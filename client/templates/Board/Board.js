import { pick, throttle } from 'lodash';
import { fabric } from 'fabric';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';

import Objects from '/imports/collections/Objects';

Template.Board.onCreated(function() {
  // Subscribe to fabric objects in a template, so that it will automaticaly
  // unsubscribe when template is destroyed.
  this.subscribe('allObjects');
});

Template.Board.onRendered(function() {
  // Get canvas HTML element from template.
  const canvasElement = this.find('canvas');
  // Create new fabric canvas.
  const canvas = this.canvas = new fabric.Canvas(canvasElement, {
    // Disable group selection.
    selection: false
  });

  const resizeCanvas = function() {
    canvas.setHeight(window.innerHeight);
    canvas.setWidth(window.innerWidth);
    canvas.renderAll();
  };
  resizeCanvas();
  this.resizeHandler = window.addEventListener('resize', () => {
    resizeCanvas();
  });

  this.autorun(() => {
    canvas.isDrawingMode = Session.get('isDrawingMode');
    canvas.freeDrawingBrush.color = Session.get('color');
  });

  canvas.on('object:added', (e) => {
    const fabricObject = e.target;
    if (fabricObject.id) {
      // Object was added by someone else and the "object:added" event was
      // called or we just refreshed page and objects are being added to the
      // canvas. In both situations we just stop here to not allow reinserting
      // an object.
      return;
    }
    // Convert fabric object to JSON.
    const object = fabricObject.toObject();
    // We have to generate id by ourself because we can't use id returned by
    // Object.insert. Before Object.insert returns the "added" event is already
    // called and we need to set id on the fabricObject before that.
    object._id = fabricObject.id = Random.id();
    fabricObject.userId = Meteor.userId();
    Meteor.call('insertObject', object, (err) => {
      if (err) {
        alert(err.message);
        canvas.remove(fabricObject);
      }
    })
    console.log('canvas:object:added', fabricObject.id);
  });

  canvas.on('object:modified', (e) => {
    const fabricObject = e.target;
    if (!fabricObject.id) {
      // It's very unlikely but somehow fabric object is missing id. In such
      // situation we can't update object in database. In theory it may happen
      // when somebody removed object that we're modifying.
      console.error(`Missing id at fabric object ${fabricObject}`);
      return;
    }
    // Convert fabric object to JSON.
    const object = fabricObject.toObject();
    Meteor.call('updateObject', fabricObject.id, object, (err) => {
      if (err) {
        alert(err.message);
      }
    });
    console.log('canvas:object:modified', fabricObject.id);
  });

  const updateObject = function(props) {
    return throttle((e) => {
      const fabricObject = e.target;
      if (!fabricObject.id) {
        // It's very unlikely but somehow fabric object is missing id. In such
        // situation we can't update object in database. In theory it may happen
        // when somebody removed object that we're modifying.
        console.error(`Missing id at fabric object ${fabricObject}`);
        return;
      }
      Meteor.call(
        'updateObject',
        fabricObject.id,
        pick(fabricObject, props),
        (err) => {
          if (err) {
            alert(err.message);
          }
        }
      );
    }, 50);
  };

  canvas.on('object:moving', updateObject(['left', 'top']));
  canvas.on('object:scaling', updateObject(['scaleX', 'scaleY']));
  canvas.on('object:rotating', updateObject(['angle']));

  this.autorun(() => {
    Objects.find().observeChanges({
      added(id, doc) {
        console.log('observeChanges.added', id, doc);
        const fabricObject = canvas.getObjectById(id);
        if (fabricObject) {
          // Object is already drawn on canvas so we stop here to not draw
          // duplicate.
          return;
        }
        // Create fabric objects from JSON.
        fabric.util.enlivenObjects([doc], ([fabricObject]) => {
          fabricObject.id = id;
          canvas.add(fabricObject);
        });
      },
      changed(id, fields) {
        console.log('observeChanges.changed', id, fields);
        const fabricObject = canvas.getObjectById(id);
        if (!fabricObject) {
          // We can't update object that does not exist on the canvas.
          return;
        }
        fabricObject.set(fields);
        canvas.renderAll();
      },
      removed(id) {
        console.log('observeChanges.removed', id);
        const fabricObject = canvas.getObjectById(id);
        if (!fabricObject) {
          // Object was already removed or does not exist so we have nothing
          // to do here.
          return;
        }
        canvas.remove(fabricObject);
      }
    });
  });
});

Template.Board.onDestroyed(function () {
  window.removeEventListener('resize', this.resizeHandler);
});
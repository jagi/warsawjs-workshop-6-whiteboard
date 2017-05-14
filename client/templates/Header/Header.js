import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { Session } from 'meteor/session';
import { Blaze } from 'meteor/blaze';

import Objects from '/imports/collections/Objects';

const getFabricCanvas = function() {
  const canvasElement = document.getElementsByTagName('canvas')[0];
  if (canvasElement) {
    const boardView = Blaze.getView(canvasElement);
    const tmpl = boardView.templateInstance();
    return tmpl.canvas;
  }
};

Template.Header.onRendered(function() {
  Tracker.afterFlush(() => {
    if (!this.canvas) {
      this.canvas = getFabricCanvas();
    }
  });
});

Template.Header.helpers({
  color() {
    return Session.get('color');
  },
  isDrawingMode() {
    return Session.get('isDrawingMode');
  },
  objectsCount() {
    return Objects.find().count();
  },
});

Template.Header.events({
  'click [data-action="pickColor"]' (e, tmpl) {
    tmpl.find('.colorPicker').click();
  },
  'click [data-action="toggleDrawingMode"]' (e, tmpl) {
    Session.set('isDrawingMode', !Session.get('isDrawingMode'));
  },
  'click [data-action="remove"]' (e, tmpl) {
    const canvas = tmpl.canvas;
    const selectedFabricObject = canvas.getActiveObject();
    if (!selectedFabricObject) {
      return;
    }
    Meteor.call('removeObject', selectedFabricObject.id, (err) => {
      if (err) {
        alert(err.message);
      }
    });
  },
  'change .isDrawingMode' (e, tmpl) {
    Session.set('isDrawingMode', e.currentTarget.checked);
  },
  'change .colorPicker' (e, tmpl) {
    Session.set('color', e.currentTarget.value);
  },
  'click .clear': () => {
    Meteor.call('removeAllObjects', (err) => {
      if (err) {
        alert(err.message);
      }
    });
  },
});
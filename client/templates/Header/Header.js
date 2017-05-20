import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { Session } from 'meteor/session';
// import { Blaze } from 'meteor/blaze';

import Objects from '/imports/collections/Objects';

// const getFabricCanvas = function() {
//   const canvasElement = document.getElementsByTagName('canvas')[0];
//   if (canvasElement) {
//     const boardView = Blaze.getView(canvasElement);
//     const tmpl = boardView.templateInstance();
//     return tmpl.canvas;
//   }
// };

// Template.Header.onRendered(function() {
//   Tracker.afterFlush(() => {
//     if (!this.canvas) {
//       this.canvas = getFabricCanvas();
//     }
//   });
// });

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
  isObjectSelected() {
    return !!Session.get('selectedObjectId');
  }
});

Template.Header.events({
  'click [data-action="pickColor"]' (e, tmpl) {
    tmpl.find('.colorPicker').click();
  },
  'click [data-action="toggleDrawingMode"]' (e, tmpl) {
    Session.set('isDrawingMode', !Session.get('isDrawingMode'));
  },
  'click [data-action="remove"]' (e, tmpl) {
    const selectedObjectId = Session.get('selectedObjectId');
    if (!selectedObjectId) {
      return;
    }
    Meteor.call('removeObject', selectedObjectId, (err) => {
      if (err) {
        alert(err.message);
      }
    });
  },
  'click [data-action="clear"]' (e, tmpl) {
    const boardId = FlowRouter.current().params.id;
    Meteor.call('removeAllObjects', boardId, (err) => {
      if (err) {
        alert(err.message);
      }
    });
  },
  'click [data-action="createBoard"]' (e, tmpl) {
    Meteor.call('createBoard', (err, boardId) => {
      if (err) {
        alert(err.message);
      }
      else if (boardId) {
        FlowRouter.redirect(`/boards/${boardId}`);
      }
    });
  },
  'change .colorPicker' (e, tmpl) {
    Session.set('color', e.currentTarget.value);
  }
});
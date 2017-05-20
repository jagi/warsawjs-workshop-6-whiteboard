import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import Objects from '/imports/collections/Objects';

Meteor.publish('objectsByBoardId', function(boardId) {
  check(boardId, String);

  if (!this.userId || !boardId) {
    return;
  }
  return Objects.find({
    boardId
  });
});
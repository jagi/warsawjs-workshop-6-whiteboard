import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import Boards from '/imports/collections/Boards';

Meteor.publish('boardById', function(boardId) {
  check(boardId, String);

  if (!this.userId || !boardId) {
    return;
  }
  return Boards.find({
    _id: boardId
  });
});
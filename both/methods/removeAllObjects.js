import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import Objects from '/imports/collections/Objects';

Meteor.methods({
  removeAllObjects(boardId) {
    check(boardId, String);

    if (!this.userId) {
      throw new Meteor.Error(403, 'Only signed in users can clear canvas');
    }

    Objects.remove({
      userId: this.userId,
      boardId
    });
  }
})
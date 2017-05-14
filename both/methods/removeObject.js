import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import Objects from '/imports/collections/Objects';

Meteor.methods({
  removeObject(objectId) {
    check(objectId, String);

    if (!this.userId) {
      throw new Meteor.Error(403, 'Only signed in users can remove drawings');
    }

    const object = Objects.findOne(objectId);
    if (object.userId !== this.userId) {
      throw new Meteor.Error(403, 'You can only remove your own drawings');
    }

    Objects.remove({
      _id: objectId
    });
  }
})
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import Objects from '/imports/collections/Objects';

Meteor.methods({
  updateObject(id, object) {
    check(id, String);
    check(object, Object);

    if (!this.userId) {
      throw new Meteor.Error(403, 'Only signed in users can modify drawings');
    }

    Objects.update(id, {
      $set: object
    });
  }
});
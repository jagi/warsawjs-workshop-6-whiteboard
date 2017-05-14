import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import Objects from '/imports/collections/Objects';

Meteor.methods({
  insertObject(object) {
    check(object, Object);

    if (!this.userId) {
      throw new Meteor.Error(403, 'Only signed in users can draw');
    }

    object.userId = this.userId;
    Objects.insert(object);
  }
});
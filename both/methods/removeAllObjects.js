import { Meteor } from 'meteor/meteor';

import Objects from '/imports/collections/Objects';

Meteor.methods({
  removeAllObjects() {
    if (!this.userId) {
      throw new Meteor.Error(403, 'Only signed in users can clear canvas');
    }

    Objects.remove({
      userId: this.userId
    });
  }
})
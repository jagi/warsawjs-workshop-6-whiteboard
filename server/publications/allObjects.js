import { Meteor } from 'meteor/meteor';

import Objects from '/imports/collections/Objects';

Meteor.publish('allObjects', function() {
  if (!this.userId) {
    return;
  }
  return Objects.find({});
});
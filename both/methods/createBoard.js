import { Meteor } from 'meteor/meteor';

import Boards from '/imports/collections/Boards';

Meteor.methods({
  createBoard() {
    return Boards.insert({});
  }
});
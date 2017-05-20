import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

Session.setDefault('isDrawingMode', true);
Session.setDefault('color', '#000000');
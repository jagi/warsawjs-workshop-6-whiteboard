import { Mongo } from 'meteor/mongo';

const Boards = new Mongo.Collection('boards');

export default Boards;
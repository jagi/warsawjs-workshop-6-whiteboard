import { fabric } from 'fabric';

fabric.Canvas.prototype.getObjectById = function(id) {
  return this.getObjects().find(obj => obj.id === id);
};
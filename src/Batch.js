"use strict";

class Batch {

  static createInstances(list, Obj) {
    let res = [];
    for(let node of list) {
      res.push(Obj.createInstance(node));
    }
    return res;
  }
}

module.exports = Batch;

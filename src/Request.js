"use strict";

/**
 * @author Nils-Boerge Margotti
 */
class Request {

  constructor(command, args, callback) {
    this.command = command;
    this.arguments = args;
    this.callback = callback;
  }

  toString() {
    let string = this.command;
    for(let key in this.arguments) {
      let type = typeof this.arguments[key];
      if(type != "undefined") {
        if(type == "boolean" && this.arguments[key]) {
          string += " -" + key;
        } else {
          string += " " + key + "=" + this.arguments[key];
        }
      }
    }
    return string;
  }
}

module.exports = Request;

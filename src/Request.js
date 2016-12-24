"use strict";

/**
 * @author Nils-Boerge Margotti
 */
class Request {

  /**
   *
   */
  constructor(body, callback) {
    /** {String} body of the request */
    this.body = body;
    /** {Function} */
    this.callback = callback;
  }
}

module.exports = Request;

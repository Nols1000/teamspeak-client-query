"use strict";

class Response {

  constructor(lines, error, request) {
    this.lines = lines;
    this.error = error;
    this.request = request;
  }

  getLines() {
    return this.lines;
  }

  getBody() {
    return this.lines.join("\n\r");
  }

  getError() {
    return this.error;
  }

  getRequest() {
    return this.request;
  }
}

module.exports = Response;

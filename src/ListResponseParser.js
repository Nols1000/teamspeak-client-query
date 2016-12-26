"use strict";

let Scanner = require('./Scanner.js');

class ListResponseParser {

  static parse(data) {
    let res = [];
    data.pop();
    while(data.length > 0) {
      res = res.concat(ListResponseParser.parseLine(data[0]));
      data.shift();
    }
    return res;
  }

  static parseLine(line) {
    let res = [];
    let items = line.split("|");
    for(let item of items) {
      res.push(ListResponseParser.parseItem(item));
    }
    return res;
  }

  static parseItem(item) {
    let res = {};
    let scanner = new Scanner(item);
    while(scanner.hasNext()) {
      let arg = scanner.next();
      arg = arg.split("=");
      if(arg.length > 1) {
        res[arg[0]] = arg[1];
      }
    }
    return res;
  }
}

module.exports = ListResponseParser;

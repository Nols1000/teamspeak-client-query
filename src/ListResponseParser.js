"use strict";
/*
    Teamspeak Client Query API written in node.js
    Copyright (C) 2016  Nils-Boerge Margotti

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

let Scanner = require('./Scanner.js');

/**
 * ListResponseParser
 * Parse lists from response
 * @author Nils-Boerge Margotti <margotni@kalmiya.de>
 */
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
        res[arg[0]] = ListResponseParser.parseString(arg[1]);
      }
    }
    return res;
  }

  static parseString(string) {
    string = string.replace(new RegExp("\\s", "g"), " ");
    return string;
  }
}

module.exports = ListResponseParser;

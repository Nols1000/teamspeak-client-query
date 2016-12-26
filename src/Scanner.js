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

/**
 * Scanner
 * @author Nils-Boerge Margotti <margotni@kalmiya.de>
 */
class Scanner {

  /**
   * Create a scanner.
   * @param {String} input - Input of the Scanner
   */
  constructor(input) {

    this.input = input.split("\n");
    for(let i = 0; i < this.input.length; i++) {
      this.input[i] = [this.input[i].replace("\r", "").replace(/\s+/g, " ").trim()];
      this.input[i] = this.input[i].concat(this.input[i][0].split(" "));
    }

    // cursor position [x, y]
    // x - colomn
    // y - row
    this.cursor = [1 , 0];
  }

  /**
   * Return the next argument of the scanners input.
   * @return {String} Next argument of the scanner's input
   */
  next() {
    let colomn = this.cursor[0];
    let row = this.cursor[1];

    if(this.input.length > row) {
      if(this.input[row].length > colomn) {
        this.cursor[0]++;
        return this.input[row][colomn];
      } else {
        this.cursor[0]++;
        this.cursor[1] = 1;
        return this.next();
      }
    }
  }

  /**
  * Return the next line of the scanners input.
  * @return {String} Next line of the scanner's input
   */
  nextLine() {
    let row = this.cursor[1];
    if(this.input.length > row) {
      this.cursor[1]++;
      return this.input[row][0];
    }
    return null;
  }

  /**
  * Returns if there is a next argument to read
  * @return {boolean} Does the input have a next argument
   */
  hasNext() {
    let colomn = this.cursor[0];
    let row = this.cursor[1];

    if(this.input.length > row) {
      if(this.input[row].length > colomn) {
        return true;
      } else {
        this.cursor[0]++;
        this.cursor[1] = 1;
        return this.hasNext();
      }
    }
    return false;
  }

  /**
   * Returns if there is a next line to read
   * @return {boolean} Does the input have a next line
   */
  hasNextLine() {
    let row = this.cursor[1];
    if(this.input.length > row) {
      return true;
    }
    return false;
  }
}

module.exports = Scanner;

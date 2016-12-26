"use strict";

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

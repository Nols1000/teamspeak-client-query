"use strict";

class Scanner {

  constructor(data) {

    this.data = data.split("\n");
    for(let i = 0; i < this.data.length; i++) {
      this.data[i] = [this.data[i].replace("\r", "").replace(/\s+/g, " ").trim()];
      this.data[i].concat(this.data[i][0].split(" "));
    }

    // cursor position [x, y]
    // x - colomn
    // y - row
    this.cursor = [1 , 0];
  }

  next() {
    let colomn = this.cursor[0];
    let row = this.cursor[1];

    if(this.data.length > row) {
      if(this.data[row].length > colomn) {
        this.cursor[1]++;
        return this.data[row][colomn];
      } else {
        this.cursor[0]++;
        this.cursor[1] = 1;
        return next();
      }
    }
  }

  nextLine() {
    let row = this.cursor[1];
    if(this.data.length > row) {
      this.cursor[1]++;
      return this.data[row][0];
    }
    return null;
  }

  hasNext() {
    let colomn = this.cursor[0];
    let row = this.cursor[1];

    if(this.data.length > row) {
      if(this.data[row].length > colomn) {
        return true;
      } else {
        this.cursor[0]++;
        this.cursor[1] = 1;
        return next();
      }
    }
    return false;
  }

  hasNextLine() {
    let row = this.cursor[1];
    if(this.data.length > row) {
      return true;
    }
    return false;
  }
}

module.exports = Scanner;

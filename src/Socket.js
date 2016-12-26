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

/* Imports */
let Request = require('./Request.js');
let Response = require('./Response.js');
let Scanner = require('./Scanner.js');

let EventEmitter = require('events').EventEmitter;

/* Logging */

let winston = require('winston');

winston.level = "debug";
winston.add(winston.transports.File, { filename: '../logs/' + Date.now() + '.log' });
winston.remove(winston.transports.Console);

/**
 * @author Nils-Boerge Margotti <nilsmargotti@gmail.com>
 */
class Socket extends EventEmitter {

  constructor(address, port) {
    super();

    this.socket = new require('net').Socket();

    this.address = address | "127.0.0.1";
    this.port = port | 25639;

    this.requests = [];
    this.packetLines = [];
    this.listener = null;
  }

  /**
   * Connect to server
   */
  connect() {
    // set encoding to utf8
    this.socket.setEncoding('utf8');
    // listen for common events
    this.socket.on('connect', this.onConnected.bind(this));
    this.socket.on('data', this.onData.bind(this));
    this.socket.on('error', this.onError.bind(this));
    this.socket.on('close', this.onClose.bind(this));
    // connect to the server
    this.socket.connect(this.port, this.address);
  }

  /**
   * Send a message to the server and call callback
   * @param {String} message
   * @param {Function} callback
   */
  send(command, args, callback) {
    // create a request
    let request = new Request(command, args, callback);
    // add request to the active requests query
    this.requests.push(request);
    // send request
    this.socket.write(request.toString() + "\n");
    winston.log("debug", "Send Command. (body: " + request.toString() + ")");
  }

  /**
   *
   */
  registerNotificationListener(listener) {
    this.send('clientnotifyregister schandlerid=0 event=any', function(res) {
      if(res.error) {
        throw res.error;
      }
      this.listener = listener;
    }.bind(this));
  }

  /**
   *
   */
  onConnected() {
    winston.log("debug", "Connected to " + this.address + ":" + this.port);
  }

  /**
   *
   */
  onData(data) {
    let scanner = new Scanner(data);

    let packetTerminatorRegex = /error id=([0-9]*) msg=(.*)/;
    let welcomePacketTerminatorRegex = /selected schandlerid=([0-9]*)/;
    let notificationPacketRegex = /notify([a-z]*) schandlerid=([0-9]*) (.*)/;

    let postpondedPacketLinesDeletion = false;

    while(scanner.hasNextLine()) {
      let line = scanner.nextLine();
      if(line != "") {
        console.log("$", line);
        this.packetLines.push(line);
        if(packetTerminatorRegex.test(line)) {
          // Packet terminated
          if(typeof this.requests[0].callback != "undefined") {
            let packet = packetTerminatorRegex.exec(line);
            let response = null;
            if(packet[1] != 0) {
              response = new Response(this.packetLines, new Error(packet[2]),
              this.requests[0]);
            } else {
              response = new Response(this.packetLines, null, this.requests[0]);
            }
            this.requests[0].callback(response);
          }
          this.requests.shift();
          postpondedPacketLinesDeletion = false;
          this.packetLines = [];
        } else if(welcomePacketTerminatorRegex.test(line)) {
          this.packetLines = [];
        } else if(notificationPacketRegex.test(line)) {
          let packet = notificationPacketRegex.exec(line);
          this.packetLines[this.packetLines.length - 1] = packet[3];
          winston.log("debug", "notification: " + packet[1] + " " + packet[3]);
          //this.listener.emit(packet[1], packet[2], packet[3]);
          postpondedPacketLinesDeletion = true;
          continue;
        }

        if(postpondedPacketLinesDeletion) {
          this.packetLines = [line];
        }
      }
    }
  }

  /**
   *
   */
  onError(error) {
    winston.log("error", error);
  }

  /**
   *
   */
  onClose(had_error) {
    winston.log("debug", "Connection closed.");
  }

  /**
   * Disconnect from server
   */
  disconnect() {
    this.socket.write("quit\n");
  }
}

module.exports = Socket;

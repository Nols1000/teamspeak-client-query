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

/* Logging */

let winston = require('winston');

winston.level = "debug";
winston.add(winston.transports.File, { filename: '../logs/' + Date.now() + '.log' });
winston.remove(winston.transports.Console);

/**
 * Socket
 * @author Nils-Boerge Margotti <nilsmargotti@gmail.com>
 */
class Socket {

  constructor(address, port) {

    this.socket = new require('net').Socket();

    this.address = address | "127.0.0.1";
    this.port = port | 25639;
    // active requests query
    this.requests = [];

    this.packetLines = [];
    this.postpondedPacketLinesDeletion = false;
    this.packetTerminatorRegex = /error id=([0-9]*) msg=(.*)/;
    this.welcomePacketTerminatorRegex = /selected schandlerid=([0-9]*)/;
    this.notificationPacketRegex = /notify([a-z]*) schandlerid=([0-9]*) (.*)/;

    this.listener = null;

    this.schandlerid = 0;
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
    this.listener = listener;
  }

  /**
   *
   */
  unregisterNotificationListener() {
    this.listener = null;
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

    while(scanner.hasNextLine()) {
      let line = scanner.nextLine();
      if(line != "") {
        console.log("$", line);
        this.packetLines.push(line);
        if(this.packetTerminatorRegex.test(line)) {
          // get packet
          if(typeof this.requests[0].callback != "undefined") {
            // call callback if it's defined
            let packet = this.packetTerminatorRegex.exec(line);
            let response = null;
            if(packet[1] != 0) {
              // an error occured
              response = new Response(this.packetLines, new Error(packet[2]),
              this.requests[0]);
            } else {
              // response is ok
              response = new Response(this.packetLines, null, this.requests[0]);
            }
            this.requests[0].callback(response);
          }
          // remove request form active requests query
          this.requests.shift();
          // delete packet lines memory
          this.postpondedPacketLinesDeletion = false;
          this.packetLines = [];
        } else if(this.welcomePacketTerminatorRegex.test(line)) {
          // get schandlerid and delete packet lines memory
          let packet = this.welcomePacketTerminatorRegex.exec(line);
          this.schandlerid = packet[1];
          this.onWelcome(packet[1]);
          this.packetLines = [];
        } else if(this.notificationPacketRegex.test(line)) {
          // get notification
          let packet = this.notificationPacketRegex.exec(line);
          this.packetLines[this.packetLines.length - 1] = packet[3];
          winston.log("debug", "notification: " + packet[1] + " " + packet[3]);
          if(this.listener != null) {
            // TODO: initalize Notification
            this.listener.onNotificationReceived(packet[1], [packet[2], packet[3]]);
          }
          // postpond packet line memory deletion because it can be part of
          // a request response
          this.postpondedPacketLinesDeletion = true;
          continue;
        }

        if(this.postpondedPacketLinesDeletion) {
          // delete packet lines memory if it was not part of a request response
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
    if(this.requests.length > 0) {
      for(let request of this.requests) {
        if(typeof request.callback != "undefined") {
          request.callback(new Response([], error, request));
        }
      }
    }
  }

  /**
   *
   */
  onClose(had_error) {
    winston.log("debug", "Connection closed.");
    if(this.requests.length > 0) {
      for(let request of this.requests) {
        if(typeof request.callback != "undefined") {
          request.callback(new Response([], new Error("Connection closed"),
          request));
        }
      }
    }
  }

  onWelcome(schandlerid) {

  }

  /**
   * Disconnect from server
   */
  disconnect() {
    this.socket.write("quit\n");
  }
}

module.exports = Socket;

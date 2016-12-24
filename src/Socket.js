"use strict";

let Request = require('./Request.js');
let Response = require('./Response.js');
let Scanner = require('./Scanner.js');

let EventEmitter = require('events').EventEmitter;

let winston = require('winston');
winston.level = "debug";
winston.add(winston.transports.File, { filename: 'somefile.log' });
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
  }

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

  send(body, callback) {
    // create a request
    let request = new Request(body, callback);
    // add request to the active requests query
    this.requests.push(request);
    // send request
    this.socket.write(request.body + "\n");
    winston.log("debug", "Send Command. (body: " + request.body + ")");
  }

  registerNotificationListener(listener) {
    this.send('clientnotifyregister schandlerid=0 event=any', function(res) {
      if(res.error) {
        throw res.error;
      }
      
    }.bind(this));
  }

  onConnected() {
    winston.log("debug", "Connected to " + this.address + ":" + this.port);
  }

  onData(data) {
    let scanner = new Scanner(data);

    let packetTerminatorRegex = /error id=([0-9]*) msg=(.*)/;
    let welcomePacketTerminatorRegex = /selected schandlerid=([0-9]*)/;
    let notificationPacketRegex = /notify([a-z]*) schandlerid=([0-9]*) (.*)/;

    let packetLines = [];
    let postpondedPacketLinesDeletion = false;

    while(scanner.hasNextLine()) {
      let line = scanner.nextLine();
      console.log(line);
      packetLines.push(line);
      if(packetTerminatorRegex.test(line)) {
        // Packet terminated
        if(typeof this.requests[0].callback != "undefined") {
          let packet = packetTerminatorRegex.exec(line);
          let response = null;
          if(packet[1] != 0) {
            response = new Response(packetLines, new Error(packet[2]));
          } else {
            response = new Response(packetLines)
          }
          this.requests[0].callback(response);
        }
        this.requests.shift();
        postpondedPacketLinesDeletion = false;
        packetLines = [];
      } else if(welcomePacketTerminatorRegex.test(line)) {
        packetLines = [];
      } else if(notificationPacketRegex.test(line)) {
        let packet = notificationPacketRegex.exec(line);
        winston.log("debug", "notification: " + packet[1] + " " + packet[3]);
        postpondedPacketLinesDeletion = true;
      }

      if(postpondedPacketLinesDeletion) {
        packetLines = [line];
      }
    }
  }

  onError(error) {
    winston.log("error", error);
  }

  onClose(had_error) {
    winston.log("debug", "Connection closed.");
  }

  disconnect() {
    this.socket.write("quit\n");
  }
}

let socket = new Socket("127.0.0.1", 25639);
socket.connect();
socket.send("help" , function(response) {
  winston.log("info", response);
});
socket.send("clientlist", function(response) {
  winston.log("info", response);
});
socket.send("test", function(response) {
  winston.log("info", response);
});

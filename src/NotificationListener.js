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

let EventEmitter = require('events').EventEmitter;

 /**
  * NotificationListener
  * @author Nils-Boerge Margotti <margotni@kalmiya.de>
  */
class NotificationListener extends EventEmitter {

  /**
   * Create NotificationListener
   */
  constructor() {
    super();
  }

  /**
   * Event handler fired when {Socket} received a notification
   * @param {String} name Notification name
   * @param {Notification} notification Notification object
   */
  onNotificationReceived(name, notification) {
    console.log("notify", name, notification);
    this.emit(name, notification);
  }
}

module.exports = NotificationListener;

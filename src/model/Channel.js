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
 * Channel
 * @author Nils-Boerge Margotti <margotni@kalmiya.de>
 */
class Channel {

  /**
   * Create a Channel
   * @param  {Number} id          Channel id
   * @param  {Number} parent      Channel parent id
   * @param  {Number} order       Channel order
   * @param  {String} name        Channel name
   * @param  {Boolean} subscribed Has the client subscribed the channel
   * @param  {Number} clientcount Client count in the channel
   */
  constructor(id, parent, order, name, subscribed, clientcount) {
    this.id = id;
    this.parent = parent;
    this.order = order;
    this.name = name;
    this.subscribed = subscribed;
    this.clientcount = clientcount;
  }

  static createInstance(channel) {
    return new Channel(parseInt(channel.cid), parseInt(channel.pid),
    parseInt(channel.channel_order), channel.channel_name,
    (parseInt(channel.channel_flag_are_subscribed) == 1), parseInt(channel.total_clients));
  }
}

module.exports = Channel;

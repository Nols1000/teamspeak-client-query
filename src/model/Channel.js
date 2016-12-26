"use strict";

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

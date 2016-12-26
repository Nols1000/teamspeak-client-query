"use strict";

class DatabaseClient {

  /**
   * Create Client
   * @param  {Number} dbid            Client database id
   * @param  {String} uid             Client uid
   * @param  {String} nickname        Client nickname
   * @param  {Date} created           Client created at
   * @param  {Date} lastconnected     Date of client's last connect
   * @param  {Number} connectioncount Count of all connections the client made
   *                                  to this server
   * @param  {String} description     Client description
   * @param  {String} lastip          Last IP the client connected to this server
   */
  constructor(dbid, uid, nickname, created, lastconnected,
    connectioncount, description, lastip) {
    this.dbid = dbid;
    this.uid = uid;
    this.nickname = nickname;
    this.created = created;
    this.lastconnected = lastconnected;
    this.connectioncount = connectioncount;
    this.description = description;
    this.lastip = lastip;
  }

  static createInstance(client) {
    return new DatabaseClient(parseInt(client.cldbid), client.client_unique_identifier,
    client.client_nickname, new Date(parseInt(client.client_created) * 1000),
    new Date(parseInt(client.client_lastconnected) * 1000),
    parseInt(client.client_totalconnections), client.client_description,
    client.client_lastip);
  }
}

module.exports = Client;

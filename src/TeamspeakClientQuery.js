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

let Socket = require('./Socket.js');
let Batch = require('./Batch.js');
let ListResponseParser = require('./ListResponseParser.js');

let BanRule = require('./model/BanRule.js');
let Channel = require('./model/Channel.js');
let DatabaseClient = require('./model/DatabaseClient.js');

/**
 * TeamspeakClientQuery
 * @author Nils-Boerge Margotti <margotni@kalmiya.de>
 */
class TeamspeakClientQuery {

  constructor(address, port) {
    this.socket = new Socket(address, port);
    this.socket.connect();
  }

  /**
   * Adds a new ban rule on the selected virtual server. All parameters are
   * optional but at least one of the following must be set: ip, name, or uid.
   *
   * Example:
   * <code>
   * TeamspeakClientQuery.banadd(ip, null, null, 0, "reason").than(
   * function(banid) {
   * 	// Do something
   * }, function(reason) {
   * 	throw reason;
   * });
   * </code>
   */
  banadd(ip, name, uid, time, reason) {
    return new Promise(function(resolve, reject) {
			this.socket.send("banadd", { "ip": ip, "name": name, "uid": uid,
			"time": time, "reason": reason}, function(res) {
				if(res.error) {
					reject(res.error);
				} else {
					resolve();
				}
			});
    }.bind(this));
  }

  /**
   * Bans the client specified with ID clid from the server. Please note that this
   * will create two separate ban rules for the targeted clients IP address and his
   * unique identifier.
   *
   * Note that banning via cldbid parameter requires a 3.0.1 server version.
   * Note that banning via uid parameter requires a 3.0.2 server version.
   *
   * Example:
   * <code>
   * TeamspeakClientQuery.banclient(clid, null, null, 0, "reason").than(
   * function(banid) {
   *  // Do something
   * }, function(reason) {
   * 	throw reason;
   * });
   * </code>
   */
  banclient(clid, cldbid, uid, time, banreason) {
		return new Promise(function(resolve, reject) {
			this.socket.send("banclient", {"clid": clid, "cldbid": cldbid, "uid": uid,
			"time": time, "banreason": banreason}, function(res) {
				if(res.error) {
					reject(res.error);
				} else {
					// TODO: parse the response
					resolve(res);
				}
			})
		}.bind(this));
  }

  /**
   * Deletes the ban rule with ID banid from the server.
   *
   * Example:
   * <code>
   * TeamspeakClientQuery.bandel(banid).than(function() {
   * 	// Do something
   * }, function(reason) {
   * 	throw reason;
   * });
   * </code>
   */
  bandel(banid) {
		return new Promise(function(resolve, reject) {
			this.socket.send("bandel", {"banid": banid}, function(res) {
				if(res.error) {
					reject(res.error);
				} else {
					resolve();
				}
			});
		}.bind(this));
  }

  /**
   * Deletes all active ban rules from the server.
   *
   * Example:
   * <code>
   * TeamspeakClientQuery.bandelall().than(function() {
   * 	// Do something
   * }, function(reason) {
   * 	throw reason;
   * });
   * </code>
   */
  bandelall() {
		return new Promise(function(resolve, reject) {
			this.socket.send("bandelall", {}, function(res) {
				if(res.error) {
					reject(res.error);
				} else {
					// TODO: parse respone;
					resolve(res);
				}
			});
		}.bind(this))
  }

  /**
   * Displays a list of active bans on the selected virtual server.
   *
   * Example:
   * <code>
   * TeamspeakClientQuery.banlist().then(function(respones) {
   *   // Do something
   * }, function(reason) {
   *   throw reason;
   * });
   * </code>
   */
  banlist() {
    return new Promise(function(resolve, reject) {
      // register for banlist notifications
      this.socket.send("clientnotifyregister",
      {"schandlerid": 1, "event": "notifybanlist"}, function(res) {
        if(res.error) {
          reject(res.error);
        }
        // request a banlist notification
        this.socket.send("banlist", {}, function(response) {
          if(response.error) {
            reject(response.error);
          } else {
            // unregister from banlist notifications
            this.socket.send("clientnotifyunregister",
            {"schandlerid": 1, "event": "notifybanlist"}, function(res) {
              if(res.error) {
                reject(res.error);
              } else {
                // return the banlist
                resolve(Batch.createInstances(
                  ListResponseParser.parse(response.getLines()), BanRule));
              }
            });
          }
        }.bind(this));
      }.bind(this));
    }.bind(this));
  }

	// channeladdperm
	// channelclientaddperm
	// channelclientdelperm
	// channelclientlist

  channelclientlist() {

  }

  channelclientpermlist() {

  }

	// channelconnectinfo
	// channelcreate
	// channeldelete
	// channeldelperm
	// channeledit
	// channelgroupadd
	// channelgroupaddperm

  channelgroupclientlist() {

  }

	// channelgroupdel
	// channelgroupdelperm
	// channelgrouplist
	// channelgrouppermlist

  channellist() {
    return new Promise(function(resolve, reject) {
      // send command channellist
      this.socket.send("channellist", {}, function(response) {
        if(response.error) {
          reject(response.error);
        } else {
          // return result
          resolve(Batch.createInstances(
            ListResponseParser.parse(response.getLines()), Channel));
        }
      }.bind(this));
    }.bind(this));
  }

	// channelmove

  channelpermlist() {

  }

	// channelvariable
	// clientaddperm
	// clientdbdelete
	// clientdbedit

  clientdblist(offset, limit, count) {
    return new Promise(function(resolve, reject) {
      // register for clientdblist notifications
      this.socket.send("clientnotifyregister",
      {"schandlerid": 1, "event": "notifyclientdblist"}, function(res) {
        if(res.error) {
          reject(res.error);
        }
        // request a banlist notification
        this.socket.send("clientdblist",
        {"start": offset, "duration": limit, "count": count},
        function(response) {
          if(response.error) {
            reject(response.error);
          } else {
            // unregister from banlist notifications
            this.socket.send("clientnotifyunregister",
            {"schandlerid": 1, "event": "notifyclientdblist"}, function(res) {
              if(res.error) {
                reject(res.error);
              } else {
                // return the client
                resolve(Batch.createInstances(
                  ListResponseParser.parse(response.getLines()), DatabaseClient));
              }
            });
          }
        }.bind(this));
      }.bind(this));
    }.bind(this));
  }

	// clientdelperm
	// clientgetdbidfromuid
	// clientgetids
	// clientgetnamefromdbid
	// clientgetnamefromuid
	// clientgetuidfromclid
	// clientkick

  clientlist(uid, away, voice, groups, icon, country) {
    return new Promise(function(resolve, reject) {
      // send command channellist
      this.socket.send("clientlist",
      {"uid": uid, "away": away, "groups": groups, "icon": icon, "voice": voice,
      "country": country},
      function(response) {
        if(response.error) {
          reject(response.error);
        } else {
          // return result
          resolve(ListResponseParser.parse(response.getLines()));
        }
      }.bind(this));
    }.bind(this));
  }

	// clientmove
	// clientmute
	// clientnotifyregister
	// clientnotifyunregister
	// clientpermlist
	// clientpoke
	// clientunmute
	// clientupdate
	// clientvaribale
	// complainadd
	// complaindel
	// complaindelall

  complainlist() {

  }

	// currentschandlerid
	// ftcreatedir
	// ftdeletefile
	// ftgetfileinfo

  ftgetfilelist() {

  }

	// ftinitdownload
	// ftinitupload

  ftlist() {

  }

	// ftrenamefile
	// ftstop
	// hashpassword
	// help
	// messageadd
	// messagedel
	// messageget

  messagelist() {

  }

	// messageupdateflag
	// permoverview
	// quit
	// sendtextmessage
	// serverconnectinfo

  serverconnectionhandlerlist() {

  }

	// servergroupadd
	// servergroupaddclient
	// servergroupaddperm

  servergroupclientlist() {

  }

	// servergroupdel
	// servergroupdelclient
	// servergroupdelperm

  servergrouplist() {

  }

  servergrouppermlist() {

  }

	// servergroupsbyclientid
	// servervariable
	// setclientchannelgroup
	// tokenadd
	// tokendelete

  tokenlist() {

  }

	// tokenuse
	// use
	// verifychannelpassword
	// verifyserverpassword
	// whoami
}

var tcq = new TeamspeakClientQuery("127.0.0.1", 25639);
tcq.clientlist(true, true, true, true, true, true).then(function(res) {
  console.log("res", res);
}, function(error) {
  throw error;
});

module.exports = TeamspeakClientQuery;

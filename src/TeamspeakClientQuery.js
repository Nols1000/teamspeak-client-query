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
   * <br />
   * <br />
   * Example: <br />
   * <code><pre>
   * TeamspeakClientQuery.banadd(ip, null, null, 0, "reason").than(
   * function(banid) {
   * 	// Do something
   * }, function(reason) {
   * 	throw reason;
   * });
   * </pre></code>
   *
   * Resolve return NOT IMPLEMENTED YET!!!
   *
   * @param {String} ip						Client-IP
   * @param {String} name					Client-Name
   * @param {String} uid					Client-UID
   * @param {Number} time					Time in seconds the ban will be enforced
   * @param {String} reason 			Reason why the ban was added.
   *
   * @return {Promise}						Promise that resolves when the method was
	 *                              successful and rejects if it was not.
	 *                              Provides an error if rejected and a
	 *                              {@link BanRule} if it resolves.
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
   * Bans the client specified with ID clientid or database ID clientdbid or
   * UID uid from the server. Please note that this will create two separate
   * ban rules for the targeted clients IP address and his unique identifier.
   * <br />
   * <br />
   * Note that banning via cldbid parameter requires a 3.0.1 server version.
   * <br />
   * Note that banning via uid parameter requires a 3.0.2 server version.
   * <br />
   * <br />
   * Example: <br />
   * <code><pre>
   * TeamspeakClientQuery.banclient(clid, null, null, 0, "reason").than(
   * function(banid) {
   * 	// Do something
   * }, function(reason) {
   * 	throw reason;
   * });
   * </pre></code>
   *
   * @param {Number} clientid					Client-ID
   * @param {Number} clientdbid				ClientDBID
   * @param {String} uid							UID
   * @param {Number} time							Time in seconds the ban will be enforced
   * @param {String} reason						Reason why the ban was added.
   *
   * @return {Promise} 								Promise that resolves when the method was
	 *                                  successful and rejects if it was not.
	 *                                  Provides an error if rejected and a
	 *                                  {@link BanRule} if it resolves.
   */
  banclient(clientid, clientdbid, uid, time, reason) {
		return new Promise(function(resolve, reject) {
			this.socket.send("banclient", {"clid": clientid, "cldbid": clientdbid,
			"uid": uid, "time": time, "banreason": reason}, function(res) {
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
   * Deletes the ban rule with ID banid from the server. <br />
   * <br />
   * Example: <br />
   * <code><pre>
   * TeamspeakClientQuery.bandel(banid).than(function() {
   * 	// Do something
   * }, function(reason) {
   * 	throw reason;
   * });
   * </pre></code>
   *
   * @return {Promise} 								Promise that resolves when the method was
	 *                                  successful and rejects if it was not.
	 *                                  Provides an error if rejected and nothing
	 *                                  if it resolves.
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
   * Deletes all active ban rules from the server. <br />
   * <br />
   * Example: <br />
   * <code><pre>
   * TeamspeakClientQuery.bandelall().than(function() {
   * 	// Do something
   * }, function(reason) {
   * 	throw reason;
   * });
   * </pre></code>
   *
   * @return {Promise} 								Promise that resolves when the method was
	 *                                  successful and rejects if it was not.
	 *                                  Provides an error if rejected and a
	 *                                  {@link Response} if it resolves.
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
   * Displays a list of active bans on the selected virtual server. <br />
   * <br />
   * Example: <br />
   * <code><pre>
   * TeamspeakClientQuery.banlist().then(function(respones) {
   * 	// Do something
   * }, function(reason) {
   * 	throw reason;
   * });
   * </pre></code>
   *
   * @return {Promise}						Promise that resolves when the method was
	 *                              successful and rejects if it was not.
	 *                              Provides an error if rejected and an array
	 *                              of all bans if it resolves.
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

	/**
	 * Adds a set of specified permissions to a channel. Multiple permissions can be
	 * added by providing the two parameters of each permission. A permission can be
	 * specified by permid or permsid. <br />
	 * <br />
	 * NOT IMPLEMENTED YET!!!
	 *
	 * @param  {Number} channelid 				Id of the channel, which the permissions
	 *                                		should be applied to.
	 * @param  {Number[]} permissionid  	Ids of the permissions that should
	 *                                   	be added.
	 *                             	     	provide this argument or
	 *                             	     	{@link permissionname}.
	 * @param  {String[]} permissionname 	Names of the permissions that should be
	 *                                    added.
	 *                             	      provide this argument or
	 *                             	      {@link permissionid}.
	 * @param  {Number[]} permissionvalue The values of the permissions that
	 *                                    should be added.
	 *
	 * @return {Promise}            			Promise that resolves when the method was
	 *                                    successful and rejects if it was not.
	 *                                    Provides an error if rejected and nothing
	 *                                    if it resolves.
	 */
	channeladdperm(channelid, permissionid, permissionname, permissionvalue) {

	}

	/**
	 * Adds a set of specified permissions to a client in a specific channel.
	 * Multiple permissions can be added by providing the two parameters of each
	 * permission. A permission can be specified by permid or permsid. <br />
	 * <br />
	 * NOT IMPLEMENTED YET!!!
	 *
	 * @param  {Number} channelid       	Id of the channel, which the permissions
	 *                                   	should be applied to.
	 * @param  {Number} clientdbid      	Id of the client, that the permissions
	 *                                   	should applied to.
	 * @param  {Number[]} permissionid    Ids of the permissions that should
	 *                                   	be added.
	 *                             	     	provide this argument or
	 *                             	     	{@link permissionname}.
	 * @param  {String[]} permissionname  Names of the permissions that should
	 *                                   	be added.
	 *                             	     	provide this argument or
	 *                             	     	{@link permissionid}.
	 * @param  {Number} permissionvalue 	The values of the permissions that
	 *                                    should be added.
	 *
	 * @return {Promise}                 	Promise that resolves when the method was
	 *                                    successful and rejects if it was not.
	 *                                    Provides an error if rejected and nothing
	 *                                    if it resolves.
	 */
	channelclientaddperm(channelid, clientdbid, permissionid, permissionname,
		permissionvalue) {


	}

	/**
	 * Removes a set of specified permissions from a client in a specific channel.
	 * Multiple permissions can be removed at once. A permission can be specified
	 * by permid or permsid. <br />
	 * <br />
	 * NOT IMPLEMENTED YET!!!
	 *
	 * @param  {Number} channelid       	Id of the channel, which the permissions
	 *                                   	should be deleted from.
	 * @param  {Number} clientdbid      	Id of the client, that the permissions
	 *                                   	should deleted from.
	 * @param  {Number[]} permissionid    Ids of the permissions that should
	 *                                   	be deleted.
	 *                             	     	provide this argument or
	 *                             	     	{@link permissionname}.
	 * @param  {String[]} permissionname  Names of the permissions that should
	 *                                   	be deleted.
	 *                             	     	provide this argument or
	 *                             	     	{@link permissionid}.
	 *
	 * @return {Promise}                 	Promise that resolves when the method was
	 *                                    successful and rejects if it was not.
	 *                                    Provides an error if rejected and nothing
	 *                                    if it resolves.
	 */
	channelclientdelperm(channelid, clientdbid, permissionid, permissionname) {

	}

	/**
	 * Displays a list of clients that are in the channel specified by the cid
	 * parameter. Included information is the clientID, client database id,
	 * nickname, channelID and client type. <br />
	 * Please take note that you can only view clients in channels that you are
	 * currently subscribed to. <br />
	 * <br />
	 * Here is a list of the additional display paramters you will receive for
	 * each of the possible modifier parameters. <br />
	 * <br />
	 * -uid: <br />
	 * client_unique_identifier <br />
	 * <br />
	 * -away: <br />
	 * client_away <br />
	 * client_away_message <br />
	 * <br />
	 * -voice: <br />
	 * client_flag_talking <br />
	 * client_input_muted <br />
	 * client_output_muted <br />
	 * client_input_hardware <br />
	 * client_output_hardware <br />
	 * client_talk_power <br />
	 * client_is_talker <br />
	 * client_is_priority_speaker <br />
	 * client_is_recording <br />
	 * client_is_channel_commander <br />
	 * client_is_muted <br />
	 * <br />
	 * -groups: <br />
	 * client_servergroups <br />
	 * client_channel_group_id <br />
	 * <br />
	 * -icon: <br />
	 * client_icon_id <br />
	 * <br />
	 * -country: <br />
	 * client_country
	 *
	 * @param  {Number} channelid   	Id of the channel to get the clients from.
	 * @param  {Boolean} showUid     	Add uid of the client to the Included
	 *                                information.
	 * @param  {Boolean} showAway    	Add away status and message to the
	 *                                information
	 * @param  {Boolean} showVoice   	Add some voice attributes to the information
	 * @param  {Boolean} showGroups  	Add servergroups and channel group id to
	 *                                the information
	 * @param  {Boolean} showIcon    	Add icon id to the information.
	 * @param  {Boolean} showCountry 	Add country to the information.
	 *
	 * @return {Promise}             	Promise that resolves when the method was
	 *                                successful and rejects if it was not.
	 *                                Provides an error if rejected and nothing
	 *                                if it resolves.
	 */
  channelclientlist(channelid, showUid, showAway, showVoice, showGroups,
		showIcon, showCountry) {

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

	/**
	 * Moves one or more clients specified with clid to the channel with ID cid. If
	 * the target channel has a password, it needs to be specified with cpw. If the
	 * channel has no password, the parameter can be omitted.
	 *
	 * @param  {Number} channelid       Channel id of the target channel
	 * @param  {String} channelpassword Channel password
	 * @param  {Number} clientid        Client id of the player to move
	 *
	 * @return {Promise}                Promise that resolves when the method was
	 *                                  successful and rejects if it was not.
	 *                                  Provides an error if rejected and nothing
	 *                                  if it resolves.
	 */
	clientmove(channelid, channelpassword, clientid) {
		return new Promise(function(resolve, reject) {
			this.socket.send("clientmove", {"cid": channelid, "cpw": channelpassword,
			"clid": clientid}, function(res) {
				if(res.error) {
					reject(error);
				} else {
					resolve();
				}
			});
		}.bind(this));
	}
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

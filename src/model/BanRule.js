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
 * Ban Rule
 * @author Nils-Boerge Margotti <margotni@kalmiya.de>
 */
class BanRule {

  /**
   * Creates a banrule
   * @param  {Number} id            Ban id
   * @param  {String} ip            Banned ip
   * @param  {String} name          Banned name
   * @param  {String} uid           Banned uid
   * @param  {String} lastnickname  Last nickname of the banned client
   * @param  {Date} created         Ban created at
   * @param  {Number} duration      Ban duration. Is 0 if permanent.
   * @param  {String} invokername   Ban invoker's name
   * @param  {Number} invokercldbid Ban invoker's client datebase id
   * @param  {String} invokeruid    Ban invoker's uid
   * @param  {String} reason        Ban reason
   * @param  {Number} enforcements  Ban enforcements. The number of connect
   *                                attempts the banned client made.
   */
  constructor(id, ip, name, uid, lastnickname, created, duration, invokername,
    invokercldbid, invokeruid, reason, enforcements) {
    this.id = id;
    this.ip = ip;
    this.name = name;
    this.uid = uid;
    this.lastnickname = lastnickname;
    this.created = created;
    this.duration = duration;
    this.invokername = invokername;
    this.invokercldbid = invokercldbid;
    this.reason = reason;
    this.enforcements = enforcements;
  }

  static createInstance(banRule) {
    return new BanRule(parseInt(banRule.banid), banRule.ip, banRule.name,
    banRule.uid, banRule.lastnickname, new Date(parseInt(banRule.created) * 1000),
    parseInt(banRule.duration), banRule.invokername, parseInt(banRule.invokercldbid),
    banRule.invokeruid, banRule.reason, parseInt(banRule.enforcements));
  }
}

module.exports = BanRule;

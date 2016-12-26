"use strict";

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

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

let TeamspeakClientQuery = require('./src/TeamspeakClientQuery.js');
let NotificationListener = require('./src/NotificationListener.js');


var tcq = new TeamspeakClientQuery("127.0.0.1", 25639);
tcq.registerNotificationListener(new NotificationListener()).then(function(res) {
  console.log("res", res);
}, function(error) {
  console.log(error);
});
tcq.banadd(null, "test", null, 1, "test proposes").then(function(res) {
  console.log("res", res);
}, function(error) {
  console.log(error);
});

module.exports = {
  "TeamspeakClientQuery": TeamspeakClientQuery,
  "NotificationListener": NotificationListener
};

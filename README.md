# Teamspeak Client Query API
## Node.js implementation of the Teamspeak Client Query API
[![Travis](https://img.shields.io/travis/Nols1000/teamspeak-client-query.svg?style=flat-square)](https://travis-ci.org/Nols1000/teamspeak-client-query) [![node](https://img.shields.io/node/v/teamspeak-client-query.svg?style=flat-square)]() [![Gitter](https://img.shields.io/gitter/room/teamspeak-client-query/teamspeak-client-query.svg?style=flat-square)](https://gitter.im/teamspeak-client-query)

### Installation:
You can install this API via the node package manager. At the moment only github installation is supported. For more information take a look at the [npm install documentation](https://docs.npmjs.com/cli/install). (I will push the API to npm.js when it will be released.)
```
npm install Nols1000/teamspeak-client-query
```

### Usage:
At the moment the API is not ready to use. But if you like to test the features that are implemented, you could take a look at the [TeamspeakClientQuery.js](src/TeamspeakClientQuery.js). You will find well documented methods that you can test.
The API will use Promises. So expect something like this:
```JavaScript
let TeamspeakClientQuery = require('teamspeak-client-query').TeamspeakClientQuery;
let tcq = new TeamspeakClientQuery(address, port);
tcq.channellist().than(function(response) {
    // Do something in here
}, function(error) {
    throw error;
});
```

### Documentation
For a full documentation please wait for the first release.

### Features
- [ ] Methods
    - [ ] banadd
    - [ ] banclient
    - [ ] bandel
    - [ ] bandelall
    - [X] banlist
    - [ ] channeladdperm
    - [ ] channelclientaddperm
    - [ ] channelclientdelperm
    - [ ] ...
    - [X] channellist
    - [X] clientdblist
- [ ] Events

### Changelog
Please read [Changelog.md](CHANGELOG.md)

### Contributing
Please read [Contributing.md](CONTRIBUTING.md)

### License
Teamspeak Client Query
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

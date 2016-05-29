/*
* Copyright 2016 François Cadeillan
* Copyright 2016 Kevin de Carvalho
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.

* If it is not possible or desirable to put the notice in a particular
* file, then You may include the notice in a location (such as a LICENSE
* file in a relevant directory) where a recipient would be likely to look
* for such a notice.
*/

'use strict';

var requirejs = require('requirejs');

//TODO : find a way to build server code with r.js
requirejs.config({
	baseUrl: __dirname,
	nodeRequire: require,
	paths: {
        "node": "./node_modules",
        "interface": "./interface",
        "entity": "./entity",
        "bluebird": "./node_modules/bluebird/js/browser/bluebird.min",
        "io": "./socket.io/socket.io",
        "check-types": "./node_modules/check-types/src/check-types.min",
        "highland": "./node_modules/highland/dist/highland.min",
        "emitter": "./node_modules/event-emitter/index",
        "_class": './lib/oopTools',
	}
});

module.exports = requirejs;
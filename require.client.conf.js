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

define(function(){
  requirejs.onError = function (err) {
      console.log('Catched by require on toplevel - You have to handle/catch theses errors for production !!!');
      console.log('Require call type :', err.requireType);
      if (err.requireType === 'timeout') {
          console.log('modules: ' + err.requireModules);
      }
      console.log(err);
      if (err.stack){
        console.log(err.stack);
      }
  };
  require.config({
    "baseUrl":".",
    waitSeconds: 0,
    "paths": {
        "node": "./node_modules",
        "interface": "./interface",
        "entity": "./entity",
        "bluebird": "./node_modules/bluebird/js/browser/bluebird.min",
        "io": "./socket.io/socket.io",
        "check-types": "../node_modules/check-types/src/check-types.min",
        "_class": './lib/oopTools',
    },
    "shim": {},
    "include":[],
    "enforceDefine": true
  });
});

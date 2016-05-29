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

define(['lib/oopTools','entity/AEntity'], function(_class, eAEntity) {
  var EntityResponse = _class.extend(eAEntity, {
		name: 'EntityResponse',
		construct: function(i_uid, o_object){//Note : never have required value in constructor of entity
    		this._parent.construct();
        	this.entity_path = 'EntityResponse';
        	this.uid = i_uid? i_uid : null;
        	this.object = o_object? o_object : null;
		},
		getObject: function(){
		    return this.object;
		},
		getUid: function(){
		    return this.uid;
		}
	});

  return EntityResponse;
});
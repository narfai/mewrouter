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

define(['lib/oopTools', 'entity/AEntity'], function(_class, eAEntity) {
  var GenericEntity = _class.extend(eAEntity, {
		name: 'Entity',
		construct: function(s_name, a_property){//Note : never have required value in constructor of entity
      a_property = a_property? a_property : [];//Cause this one isn't supported by serialization system
			this._parent.construct();
      this.name = s_name;
      this.entity_path = 'entity';
      this.properties = a_property;
      for(var i = 0; i < a_property.length; i++){
        this[a_property[i]] = null;
      }
		},
    extend: function(a_property){
      for(var i = 0; i < a_property.length; i++){
        this.properties.push(a_property[i]);
        this[a_property[i]] = null;
      }
    }
	});

  return GenericEntity;
});

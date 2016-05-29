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

define(['lib/oopTools', 'entity/EntityRequest','interface/IEntity', 'interface/IEntityResponse'], function(_class, eEntityRequest, IEntity, IEntityResponse){
    var i_static_uid = 0;
    var RequestBuilder = _class.create({
		name: 'RequestBuilder',
		wrap:function(o_entity){
			o_entity.implement(IEntity);
		  	return new eEntityRequest(++i_static_uid, o_entity);
		},
		unwrap:function(o_response_entity){
			o_response_entity.implement(IEntity, IEntityResponse);
		    return o_response_entity.getObject();
		}
    });
    return RequestBuilder;
});
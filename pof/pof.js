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

requirejs = require('./require.server.conf');

requirejs(['./router','entity/Entity', 'interface/IEntityRequest', 'entity/EntityResponse'], function(eRouter, eEntity, IRequestEntity, eEntityResponse){
    var o_router = new eRouter({
        observer_path : ['coin', './observer'],
        entity_path : ['./entity']
    });
    var TestEntity = eEntity.bind(eEntity, 'TestEntity', ['test']);
    var o_entity1 = new TestEntity();
    
    o_entity1.set('test', 'coin')
    .then(function(o_entity1){
        o_router.subscribe('IsoLocalObserver', 'general').then(function(listener){
            listener.on(function(o_requestentity, s_channel){
                var o_requestobject = o_requestentity.getObject();
                o_requestobject.set('test', 'im response !').then(function(o_modentity){
                    o_router.notify('IsoLocalObserver', 'general', new eEntityResponse(o_requestentity.getUid(), o_modentity));
                });
            }).filter({name:'EntityRequest'});
            o_router.query('IsoLocalObserver', 'general', o_entity1).then(function(o_entity2){
                console.log('It respond : ', o_entity2);
            });
        });
    });
});
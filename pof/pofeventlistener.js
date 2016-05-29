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

requirejs = require('./require.server.conf');

requirejs(['lib/CustomEventManager', 'entity/Entity'], function(EventManager, eEntity){
  
  var TestEntity = eEntity.bind(eEntity, 'TestEntity', ['test']);
  var o_entity1 = new TestEntity();
  var o_entity2 = new TestEntity();
  var o_entity3 = new TestEntity();
  var evm = new EventManager();
  
  //Catch every events (on handler)
  evm.on(function(o_entity, s_channel){//Must begin by on first !
     //ASYNC  
     console.log('all entity', o_entity);
  }).on(function(o_entity, s_channel){
    console.log('coin2 entity', o_entity);
  }).filter({test:'coin2'}).on(function(o_entity, s_channel){
    console.log('separated', o_entity);
    //this.done();
  }).channel('separated');
  
  o_entity1.set('test', 'coin').then(function(o_entity1){
    evm.emit(o_entity1, 'general');  
  });
  o_entity2.set('test', 'coin2').then(function(o_entity2){
    evm.emit(o_entity2, 'general');  
  });
  o_entity3.set('test', 'coin2').then(function(o_entity2){
    evm.emit(o_entity2, 'separated');  
  });
  
  //OR CHAINABLE
  //evm.on()/*What handler you want*/.on(function(o_entity){
     //ASYNC 
  //});
  
  //Once behavior (done handler)
  //evm.on(function(){
     //ASYNC  
  //}).done();//Remove event listener
  
  //Chainable AND filtering (filter handler)
  //evm.on().filter({name:'RequestEntity'}).on(function(o_entity, s_channel){
      //Match all RequestEntity
//      console.log('Unhandled entity on ' + s_channel, o_entity);
//  }).filter({uid:107}).on(function(o_entity, s_channel){
      //Mach RequestEntity with uid #107
      //console.log('Response on ' + s_channel, o_entity)
      //this.done();//Notice you can call handler methods here for close subscription
  //});
  
  //Chainable channel filtering (channel handler)
  //evm.on().channel('general').on(function(o_entity){
      //console.log('general channel received', o_entity);
  //}).filter({name:"LayoutEntity"}).on(function(o_entity){
      //console.log('Get layout entity !', o_entity);
  //});
  
  //evm.emit({/*entity*/}); //Broadcast
  //evm.emit({/*entity*/}, 'general');//Emit on channel
  
});

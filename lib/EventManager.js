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

define(['lib/oopTools','interface/IEventManager','lib/EventListener'], function(_class, IEventManager, eEventListener){
    var EventManager = _class.create({
        name:"EventManager",
        construct: function(){
            this.listeners = [];
        },
        on: function(f_call){
          var self = this;
          var o_listener = new eEventListener(function(){
            self.removeListener(o_listener);
          }, f_call);
          this.listeners.push(o_listener);      
          return o_listener;
        },
        emit: function(o_entity, s_channel){
          for(var i = 0; i < this.listeners.length; i ++){       
              if(this.listeners[i].check(o_entity, s_channel) && this.listeners[i]._on){
                this.listeners[i]._on.call(this.listeners[i], o_entity, s_channel);
              }
          }
        },
        removeAllListener: function(s_event_name){
          this.listeners.length = 0;
          
        },
        removeListener: function(o_listener){
          for(var i = 0; i < this.listeners.length; i ++){
            if(this.listeners[i] === o_listener){
              this.listeners.splice(i, 1);
            }
          }	
        }
    }).implement(IEventManager);
    
    return EventManager;
});
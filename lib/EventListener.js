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

define(['lib/oopTools','interface/IEventListener'], function(_class, IEventListener){
    var EventListener = _class({
        name:'EventListener',
        construct: function(f_done, f_on){
          this.filters = [];  
          this._on = f_on || null;
          this.done = f_done;      
        },
        on: function(f_on){  
            var self = this;
            var o_chainer = new EventListener(this.done.bind(this), f_on);  
            o_chainer.filters = this.filters.slice(0);
            var f_original_on = this._on;
            this._on = function(o_entity, s_channel){//Propagation
                if(f_original_on) { f_original_on.call(self, o_entity, s_channel); }
                if(o_chainer.check(o_entity, s_channel)){
                    if(o_chainer._on) { o_chainer._on.call(o_chainer, o_entity, s_channel); }
                }
            };
            return o_chainer;
        },
        check: function(o_entity, s_channel, debug){  
          for(var i = 0; i < this.filters.length; i++){
            for(var key in this.filters[i]){
              if(typeof this.filters[i]['channel'] !== 'undefined'){
                if(this.filters[i]['channel'] !== s_channel){
                  return false;
                }
              } else if(typeof o_entity[key] === 'undefined' || o_entity[key] !== this.filters[i][key]){
                return false;
              }
            }
          }
          return true;
        },
        filter: function(h_filter){
          this.filters.push(h_filter);
          return this;
        },
        channel: function(s_channel){
          return this.filter({'channel':s_channel});
        }
    }).implement(IEventListener);
    
    return EventListener;
});
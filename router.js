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

if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}

define(['lib/oopTools', 'bluebird', 'lib/RequestBuilder', 'interface/IEntity','interface/IEventListener'], function(_class, Promise, RequestBuilder, IEntity, IEventListener){
    function f_load_observer(s_observer_key, a_path){
        return new Promise(function(f_success, f_fail){
            var s_try_path = a_path.shift() + '/' + s_observer_key;
            require([s_try_path], function(RouterObserver){
                f_success(RouterObserver);
            }, function(e){
                if(a_path.length){
                    f_success(f_load_observer.call(null, s_observer_key, a_path));
                } else {
                	console.log(e);
                    f_fail(new Error('Unable to load ' + s_observer_key));
                }
            });
        });
    }
    function f_get_observer(s_observer_key, b_force){
        var self = this;
        if(!b_force && this.observer.hasOwnProperty(s_observer_key)){
            return this.observer[s_observer_key];
        } else {
            return f_load_observer(s_observer_key, this.conf.observer_path.slice(0)).then(function(Blueprint){
                var o_observer = new Blueprint();
                self.observer[s_observer_key] = Promise.resolve(o_observer);
                return o_observer;
            });
        }
    };
    
	/*Conf is loaded here*/
    var Router = _class.create({
		name: 'Router',
		construct: function(h_conf){
		    this.conf = h_conf;
		    this.requestbuilder = new RequestBuilder();
		    this.observer = {};
		},
		query: function(s_observer_key, s_channel, o_entity){
			var self = this;
	        o_entity.implement(IEntity);
		    
		    var o_requestentity = self.requestbuilder.wrap(o_entity);
		    var p = self.once(s_observer_key, s_channel, {
						name: 'EntityResponse',
						uid: o_requestentity.getUid()
				}).then(function(o_response){
					return self.requestbuilder.unwrap(o_requestentity);
				});	
			self.notify(s_observer_key, s_channel, o_requestentity);
			return p;
		},
    	once: function(s_observer_key, s_channel){
		    return f_get_observer.call(this, s_observer_key)
		        .then(function(o_observer){
		            return o_observer.once(s_channel);
		        });
		},
		subscribe: function(s_observer_key, s_channel){
		    return f_get_observer.call(this, s_observer_key)
		        .then(function(o_observer){
		            var o_listener =  o_observer.subscribe(s_channel);
		            o_listener.implement(IEventListener);
		            return o_listener;
		        });
		},
		unsubscribe: function(s_observer_key, s_channel, o_stream){
		    return f_get_observer.call(this, s_observer_key)
		        .then(function(o_observer){
		            return o_observer.unsubscribe(s_channel, o_stream);
		        });
		},
		notify: function(s_observer_key, s_channel, o_entity){
		    return f_get_observer.call(this, s_observer_key)
		        .then(function(o_observer){
		            return o_observer.notify(s_channel, o_entity);
		        });
    	}
    });
    return Router;
});

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

define(['lib/oopTools', 'interface/IRouterObserver', 'interface/IEntity', 'lib/EventManager'], function(_class, IRouterObserver, IEntity, eEventManager){
	function f_match_filter(h_left, h_right){
		for(var key in h_right){
			if(h_right.hasOwnProperty(key)){
				if(h_right[key] !== h_left[key]){
					return false;
				}
			}
		}
		return true;
	}
	
    var IsoLocalObserver = _class.create({
		name: 'IsoLocalObserver',
		construct: function(){
		    console.log(this.name + 'loaded');
		    this.eventmanager = new eEventManager();
		},
		once: function(s_channel, h_filter){
			var self = this;
			return new Promise(function(f_success, f_fail){
					var o_eventlistener = self.eventmanager.on(function(o_entity){
						f_success(o_entity);
						this.done();
					}).channel(s_channel);
					if(h_filter){
						o_eventlistener.filter(h_filter);
					}
			});
		},
		subscribe: function(s_channel){
			return this.eventmanager.on().channel(s_channel);
		},
		unsubscribe: function(o_listener){
			o_listener.done();
		},
		notify: function( s_channel, o_entity){
			this.eventmanager.emit(o_entity, s_channel);
		},
		clear: function(){}
    }).implement(IRouterObserver);
    return IsoLocalObserver; 
});
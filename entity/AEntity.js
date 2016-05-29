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

define(['lib/oopTools', 'bluebird', 'check-types','interface/IEntity'], function(_class, Promise, ehf_check, eIEntity) {
	function isEntityInstance(v_value){
		return ehf_check.object(v_value) && typeof v_value.implement !== 'undefined' && !!v_value.implement(eIEntity);
	}
	function isSerializedEntity(v_value){
		return ehf_check.object(v_value) && typeof v_value.entity_path !== 'undefined' && !!v_value.entity_path;
	}
	function getEntity(h_value){
		return new Promise(function(f_success, f_fail){
			require(['entity/' + h_value.entity_path], function(eEntity){
				var oc_entity = new eEntity();
				oc_entity.fromObjectModel(h_value)
					.then(function(oc_entity){
						f_success(oc_entity);
					});
			}, function(err){
				f_success(h_value);
			});
		});
	}
  var AEntity = _class.create({
		name: 'Entity',
		entity_path: '',
		construct: function(){},
    toObjectModel: function(){
			var self = this;
			var a_p = [];
      var o_serialized = {};
			function f_add_entity(s_key, v, b_is_list){
				a_p.push(v.toObjectModel().then(function(v){
					if(b_is_list){
						o_serialized[s_key].push(v);
					} else {
						o_serialized[s_key] = v;
					}
				}));
			}
			function f_add_value(s_key, v, b_is_list){
				a_p.push(Promise.resolve(v).then(function(v){
					if(b_is_list){
						o_serialized[s_key].push(v);
					} else {
						o_serialized[s_key] = v;
					}
				}));
			}

      for(s_key in this){
        if(this.hasOwnProperty(s_key) && s_key[0] !== '_'){//Avoid to work on inherited keys
					(function(s_key){
						var v_value = self[s_key];
						if(ehf_check.not.function(v_value)) {
							if(ehf_check.array.of.object(v_value)){ //Filter array of objects (it may contain other entity)
								o_serialized[s_key] = new Array();
								for(var i = 0; i < v_value.length; i++){
									if(isEntityInstance(v_value[i])){
										f_add_entity(s_key, v_value[i], true);
									} else {
										f_add_value(s_key, v_value[i], true);
									}
								}
							} else if(isEntityInstance(v_value)){
								f_add_entity(s_key, v_value);
		          } else {//Relay common data
								f_add_value(s_key, v_value);
							}
						}
					})(s_key);
        }
      }
      return Promise.all(a_p).then(function(){
				return o_serialized;
			});
    },
    fromObjectModel: function(o){
			var self = this;
			var a_p = [];
			function f_add_entity(s_key, v, b_is_list){
				a_p.push(getEntity(v).then(function(v){
					if(b_is_list){
						self[s_key].push(v);
					} else {
						self[s_key] = v;
					}
				}));
			}
			function f_add_value(s_key, v, b_is_list){
				a_p.push(Promise.resolve(v).then(function(v){
					if(b_is_list){
						self[s_key].push(v);
					} else {
						self[s_key] = v;
					}
				}));
			}
      for(s_key in o){
        if(o.hasOwnProperty(s_key)){
					var v_value = o[s_key];
					if(isSerializedEntity(v_value)){
						f_add_entity(s_key, v_value);
					} else if(ehf_check.array.of.object(v_value)){
						this[s_key] = [];
						for(var i = 0; i < v_value.length; i++){
							if(isSerializedEntity(v_value[i])){
								f_add_entity(s_key, v_value[i], true);
							} else {
								f_add_value(s_key, v_value[i], true);
							}
						}
					}	else {
						f_add_value(s_key, v_value)
					}
        }
      }
			return Promise.all(a_p).then(function(){
				return self;
			});
    },
		get: function(s_key){
			var self = this;
			return new Promise(function(f_success, f_fail){
				if(self.hasOwnProperty(s_key) ){
					f_success(self[s_key]);
				} else {
					f_fail(new Error('No such entity key ' + s_key));
				}
			});
		},
		set: function(s_key, v_value){
			var self = this;
			return new Promise(function(f_success, f_fail){
				if(self.hasOwnProperty(s_key)){
					self[s_key] = v_value;
					f_success(self);
				} else {
					f_fail(new Error('No such entity key ' + s_key));
				}
			});
		}
	});//TODO force implements IEntity

	return AEntity;
});

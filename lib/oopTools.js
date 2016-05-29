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

define([], function(){
	var Class = {

		/**
		 * Extends method by providing access to parent method from within child
		 * method via this._parent[methodName];
		 */
		extendMethod : function(methodName,parentMethod,childMethod){

			return function(){
				var self = this;
				this._parent = {};

				/* Provide access to parent via this._parent[methodName], while making
				 * sure that "this" refers to the child instance */
				this._parent[methodName] = function(){
					var parentArgs = Array.prototype.slice.call(arguments);

					try {
						delete self._parent;
					} catch (e){
						self._parent = undefined;
					}

					/* Return result of parent method, called in the scope of the child instance */
					return parentMethod.apply(self,parentArgs);
				};
				var args = Array.prototype.slice.call(arguments);

				/* Return result of child function */
				return childMethod.apply(this,args);
			}
		},

		/**
		 * Creates instance-specific copies of any class properties which are objects or arrays.
		 *
		 * When the class is created, all properties are added to the prototype. This is fine
		 * for strings, numbers, booleans, etc. When their values are set on a class instance,
		 * the value becomes a property of that instance only. Objects (and arrays) are different.
		 * When you modify an object, the change is not made only to the single instance. Instead,
		 * the prototype itself is modified. The result is that modifying an object in one class
		 * instance ends up modifying that object in ALL classes' instances.
		 *
		 * To overcome this, we create a temporary object, copy the prototype object's properties
		 * into it, then assign the class instance property to that object. The end result is
		 * that the class instance has an instance-specific copy of the object, allowing it to be
		 * modified without affecting any other instances.
		 */
		createInstanceObjects : function(ClassInstance){
			for (var prop in ClassInstance){
				if (typeof ClassInstance[prop] === 'object' && ClassInstance[prop] !== null){
					ClassInstance[prop] = this.copyObj(ClassInstance[prop]);
				}
			}
		},

		/**
		 * Recursively creates deep copy of an object/array
		 */
		copyObj : function(source){

			var copy = (typeof source.length === 'number') ? [] : {};
			for (var i in source){
				copy[i] = (typeof source[i] === 'object' && source[i] !== null) ? this.copyObj(source[i]) : source[i];
			}

			return copy;
		},

		/**
		 * Checks whether all interfaces are properly and fully implemented in the
		 * ClassInstance's prototype
		 */
		checkInterfaces : function(o_against,interfaces){
			for (var i=0;i<interfaces.length;i++){
				for (var prop in interfaces[i]){
					if (interfaces[i].hasOwnProperty(prop)){						
						if (typeof o_against[prop] === 'undefined'){
							throw new Error('Interface not fully implemented: "'+prop+'" '+typeof interfaces[i][prop]+' is missing.');
						} else if (typeof interfaces[i][prop] !== typeof o_against[prop]){
							throw new Error('Interface improperly implemented. "'+prop+'" must be a '+typeof interfaces[i][prop]+'.');
						}
					}
				}
			}
		}
	};

	var ClassFactory                    = function(){};
	ClassFactory.BOOLEAN                = true;
	ClassFactory.FUNCTION               = function(){};
	ClassFactory.NUMBER                 = 1;
	ClassFactory.OBJECT                 = {};
	ClassFactory.STRING                 = '';
	ClassFactory.PROMISE               = function(){};

	/**
	 * Creates new class based on definition object
	 */
	ClassFactory.create = function(definition){
		function ClassInstance(){
			Class.createInstanceObjects(this);
			if (typeof this.construct === 'function'){
				this.construct.apply(this,Array.prototype.slice.call(arguments));
			}
		}
		ClassInstance.prototype = definition;

		ClassInstance.implement = function(){
			Class.checkInterfaces(this.prototype,Array.prototype.slice.call(arguments));
			return this;
		};
		ClassInstance.implements = ClassInstance.implement;
		ClassInstance.prototype.implement = function(){
			Class.checkInterfaces(this.__proto__,Array.prototype.slice.call(arguments));
			return this;
		};
		ClassInstance.prototype.implements = ClassInstance.prototype.implement;
		
		return ClassInstance;
	};

	/**
	 * Extends class, adding the child class definition to the parent class
	 * prototype and extending any parent methods
	 */
	ClassFactory.extend = function(parent,definition){

		function ParentInstance(){}

		var ClassInstance                       = ClassFactory.create(definition);
		ParentInstance.prototype                = parent.prototype;
		ClassInstance.prototype                 = new ParentInstance();
		ClassInstance.prototype.constructor     = ClassInstance;
		for (var prop in definition){
			if (definition.hasOwnProperty(prop)){
				if (typeof definition[prop] === 'function' && typeof parent.prototype[prop] === 'function'){
					definition[prop] = Class.extendMethod(prop,parent.prototype[prop],definition[prop]);
				}
				ClassInstance.prototype[prop]   = definition[prop];
			}
		}

		return ClassInstance;
	};
	return ClassFactory;
});

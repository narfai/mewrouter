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

define(['lib/oopTools'], function(_class){
	return {
		/*Promise(Entity entity)*/once: _class.FUNCTION,/*(string channel)*/
		/*Stream(Entity entity)*/subscribe: _class.FUNCTION,/*(string channel)*/
		/*Promise()*/unsubscribe: _class.FUNCTION,/*(string channel)*/
		/*Promise(integer notified)*/notify: _class.FUNCTION,/*(string channel, Entity entity)*/
		/*
		list of available type for interfaces
			_class.BOOLEAN
			_class.FUNCTION
			_class.NUMBER
			_class.OBJECT
			_class.STRING
			_class.PROMISE
		*/
	}
});

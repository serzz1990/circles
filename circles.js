(function(){

	"use strict";


	document.constructor.prototype.createElementSvgCircles = function( arr ){

		return new ElementSvgCircles( arr );

	};


	var _private = {};
	_private.methods = {};


	/**
	 *     Constructor  -  Element Svg Circles
	 */
	function ElementSvgCircles( circles ){

		this.SVG = _private.createSvg();
		this.SVG.__data = this;
		this.circles = [];


		_private.methods.global.add.call( this, circles );

		this.SVG.get = _private.methods.global.get.bind(this.SVG.__data);
		this.SVG.add = _private.methods.global.add.bind(this.SVG.__data);

		return this.SVG;

	}


	_private.methods.global = {};


	_private.methods.global.add = function(params){

		var res = [];

		if ( isArray(params) ) for(var i=0; params.length>i; i++){
			res.push( _private.methods.global.addCircles.call( this, params[i]) );
		}
		else res = _private.methods.global.addCircles.call( this, params );

		if( res ) this.circles = this.circles.concat(res);
		return res;

	};


	_private.methods.global.addCircles = function(circles){

		if ( _private.methods.collection.isCollection(circles) ) return _private.methods.global.addCollection.call( this, circles);
		if ( _private.methods.circle.isCircle(circles) ) return _private.methods.global.addCircle.call( this, circles);

		return null;
	};


	_private.methods.global.addCircle = function(option){

		if( !_private.methods.circle.isCircle(option) ){
			_private.error('Invalid circle', option);
			return null;
		}

		return new Circle( this.SVG, option);

	};


	_private.methods.global.addCollection = function(option){

		if( !_private.methods.collection.isCollection(option) ){
			_private.error('Invalid collection', option);
			return null;
		}

		return new Collection( this.SVG, option);

	};


	_private.methods.global.get = function(find){

		if( typeof find === 'string' ){
			//поиск по имени
			for(var i = this.circles.length; i--;){
				if( this.circles[i] && this.circles[i].name == find) return this.circles[i];
			}
			return null;
		}

		//TODO Доделать поиск коллекции и кругов
		return this.circles;

	};













	/**
	 *     Constructor  -  Circle
	 */
	function Circle( svg, option, collection) {

		this.svg  = svg;
		this.id   = _private.getUnicId();
		this.path = _private.createSvgElement('path');
		this.animation = {
			queue : []
		};

		if(collection) this.collection = collection;
		if(option.name) this.name = option.name;


		this.params = _private.validateParams(option);
		this.path.setAttribute('id', this.id);
		_private.addClass(this.path, this.name);
		_private.methods.circle.set.params(this.path, this.params);

		this.svg.appendChild(this.path);

		return this;

	}

	Circle.prototype.update = function(){

		var animation = {
			circle : this,
			options: {
				delay : (this.animation.delay || 0),
				queue : true
			},
			params : {}
		};


		this.animation.delay = 0; // Clear delay;


		if( typeof arguments[0] === 'string' ){

			if( !arguments[1] && arguments[1] !== 0 ){
				return _private.error('Update > no val');
			}

			animation.params[arguments[0]] = arguments[1];
			animation.options.duration = arguments[2];
			animation.options.callback = arguments[3];

		}else if( typeof arguments[0] === 'object' ){

			animation.params = arguments[0];
			animation.options.duration = arguments[1];
			animation.options.callback = arguments[2];

		}


		if(!animation.options.duration){

			animation.circle.params = _private.validateParams( deepExtend( animation.circle.params, animation.params) );
			_private.methods.circle.set.params( animation.circle.path, animation.circle.params);
			animation.options.callback && animation.options.callback.call( animation.circle, animation.circle );

			return this;
		}

		if(!animation.options.queue){
			_private.methods.circle.animation.start(animation);
		}else{
			_private.methods.circle.animation.add(animation);
		}


		return this;

	};


	Circle.prototype.delay = function(time){

		this.animation = this.animation || {};
		this.animation.delay = (parseInt(time) || 0);

		return this;
	};


	_private.methods.circle = {};
	_private.methods.circle.get = {};
	_private.methods.circle.set = {};


	_private.methods.circle.get.randomColor = function(){

		var rgb = [_private.getRandomInt(0,255), _private.getRandomInt(0,255), _private.getRandomInt(0,255)];
		return 'rgb('+rgb.join(',')+')';

	};


	_private.methods.circle.get.coordinates = function( percent, C, R ){

		percent = percent || 0; if (percent >= 100) percent = 99.999;
		var res = {};

		res.angle = 360/100 * percent;
		res.alpha = (90 - res.angle) * Math.PI / 180;
		res.x = C + R * Math.cos(res.alpha);
		res.y = C - R * Math.sin(res.alpha);

		return res;

	};


	_private.methods.circle.set.params = function( path, params ){

		path.setAttribute('fill','transparent');
		path.setAttribute('opacity', params.opacity);
		path.setAttribute('stroke', params.color);
		path.setAttribute('stroke-width', params.width);
		path.setAttribute('d', _private.methods.circle.generateD(params) );

	};


	_private.methods.circle.generateD = function( params ){

		var CENTER = 50;
		var start = _private.validation.start( params.start || params.floatStat );

		var finish = _private.validation.finish( params.percent, start );
		var R = params.radius - params.width / 2;
		var PointA = _private.methods.circle.get.coordinates( start, CENTER, R );
		var PointB = _private.methods.circle.get.coordinates( finish, CENTER, R );

		var d = [ 'M', PointA.x, PointA.y, 'L', PointA.x, PointA.y,
			'A', R, R, 0, +(PointB.angle - PointA.angle > 180), 1, PointB.x, PointB.y ];

		return d.join(' ');

	};


	_private.methods.circle.isCircle = function( obj ){

		obj = (typeof obj == 'object') ? obj: {};
		return (obj.percent || obj.percent == 0)? true: false;

	};


	_private.methods.circle.animation = {};


	_private.methods.circle.animation.add = function( animation ){

		animation.circle.animation.queue.push(animation);

		_private.methods.circle.animation.next(animation.circle);

	};


	_private.methods.circle.animation.next = function( circle ){

		if( !circle.animation.__active ){

			var animation = circle.animation.queue.shift();
			if(animation) _private.methods.circle.animation.start(animation);

		}

	};


	_private.methods.circle.animation.start = function( animation ){

		if( animation.options.queue ){
			animation.circle.animation.__active = true;
		}

		setTimeout(function(){

			animation.__startTime = 0;
			animation.__lastTime = 0;

			animation.params = _private.validateParams(deepExtend({}, animation.circle.params, animation.params));
			requestAnimationFrame(_private.methods.circle.animation.loop.bind(animation));

		}, animation.options.delay);


	};


	_private.methods.circle.animation.getStep = function(from, to, delta, last){
		if(!from && from != 0) from = 0;
		if(!to && to != 0) to = 0;

		return (to-from) * delta / last;
	};


	_private.methods.circle.animation.color = function(from, to, deltaTime, lastTime){

		var fromRgb = _private.colors.parseRgb(from);
		var toRgb = _private.colors.parseRgb(to);

		for( var c = 3; c--; ){

			fromRgb[c] = parseInt(fromRgb[c]) + Math.round(  _private.methods.circle.animation.getStep( fromRgb[c], toRgb[c], deltaTime, lastTime)  );

		}

		return 'rgba('+fromRgb+')';

	};


	_private.methods.circle.animation.complete = function(animation){

		_private.methods.circle.set.params(animation.circle.path, animation.params);

		if( animation.options.queue ){

			animation.circle.animation.__active = false;
			_private.methods.circle.animation.next(animation.circle);

		}

		animation.options.callback && animation.options.callback.call(animation.circle, animation.circle);


	};


	_private.methods.circle.animation.loop = function(timestamp){


		if(!this.__startTime) this.__startTime = timestamp;

		var to,from;
		var progress  = timestamp - this.__startTime;
		var deltaTime = progress - this.__lastTime;
		var lastTime  = this.options.duration - progress;

		if( this.options.duration <= progress ){

			return _private.methods.circle.animation.complete(this);

		}


		this.__lastTime = progress;


		//update params
		for(var param in this.params){

			from = this.circle.params[param];
			to   = this.params[param];

			if( from === to ) continue;

			if( param === 'color' ){

				this.circle.params[param] = _private.methods.circle.animation.color(from, to, deltaTime, lastTime);
				continue

			}else if(typeof to !== 'number') continue;


			this.circle.params[param] += _private.methods.circle.animation.getStep(from, to, deltaTime, lastTime);

		}



		_private.methods.circle.set.params(this.circle.path, this.circle.params);

		requestAnimationFrame(_private.methods.circle.animation.loop.bind(this));

	};









	/**
	 *     Constructor  -  Collection
	 */
	function Collection( svg, option ){

		var circle,
			data = {};

		this.svg = svg;

		this.circles = [];

		this.params = {};
		this.params.start = _private.validation.start(option.start);
		this.params.width = _private.validation.width(option.width);
		this.params.radius = _private.validation.radius(option.radius, this.params.width);

		data.start = this.params.start;

		for( var i = 0; option.circles.length > i; i++){

			circle = new Circle( svg, deepExtend(option.circles[i], this.params, data), this );
			this.circles.push(circle);
			data.start += circle.params.percent;

		}

		return this;

	}


	_private.methods.collection = {};
	_private.methods.collection.get = {};
	_private.methods.collection.set = {};


	_private.methods.collection.isCollection = function(obj){
		obj = (typeof obj == 'object') ? obj: {};
		return (obj.circles)? true: false;
	};








	_private.error = function(){

		console.error.apply(console, arguments);

	};


	_private.addClass = function(el, className){

		if( !className ) return;
		if (el.classList) el.classList.add(className);
		else el.className += ' ' + className;

	};


	_private.createSvg = function(){

		var svg = _private.createSvgElement('svg');

		svg.setAttribute('version','1.1');
		svg.setAttribute('version','1.1');
		svg.setAttribute('viewBox','0 0 100 100');
		svg.setAttribute('width','100%');
		svg.setAttribute('height','100%');

		return svg;

	};


	_private.getUnicId = function(prefix){

		//TODO add prefix
		return 'circle-'+(new Date()).getTime() + Math.round(Math.random() * 100000000000000);

	};


	_private.getRandomInt = function(min, max) {

		return Math.floor(Math.random() * (max - min)) + min;

	};


	_private.createSvgElement = function(tag){

		if( !tag ) {
			_private.error('Error creating svg element, no tag');
			return null;
		}

		return document.createElementNS('http://www.w3.org/2000/svg', tag );

	};


	_private.validation = {

		radius : function(r,w){
			if( !r ) return 0;
			if( r > 50 ) return 50;
			if( w > r ) return w;
			return r;
		},
		width : function(w){
			if( !w && w !== 0 ) return 0.1;
			if( w > 50 ) return 50;
			return w;
		},
		start : function(s){
			return (!s || s > 100 || s < 0) ?0: s;
		},
		finish : function(p,s){
			s = s || 0;
			//todo для коллекции
			//p = s + p;
			return ( !p && p !== 0 || p > 100 )? 100: p;
		},
		percent: function(p,s){
			return ( !p && p !== 0 || p-s > 100 )? 100: p;
		}

	};

	_private.validateParams = function(params){

		var res = {};
		if( params.start || params.start === 0 ) res.start = _private.validation.start( params.start );
		else res.floatStart = _private.validation.start( params.floatStart );

		res.width   = _private.validation.width( params.width );
		res.radius  = _private.validation.radius( params.radius, res.width );
		res.percent = _private.validation.percent( params.percent, res.start || res.floatStart );
		res.color   = _private.colors.parse(params.color) || _private.methods.circle.get.randomColor();
		res.opacity = params.opacity || 1;

		return res;

	};

	_private.colors = {};


	_private.colors.random = function(){

		return 'rgba('+[Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)]+',1)';

	};


	_private.colors.parse = function(color){

		if(_private.colors.isHex(color)){
			color = _private.colors.hexToRgb(color);
		}
		return color;
	};


	_private.colors.isRgb = function(color){
		return /^rgba?\((\d{1,3}\.?,?)+\)$/i.test(color);
	};


	_private.colors.isHex = function(color){
		return /^#\S{3,6}$/i.test(color);
	};


	_private.colors.hexToRgb = function(hex) {

		var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
		hex = hex.replace(shorthandRegex, function(m, r, g, b) {
			return r + r + g + g + b + b;
		});

		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

		return result ? 'rgba('+[
			parseInt(result[1], 16),
			parseInt(result[2], 16),
			parseInt(result[3], 16)
		] + ',1)' : _private.colors.random();

	};


	_private.colors.parseRgb = function(color){

		return color.match(/(\d{1,3}\.?,?)+/i)[0].split(',');

	};




	var pageStartTimestamp = Date.now();
	var requestAnimationFrame = window.requestAnimationFrame       ||
								window.webkitRequestAnimationFrame ||
								window.mozRequestAnimationFrame    ||
								window.oRequestAnimationFrame      ||
								window.msRequestAnimationFrame     ||
								function (callback) {
									setTimeout(function(){
										callback(Date.now()-pageStartTimestamp);
									}, 1000 / 60);
								};


	var isArray = function(o) {
		return Object.prototype.toString.call(o) === '[object Array]';
	};


	var deepExtend = function(out) {
		out = out || {};

		for (var i = 1; i < arguments.length; i++) {
			var obj = arguments[i];

			if (!obj)
				continue;

			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					if (typeof obj[key] === 'object')
						deepExtend(out[key], obj[key]);
					else
						out[key] = obj[key];
				}
			}
		}

		return out;
	};


	if (!Function.prototype.bind) {
		Function.prototype.bind = function(oThis) {
			if (typeof this !== 'function') {
				// closest thing possible to the ECMAScript 5
				// internal IsCallable function
				throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
			}

			var aArgs   = Array.prototype.slice.call(arguments, 1),
				fToBind = this,
				fNOP    = function() {},
				fBound  = function() {
					return fToBind.apply(this instanceof fNOP
							? this
							: oThis,
						aArgs.concat(Array.prototype.slice.call(arguments)));
				};

			if (this.prototype) {
				// native functions don't have a prototype
				fNOP.prototype = this.prototype;
			}
			fBound.prototype = new fNOP();

			return fBound;
		};
	}


})();



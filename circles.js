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
		this.circles = [];

		_private.methods.global.add.call( this, circles );

		this.SVG.constructor.prototype.get = _private.methods.global.get.bind(this);
		this.SVG.constructor.prototype.add = _private.methods.global.add.bind(this);

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
				if(this.circles[i].name == find) return this.circles[i];
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

		this.params = {};
		this.svg  = svg;
		this.id   = _private.getUnicId();
		this.path = _private.createSvgElement('path');

		if(collection) this.collection = collection;
		if(option.name) this.name = option.name;

		option.name = false;

		this.params = _private.validateParams(option);
		this.path.setAttribute('id', this.id);
		_private.addClass(this.path, this.name);
		_private.methods.circle.set.params(this.path, this.params);

		this.svg.appendChild(this.path);

		return this;

	}

	Circle.prototype.update = function(){

		var duration,
			params = {},
			cb;


		if( typeof arguments[0] === 'string' ){

			if( !arguments[1] && arguments[1] !== 0 ){
				return _private.error('Update > no val');
			}
			params[arguments[0]] = arguments[1];
			duration = arguments[2];
			cb = arguments[3];

		}else if( typeof arguments[0] === 'object' ){

			params = arguments[0];
			duration = arguments[1];
			cb = arguments[2];

		}

		if(!duration){

			this.params = _private.validateParams( deepExtend(this.params,params) );
			_private.methods.circle.set.params(this.path, this.params);
			cb && cb.call(this, this);

		}else{
			_private.methods.circle.set.animation(this, params, duration, cb);
			_private.methods.circle.animation.start(this);
		}

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


	_private.methods.circle.set.animation = function(circle, params, duration, cb){

		circle.animation = circle.animation || {};

		circle.animation.duration = duration;
		circle.animation.callback = cb || false;
		circle.animation.params   =  _private.validateParams(deepExtend({},circle.params,params));

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


	_private.methods.circle.animation.start = function(circle){

		circle.animation.startTime = 0;
		circle.animation.lastTime = 0;

		requestAnimationFrame(_private.methods.circle.animation.loop.bind(circle));

	};


	_private.methods.circle.animation.loop = function(timestamp){

		if(!this.animation.startTime) this.animation.startTime = timestamp;

		var progress = timestamp - this.animation.startTime;
		var deltaTime = progress - this.animation.lastTime;

		if( this.animation.duration <= progress ){
			this.animation.callback && this.animation.callback.call(this, this);
			return _private.methods.circle.set.params(this.path, this.animation.params);
		}



		this.animation.lastTime = progress;


		//update params
		var step,to,from;

		for(var param in this.animation.params){

			from = this.params[param] = this.params[param]|| 0;
			to   = this.animation.params[param];
			if(typeof to !== 'number') continue;

			step = ((to-from) * deltaTime) / (this.animation.duration - progress);

			this.params[param] += step;

		}


		_private.methods.circle.set.params(this.path, this.params);

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

		if( !el || !className ) return;
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

		return svg

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
			p = s + p;
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
		res.color   =  params.color || _private.methods.circle.get.randomColor();
		res.opacity =  params.opacity || 1;

		return res;

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


})();



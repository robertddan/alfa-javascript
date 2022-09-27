'use strict';

var chart = {
	svg: {},
	height: 1890,
	width: 2240,
	grid_gap: 60,
	constructor: function(sDivId) {
		try {
			// chart
			if (!this.chart_stage()) throw 'chart_stage';
			if (!this.chart_limits()) throw 'chart_limits';
			if (!this.chart_grid()) throw 'chart_grid';
			document.getElementById(sDivId).appendChild(this.svg);
			return true;
		} catch (e) {
			console.error(e);
		}
  },
	chart_stage: function() {
		this.xmlns = 'http://www.w3.org/2000/svg';
		this.svg = document.createElementNS(this.xmlns, 'svg');
		this.svg.setAttributeNS(null, 'id', 'chart');
		this.svg.setAttributeNS(null, 'height', this.height);
		this.svg.setAttributeNS(null, 'width', this.width);
		return true;
  },
	chart_limits: function() {
		// Limits
		let groupLimits = document.createElementNS(this.xmlns, 'g');
		// Vertical
		let borderVertical = document.createElementNS(this.xmlns, 'line');
		borderVertical.setAttributeNS(null, 'x1', '0');
		borderVertical.setAttributeNS(null, 'x2', '0');
		borderVertical.setAttributeNS(null, 'y1', '0');
		borderVertical.setAttributeNS(null, 'y2', this.height);
		borderVertical.setAttributeNS(null, 'stroke', 'Red');
		// Horizontal
		let linesHorizontal = document.createElementNS(this.xmlns, 'line');
		linesHorizontal.setAttributeNS(null, 'x1', '0');
		linesHorizontal.setAttributeNS(null, 'x2', this.width);
		linesHorizontal.setAttributeNS(null, 'y1', this.height);
		linesHorizontal.setAttributeNS(null, 'y2', this.height);
		linesHorizontal.setAttributeNS(null, 'stroke', 'Red');
		// Append
		groupLimits.appendChild(borderVertical);
		groupLimits.appendChild(linesHorizontal);
		this.svg.appendChild(groupLimits);
		return true;
	},
	chart_grid: function() {
		// Grid
		let groupGrid = document.createElementNS(this.xmlns, 'g');
		// Grid horizontal
		for (let i = 0; i < (this.width / this.grid_gap); i++) {
			let gridHorizontal = document.createElementNS(this.xmlns, 'line');
			gridHorizontal.setAttributeNS(null, 'x1', this.grid_gap * i);
			gridHorizontal.setAttributeNS(null, 'y1', 0);
			gridHorizontal.setAttributeNS(null, 'x2', this.grid_gap * i);
			gridHorizontal.setAttributeNS(null, 'y2', this.height);
			gridHorizontal.setAttributeNS(null, 'stroke', 'LightGray');
			groupGrid.appendChild(gridHorizontal);
		}
		// Grid vertical
		for (let i = 0; i < (this.height / this.grid_gap); i++) {
			let gridVertical = document.createElementNS(this.xmlns, 'line');
			gridVertical.setAttributeNS(null, 'x1', 0);
			gridVertical.setAttributeNS(null, 'y1', this.grid_gap * i);
			gridVertical.setAttributeNS(null, 'x2', this.width);
			gridVertical.setAttributeNS(null, 'y2', this.grid_gap * i);
			gridVertical.setAttributeNS(null, 'stroke', 'LightGray');
			groupGrid.appendChild(gridVertical);
		}
		//append
		this.svg.appendChild(groupGrid);
		return true;
	}
};

var prices = {
	xhr: {},
	list: {},
	prices_event: function() {
		return new CustomEvent('PricesLoaded');
	},
	constructor: function(sDivId) {
		try {
			// get data
			if (!this.prices_xhr()) throw 'prices_xhr';
			if (!this.prices_get()) throw 'prices_get';
			return true;
		} catch (e) {
			console.error(e);
		}
  },
	get: function() {
		return this.list;
	},
	prices_set: function(prices) {
		this.list = prices;
		return true;
	},
	prices_xhr: function () {
		if (window.XMLHttpRequest) {
			// moderner Browser - IE ab version 7
			this.xhr = new XMLHttpRequest();
		} else if (window.ActiveXObject) {
			// IE 6
			this.xhr = new ActiveXObject('Microsoft.XMLHTTP');
		}
		return true;
	},
	prices_load: function(event) {
		if (event.target.status !== 200) return console.log(event.target.status);
		if (event.target.readyState !== 4) return console.log(event.target.readyState);
		if (!window.prices.prices_set(event.target.response)) throw 'prices_set'; 
		document.dispatchEvent(window.prices.prices_event());
		console.log('Laden der Daten abgeschlossen');
	},
	prices_progress: function(event) {
		//console.log('Received '+ event.loaded +' of ' + event.total + ' bytes');
		//this.list = event.target.response;
		//if (event.loaded == event.total) {}
		//console.log('Fortschritt beim Laden der Daten');
	},
	prices_error: function(event) {
		console.error(event);
		throw 'Fehler beim Laden der Daten aufgetretn';
	},
	prices_timeout: function(event) {
		console.error(event);
		throw 'Timeout beim Laden der Daten aufgetreten';
	},
	prices_get: function() {
		this.xhr.open('POST', 'script.php', true);
		this.xhr.responseType = 'json';
		this.xhr.send();
		this.xhr.addEventListener('load', this.prices_load);
		this.xhr.addEventListener('progress', this.prices_progress);
		this.xhr.addEventListener('error', this.prices_error);
		this.xhr.addEventListener('timeout', this.prices_timeout);
		return true;
  }
};

var shapes = {
	index: 0,
	index_first: false,
	time: 2, // min
	time_lock: false,
	shapes: null,
	shapes_key: 0,
	shapes_lestest: null,
	sticks: null,
	lestest: null,
	key: 0,
	prices: [],
	debug: 0,
	constructor: function(prices) {
		try {
			// set shapes
			for (let i = 0; i < prices.length; i++) {
				const time = new Date(prices[i].time);
				if (!this.comparison(time)) throw 'this.comparison';
				if (!this.enclose(time)) throw 'this.enclose';
				if (!this.setup(prices[i])) throw 'this.setup';
				if (!this.structure()) throw 'this.structure';
			}
			return true;
		} catch (e) {
			console.error(e);
		}
  },
	get: function() {
		return this.sticks;
	},
	structure: function() {
		if (this.shapes[this.shapes_key] == undefined) return true;
		if (this.lestest !== this.index.getTime()) this.key = this.key + 1;
		this.lestest = this.index.getTime();
		let closeoutAsk = this.shapes[this.shapes_key].map(function(value) {return value.closeoutAsk;});
		if (this.sticks == null) this.sticks = Object.create({});
		if (this.sticks[this.key] == undefined) this.sticks[this.key] = new Array();
		let stick = new Array(
			Math.max(...closeoutAsk).toString(),
			Math.min(...closeoutAsk).toString(),
			closeoutAsk[0],
			closeoutAsk[closeoutAsk.length - 1]
		);
		this.sticks[this.key] = stick;
		return true;
  },
	setup: function(price) {
		if (this.shapes_lestest !== this.index.getTime()) this.shapes_key = this.shapes_key + 1;
		this.shapes_lestest = this.index.getTime();
		if (this.shapes == null) this.shapes = Object.create({});
		//if (this.time_lock !== true) return true; //enclose(); disabled for moment
		if (this.shapes[this.shapes_key] == undefined) this.shapes[this.shapes_key] = new Array();
		this.shapes[this.shapes_key].push(price);
		return true;
  },
	enclose: function(time) { // start from fix minute/ ex: 11:11:11 => 11:12:00 for 2min or 11:15:00 for 5 min, etc.
		let minute = time.getMinutes();
		if (minute % this.time === 0) this.time_lock = true;
		else this.time_lock = false; 
		return true;
  },
	comparison: function(time) {
		if (this.index_first == false) this.index = time;
		let indexDate = new Date();
		indexDate.setFullYear(this.index.getFullYear());
		indexDate.setMonth(this.index.getMonth());
		indexDate.setDate(this.index.getDate());
		indexDate.setHours(this.index.getHours());
		indexDate.setMinutes(this.index.getMinutes() + this.time);
		indexDate.setSeconds(0);
		let newDate = new Date();
		newDate.setFullYear(time.getFullYear());
		newDate.setMonth(time.getMonth());
		newDate.setDate(time.getDate());
		newDate.setHours(time.getHours());
		newDate.setMinutes(time.getMinutes());
		newDate.setSeconds(0);
		if (this.index_first == false) this.index = indexDate;
		if (this.index_first == false) this.index_first = true;
		if (indexDate.getTime() < newDate.getTime()) this.index = indexDate;
		return true;
  }
};

var sticks = {
	chart: window.chart,
	scale: null,
	ratio: null,
	min: null,
	sticks: null,
	xmlns: '',
	width: 12,
	svg: null,
	gap: 10,
	constructor: function(list) {
		try {
			// set sticks
			this.xmlns = 'http://www.w3.org/2000/svg';
			this.svg = window.chart.svg;
			
			if (!this.sticks_scale(list)) throw 'sticks.sticks_scale';
			if (!this.sticks_ratio(list)) throw 'sticks.sticks_ratio';
			if (!this.sticks_architecture(list)) throw 'sticks.sticks_architecture';
			if (!this.sticks_view()) throw 'sticks.sticks_view';
			console.log(this.sticks);
			return true;
		} catch (e) {
			console.error(e);
		}
  },
	sticks_chart: function(chart, groupGrid) {
		let stick_y = 100;
		let stick_x = 6;
		let stick_group = document.createElementNS(this.xmlns, 'g');
		let stick_body = document.createElementNS(this.xmlns, 'rect');
		let stick_top = document.createElementNS(this.xmlns, 'line');
		let stick_below = document.createElementNS(this.xmlns, 'line');
		console.log([chart.get('high'), chart]);
		if (chart.get('open') > chart.get('close')) {
			// bullish

			stick_top.setAttributeNS(null, 'x1', this.gap + stick_x);
			stick_top.setAttributeNS(null, 'x2', this.gap + stick_x);
			stick_top.setAttributeNS(null, 'y1', chart.get('high'));
			stick_top.setAttributeNS(null, 'y2', chart.get('open'));
			stick_top.setAttributeNS(null, 'stroke', 'Black');
			
			//let stick_body = document.createElementNS(this.xmlns, 'rect');
			stick_body.setAttributeNS(null, 'x', this.gap + stick_x);
			stick_body.setAttributeNS(null, 'y', chart.get('open') + stick_y);
			stick_body.setAttributeNS(null, 'width', this.width);
			stick_body.setAttributeNS(null, 'height', (chart.get('open') - chart.get('close')) );
			stick_body.setAttributeNS(null, 'fill', 'DodgerBlue');
			stick_body.setAttributeNS(null, 'stroke', 'White');
			
			
		}
		else if (chart.get('open') < chart.get('close')) {
			// bearisch
			stick_top.setAttributeNS(null, 'x1', this.gap + stick_x);
			stick_top.setAttributeNS(null, 'x2', this.gap + stick_x);
			stick_top.setAttributeNS(null, 'y1', chart.get('high'));
			stick_top.setAttributeNS(null, 'y2', chart.get('close'));
			stick_top.setAttributeNS(null, 'stroke', 'Black');
			
			//let stick_body = document.createElementNS(this.xmlns, 'rect');
			stick_body.setAttributeNS(null, 'x', this.gap);
			stick_body.setAttributeNS(null, 'y', 10 - chart.get('open') + stick_y);
			stick_body.setAttributeNS(null, 'width', this.width);
			stick_body.setAttributeNS(null, 'height', (chart.get('close') - chart.get('open')) );
			stick_body.setAttributeNS(null, 'fill', 'Red');
			stick_body.setAttributeNS(null, 'stroke', 'White');
			
			
		}
		else if (chart.get('open') == chart.get('close')) {
			// doji
			stick_top.setAttributeNS(null, 'x1', this.gap + stick_x);
			stick_top.setAttributeNS(null, 'x2', this.gap + stick_x);
			stick_top.setAttributeNS(null, 'y1', chart.get('high'));
			stick_top.setAttributeNS(null, 'y2', chart.get('close'));
			stick_top.setAttributeNS(null, 'stroke', 'Black');
			
			//let stick_body = document.createElementNS(this.xmlns, 'rect');
			stick_body.setAttributeNS(null, 'x', this.gap);
			stick_body.setAttributeNS(null, 'y', chart.get('open') + stick_y);
			stick_body.setAttributeNS(null, 'width', this.width);
			stick_body.setAttributeNS(null, 'height', 2);
			stick_body.setAttributeNS(null, 'fill', 'DodgerBlue');
			stick_body.setAttributeNS(null, 'stroke', 'White');
			
			
		}
		
		this.gap = this.gap + 20;
		console.log(this.gap);
			
/*
	<line x1="0" y1="0" x2="200" y2="200" style="stroke:rgb(255,0,0);stroke-width:2" />
	<line 
		x1="{{ xx1 }}"
		y1="{{ 2555 - price.chart_high }}" 
		x2="{{ xx1 }}" 
		y2="{{ 2555 - price.chart_open }}" 
		style="stroke:DodgerBlue;stroke-width:1"
	/>
*/
/*
{% if price.chart_open > price.chart_close %}
	<!-- bearish -->
	<line 
		x1="{{ xx1 }}"
		y1="{{ 2555 - price.chart_high }}" 
		x2="{{ xx1 }}" 
		y2="{{ 2555 - price.chart_open }}" 
		style="stroke:DodgerBlue;stroke-width:1"
	/>
	<!-- bearish -->
{% elseif price.chart_open < price.chart_close %}
	<!-- bullish -->
	<line 
		x1="{{ xx1 }}"
		y1="{{ 2555 - price.chart_high }}" 
		x2="{{ xx1 }}" 
		y2="{{ 2555 - price.chart_close }}" 
		style="stroke:DodgerBlue;stroke-width:1"
	/>
	<!-- bullish -->
{% elseif price.chart_open == price.chart_close %}
	<!-- doji-->
	<line 
		x1="{{ xx1 }}"
		y1="{{ 2555 - price.chart_high }}" 
		x2="{{ xx1 }}" 
		y2="{{ 2555 - price.chart_open }}" 
		style="stroke:DodgerBlue;stroke-width:1"
	/>
	<!-- doji-->
{% endif %}

{% set xx1 = 150 + ((loop.index / 1) - 1) * (3700 / prices|length) %}
{% set xx2 = 150 + (loop.index / 1) * (3700 / prices|length) %}
					
{% elseif price.chart_open == price.chart_close %}
<!-- doji -->
	<rect 
		x="{{ xx1 - 6}}"
		y="{{ 2555 - price.chart_open }}" 
		width="12" 
		height="1"
		style="fill:DodgerBlue;stroke:DodgerBlue;stroke-width:0.5;" 
	/>
	<!-- doji -->
{% endif %}
*/
/*
rect.setAttributeNS( null,'x',x );
rect.setAttributeNS( null,'y',y );
rect.setAttributeNS( null,'width','50' );
rect.setAttributeNS( null,'height','50' );
rect.setAttributeNS( null,'fill','#'+Math.round( 0xffffff * Math.random()).toString(16) );
document.getElementById( 'svgOne' ).appendChild( rect );
*/
/*
<rect 
	x="{{ xx1 - 6}}"
	y="{{ 2555 - price.chart_open }}" 
	width="12" 
	height="{{ price.chart_open - price.chart_close }}"
	style="fill:none;stroke:DodgerBlue;stroke-width:1;" {# fill:DodgerBlue; - Red - DodgerBlue #}
	opacity="1"
/>
*/
/*
% if price.chart_open > price.chart_close %}
<!-- bullish -->
height="{{ price.chart_open - price.chart_close }}"

{% elseif price.chart_open < price.chart_close %}
<!-- bearish -->
height="{{ price.chart_close - price.chart_open }}"
*/

		// append
		
		stick_group.appendChild(stick_top);
		stick_group.appendChild(stick_body);
		
		this.svg.appendChild(stick_group);
		return true;
  },
	sticks_view: function() {
		for (const [key, value] of Object.entries(this.sticks)) {		
			this.sticks_chart(value);
			// <rect x="120" width="100" height="100" rx="15" />
		}
		
		return true;
  },
	sticks_architecture: function(prices) {
		if (this.sticks == null) this.sticks = Object.create({});
		let len = Object.keys(prices).length;
		let i = 0;
		let keys = ['high', 'low', 'open', 'close'];
		for (const [key, value] of Object.entries(prices)) {
			for (let j = 0; j < value.length; j++) {
				if (this.sticks[i] == undefined) this.sticks[i] = new Map();
				this.sticks[i].set(keys[j], this.price_ratio(value[j]));
			}
			i = i + 1;
		}
		return true;
  },
	price_ratio: function(price) {
		let diff = Number(price) - Number(this.min);
		return Number(diff) * Number(this.ratio);
  },
	sticks_scale: function(list) { 
		if (this.scale !== null) return true;
		let prices = new Array(list[1], list[Object.keys(list).length]);
		for (let i = 0; i < prices.length; i++) {
			for (let j = 0; j < prices[i].length; j++) {
				let len = prices[i][j].split('.')[1].length;
				if (this.scale < len) this.scale = len;
			}
		}
		return true;
  },
	sticks_ratio: function(prices) {
		if (this.ratio !== null) return true;
		let allPrices = [];
		let len = Object.keys(prices).length;
		for (const [key, value] of Object.entries(prices)) {
			for (let j = 0; j < value.length; j++) allPrices.push(value[j]);
		}
		let minPrice = Math.min(...allPrices);
		let maxPrice = Math.max(...allPrices);
		let chartMin = -445; //window.chart.height
		let chartMax = +445;
		let difPrice = Number(maxPrice) - Number(minPrice);
		let difChart = Number(chartMax) - Number(chartMin);
		this.ratio = Number(difChart) / Number(difPrice);
		this.min = minPrice;
		return true;
	},
};


function init(value = false) {
	try {
		if (!value) if (!chart.constructor('wrapChart')) throw 'chart.constructor';
		if (!value) if (!prices.constructor()) throw 'prices.constructor';
		if (value) if (!shapes.constructor(prices.get())) throw 'shapes.constructor';
		if (value) if (!sticks.constructor(shapes.get())) throw 'sticks.constructor';
		return true;
	} catch (e) {
		console.error(e);
		return false;
	}
}

document.addEventListener('DOMContentLoaded', () => init(false));
document.addEventListener('PricesLoaded', () => init(true));







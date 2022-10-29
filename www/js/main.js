'use strict';

var chart = {
	svg: {},
	height: 1390,
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
		borderVertical.setAttributeNS(null, 'stroke', '#FEBC56');
		// Horizontal
		let linesHorizontal = document.createElementNS(this.xmlns, 'line');
		linesHorizontal.setAttributeNS(null, 'x1', '0');
		linesHorizontal.setAttributeNS(null, 'x2', this.width);
		linesHorizontal.setAttributeNS(null, 'y1', this.height);
		linesHorizontal.setAttributeNS(null, 'y2', this.height);
		linesHorizontal.setAttributeNS(null, 'stroke', '#FEBC56');
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
	prices_event: function() {
		return new CustomEvent('PricesLoaded');
	},
	get: function() {
		return this.list;
	},
	prices_set: function(prices) {
		this.list = prices;
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
		// TO DO IT!
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
				if (i < 250) continue;
				//if (i > 4000) break;
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
		this.shapes[this.shapes_key].unshift(price);
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
	width: 10,
	svg: null,
	gap: 1,
	chartMin: -650,
	chartMax: +650,
	stick_xx: 0,
	stick_x: 0,
	stick_y: 1260,
	constructor: function(list) {
		try {
			// set sticks
			this.xmlns = 'http://www.w3.org/2000/svg';
			this.svg = window.chart.svg;
			if (!this.sticks_scale(list)) throw 'sticks.sticks_scale';
			if (!this.sticks_ratio(list)) throw 'sticks.sticks_ratio';
			if (!this.sticks_architecture(list)) throw 'sticks.sticks_architecture';
			if (!this.sticks_view()) throw 'sticks.sticks_view';
			return true;
		} catch (e) {
			console.error(e);
		}
  },
	sticks_chart: function(chart) {
		let stick_group = document.createElementNS(this.xmlns, 'g');
		let stick_body = document.createElementNS(this.xmlns, 'rect');
		let stick_top = document.createElementNS(this.xmlns, 'line');
		let stick_below = document.createElementNS(this.xmlns, 'line');
		//let stick_xx = this.gap * (window.chart.width / Object.keys(this.sticks).length);
		this.stick_xx = this.gap * 11;
		stick_group.setAttribute('class', 'chart_group');
		if (chart.get('open') > chart.get('close')) {
			// bullisch
			//top
			stick_top.setAttributeNS(null, 'x1', this.stick_x + this.stick_xx);
			stick_top.setAttributeNS(null, 'x2', this.stick_x + this.stick_xx);
			stick_top.setAttributeNS(null, 'y1', this.stick_y - chart.get('high'));
			stick_top.setAttributeNS(null, 'y2', this.stick_y - chart.get('open'));
			stick_top.setAttributeNS(null, 'stroke', 'Black');
			// body
			stick_body.setAttributeNS(null, 'x', this.stick_x + this.stick_xx - 5);
			stick_body.setAttributeNS(null, 'y', this.stick_y - chart.get('open'));
			stick_body.setAttributeNS(null, 'width', this.width);
			stick_body.setAttributeNS(null, 'height', (chart.get('open') - chart.get('close')) );
			stick_body.setAttributeNS(null, 'fill', 'Green');
			stick_body.setAttributeNS(null, 'stroke', 'White');
			// bottom
			stick_below .setAttributeNS(null, 'x1', this.stick_x + this.stick_xx);
			stick_below.setAttributeNS(null, 'x2', this.stick_x + this.stick_xx);
			stick_below.setAttributeNS(null, 'y1', this.stick_y - chart.get('close'));
			stick_below.setAttributeNS(null, 'y2', this.stick_y - chart.get('low'));
			stick_below.setAttributeNS(null, 'stroke', 'Black');
		}
		else if (chart.get('open') < chart.get('close')) {
			// bearisch
			// top
			stick_top.setAttributeNS(null, 'x1', this.stick_x + this.stick_xx);
			stick_top.setAttributeNS(null, 'x2', this.stick_x + this.stick_xx);
			stick_top.setAttributeNS(null, 'y1', this.stick_y - chart.get('high'));
			stick_top.setAttributeNS(null, 'y2', this.stick_y - chart.get('close'));
			stick_top.setAttributeNS(null, 'stroke', 'Black');
			// body
			stick_body.setAttributeNS(null, 'x', this.stick_x + this.stick_xx - 5);
			stick_body.setAttributeNS(null, 'y', this.stick_y - chart.get('close'));
			stick_body.setAttributeNS(null, 'width', this.width);
			stick_body.setAttributeNS(null, 'height', (chart.get('close') - chart.get('open')) );
			stick_body.setAttributeNS(null, 'fill', 'Red');
			stick_body.setAttributeNS(null, 'stroke', 'White');
			// bottom
			stick_below.setAttributeNS(null, 'x1', this.stick_x + this.stick_xx);
			stick_below.setAttributeNS(null, 'x2', this.stick_x + this.stick_xx);
			stick_below.setAttributeNS(null, 'y1', this.stick_y - chart.get('open'));
			stick_below.setAttributeNS(null, 'y2', this.stick_y - chart.get('low'));
			stick_below.setAttributeNS(null, 'stroke', 'Black');
		}
		else if (chart.get('open') == chart.get('close')) {
			// doji
			// top
			stick_top.setAttributeNS(null, 'x1', this.stick_x + this.stick_xx);
			stick_top.setAttributeNS(null, 'x2', this.stick_x + this.stick_xx);
			stick_top.setAttributeNS(null, 'y1', this.stick_y - chart.get('high'));
			stick_top.setAttributeNS(null, 'y2', this.stick_y - chart.get('open'));
			stick_top.setAttributeNS(null, 'stroke', 'Black');
			// body
			stick_body.setAttributeNS(null, 'x', this.stick_x + this.stick_xx - 5);
			stick_body.setAttributeNS(null, 'y', this.stick_y - chart.get('open'));
			stick_body.setAttributeNS(null, 'width', this.width);
			stick_body.setAttributeNS(null, 'height', 2);
			stick_body.setAttributeNS(null, 'fill', 'Black');
			stick_body.setAttributeNS(null, 'stroke', 'White');
			// bottom
			stick_below.setAttributeNS(null, 'x1', this.stick_x + this.stick_xx);
			stick_below.setAttributeNS(null, 'x2', this.stick_x + this.stick_xx);
			stick_below.setAttributeNS(null, 'y1', this.stick_y - chart.get('close'));
			stick_below.setAttributeNS(null, 'y2', this.stick_y - chart.get('low'));
			stick_below.setAttributeNS(null, 'stroke', 'Black');
		}
		
		this.gap = this.gap + 1;
		// append
		stick_group.appendChild(stick_top);
		stick_group.appendChild(stick_body);
		stick_group.appendChild(stick_below);
		this.svg.appendChild(stick_group);
		return true;
  },
	sticks_view: function() {
		for (const [key, value] of Object.entries(this.sticks)) this.sticks_chart(value);
		console.log('sticks_view');
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
				let diff = Number(Number(value[j]) - Number(this.min)) * Number(this.ratio);
				this.sticks[i].set(keys[j], diff);
			}
			i = i + 1;
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
		let chartMin = this.chartMin; //window.chart.height
		let chartMax = this.chartMax;
		let difPrice = Number(maxPrice) - Number(minPrice);
		let difChart = Number(chartMax) - Number(chartMin);
		this.ratio = Number(difChart) / Number(difPrice);
		this.min = minPrice;
		return true;
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
		console.log('sticks_scale');
		return true;
  }
};

var settings = {
	range_step: 1,
	scale: 0,
	constructor: function() {
		try {
			// set settings
			if (!this.chart_range()) throw 'sticks.chart_range';
			return true;
		} catch (e) {
			console.error(e);
		}
  },
	chart_range: function(list) {
		// vertical move
		var chart_zoom_vertical = document.createElement('input');
		var chart_zoom_vertical_label = document.createElement('label');
		chart_zoom_vertical_label.innerHTML = 'Vertical move';
		chart_zoom_vertical.setAttribute('type', 'range');
		chart_zoom_vertical.setAttribute('min', 490);
		chart_zoom_vertical.setAttribute('max', +1090 * 2);
		chart_zoom_vertical.setAttribute('step', this.range_step);
		chart_zoom_vertical.setAttribute('value', 1390);
		chart_zoom_vertical.setAttribute('oninput', 'window.settings.vertical_change(this.value)');
		// horizontal move
		var chart_zoom_horizontal = document.createElement('input');
		var chart_zoom_horizontal_label = document.createElement('label');
		chart_zoom_horizontal_label.innerHTML = 'Horizontal move';
		chart_zoom_horizontal.setAttribute('type', 'range');
		chart_zoom_horizontal.setAttribute('min', -5480);
		chart_zoom_horizontal.setAttribute('max', +1640);
		chart_zoom_horizontal.setAttribute('step', this.range_step);
		chart_zoom_horizontal.setAttribute('value', 0);
		chart_zoom_horizontal.setAttribute('oninput', 'window.settings.horizontal_change(this.value)');
		// zoom
		var chart_zoom = document.createElement("input");
		var chart_zoom_label = document.createElement('label');
		chart_zoom_label.innerHTML = 'Zoom +/-';
		chart_zoom.setAttribute('type', 'range');
		chart_zoom.setAttribute('min', 100);
		chart_zoom.setAttribute('max', 500);
		chart_zoom.setAttribute('step', this.range_step);
		chart_zoom.setAttribute('value', 1);
		chart_zoom.setAttribute('oninput', 'window.settings.chart_zoom(this.value)');
		
		document.getElementById('settings').appendChild(chart_zoom_vertical_label);
		document.getElementById('settings').appendChild(document.createElement('br'));
		document.getElementById('settings').appendChild(chart_zoom_vertical);
		document.getElementById('settings').appendChild(document.createElement('br'));
		
		document.getElementById('settings').appendChild(chart_zoom_horizontal_label);
		document.getElementById('settings').appendChild(document.createElement('br'));
		document.getElementById('settings').appendChild(chart_zoom_horizontal);
		document.getElementById('settings').appendChild(document.createElement('br'));
		
		document.getElementById('settings').appendChild(chart_zoom_label);
		document.getElementById('settings').appendChild(document.createElement('br'));
		document.getElementById('settings').appendChild(chart_zoom);
		return true;
  },
	vertical_change: function(newvalue) {
		window.sticks.stick_y = Number(newvalue);
		const boxes = document.querySelectorAll('.chart_group');
		boxes.forEach(box => box.remove());
		
		sticks.chart = window.chart;
		sticks.scale = null;
		sticks.ratio = null;
		sticks.min = null;
		sticks.sticks = null;
		sticks.xmlns = null;
		sticks.width = 10;
		sticks.svg = null;
		sticks.gap = 1;
		sticks.chartMin = -650;
		sticks.chartMax = +650;
		
		if (!sticks.constructor(shapes.get())) throw 'sticks.constructor';
	},
	horizontal_change: function(newvalue) {
		window.sticks.stick_x = Number(newvalue);
		const boxes = document.querySelectorAll('.chart_group');
		boxes.forEach(box => box.remove());
		
		sticks.chart = window.chart;
		sticks.scale = null;
		sticks.ratio = null;
		sticks.min = null;
		sticks.sticks = null;
		sticks.xmlns = null;
		sticks.width = 10;
		sticks.svg = null;
		sticks.gap = 1;
		sticks.chartMin = -650;
		sticks.chartMax = +650;
		
		if (!sticks.constructor(shapes.get())) throw 'sticks.constructor';
	},
	chart_zoom: function (value) {
		this.scale = value * 0.01;
		window.chart.svg.setAttributeNS(null, 'transform', 'scale('+ this.scale +')');
	}
};

function init(value = false) {
	try {
		if (!value) if (!prices.constructor()) throw 'prices.constructor';
		if (!value) if (!chart.constructor('cover')) throw 'chart.constructor';
		if (value) if (!shapes.constructor(prices.get())) throw 'shapes.constructor';
		if (value) if (!sticks.constructor(shapes.get())) throw 'sticks.constructor';
		if (value) if (!settings.constructor()) throw 'settings.constructor';
		return true;
	} catch (e) {
		console.error(e);
		return false;
	}
}

document.addEventListener('DOMContentLoaded', () => init(false));
document.addEventListener('PricesLoaded', () => init(true));

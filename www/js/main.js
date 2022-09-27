'use strict';

var chart = {
	svg: {},
	height: 890,
	width: 1240,
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
		// limits
		let borderVertical = document.createElementNS(this.xmlns, 'line');
		let linesHorizontal = document.createElementNS(this.xmlns, 'line');
		// Vertical
		borderVertical.setAttributeNS(null, 'x1', '0');
		borderVertical.setAttributeNS(null, 'x2', '0');
		borderVertical.setAttributeNS(null, 'y1', '0');
		borderVertical.setAttributeNS(null, 'y2', this.height);
		borderVertical.setAttributeNS(null, 'stroke', 'Red');
		// Horizontal
		linesHorizontal.setAttributeNS(null, 'x1', '0');
		linesHorizontal.setAttributeNS(null, 'x2', this.width);
		linesHorizontal.setAttributeNS(null, 'y1', this.height);
		linesHorizontal.setAttributeNS(null, 'y2', this.height);
		linesHorizontal.setAttributeNS(null, 'stroke', 'Red');
		// append
		this.svg.appendChild(borderVertical);
		this.svg.appendChild(linesHorizontal);
		
		return true;
	},
	chart_grid: function() {
		// grid horizontal
		for (let i = 0; i < (this.width / this.grid_gap); i++) {
			let gridHorizontal = document.createElementNS(this.xmlns, 'line');
			gridHorizontal.setAttributeNS(null, 'x1', this.grid_gap * i);
			gridHorizontal.setAttributeNS(null, 'y1', 0);
			gridHorizontal.setAttributeNS(null, 'x2', this.grid_gap * i);
			gridHorizontal.setAttributeNS(null, 'y2', this.height);
			gridHorizontal.setAttributeNS(null, 'stroke', 'LightGray');
			this.svg.appendChild(gridHorizontal);
		}
		// grid vertical
		for (let i = 0; i < (this.height / this.grid_gap); i++) {
			let gridVertical = document.createElementNS(this.xmlns, 'line');
			gridVertical.setAttributeNS(null, 'x1', 0);
			gridVertical.setAttributeNS(null, 'y1', this.grid_gap * i);
			gridVertical.setAttributeNS(null, 'x2', this.width);
			gridVertical.setAttributeNS(null, 'y2', this.grid_gap * i);
			gridVertical.setAttributeNS(null, 'stroke', 'LightGray');
			this.svg.appendChild(gridVertical);
		}
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
			
			console.log(this.sticks);
			
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
			Math.min(...closeoutAsk).toString(), 
			Math.max(...closeoutAsk).toString(),
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
	constructor: function(list) {
		try {
			// set sticks
			//if (!this.scale(list)) throw 'sticks.scale';
			//if (!this.ratio(list)) throw 'sticks.ratio';
			//console.log(this.scale);
			return true;
		} catch (e) {
			console.error(e);
		}
  },
	index: function(prices) {
		console.log(this.chart.svg);
		return true;
  },
	scale: function(list) { 
		if (this.scale !== null) return true;
		let prices = new Array(list[0], list[list.length - 1]);
		for (let i = 0; i < prices.length; i++) {
			for (let j = 0; j < prices[i].length; j++) {
				let len = prices[i][j].split('.')[1].length;
				if (this.scale < len) this.scale = len;
			}
		}
		return true;
  },
	ratio: function(prices) { // parseFloat
		console.log(prices);
		for (let i = 0; i < prices.length; i++) {
			for (let j = 0; j < prices[i].length; j++) {
				//console.log();
				console.log(parseFloat(prices[i][j]));
			}
		}
		
		
		
/*
#prices

  {
    bcscale($this->iScale);
    $sPrice = floatval(number_format($sPrice, $this->iScale, '.', ''));
    if ($sPrice === 0) return 1;

    if (!empty($sPrice)) {
      return bcmul(bcsub($sPrice, $this->fMinPrice, $this->iScale), $this->fRatio, $this->iScale);
    }

    $aaPrices = $this->aaView;
    $aColumns = array_map(function($k) use ($aaPrices) {
      return array_column($aaPrices, $k);
    }, array('closeoutAsk','closeoutBid'));

    list($closeoutAsk, $closeoutBid) = $aColumns;
    $maxPrice = max($closeoutAsk);
    $minPrice = min($closeoutBid);
    
    $pSmallC = -1000;
    $pLargeD = 1000;

    $difPrice = bcsub($maxPrice, $minPrice);
    $difChart = bcsub($pLargeD, $pSmallC);
    #if ($difPrice == 0) $difPrice = $minPrice;
    $fRation = bcdiv($difChart, $difPrice);
    $this->fRatio = ($fRation != 0 ? $fRation: 0.2);
    $this->fMinPrice = $minPrice;
		
		
    bcscale(0); # reset
    return 1;
  }
*/
		
	}
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







'use strict';
/*
var response = {
	addPrices: function() {
		prices.state = true;
  }
};
*/
var chart = {
	height: '',
	width: '',
	grid_gap: '',
	constructor: function(sDivId) {
		try {
			// chart
			console.log('chart.constructor');
			if (!this.chart_setup()) throw 'chart_setup';
			if (!this.chart_stage()) throw 'chart_stage';
			if (!this.chart_limits()) throw 'chart_limits';
			if (!this.chart_grid()) throw 'chart_grid';
			document.getElementById(sDivId).appendChild(this.svg);
			return true;
		} catch (e) {
			console.error(e);
		}
  },
	chart_setup: function() {
		this.height = 420;
		this.width = 600;
		this.grid_gap = 30;
		return true;
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
		return new CustomEvent("menu-open", {
			bubbles: true
		});
	},
	constructor: function(sDivId) {
		try {
			// get data
			console.log('prices.constructor');
			if (!this.prices_xhr()) throw 'prices_xhr';
			if (!this.prices_get()) throw 'prices_get';
			return true;
		} catch (e) {
			console.error(e);
		}
  },
	prices_list: function() {
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
		
		console.log(['load', event]);
		console.log(['load', ['document', document, 'window', window]]);
		console.log(['response', event.target.response]);
		//console.log(window.prices.prices_event);
		//window.dispatchEvent(window.prices.prices_event());
		
		window.dispatchEvent(window.prices.prices_event());
		console.log('Laden der Daten abgeschlossen');
	},
	prices_progress: function(event) {
		//console.log('Received '+ event.loaded +' of ' + event.total + ' bytes');
		//this.list = event.target.response;
		//if (event.loaded == event.total) {}
		//console.log('Fortschritt beim Laden der Daten');
	},
	prices_abort: function(event) {
		console.error(event);
		throw 'Laden der Daten abgebrochen';
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
		this.xhr.addEventListener('abort', this.prices_abort);
		this.xhr.addEventListener('error', this.prices_error);
		this.xhr.addEventListener('timeout', this.prices_timeout);
		return true;
  }
};


var sticks = {
	constructor: function(sDivId) {
		try {
			// get data
			console.log('sticks.constructor');
			return true;
		} catch (e) {
			console.error(e);
		}
  },
	get_list: function() {
		console.log('get');
  }
};

document.addEventListener('DOMContentLoaded', init(false));
//document.addEventListener('PricesLoaded', init(true), false);

window.addEventListener('menu-open', () => alert('nested'));



function init(value = false) {
	if (!value) if (!chart.constructor('wrapChart')) throw 'chart.constructor';
	if (!value) if (!prices.constructor()) throw 'prices.constructor';
	console.log(value);
	if (value) if (!sticks.constructor()) throw 'sticks.constructor';
	
}



/*
var evt = document.createEvent("Event");
evt.initEvent("myEvent",true,true);

//invoke
document.dispatchEvent(evt);

// custom param
evt.foo = "bar";


//register
document.addEventListener("myEvent",myEventHandler,false);




const event = document.createEvent('Event');

// Define that the event name is 'build'.
event.initEvent('build', true, true);

// Listen for the event.
elem.addEventListener('build', (e) => {
  // e.target matches elem
}, false);

// target can be any Element or other EventTarget.
elem.dispatchEvent(event);



<button id="menu">Menu (click me)</button>
<script>
  menu.onclick = function() {
    alert(1);

    menu.dispatchEvent(new CustomEvent("menu-open", {
      bubbles: true
    }));

    alert(2);
  };

  // triggers between 1 and 2
  document.addEventListener('menu-open', () => alert('nested'));
</script>
*/

	
	//if (!prices.get_list()) throw 'prices.get_list';

//console.log(prices.get());
"use strict";

class Chart {
	
  svg;
	xmlns;
	
	#height;
	#width;
	#grid_gap;
	
	constructor(sDivId) {
		try {
			if (!this.chart_setup()) throw 'chart_setup';
			if (!this.chart_stage()) throw 'chart_stage';
			if (!this.chart_limits()) throw 'chart_limits';
			if (!this.chart_grid()) throw 'chart_grid';
			document.getElementById(sDivId).appendChild(this.svg);
		} catch (e) {
			console.error(e);
		}
  }
		
	chart_setup() {
		this.height = 420;
		this.width = 600;
		this.grid_gap = 30;
		return true;
  }
	
	chart_stage() {
		this.xmlns = 'http://www.w3.org/2000/svg';
		this.svg = document.createElementNS(this.xmlns, 'svg');
		this.svg.setAttributeNS(null, 'id', 'chart');
		this.svg.setAttributeNS(null, 'height', this.height);
		this.svg.setAttributeNS(null, 'width', this.width);
		return true;
  }
	
	chart_limits() {
		// limits
		let borderVertical = document.createElementNS(this.xmlns, 'line');
		let linesHorizontal = document.createElementNS(this.xmlns, 'line');
		
		borderVertical.setAttributeNS(null, 'x1', '0');
		borderVertical.setAttributeNS(null, 'x2', '0');
		borderVertical.setAttributeNS(null, 'y1', '0');
		borderVertical.setAttributeNS(null, 'y2', this.height);
		borderVertical.setAttributeNS(null, 'stroke', 'Red');
		borderVertical.setAttributeNS(null, 'stroke-widt', '2.75');
		
		linesHorizontal.setAttributeNS(null, 'x1', '0');
		linesHorizontal.setAttributeNS(null, 'x2', this.width);
		linesHorizontal.setAttributeNS(null, 'y1', this.height);
		linesHorizontal.setAttributeNS(null, 'y2', this.height);
		linesHorizontal.setAttributeNS(null, 'stroke', 'Red');
		
		this.svg.appendChild(borderVertical);
		this.svg.appendChild(linesHorizontal);
		
		return true;
	}
	
	chart_grid() {
		// grid horizontal
		for (let i = 0; i < (this.width / this.grid_gap); i++) {
			let gridHorizontal = document.createElementNS(this.xmlns, 'line');
			gridHorizontal.setAttributeNS(null, 'x1', this.grid_gap * i);
			gridHorizontal.setAttributeNS(null, 'y1', 0);
			gridHorizontal.setAttributeNS(null, 'x2', this.grid_gap * i);
			gridHorizontal.setAttributeNS(null, 'y2', this.height);
			gridHorizontal.setAttributeNS(null, 'stroke', 'Gray');
			this.svg.appendChild(gridHorizontal);
		}
		// grid vertical
		for (let i = 0; i < (this.height / this.grid_gap); i++) {
			let gridVertical = document.createElementNS(this.xmlns, 'line');
			gridVertical.setAttributeNS(null, 'x1', 0);
			gridVertical.setAttributeNS(null, 'y1', this.grid_gap * i);
			gridVertical.setAttributeNS(null, 'x2', this.width);
			gridVertical.setAttributeNS(null, 'y2', this.grid_gap * i);
			gridVertical.setAttributeNS(null, 'stroke', 'Gray');
			this.svg.appendChild(gridVertical);
		}
		return true;
	}
	
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');
	new Chart('wrapChart');
});

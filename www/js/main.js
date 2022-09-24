"use strict";

class Chart {

  svg;
	xmlns;

	constructor(sDivId) {
		try {
			if (!this.chart_stage()) throw 'chart_stage';
			if (!this.chart_limits()) throw 'chart_limits';
			if (!this.chart_grid()) throw 'chart_grid';
			document.getElementById(sDivId).appendChild(this.svg);
		} catch (e) {
			console.error(e);
		}
  }
	
	chart_stage() {
		this.xmlns = 'http://www.w3.org/2000/svg';
		this.svg = document.createElementNS(this.xmlns, 'svg');
		this.svg.setAttributeNS(null, 'id', 'chart');
		this.svg.setAttributeNS(null, 'height', '400');
		this.svg.setAttributeNS(null, 'width', '600');
		return true;
  }
	
	chart_limits() {
		// limits
		let borderVertical = document.createElementNS(this.xmlns, 'line');
		let linesHorizontal = document.createElementNS(this.xmlns, 'line');
		
		borderVertical.setAttributeNS(null, 'x1', '0');
		borderVertical.setAttributeNS(null, 'x2', '0');
		borderVertical.setAttributeNS(null, 'y1', '0');
		borderVertical.setAttributeNS(null, 'y2', '400');
		borderVertical.setAttributeNS(null, 'stroke', 'Red');
		borderVertical.setAttributeNS(null, 'stroke-widt', '2.75');
		
		linesHorizontal.setAttributeNS(null, 'x1', '0');
		linesHorizontal.setAttributeNS(null, 'x2', '600');
		linesHorizontal.setAttributeNS(null, 'y1', '400');
		linesHorizontal.setAttributeNS(null, 'y2', '400');
		linesHorizontal.setAttributeNS(null, 'stroke', 'Red');
		
		this.svg.appendChild(borderVertical);
		this.svg.appendChild(linesHorizontal);
		
		return true;
	}
	
	chart_grid() {
		// grid
		for (let i = 0; i < 20; i++) {
			let gridHorizontal = document.createElementNS(this.xmlns, 'line');
			gridHorizontal.setAttributeNS(null, 'x1', 0);
			gridHorizontal.setAttributeNS(null, 'x2', 20 * i);
			gridHorizontal.setAttributeNS(null, 'y1', 400);
			gridHorizontal.setAttributeNS(null, 'y2', 20 * i);
			gridHorizontal.setAttributeNS(null, 'stroke', 'Gray');
			this.svg.appendChild(gridHorizontal);
		}
		
		return true;
	}

/*
<!-- chart boundaries -->
{% for i in range(0, 26) %} # orizontal
	<line x1="{{ 150 * i + 0 }}" y1="{{ 0 }}" x2="{{ 150 * i + 0 }}" y2="{{ 2200 }}" style="stroke:LightGray;stroke-width:1.75" /> <!-- vertical -->
	{% if i <= 14 %} # vertical
		<line x1="{{ 0 }}" y1="{{ 150 * i }}" x2="{{ 3900 }}" y2="{{ 150 * i }}" style="stroke:LightGray;stroke-width:1.75" /> <!-- orizontal -->
	{% endif %}
{% endfor %}
<!-- chart boundaries -->
*/

}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');
	new Chart('wrapChart');
});

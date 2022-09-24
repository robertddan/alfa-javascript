"use strict";


{

/*
var xmlns = "http://www.w3.org/2000/svg";

var o_svg = document.createElementNS(xmlns, "svg");
o_svg.setAttribute('height', '300');
o_svg.setAttribute('width', '300');
	
var g = document.createElementNS(xmlns, "g");
	
// draw linear gradient
var defs = document.createElementNS(xmlns, "defs");
var grad = document.createElementNS(xmlns, "linearGradient");
grad.setAttributeNS(null, "id", "gradient");
grad.setAttributeNS(null, "x1", "0%");
grad.setAttributeNS(null, "x2", "0%");
grad.setAttributeNS(null, "y1", "100%");
grad.setAttributeNS(null, "y2", "0%");
var stopTop = document.createElementNS(xmlns, "stop");
stopTop.setAttributeNS(null, "offset", "0%");
stopTop.setAttributeNS(null, "stop-color", "#ff0000");
grad.appendChild(stopTop);
var stopBottom = document.createElementNS(xmlns, "stop");
stopBottom.setAttributeNS(null, "offset", "100%");
stopBottom.setAttributeNS(null, "stop-color", "#0000ff");
grad.appendChild(stopBottom);
defs.appendChild(grad);
g.appendChild(defs);
	
    // draw borders
    var coords = "M 0, 0";
    coords += " l 0, 300";
    coords += " l 300, 0";
    coords += " l 0, -300";
    coords += " l -300, 0";


	//<line x1="0" y1="0" x2="200" y2="200" style="stroke:rgb(255,0,0);stroke-width:2" />
	//<line x1="0" y1="80" x2="100" y2="20" stroke="black" />
	
    var line = document.createElementNS(xmlns, "line");
    line.setAttributeNS(null, 'x1', "0");
    line.setAttributeNS(null, 'y1', "80");
    line.setAttributeNS(null, 'x2', "100");
    line.setAttributeNS(null, 'y2', "20");
    line.setAttributeNS(null, 'stroke', "black");
    line.setAttributeNS(null, 'stroke-width', "2");
    g.appendChild(line);
	
o_svg.appendChild(g);
var svgContainer = document.getElementById("wrapChart");
svgContainer.appendChild(o_svg);
*/
	
/*
let unorderedList = document.querySelector("ul");
console.log(unorderedList);
let listItem = document.createElement("li");
listItem.textContent = 4;
listItem.className = "newItem";
console.log(listItem);
console.log(unorderedList.appendChild(listItem));
*/
	

	let sDivId = 'wrapChart';
	
	var xmlns = "http://www.w3.org/2000/svg";
	// let o_svg = document.querySelector('svg');
	var o_svg = document.createElementNS(xmlns, "svg");
	o_svg.setAttributeNS(null, 'height', '210');
	o_svg.setAttributeNS(null, 'width', '500');
	o_svg.style.display = "block";
	
	//let linesVertical = document.createElement('line');
	var linesVertical = document.createElementNS(xmlns, "line");
	linesVertical.setAttributeNS(null, 'x1', '0');
	linesVertical.setAttributeNS(null, 'x2', '200');
	linesVertical.setAttributeNS(null, 'y1', '0');
	linesVertical.setAttributeNS(null, 'y2', '200');
	linesVertical.setAttributeNS(null, 'stroke', 'Red');
	linesVertical.setAttributeNS(null, 'stroke-widt', '2.75');
	
	o_svg.appendChild(linesVertical);
	const container = document.getElementById(sDivId);
	container.append(o_svg);
	
	console.log(container.childNodes) // NodeList [ <p> ]
	
/*
<svg height="210" width="500">
  <line x1="0" y1="0" x2="200" y2="200" style="stroke:rgb(255,0,0);stroke-width:2" />
</svg> 
*/
	
/*
	let sDivId = 'wrapChart';
	let svg = document.createElement('svg');
	//let svg = document.querySelector('svg');
	svg.setAttribute('id', 'chart');
	svg.setAttribute('height', '400');
	svg.setAttribute('width', '630');
	svg.setAttribute('style', 'background-color: beige;');
	

	// boundaries
	let linesVertical = document.createElement('line');
	let linesHorizontal = document.createElement('line');

	linesVertical.setAttribute('x1', '0');
	linesVertical.setAttribute('x2', '0');
	linesVertical.setAttribute('y1', '0');
	linesVertical.setAttribute('y2', '400');
	linesVertical.setAttribute('stroke', 'Red');
	linesVertical.setAttribute('stroke-widt', '2.75');

	linesHorizontal.setAttribute('x1', '0');
	linesHorizontal.setAttribute('x2', '600');
	linesHorizontal.setAttribute('y1', '600');
	linesHorizontal.setAttribute('y2', '600');
	linesVertical.setAttribute('stroke', 'Red');
	linesVertical.setAttribute('stroke-widt', '2.75');

//<line x1="0" y1="0" x2="0" y2="2600" style="stroke:Red;stroke-width:2.75" /> <!-- vertical -->
//<line x1="0" y1="2600" x2="2600" y2="2600" style="stroke:Red;stroke-width:2.75"/> <!-- orizontal -->

	svg.appendChild(linesVertical);
	svg.appendChild(linesHorizontal);

	const container = document.getElementById(sDivId);
	container.appendChild(svg);
*/

}

/*
class Chart {

  svg;

	constructor(sDivId) {
		this.svg = document.createElement('svg');
		this.svg.setAttribute('id', 'chart');
		this.svg.setAttribute('height', '400');
		this.svg.setAttribute('width', '630');
		
		// boundaries
		let linesVertical = document.createElement('line');
		let linesHorizontal = document.createElement('line');
		
		linesVertical.setAttribute('x1', '0');
		linesVertical.setAttribute('x2', '0');
		linesVertical.setAttribute('y1', '0');
		linesVertical.setAttribute('y2', '400');
		linesVertical.setAttribute('style', 'stroke:Red;stroke-width:2.75');
		
		linesHorizontal.setAttribute('x1', '0');
		linesHorizontal.setAttribute('x2', '600');
		linesHorizontal.setAttribute('y1', '600');
		linesHorizontal.setAttribute('y2', '600');
		linesHorizontal.setAttribute('style', 'stroke:Red;stroke-width:2.75');
		
//<line x1="0" y1="0" x2="0" y2="2600" style="stroke:Red;stroke-width:2.75" /> <!-- vertical -->
//<line x1="0" y1="2600" x2="2600" y2="2600" style="stroke:Red;stroke-width:2.75"/> <!-- orizontal -->

		this.svg.appendChild(linesVertical);
		this.svg.appendChild(linesHorizontal);
		
		const container = document.getElementById(sDivId);
		container.appendChild(svg);
  }
}

document.addEventListener('DOMContentLoaded', (event) => {
  console.log('DOM fully loaded and parsed');
	new Chart('wrapChart');
});
*/
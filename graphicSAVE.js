var svgHist;


var scaleXHist = d3.scaleLinear();
var scaleYHist = d3.scaleLinear();
    			
var xAxisHist = d3.axisBottom(scaleXHist);
var yAxisHist = d3.axisLeft(scaleYHist);

var gxAxisHist;
var gyAxisHist;

var classes;
var nbClasses = 15;

var bars;

var	parseDate = d3.time.format("%Y-%m-%d").parse;

function graph(StationID,DateDebut) {
	DateDebut=convertDigitIn(DateDebut)
	DateDebut=DateDebut.replace(/\//g, "");
	var path="data_climat/data_brute/"
	var CSVname=path+"Station_"+StationID+"_"+DateDebut+"_J.csv";
	graphA(CSVname);
	//graphB(CSVname);
}

function convertDigitIn(str){
   return str.split('/').reverse().join('/');
}


function graphA(CSVname){
	var h=250;
	var w=document.getElementById("graphA").clientWidth-50;
	document.getElementById("graphA").innerHTML ="";
	
	var svg = d3.select("#graphA").insert("svg")
	.attr("width", w)
	.attr("height", h)
	var border= svg.append("rect")
			.attr("x", 0.1)
			.attr("y", 0.1)
			.attr("height", h)
			.attr("width", w)
			.style("stroke", "black")
			.style("fill", "WhiteSmoke")
			.style("stroke-width", "1px");
	
	$.ajax({
   		type: "GET",
    	url: CSVname,
    	dataType: "text",
    	success: function(DATA){
    		var a=-1;
    		var list=["é","é","°","é","°"]
    		DATA2=DATA.replace(/�/g, function (x) {a=a+1;x=list[a];return x});
    		var dataHist=Papa.parse(DATA2, {delimiter: ";",header:true}).data
    		
    		console.log(dataHist[0]["Date de la mesure"])
    		console.log(dataHist[0]["Précipitations en mm"])
    		console.log(dataHist[0]["Température Minimale en °C"])
    		console.log(dataHist[0]["Température Maximale en °C"])
    		
    		
		
			scaleXHist.domain([d3.min(dataHist, function(d) { return d["Date de la mesure"]; }), 
													d3.max(dataHist, function(d) { return d["Date de la mesure"]; })]);
			scaleXHist.range([0, w-50]);  
			gxAxisHist = svg.append("g")
			.call(xAxisHist)
			.attr("transform","translate(25,"+(h-25)+")");   
			
			scaleYHist.domain([d3.max(dataHist, function(d) { return d["Précipitations en mm"]; }), 
													d3.min(dataHist, function(d) { return d["Précipitations en mm"]; })]);
			
			scaleYHist.range([0, h-50]);  
			gyAxisHist = svg.append("g")
			.call(yAxisHist)
			.attr("transform","translate(25,25)");  
			
			bars = svg.selectAll(".bars")
			.data
			.enter().append("rect");
			
			bars.attr("stroke", "#aaaaaa")
					.attr("stroke-width", 1)
					.attr("fill", "#dddddd")
					.attr("x", function(d) { return 25+d.minX; })
					.attr("y", function(d) { return 25+scaleYHist(d.density); })
					.attr("width", function(d) { return d.maxX-d.minX; })
					.attr("height", function(d) { return hHist-50-scaleYHist(d.density); });	
    		
    		
    		
    		
    	}
    });
			
}
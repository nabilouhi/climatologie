var margin = {top: 10, right: 40, bottom: 50, left: 40}
var h = 400 - margin.top - margin.bottom;
    
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
	var w = document.getElementById("graphA").clientWidth - margin.left - margin.right;
	//var wi=document.getElementById("graphA").clientWidth-50;
	document.getElementById("graphA").innerHTML ="";

	var	parseDate = d3.utcParse("%d/%m/%Y");
	//var x = d3.scaleOrdinal();
	var x = d3.scaleTime().range([0,w]);
	var y = d3.scaleLinear().range([h, 0]);
	var y2 = d3.scaleLinear().range([h, 0]);
	
	var xAxis =d3.axisBottom(x)
    .tickFormat(d3.timeFormat("%m/%Y"));
    
   var yAxis = d3.axisLeft(y)
    .ticks(10);
    
    var yAxis2 = d3.axisRight(y2)
    .ticks(10);
    
    var LineMAX = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y2(d.TempMax); })
    .curve(d3.curveBasisOpen);
    
    var LineMIN = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y2(d.TempMin); })
    .curve(d3.curveBasisOpen);
	
	var sum=1;	
	var AverageLine = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d,i) { sum+=d.TempMax-d.TempMin; return y2(sum/(i+1)); });
	
	var svg = d3.select("#graphA").insert("svg")
		.attr("width",w + margin.left + margin.right)
		.attr("height", h+ margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	
	
	$.ajax({
   		type: "GET",
    	url: CSVname,
    	dataType: "text",
    	success: function(DATA){
    		var a=-1;
    		var list=["é","é","°","é","°"]
    		DATA2=DATA.replace(/�/g, function (x) {a=a+1;x=list[a];return x});
    		DATA3=DATA2.replace(/,/g,".");
    		var DATA=Papa.parse(DATA3, {delimiter: ";",header:true}).data
    		
    		//console.log(DATA[0]["Date de la mesure"])
    		//console.log(DATA[0]["Précipitations en mm"])
    		//console.log(DATA[0]["Température Minimale en °C"])
    		//console.log(DATA[0]["Température Maximale en °C"])
    		
    		DATA.forEach(function(d) {
        		d.date = parseDate(d["Date de la mesure"]);
        		d.value = +d["Précipitations en mm"];
        		d.TempMax = +d["Température Maximale en °C"];
        		d.TempMin = +d["Température Minimale en °C"];
    		});
    		//console.log(DATA[0].TempMax);
    		//console.log(DATA[0].value)
			var Temp_max= d3.max(DATA, function(d) { return d.TempMax; })+"°C";
			var Temp_min= d3.min(DATA, function(d) { return d.TempMin; })+"°C";
		 	document.getElementById("info6").innerHTML ="<h3 style='color:blue'>Min:"+Temp_min+"</h3><h3 style='color:red'>Max:"+Temp_max+"</h3>";
    		
			x.domain(d3.extent(DATA,function(d) { return d.date; }));
			 y.domain([0, d3.max(DATA, function(d) { return d.value; })]);
			 y2.domain([d3.min(DATA, function(d) { return d.TempMin; }), d3.max(DATA, function(d) { return d.TempMax; })]);
			
			  svg.append("g")
			   .attr("class", "x axis")
			   .attr("transform", "translate(0," + h+ ")")
			   .call(xAxis)
			 	.selectAll("text")
			   .style("text-anchor", "end")
			   .attr("dx", "-.8em")
			   .attr("dy", "-.55em")
			   .attr("transform", "rotate(-60)" );
			
			  svg.append("g")
			   .attr("class", "y axis")
			   .call(yAxis);
			   
			   svg.append("g")
			   .attr("class", "y2 axis")
			   .call(yAxis2)
			   .attr("transform", "translate(" + w + " ,0)")
			 	.append("text")
			   .attr("transform", "rotate(-90)")
			   .attr("y", 0)
			   .attr("dy", ".71em")
			   .style("text-anchor", "end")
			   .text("Temperature");
			   ;
			   
			   svg.append("path")
      			.data(DATA)
      			.attr("class", "linemax")
      			.attr("d",LineMAX(DATA));
      			
      			 svg.append("path")
      			.data(DATA)
      			.attr("class", "linemin")
      			.attr("d",LineMIN(DATA));
      			
      		 	svg.append("path")
      		 	.data(DATA)
	        .attr("class", "average")
	        .attr("d", AverageLine(DATA));
			
			  svg.selectAll("bar")
			  	.data(DATA)
			  	.enter().append("rect")
			   .style("fill", "#4285F4")
			   .attr("x", function(d) { return x(d.date); })
			   .attr("width", "2")
			   .attr("y", function(d) { return y(d.value); })
			   .attr("height", function(d) { return h - y(d.value); });		   			 
      			
	     
    		
    		
    		
    	}
    });
			
}
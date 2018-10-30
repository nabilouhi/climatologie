var map = L.map('divmap'); 
		map.setView([43.58,3.358], 9);//localisation centré , zoom 
		
		L.tileLayer('http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png',
		{ attribution: ' © <a href="http://osm.org/copyright">OpenStreetMap</a> contributors ',
			maxZoom: 11,
			minZoom: 8 }
		) .addTo(map);
				  
		
		
		//CONTOUR Herault
		$.ajax({
		url: "dataMAP.geojson", //Nom du fichier à charger.
		dataType: "json", //Type du fichier à charger. 
		success: function(zone){
			L.geoJson( zone,{
				style:function(feature){					return { color: "grey", 
							weight: 1.5,
							dashArray: '3',
							fillOpacity: 0
							};
				}
			}	
			).addTo(map);
		 }		});
		
		//Station
		$.ajax({
   		type: "GET",
    	url: "data_climat/station.csv",
    	dataType: "text",
    	success: function(csv){
    	
			//var data = $.csv.toObjects(csv);
			
			var ICONA = L.icon({
			iconUrl: 'img/statioA.png', 
		 	iconSize: [20,25]	 	
		 	});
		 	var ICONM = L.icon({
			iconUrl: 'img/statioM.png', 
		 	iconSize: [20,25]	 	
		 	});
		 	var ICONAM = L.icon({
			iconUrl: 'img/statioAM.png', 
		 	iconSize: [20,25]	 	
		 	});
		 	
		 	L.geoCsv(csv,{
		 		fieldSeparator:',',
		 		firstLineTitles: true,
		 		latitudeTitle:"Lat",
		 		longitudeTitle:"Long",
		 		lineSeparator: '\n',
		 		deleteDobleQuotes:false,
		 		onEachFeature: function (feature, layer) {
		 		//console.log(feature);
		 			layer.bindPopup(
		 				 "Station # "+feature.properties["id_station"]+
		 				 "<br><strong>"+feature.properties["nom_station"] +"</strong>"+
		 				"<br>"+ feature.properties["zone_hydrographique"]
		 			);
		 			
		 			layer.on('click', function(e){
		 			var stationID=feature.properties["id_station"];
		 			var stationStart=feature.properties["debut_peri"];
		 			graph(stationID,stationStart);
		 			var info1= "<strong><sup>#</sup>"+
		 								feature.properties["id_station"]+"-"+
		 								feature.properties["nom_station"] +
		 								"</strong>"+
		 								" <p style='color:grey;'><i class='glyphicon glyphicon-map-marker'></i><small><i>"+
		 								feature.properties["zone_hydrographique"]+
		 								" </i><sub> ["+ feature.properties["insee"]+"]</sub></small>"+
		 								"</p><svg width='110%' height='5'><rect width='110%' height='5' style='fill:white;' /></svg>";
		 			document.getElementById("info1").innerHTML =info1;
		 			
		 			var info2="<i class='glyphicon glyphicon-upload'></i>"+feature.properties["altitude"]+"m";
		 			document.getElementById("info2").innerHTML =info2;
		 			
		 			var info3="<i class='glyphicon glyphicon-ok'></i> "+feature.properties["validation"];
		 			document.getElementById("info3").innerHTML =info3;
		 			
		 			if (feature.properties["fin_peri"]=="") {var END= "<font color=MediumSeaGreen>Aujourd'hui</font>"	}
		 			else {var END= "<font color=red>"+feature.properties["fin_peri"]+"</font>"	}
		 			var info4="<i class='glyphicon glyphicon-calendar'></i> De: "+feature.properties["debut_peri"]+" au "+END;
		 			document.getElementById("info4").innerHTML =info4;
		 			
		 			if (feature.properties["type"]=="A") {var TYPE= '<img src="img/statioA.png" height="25px"> Automatique'}
		 			if(feature.properties["type"]=="M") {var TYPE= '<img src="img/statioM.png" height="25px"> Manuelle'}
		 			if (feature.properties["type"]=="B") {var TYPE= '<img src="img/statioAM.png" height="25px"> Automatique+Manuelle'}
		 			document.getElementById("info5").innerHTML =TYPE;
		 			
		 			
		 			} );
		 		},
		 		pointToLayer: function (feature, latlng) {
		 			if (feature.properties["type"]=="A") {
		 				return L.marker(latlng, {
		 					icon:ICONA
		 				});
		 			}
		 			if (feature.properties["type"]=="B") {
		 				return L.marker(latlng, {
		 					icon:ICONAM
		 				});
		 			}
		 			else {
		 				return L.marker(latlng, {
		 					icon:ICONM
		 				});
		 			}	
		 		}
		 	}).addTo(map);
		 		
		 		
		 	}
});
		
		
var modal = document.getElementById('myModal');
var btn = document.getElementById("myBTN");
var span = document.getElementsByClassName("close")[0];
		
btn.onclick = function() { modal.style.display = "block";}
span.onclick = function() {modal.style.display = "none";}
window.onclick = function(event) {if (event.target == modal) {modal.style.display = "none";}}
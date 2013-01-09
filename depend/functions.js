/*
 Copyright 2012 Eric Jonathan Whyne

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0
   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getcolhead(strIntent){
	"use strict";
	var latcol, latcount = 0, loncol, loncount = 0, latcommaloncol, latcommaloncount = 0, timecol, timecount = 0, namecol, namecount = 0, altintensitycol, altintensitycount = 0, desccol = [], havewhatweneed = true;
	for(var col = 0; col < ssdata[0].length; col++){
		var columnid = "column" + col;
		//var colvalue = document.getElementById(columnid).value;
		var colvalue = "";
		$('#' + columnid + ' .ui-widget-content.ui-selected').each(function(index) {
			//console.log(columnid);
     		//console.log($(this).attr('data'));
     		colvalue = $(this).attr('data');
		});
		
		switch (colvalue) {
			case "name":
        	namecol = col;
        	namecount++;
        	break;
    		case "latitude":
        	latcol = col;
        	latcount++;
        	break;
        	case "longitude":
        	loncol = col;
        	loncount++;
        	break;
        	case "latcommalon":
        	latcommaloncol = col;
        	latcommaloncount++;
        	case "time":
        	timecol = col;
        	timecount++;
        	break;
        	//case "description":
        	//desccol.push(col);
        	//break;
        	case "altintensity":
        	altintensitycol = col;
        	altintensitycount++;
        	break;
		}
		desccol.push(col); //add all columns to the description for now
	}
	if(namecount == 0 && strIntent == "pm"){StatusWarnErr("No column identified for placemark names.  Stopping build.","bad"); havewhatweneed = false;}
	if(namecount > 1){StatusWarnErr("More than one Name column identified; picking one at random.","bad");}
	if(altintensitycount == 0 && strIntent == "altintensity"){StatusWarnErr("No column identified for altitude intensity.  Stopping build.","bad"); havewhatweneed = false;}
	if(altintensitycount > 1 && strIntent == "altintensity"){StatusWarnErr("More than one altitude intensity column identified. Stopping build.","bad"); havewhatweneed = false;}
	if(timecount > 1){StatusWarnErr("More than one time column identified; time is probably not going to work, trying anyway.","bad");}
	if(timecount == 0 && strIntent == "timealt"){StatusWarnErr("No time column identified; needed for altitude. Stopping build.","bad"); havewhatweneed = false;}
	
	//spatial stuff
	if(latcount == 0 && latcommaloncount == 0){StatusWarnErr("No column identified for latitude. Stopping build.","bad"); havewhatweneed = false;}
	if(latcount > 1){StatusWarnErr("More than one latitude column identified; this probably is not going to look right, trying anyway.'.","bad");}
	if(loncount == 0 && latcommaloncount == 0){StatusWarnErr("No column identified for longitude. Stopping build.","bad");havewhatweneed = false;}
	if(loncount > 1){StatusWarnErr("More than one longitude column identified; this probably is not going to look right, trying anyway.'.","bad");}
	if(latcommaloncount == 0 && latcount == 0){StatusWarnErr("No column identified for location information. Stopping build.","bad"); havewhatweneed = false;}
	if(latcommaloncount > 1){StatusWarnErr("More than one Lat, Lon column identified; this probably is not going to look right, trying anyway.'.","bad");}
	
	var ssdatahead = { 	latcol: latcol, 
						loncol: loncol, 
						latcommaloncol: latcommaloncol, 
						timecol: timecol, 
						namecol: namecol, 
						desccol: desccol, 
						altintensitycol: altintensitycol, 
						havewhatweneed: havewhatweneed
					};
	return ssdatahead;
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getssdataattrib(ssdatahead){
	//TODO: make this able to handle bad data in the first row!!!!
	var latmax = -180;
	var latmin = 180;
	var lonmax = -180;
	var lonmin = 180;
	var altintensitymax = parseFloat(ssdata[1][ssdatahead.altintensitycol]);
	var altintensitymin = parseFloat(ssdata[1][ssdatahead.altintensitycol]);
	
	var timeos = [];
	for(var row = 1; row < ssdata.length; row++) {
		var lat;
		var lon;
		var altintensity;
		var latlonstring, latlonstringarray;
	  	for(var col = 0; col < ssdata[0].length; col++){
	  		switch (col) {
				case ssdatahead.latcol:
	        		lat = parseFloat(ssdata[row][col]);
	        		if (lat > latmax) latmax = lat;
	        		if (lat < latmin) latmin = lat;
	        		break;
	    		case ssdatahead.loncol:
	        		lon = parseFloat(ssdata[row][col]);
	        		if (lon > lonmax) lonmax = lon;
	        		if (lon < lonmin) lonmin = lon;
	        		break;
	        	case ssdatahead.latcommaloncol:
	        		latlonstring = ssdata[row][col];
	        		latlonstringarray = latlonstring.split(/,/);
	        		lat = parseFloat(latlonstringarray[0]);
	        		lon = parseFloat(latlonstringarray[1]);
	        		if (lat > latmax) latmax = lat;
	        		if (lat < latmin) latmin = lat;
	        		if (lon > lonmax) lonmax = lon;
	        		if (lon < lonmin) lonmin = lon;
	        		break;
	        	case ssdatahead.altintensitycol:
	        		altintensity = parseFloat(ssdata[row][col]);
	        		if (altintensity > altintensitymax) altintensitymax = altintensity;
	        		if (altintensity < altintensitymin) altintensitymin = altintensity;
	        		break;
	        	case ssdatahead.timecol:  
        		    var timeo = Date.parse(ssdata[row][col]);
        		  	if (timeo){
						timeos.push(timeo);
					}
        			break;
			}
		}
  	}
  	timeos.sort(function(a,b){ return a.compareTo(b); }); //compareTo from date.js
  	var earlydateo = timeos[0];
  	var latedateo = timeos[timeos.length - 1];
  	console.log("dateo");
  	console.log(latedateo);
  	console.log(earlydateo);
  	
	var ssdataattrib = {latmax: latmax, latmin: latmin, lonmax: lonmax, lonmin: lonmin, earlydateo: earlydateo, latedateo: latedateo, altintensitymax: altintensitymax, altintensitymin: altintensitymin}; 
	return ssdataattrib;
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function normalizexy(lat, lon, ssdataattrib, crs){
		//Let's get lat and lon into integer space to make calculations easier on the computer and my brain
		lon = lon + 180; //make lon always positive
		lon = lon - (ssdataattrib.lonmin + 180);
		lon = Math.round(lon * crs);
		lat = lat - ssdataattrib.latmin;
		lat = Math.round((ssdataattrib.latmax - ssdataattrib.latmin) * crs) - Math.round(lat * crs);// some magic here because html5 canvas y axis measures from the top
		return ({y: lat, x: lon});
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function putFormattedTimeInTableToShowUser(strTime, row, col){
	var tdid = "datatd" + row + col;
	//TODO instead of displaying these adjacent, make it a mouseover thing that shows the old date when mouseover and the new data by default
	document.getElementById(tdid).innerHTML = "<input id='datatable" + row + col + "' width=26 type='text' value='" + ssdata[row][col] + "' onblur='UpdateCell(this.value," + row + "," + col + ")'><span class='isotime'>" + strTime + "</span>";        		
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function StatusWarnErr(strSWE, strType){
	switch (strType) {
		case "bad":
    		document.getElementById("StatusWarnErrArea").innerHTML = document.getElementById("StatusWarnErrArea").innerHTML + "<img src='cross-icon.png' height=10> ";
    	break;
    	case "good":
    		document.getElementById("StatusWarnErrArea").innerHTML = document.getElementById("StatusWarnErrArea").innerHTML + "<img src='check-icon.png' height=10> ";
    	break;
	}
	document.getElementById("StatusWarnErrArea").innerHTML = document.getElementById("StatusWarnErrArea").innerHTML + strSWE + "<br>";
	//make the area scroll
	var height = $("#StatusWarnErrArea").get(0).scrollHeight;
    $("#StatusWarnErrArea").animate({
        scrollTop: height
    }, 500);
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function buildHeatmapjs(){
	document.getElementById('hmkmloutput').innerHTML = "<img src='loading.gif' width=50>";
	
	StatusWarnErr("Trying to build a heatmap.","good");
	var retObj = buildHeatmapjson();
	var hmkmlajaxdata = retObj.hmkmlajaxdata;
	var havewhatweneed = retObj.havewhatweneed; 
	if(havewhatweneed){	
        $.ajax({
	        type:           'post',
	        cache:          false,
	        url:            'buildheatmapkml.php',
	        data: hmkmlajaxdata,
	        // callback handler that will be called on success
	        success: function(response, textStatus, jqXHR){
	            console.log("Received an ajax response:"); console.log(response);
	            document.getElementById('hmkmloutput').innerHTML = "<a href='" + response + "'><img src='geicon.png'></a>";
	            StatusWarnErr("Successfully built heatmap","good");
	        },
	        error: function(jqXHR, textStatus, errorThrown){
	            //console.log("The following error occured: " + textStatus, errorThrown);
	            StatusWarnErr("Failed to build heatmap","bad");
	        },
	        complete: function(){
	            console.log("ajax request complete");
	        }
        });
		
		document.getElementById('kmlhmbuildbutton').innerHTML = "Rebuild Heatmap KMZ"; 	
	} else{
		document.getElementById('hmkmloutput').innerHTML = "<img src='cross-icon.png' height=50>";
	}
}	
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function buildHeatmapjson(){
	
	var ssdatahead = getcolhead("hm");
	var ssdataattrib = getssdataattrib(ssdatahead);
	var crs; // canvas resolution scalar for our lat lon conversions
	
	console.log("scaling testing");
	
	var llwidth = ssdataattrib.lonmax - ssdataattrib.lonmin;
	if(llwidth > 30){
		StatusWarnErr("Stopping build, your data covers too large of an area to create a heatmap with the public version of Simple Spatial (keep it under 10 degrees lon).  Please contact us if you need to go over this limit.", "bad");
		ssdatahead.havewhatweneed = false;
	}else{
		
		if(llwidth > 6){//TODO: make this smarter and better.
			crs = 100; // screw it, if they are making a heatmap this big they deserve low resolution.  This is a dirty tweak/hack.
		}else{
			crs = Math.round((-90 * llwidth) + 1000); // linear normalization mapping llwidth of 10 to 0 to 100 to 1000 respectively to cut down on processing time for large areas
		}
		console.log(crs); 
	}
	
	if(ssdatahead.havewhatweneed){
	  	// The loop that actually pulls out the lat lon data and adds it to the object array that will create the heatmap
	  	var heatmapdata = [];
	  	var staticweight = parseInt(document.getElementById("hmweight").value); // how much intensity each point will have on heatmap
		
		for(var row = 1; row < ssdata.length; row++) {
			var lat;
			var lon;
			var cleanrow = true;
	
		  	for(var col = 0; col < ssdata[0].length; col++){
		  		switch (col) {
					case ssdatahead.latcol:
		        		lat = parseFloat(ssdata[row][col]);
		        		var uirow = row + 1;
		        		if(isNaN(lat)){ 
		        			StatusWarnErr("Ignoring row " + uirow + ", latitude looks wrong: " + ssdata[row][col], "bad");
		        			cleanrow = false; 
		        		}
		        		break;
		    		case ssdatahead.loncol:
		        		lon = parseFloat(ssdata[row][col]);
		        		var uirow = row + 1;
		        		if(isNaN(lon)){ 
		        			StatusWarnErr("Ignoring row " + uirow + ", longitude looks wrong: " + ssdata[row][col], "bad");
		        			cleanrow = false; 
	        			}
		        		break;
		        	case ssdatahead.latcommaloncol:
		        		latlonstring = ssdata[row][col];
		        		latlonstringarray = latlonstring.split(/,/);
		        		lat = parseFloat(latlonstringarray[0]);
		        		lon = parseFloat(latlonstringarray[1]);
		        		if(isNaN(lon) || isNaN(lat)){ 
		        			StatusWarnErr("Ignoring row " + uirow + ", Lat, Lon looks wrong: " + ssdata[row][col], "bad");
		        			cleanrow = false; 
	        			}
		        		break;
				}
			}
			var normxy = normalizexy(lat, lon, ssdataattrib, crs);
		    // push the integer point object we created into the array
			if(cleanrow){
				heatmapdata.push({x: normxy.x, y: normxy.y, count: staticweight});
			}
		}
		//resize that canvas element
		var canvaswidth = Math.round((ssdataattrib.lonmax - ssdataattrib.lonmin) * crs);
	  	var canvasheight = Math.round((ssdataattrib.latmax - ssdataattrib.latmin) * crs);
	  	document.getElementById('heatmapArea').style.width = canvaswidth;
	  	document.getElementById('heatmapArea').style.height = canvasheight;
	  	
	  	// results pushed to global objects
	  	var weightmax = parseInt(document.getElementById("hmmaxweight").value); // the max intensity any point will have
		var heatmapjson = { max: weightmax, data: heatmapdata};
		// build the canvas element and grab it as an image
		var radius = parseInt(document.getElementById("hmradius").value);
		var xx = h337.create({"element":document.getElementById("heatmapArea"), "radius":radius, "visible":true});
		xx.store.setDataSet(heatmapjson);
		var imgdata = xx.getImageData();
		xx.clear(); // Clear that canvas or everything will be there next time we build it
		//build and return our object
		var heatmaplatlonbox = {north: ssdataattrib.latmax, south: ssdataattrib.latmin, east: ssdataattrib.lonmax, west: ssdataattrib.lonmin};
		var heatmaptsbegin;
		var heatmaptsend;	
		//TODO add a buton to pull tsbeing and tsend from the data
		if(document.getElementById("heatmaptsbegin").value && document.getElementById("heatmaptsend").value){
			heatmaptsbegin = Date.parse(document.getElementById("heatmaptsbegin").value).toISOString();
			heatmaptsend = Date.parse(document.getElementById("heatmaptsend").value).toISOString();
		}
		console.log(heatmaptsbegin);
		console.log(heatmaptsend);
		var hmkmlajaxdata = {
				imageData: imgdata,
				heatmaplatlonbox: heatmaplatlonbox,
				heatmaptsbegin: heatmaptsbegin,
				heatmaptsend: heatmaptsend
			};	
	}	
	
	return {hmkmlajaxdata: hmkmlajaxdata, havewhatweneed: ssdatahead.havewhatweneed};
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function buildKml(mode){
	document.getElementById('pmkmloutput').innerHTML = "<img src='loading.gif' width=50>";
	document.getElementById('tpmkmloutput').innerHTML = "<img src='loading.gif' width=50>";
	
	StatusWarnErr("Trying to build placemarks.","good");
	var retObj = buildKmljson("pm");
	var placemarks = retObj.placemarks;
	var havewhatweneed = retObj.havewhatweneed;
	var pmcolor = htmlcolortokmlcolor(document.getElementById('pmcolorselect').value);

	var data = {
                	asetting: 'one',
                	color: pmcolor,
					placemarks: placemarks,
  			};
  	
  	console.log("mode");
	console.log(mode);
  	
  	if(mode == 'maketrack'){
  		data.maketrack = true;
  		data.color = htmlcolortokmlcolor(document.getElementById('tpmcolorselect').value);
  	}
  			
	if(havewhatweneed){
        $.ajax({
                type:           'post',
                cache:          false,
                url:            'buildkml.php',
                data: data,
                // callback handler that will be called on success
		        success: function(response, textStatus, jqXHR){
		            // log a message to the console
		            console.log("Received successful response:");
		            console.log(response);
		            if(!mode){
			            document.getElementById('pmkmloutput').innerHTML = "<a href='" + response + "'><img src='geicon.png'></a><a href='http://maps.google.com/maps?q=http://" + window.location.hostname + "/" + response + "' target='_blank'><img src='gmicon.png'></a>";
			            StatusWarnErr("Successfully built placemarks kml", "good");
		            }else if(mode == 'maketrack'){
		            	document.getElementById('tpmkmloutput').innerHTML = "<a href='" + response + "'><img src='geicon.png'></a><a href='http://maps.google.com/maps?q=http://" + window.location.hostname + "/" + response + "' target='_blank'><img src='gmicon.png'></a>";
			            StatusWarnErr("Successfully built track kml", "good");
		            }
		        },
		        error: function(jqXHR, textStatus, errorThrown){
		            console.log("The following error occured: " + textStatus, errorThrown);
		        },
		        complete: function(){
		            console.log("ajax request complete");
		        }
        });
		
		document.getElementById('kmlbuildbutton').innerHTML = "Rebuild Placemarks KML";
	} else{
		document.getElementById('pmkmloutput').innerHTML = "<img src='cross-icon.png' height=50>";
		document.getElementById('tpmkmloutput').innerHTML = "<img src='cross-icon.png' height=50>";
	}
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function buildaltintensitykml(){
	document.getElementById('aikmloutput').innerHTML = "<img src='loading.gif' width=50>";
	
	StatusWarnErr("Trying to build altitude intensity kml.","good");
	var retObj = buildKmljson("altintensity");
	var placemarks = retObj.placemarks;
	var havewhatweneed = retObj.havewhatweneed;
	
	var pmcolor = htmlcolortokmlcolor(document.getElementById('aipmcolorselect').value);
	
	if(havewhatweneed){
        $.ajax({
                type: 'post',
                cache: false,
                url: 'buildkml.php',
                //url: 'postecho.php', // for debugging
                data:{
                	asetting: 'one',
                	color: pmcolor,
					placemarks: placemarks,
  				},
                // callback handler that will be called on success
		        success: function(response, textStatus, jqXHR){
		            // log a message to the console
		            console.log("Received successful response:");
		            console.log(response);
		            document.getElementById('aikmloutput').innerHTML = "<a href='" + response + "'><img src='geicon.png'></a>";
		            StatusWarnErr("Successfully built placemarks kml", "good");
		        },
		        error: function(jqXHR, textStatus, errorThrown){
		            console.log("The following error occured: " + textStatus, errorThrown);
		        },
		        complete: function(){
		            console.log("ajax request complete");
		        }
        });
		
		document.getElementById('kmlaibuildbutton').innerHTML = "Rebuild Altitude Intensity KML";
	}else{
		document.getElementById('aikmloutput').innerHTML = "<img src='cross-icon.png' height=50>";
	}
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function builddataterrainkml(){
	document.getElementById('dtkmloutput').innerHTML = "<img src='loading.gif' width=50>";
	
	StatusWarnErr("Trying to build data terrain kml.","good");
	var retObj = buildKmljson("altintensity"); //TODO: This will use controls from Number as Alt tab until I fix it
	var placemarks = retObj.placemarks;
	var havewhatweneed = retObj.havewhatweneed;
	
	var pmcolor = htmlcolortokmlcolor(document.getElementById('dtpmcolorselect').value);
	
	if(havewhatweneed){
        $.ajax({
                type: 'post',
                cache: false,
                url: 'builddataterrainkml.php',
                //url: 'postecho.php', // for debugging
                data:{
                	asetting: 'one',
                	color: pmcolor,
					placemarks: placemarks,
  				},
                // callback handler that will be called on success
		        success: function(response, textStatus, jqXHR){
		            // log a message to the console
		            console.log("Received successful response:");
		            console.log(response);
		            document.getElementById('dtkmloutput').innerHTML = "<a href='" + response + "'><img src='geicon.png'></a>";
		            StatusWarnErr("Successfully built placemarks kml", "good");
		        },
		        error: function(jqXHR, textStatus, errorThrown){
		            console.log("The following error occured: " + textStatus, errorThrown);
		        },
		        complete: function(){
		            console.log("ajax request complete");
		        }
        });
		
		document.getElementById('kmldtbuildbutton').innerHTML = "Rebuild Data Terrain KML";
	}else{
		document.getElementById('dtkmloutput').innerHTML = "<img src='cross-icon.png' height=50>";
	}
}	
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function buildtimealtkml(){
	document.getElementById('takmloutput').innerHTML = "<img src='loading.gif' width=50>";
	StatusWarnErr("Trying to build Time as Altitude visualization.","good");
	var retObj = buildKmljson("timealt");
	var placemarks = retObj.placemarks;
	var havewhatweneed = retObj.havewhatweneed;
	
	var pmcolor = htmlcolortokmlcolor(document.getElementById('tapmcolorselect').value);
	
	if(havewhatweneed){
        $.ajax({
                type: 'post',
                cache: false,
                url: 'buildkml.php',
                //url: 'postecho.php', // for debugging
                data:{
                	asetting: 'one',
                	color: pmcolor,
					placemarks: placemarks,
  				},
                // callback handler that will be called on success
		        success: function(response, textStatus, jqXHR){
		            // log a message to the console
		            console.log("Received successful response:");
		            console.log(response);
		            document.getElementById('takmloutput').innerHTML = "<a href='" + response + "'><img src='geicon.png'></a>";
		            StatusWarnErr("Successfully built Time as Altitude visualization", "good");
		        },
		        error: function(jqXHR, textStatus, errorThrown){
		            console.log("The following error occured: " + textStatus, errorThrown);
		        },
		        complete: function(){
		            console.log("ajax request complete");
		        }
        });
		
		document.getElementById('kmltabuildbutton').innerHTML = "Rebuild Time as Altitude KML";
	}else{
		document.getElementById('takmloutput').innerHTML = "<img src='cross-icon.png' height=50>";
	}
}	
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function buildKmljson(strIntent){
	//strIntent = "pm" or "altintensity" or "timealt"
	var placemarks = []; 
	var ssdatahead = getcolhead(strIntent);
	
	
	if(ssdatahead.havewhatweneed){
		var ssdataattrib = getssdataattrib(ssdatahead);
	
		console.log("dataattributes");
		console.log(ssdataattrib);
		console.log("datheader");
		console.log(ssdatahead);	
		
		//ssdataattrib.altintensitymax	
		for(var row = 1; row < ssdata.length; row++) {
			var lat;
			var lon;
			var name;
			var altintensity;
			var timeobj = new Date();
			var description = "";
			var isoTime;
			var uirow = row + 1;
			var earlydateepoch, latedateepoch;
			if(strIntent == "timealt"){
				earlydateepoch = ssdataattrib.earlydateo.getTime()/1000.0;
				latedateepoch = ssdataattrib.latedateo.getTime()/1000.0;
			}
			var cleanrow = true;
		  	for(var col = 0; col < ssdata[0].length; col++){
		  		for(var descnum = 0; descnum < ssdatahead.desccol.length; descnum++){
		  			if(col == ssdatahead.desccol[descnum]){
		  				var colheadertext = ssdata[0][col];
		  				description = description + colheadertext + ": " + ssdata[row][col] + "<br>";
		  			}	
		  		}
		  		switch (col) {
		  			case ssdatahead.altintensitycol:
		  				var trytoparsealtintensity = parseFloat(ssdata[row][col]);
		        		if(isNaN(trytoparsealtintensity)){ 
		        			StatusWarnErr("Row:" + uirow + " Altitude Intensity does not look like a number: " + ssdata[row][col] + " Setting altitude to zero.", "bad"); 
		        			//console.log("setting alt to zero");
		        			altintensity = 0;
		        		}else{
		        			altintensity = normalizealtintensity(trytoparsealtintensity, ssdataattrib.altintensitymin, ssdataattrib.altintensitymax);
		        			//console.log("setting alt " + altintensity);
		        		}
		  				break;
	    			case ssdatahead.namecol:
		        		name = ssdata[row][col];
		        		break;
					case ssdatahead.latcol:
		        		lat = parseFloat(ssdata[row][col]);
		        		if(isNaN(lat)){ 
		        			StatusWarnErr("Ignoring Row:" + uirow + " Latitude looks wrong: " + ssdata[row][col], "bad"); 
		        			cleanrow = false;
	        			}
		        		break;
		    		case ssdatahead.loncol:
		        		lon = parseFloat(ssdata[row][col]);
		        		if(isNaN(lon)){ 
		        			StatusWarnErr("Ignoring Row:" + uirow + " Longitude looks wrong: " + ssdata[row][col], "bad"); 
		        			cleanrow = false;
	        			}
		        		break;
		        	case ssdatahead.latcommaloncol:
		        		latlonstring = ssdata[row][col];
		        		latlonstringarray = latlonstring.split(/,/);
		        		lat = parseFloat(latlonstringarray[0]);
		        		lon = parseFloat(latlonstringarray[1]);
		        		if(isNaN(lon) || isNaN(lat)){ 
		        			StatusWarnErr("Ignoring Row " + uirow + ", Lat, Lon looks wrong: " + ssdata[row][col], "bad");
		        			cleanrow = false; 
	        			}
	        			break;
	        		case ssdatahead.timecol:
	        		    var timestr = ssdata[row][col];
	        		    timestr = timestr.replace(/T/," "); //date.js doesn't like this T from kml or ISO times
	        		    isoTime = "";
	        		    timeobj =  Date.parse(timestr);
	        		  	if (timeobj){
							isoTime = timeobj.toISOString();
							isoTime = isoTime.replace(/\.000Z$/,"Z"); //we won't need sub-second precision in kml.
							putFormattedTimeInTableToShowUser(isoTime, row, col);
							if(strIntent == "timealt"){
								altintensity = normalizealtintensity((timeobj.getTime() / 1000.0) - earlydateepoch, 0, latedateepoch - earlydateepoch);
							}
						}else{
							StatusWarnErr("Row:" + uirow + " Could not parse this date: " + ssdata[row][col], "bad");
						}
	        			break;
				}
	  		}
	  		// add the data to our kmljson object	
	  		
	  		//debug code:
	  		//description = description + "point_alt: " + altintensity + "<br>";
	  		
	  		if(cleanrow){
	 			placemarks.push({pname: name, ddlat: lat, ddlon: lon, timestamp: isoTime, description: description, timeobj: timeobj, altintensity: altintensity});
	 		}             
	  	}
	}
  	return {placemarks: placemarks, havewhatweneed: ssdatahead.havewhatweneed};
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function normalizealtintensity(altIntensity, minIntensity, maxIntensity){
	// this maps the data they want to use as intensity to a reasonable altitude in GE
	var maxalt = document.getElementById("aimaxalt").value;
	var absMaxIntensity = maxIntensity - minIntensity;
	var absAltIntensity = altIntensity - minIntensity;
	var normalizedIntensity = (absAltIntensity / absMaxIntensity) * maxalt;
	return Math.floor(normalizedIntensity);
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
function ingestcsvarea(strData){
	document.getElementById('tableoutput').innerHTML = "<img src='loading.gif' width=50>";
	var delimeter = document.getElementById("csvdelimeter").value; //csvdelimeter
	
	//Make the input area not visible.
	controlMenuFlipOff("inputcheck");
	controlMenuFlipOn("outputcheck");
	StatusWarnErr("New data pulled in", "good");
	
	ssdata = CSVToArray( strData, delimeter );
	displayssdata();
}
function ingestgooglespreadsheet(docid){
	document.getElementById('tableoutput').innerHTML = "<img src='loading.gif' width=50>";
	//Make the input area not visible.
	controlMenuFlipOff("inputcheck");
	controlMenuFlipOn("outputcheck");
	StatusWarnErr("New data pulled in", "good");
	
	var googlespreadcsv;
	console.log("ingest google spreadsheet");
	console.log(docid);
   $.ajax({
            type: 'post',
            cache: false,
            url: 'fetchgoogspreadsheet.php',
            data: {
            		"id": docid,
      				"exportFormat": "csv",
      				"accesstoken": accesstoken
  				},
  	        success: function(response, textStatus, jqXHR){
				ssdata = CSVToArray(response,',');
				displayssdata();
	        },
	        error: function(jqXHR, textStatus, errorThrown){
	            console.log("The following error occured: " + textStatus, errorThrown);
	        },
	        complete: function(){
	            console.log("ajax request complete");
	        }
    });
	

	
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function displayssdata(startrow){
  if(!startrow){ startrow = 1; }
  var showrows = 10;
  var endrow = startrow - 1 + showrows;  
  
  var datatable = "<div class='howtousedata'>Identify each of the columns required to make your visualization by clicking on the options here.</div>";
  datatable = datatable.concat("<table border=0>");
  datatable = datatable.concat("<tr><td class='uirow'></td>");
  for(var col = 0; col < ssdata[0].length; col++){					
		datatable = datatable.concat("<td align=center><ol class='columnselect' id='column",col,"'>",
								"<li class='ui-widget-content' data='name'>Name</li>",
								"<li class='ui-widget-content' data='latitude'>Latitude</li>",
								"<li class='ui-widget-content' data='longitude'>Longitude</li>",
								"<li class='ui-widget-content' data='latcommalon'>Lat, Lon</li>",
								"<li class='ui-widget-content' data='time'>Date and or time</li>",
								"<li class='ui-widget-content' data='altintensity'>Number to Altitude</li>",
								"<li class='ui-widget-content' data='Description'>Description</li>",
							"</ol></td>");
									
  }
  datatable = datatable.concat("</tr>");
  
  datatable = datatable.concat("<tr><td class='uirow'>Header <img id='headerquestionimg' src='question.png' height=25 onclick=\"$('#headerquestiondialog').dialog('open');\"></td>");
  for(var col = 0; col < ssdata[0].length; col++){
  		var row = 0;
  		datatable = datatable.concat("<td id='datatd",row,col,"'><input style='width: 100%;' id='datatable",row,col,"' size=16 type='text' value='",ssdata[row][col],"' onblur='UpdateCell(this.value,",row,",",col,")'></td>");
  }
  datatable = datatable.concat("</tr>");
  
  for(var row = startrow - 1; row < endrow && row < ssdata.length; row++) {
  	var uirow = row + 1;
  	datatable = datatable.concat("<tr><td class='uirow'>" + uirow + "</td>");
  	for(var col = 0; col < ssdata[0].length; col++){
  		datatable = datatable.concat("<td id='datatd",row,col,"'><input id='datatable",row,col,"' size=16 type='text' value='",ssdata[row][col],"' onblur='UpdateCell(this.value,",row,",",col,")'></td>");
  	}
  	datatable = datatable.concat("</tr>");
  }
  
  
  
  datatable = datatable.concat("</table>");
  
  var menustring = "<div class='datarangemenu'>";
  var lastmenurow = 1;
  for(var row = 1; row < ssdata.length - 1; row++) {
  	if(row % showrows == 0){
  		menustring = menustring.concat("<a href='#' onclick='displayssdata("+ lastmenurow + ")'>" + lastmenurow + "..." + row + "</a> | ");
  		lastmenurow = row + 1;
  	}		
  }
  menustring = menustring.concat("<a href='#' onclick='displayssdata("+ lastmenurow + ")'>" + lastmenurow + "..." + ssdata.length + "</a> | ");
  
  
  datatable = datatable.concat("<br>" + menustring + "</div>");
  
  
  
  document.getElementById('tableoutput').innerHTML = datatable;
  
	$(function() {
		$( ".columnselect" ).selectable();
	});
  
  guessColIdentities();
  
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function guessColIdentities(){
	for(var col = 0; col < ssdata[0].length; col++){
		var columnid = "column" + col;
		
		//Start jqueryui selectables specific stuff
		var header = ssdata[0][col];
	    var uppercaseheader = header.toUpperCase().replace(/\s/g, "");
		
		
		
		//TODO: add code here to guess columns
		
		
		/*//This is how I did this when I used options.  Had to abandon this cleverness to use jqueryui selectables
	    for ( var i = 0; i < document.getElementById(columnid).options.length; i++ ) {
	    	
	    	var option = document.getElementById(columnid).options[i].value;
	    	var header = ssdata[0][col];
	        if ( option.toUpperCase().replace(/\s/g, "") == header.toUpperCase().replace(/\s/g, "") ) {
	            document.getElementById(columnid).options[i].selected = true;
	            break;
	        }
	    }
	    //*/
	}
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function controlMenuFlipOff(strElemID){
	console.log("controlmenuflipoff");
	document.getElementById(strElemID).checked = "";
	$(':checkbox').iphoneStyle("refresh");
	checkchangeaction();
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function controlMenuFlipOn(strElemID){ //this function is untested... it should work
	console.log("controlmenuflipon");
	document.getElementById(strElemID).checked = "checked";
	$(':checkbox').iphoneStyle("refresh");
	checkchangeaction();
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function UpdateCell(strData,row,col){
	console.log("updating cell");
	console.log(strData,row,col);
	ssdata[row][col] = strData;	
} 
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function CSVToArray( strData, strDelimiter ){
		strDelimiter = (strDelimiter || ",");
		//console.log("csvtoarayy");
		//console.log(strData);
 		var objPattern = new RegExp(
			(
				// Delimiters.
				"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
 				// Quoted fields.
				"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
 				// Standard fields.
				"([^\"\\" + strDelimiter + "\\r\\n]*))"
			),
			"gi"
			);
		var arrData = [[]];
		var arrMatches = null;
		while (arrMatches = objPattern.exec( strData )){
			var strMatchedDelimiter = arrMatches[ 1 ];
			if (
				strMatchedDelimiter.length &&
				(strMatchedDelimiter != strDelimiter)
				){
				arrData.push( [] );
			}
			if (arrMatches[ 2 ]){
				var strMatchedValue = arrMatches[ 2 ].replace(
					new RegExp( "\"\"", "g" ),
					"\""
					);
			} else {
				var strMatchedValue = arrMatches[ 3 ]; 
			}
			arrData[ arrData.length - 1 ].push( strMatchedValue );
		}
		//console.log(arrData);
		return( arrData );
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function dms2deg(s) {
  // Determine if south latitude or west longitude
  var sw = /[sw]/i.test(s);
  // Determine sign based on sw (south or west is -ve) 
  var f = sw? -1 : 1;
  // Get into numeric parts
  var bits = s.match(/[\d.]+/g);
  var result = 0;
  // Convert to decimal degrees
  for (var i=0, iLen=bits.length; i<iLen; i++) {
    // String conversion to number is done by division
    // To be explicit (not necessary), use 
    //   result += Number(bits[i])/f
    result += bits[i]/f;
    // Divide degrees by +/- 1, min by +/- 60, sec by +/-3600
    f *= 60;
  }
  return result;
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function htmlcolortokmlcolor(htmlcolor, opacity){
	// html color looks like this: #0033FF 
	//TODO: write a slider for this opacity functionality...
	if(!opacity){
		opacity = "FF";
	}
	var rgbcolor = htmlcolor.replace("\#", "");
	console.log("rgbcolor");
	console.log(rgbcolor);
	var red = rgbcolor.substring(0,2);
	var green = rgbcolor.substring(2,4);
	var blue = rgbcolor.substring(4,6);
	// kml color looks like this: ffff3c84
	return opacity + blue + green + red;
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	
// polymorph array type to provide max method
Array.prototype.max = function() {
	var max = this[0];
	var len = this.length;
	for (var i = 1; i < len; i++) if (this[i] > max) max = this[i];
	return max;
	}
// polymorph array type to provide min method
Array.prototype.min = function() {
	var min = this[0];
	var len = this.length;
	for (var i = 1; i < len; i++) if (this[i] < min) min = this[i];
	return min;
}
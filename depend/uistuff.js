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

// Some stuff we are storing at the global level in the DOM
var ssdata=new Array; // the main data array

// end of globals
//start stuff that needs to happen immediately
	//Format the tabs to look like tabs
	$(function() {
		$( "#inputtabs" ).tabs();
		$( "#inputtabs" ).tabs("option","disabled", [2,3,4]);
	});
	$(function() {
		$( "#outputtabs" ).tabs();
		//$( "#outputtabs" ).tabs("option","disabled", [0, 1, 2, 3]);
		$( "#outputtabs" ).tabs("option","disabled", [5]);
	});
//end of stuff that needs to happen immediately

function checkchangeaction(){
	

	//inputtabs
	if(document.getElementById('inputcheck').checked){
		$('#inputtabs').show("Explode");
	}else{
		$('#inputtabs').hide("Explode");
	}
	//outputtabs
	if(document.getElementById('outputcheck').checked){
		$('#outputtabs').show("Explode");
	}else{
		$('#outputtabs').hide("Explode");
	}
}


     	
function doInit(){
	console.log("doInit");
	
	//Turn all checkboxes into the iphone slider switch style
	$(':checkbox').iphoneStyle({
	  onChange: function(elem, value) { 
	  			checkchangeaction();
		}
	});

	checkchangeaction(); // Make sure the UI maps to all the UI switches to control it
	StatusWarnErr("<u>Status, warnings, and errors:</u>");
	

	controlMenuFlipOff("outputcheck");
	
	$('#heatmaptsbegin').datetimepicker();
	$('#heatmaptsend').datetimepicker();
	
					
	$(".color-picker").miniColors({
		letterCase: 'uppercase',
		change: function(hex, rgb) {
			
		},
		open: function(hex, rgb) {
			
		},
		close: function(hex, rgb) {
			
		}
	});
				
	
	
	// heatmap sliders		
	$(function() {
		$( "#hmradiusslider" ).slider({
			value:20,
			min: 5,
			max: 100,
			step: 5,
			slide: function( event, ui ) {
				$( "#hmradius" ).val( ui.value );
			}
		});
		$( "#hmradius" ).val( $( "#hmradiusslider" ).slider( "value" ) );
	});
	
	$(function() {
		$( "#hmweightslider" ).slider({
			value:90,
			min: 5,
			max: 100,
			step: 5,
			slide: function( event, ui ) {
				$( "#hmweight" ).val( ui.value );
			}
		});
		$( "#hmweight" ).val( $( "#hmweightslider" ).slider( "value" ) );
	});

	
	$(function() {
		$( "#aimaxaltslider" ).slider({
			value:10000,
			min: 100,
			max: 50000,
			step: 100,
			slide: function( event, ui ) {
				$( "#aimaxalt" ).val( ui.value );
			}
		});
		$( "#aimaxalt" ).val( $( "#aimaxaltslider" ).slider( "value" ) );
	});


	$(function() {
		$( "#tamaxaltslider" ).slider({
			value:10000,
			min: 100,
			max: 50000,
			step: 100,
			slide: function( event, ui ) {
				$( "#tamaxalt" ).val( ui.value );
			}
		});
		$( "#tamaxalt" ).val( $( "#tamaxaltslider" ).slider( "value" ) );
	});


	$(function() {
		$( "#dtmaxaltslider" ).slider({
			value:10000,
			min: 100,
			max: 50000,
			step: 100,
			slide: function( event, ui ) {
				$( "#dtmaxalt" ).val( ui.value );
			}
		});
		$( "#dtmaxalt" ).val( $( "#dtmaxaltslider" ).slider( "value" ) );
	});

	///////////////////////////////////// dialog stuff
	$.fx.speeds._default = 500;

	$(function(){
				$( ".questiondialog" ).dialog({
				autoOpen: false,
				draggable: false,
				show: "blind",
				hide: "explode"
			});
	});

	$(function() {
		$( "#aipmcolorquestionimg" ).click(function() {
			$( "#aipmcolorquestiondialog" ).dialog( "open" );
			return false;
		});
	});
	$(function() {
		$( "#tapmcolorquestionimg" ).click(function() {
			$( "#tapmcolorquestiondialog" ).dialog( "open" );
			return false;
		});
	});
	$(function() {
		$( "#aimaxaltquestionimg" ).click(function() {
			$( "#maxaltquestiondialog" ).dialog( "open" );
			return false;
		});
	});
	$(function() {
		$( "#tamaxaltquestionimg" ).click(function() {
			$( "#maxaltquestiondialog" ).dialog( "open" );
			return false;
		});
	});
	
	
	$(function() {
		$( "#tpmcolorquestionimg" ).click(function() {
			$( "#tpmcolorquestiondialog" ).dialog( "open" );
			return false;
		});
	});
	$(function() {
		$( "#pmcolorquestionimg" ).click(function() {
			$( "#pmcolorquestiondialog" ).dialog( "open" );
			return false;
		});
	});
	$(function() {
	$( "#csvdelimetertipimg" ).click(function() {
		$( "#csvdelimetertipdialog" ).dialog( "open" );
		return false;
	});
	});
	$(function() {
		$( "#hmradiusquestionimg" ).click(function() {
			$( "#hmradiusquestiondialog" ).dialog( "open" );
			return false;
		});
	});
	$(function() {
		$( "#hmweightquestionimg" ).click(function() {
			$( "#hmweightquestiondialog" ).dialog( "open" );
			return false;
		});
	});
	$(function() {
		$( "#hmtsquestionimg" ).click(function() {
			$( "#hmtsquestiondialog" ).dialog( "open" );
			return false;
		});
	});
	// NOTE: #headerquestiondialog" is generated alongside content and not here.
}

/* TODO: Figure out what the hell I was thinking... this should probably be deleted.
function csvdelimetertip(){
	$(function() {
		$( "#dialog" ).dialog();
	});
}
*/
///////////////////////////////////// end dialog stuff


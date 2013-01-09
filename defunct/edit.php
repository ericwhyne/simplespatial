<html>
<head>
	<link rel="stylesheet" type="text/css" href="site.css" />
</head>

<script type="text/javascript" src="depend/jquery-1.7.2.js"></script>
<script type="text/javascript" src="depend/date.js"></script>
<script type="text/javascript" src="depend/hm.js"></script>
<script type="text/javascript" src="depend/functions.js"></script>
<script type="text/javascript" src="depend/uistuff.js"></script>
<script type="text/javascript" src="depend/jquery-ui-1.8.21.custom.min.js"></script>
<script type="text/javascript" src="depend/jquery-ui-timepicker-addon.js"></script>

<script type="text/javascript" src="depend/iphone-style-checkboxes.js"></script>
<link rel="stylesheet" href="iphone-checkboxes.css" type="text/css" media="screen" />

<link rel="stylesheet" href="jquery-ui-eb.css" type="text/css">

<div id="header-main">
		<table><tr><td id='logotext'>Simple Spatial</td><td id='versiontext'>version: private beta 9</td></tr></table>
        <ul id="nav"><li><a href="#">About</a></li><li><a href="#">Documents</a></li><li><a href="#">Contact</a></li><li><a href="#">Login</a></li></ul>	
</div>

<body onload="doInit()">
  <div class="Base">
     <div id="Left-col">
     	<br>
     	<center>
     	Input Menu <input type="checkbox" id='inputcheck' onClick='checkchangeaction()' checked="checked"><br>
     	Output Menu <input type="checkbox" id='outputcheck' onClick='checkchangeaction()' checked="checked"><br>
     	Tool Tips <input type="checkbox" id='tooltipscheck' onClick='checkchangeaction()' checked="checked"><br>
     	</center>
	 </div>
	 
     <div id="Central-col">
     
<div id="inputtabs">
	Select a source of spatial data and bring it in to your workspace:
	<ul>
		<li><a href="#tabs-1">CSV</a></li>
		<li><a href="#tabs-2">Google Spreadsheet</a></li>
	</ul>
	<div id="tabs-1">
<div id='inputarea' class='inputarea'>
	 <textarea id="csvarea" rows="5" cols="80">
Eric,39.055719,-77.417352,thursday
Dulles Town Center,39.031942,-77.424264,next friday
Snickersville Turnpike,38.979029,-77.652110,Aug 3 2012
Random Point,38.579029,-77.352110,2012-08-02T04:00:00</textarea>
		<br>
		<button onclick="ingestcsvarea(document.getElementById('csvarea').value)">Input CSV Data</button>
		Delimeter: <input id='csvdelimeter' size=2 type='text' value=','><img src='question.png' height=25 id='csvdelimetertipimg'><br>
		</div>	
	</div>
	<div id="tabs-2">
		<p>Working on this.</p>
	</div>
	<div id="tabs-3">
		<p>Potential feature.</p>
	</div>
</div>
     
<br>
<div id="outputtabs">
	Select, configure, and view a type of spatial visualization:
	<ul>
		<li><a href="#tabs-1">Placemarks</a></li>
		<li><a href="#tabs-2">Heatmap</a></li>
		<li><a href="#tabs-4">Altitude Intensity</a></li>
		<li><a href="#tabs-5">Conrey</a></li>
	</ul>
	<div id="tabs-1">

				<button id='kmlbuildbutton' onclick='buildKml()'>Build Placemarks KML</button><br>
				

	<style>
	#red, #green, #blue {

		width: 100px;
		margin: 10px;
	}
	#colorpicker{
		width: 300px;
		float:right;
	}
	#swatch {
		width: 70px;
		height: 50px;
		background-image: none;
	}
	#red .ui-slider-range { background: #ef2929; }
	#red .ui-slider-handle { border-color: #ef2929; }
	#green .ui-slider-range { background: #8ae234; }
	#green .ui-slider-handle { border-color: #8ae234; }
	#blue .ui-slider-range { background: #729fcf; }
	#blue .ui-slider-handle { border-color: #729fcf; }
	</style>

<div class="colorpicker">
<table><tr><td align=center>Placemark Color:<br><img id='pmcolorquestionimg' src='question.png' height=25></td><td>
<div id="swatch" class="ui-widget-content ui-corner-all"></div>	
</td><td>
<div id="red"></div>
<div id="green"></div>
<div id="blue"></div>	
</td>
</tr></table>
</div>


<div id='pmkmloutput'></div>

	</div>
	<div id="tabs-2">

		<button id='kmlhmbuildbutton' onclick='buildHeatmapjs()'>Build Heatmap KMZ</button><br><br>
		<table border=0><tr><td>Radius: </td><td><input id='hmradius' size=2 type='text'  style="border:0; color:#f6931f; font-weight:bold;"></td><td><div id='hmradiusslider' style="width:100px;"></div></td><td><img id='hmradiusquestionimg' src='question.png' height=25></td></tr></table>
		<table border=0><tr><td>Intensity: </td><td><input id='hmweight' size=2 type='text'  style="border:0; color:#f6931f; font-weight:bold;"></td><td><div id='hmweightslider' style="width:100px;"></div></td><td><img id='hmweightquestionimg' src='question.png' height=25></td></tr></table>
		<input id='hmmaxweight' hidden=true size=3 type='text' value='100'>
		<table border=0><tr><td>Timestamp </td><td><img id='hmtsquestionimg' src='question.png' height=25></td><td><table id='heatmaptstable'><tr><td>begin:</td><td><input id='heatmaptsbegin' type='text'></td><td>end:</td><td><input id='heatmaptsend' type='text'></td></tr></table></td></tr></table>
		<br>
		<div id='hmkmloutput'></div>

	</div>
	<div id="tabs-4">
		<button id='kmlaibuildbutton' onclick='buildaltintensitykml()'>Build Altitude Intensity KML</button><br><br>
		<table border=0><tr><td>Max Altitude: </td><td><input id='aimaxalt' size=2 type='text'  style="border:0; color:#f6931f; font-weight:bold;"></td><td><div id='aimaxaltslider' style="width:100px;"></div></td><td><img id='aimaxaltquestionimg' src='question.png' height=25></td></tr></table>
		<br>
		<div id='aikmloutput'></div>
	</div>
	<div id="tabs-5">
		<p>"Conrey" Visualization: Heatmap with Altitude Intensity.  Working on this.  "One vis to rule them all."</p>
	</div>
</div>
<br>
<div id='StatusWarnErrArea'>
</div>

<br>
<div id='tooltip' class='bubbleback' align=left><img src="compass.png" class="floatLeft" height=100><b>Tool tip: </b><div id="tooltiptext"></div></div>


<div id='tableoutput' class='dataarea'>Your data will appear here.</div>
<div id="heatmapArea"></div>


</div>

</div>


<div id="csvdelimetertipdialog" title="CSV Deimeters">
	<p>A delimiter is a sequence of one or more characters used to specify the boundary between separate, independent regions in plain text.</p><p>An example of a delimiter is the comma character, which often acts as a field delimiter in a sequence of comma-separated values.</p><p>Selecting a delimeter character is often an option in your spreadsheet application when you save as a .csv file.</p>
</div>
<div id="hmradiusquestiondialog" title="Heatmap Radius">
	<p>The heatmap radius number controls how much area each point will cover on the heatmap.</p>
</div>
<div id="hmweightquestiondialog" title="Heatmap Intensity">
	<p>The heatmap intensity controls how much intensity each point will produce on the heatmap.</p><p>If this is higher each point will contribute more to making that area of the heatmap darker.</p>
</div>
<div id="hmtsquestiondialog" title="Heatmap Time Stamp">
	<p>Timestamping allows you to use the time slider functionality in Google Earth.</p><p>Your heatmap will only be visible if the timeslider falls within this time frame.</p><p>Split your data into parts, build the heatmaps with adjacent timestamps, and bring them all into Google Earth at the same time to create a time series heatmap wich shows change over time.</p><p>Note: If these are empty they will be ignored.</p>
</div>
<div id="pmcolorquestiondialog" title="Placemark Color">
	<p>Use the sliders to adjust the color.</p><p>The placemarks on the map will be the color shown in the box.</p>
</div>


</body>
</html>
<html>
<?php
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

require_once 'oauth/Google_Client.php';
require_once 'oauth/Google_Oauth2Service.php';
require_once 'oauth/Google_DriveService.php';
//require_once 'oauth/Google_IO.php';
session_start();
$client = new Google_Client();
$client->setApplicationName("Simple Spatial");
$client->setClientId('yourclientidhere');
$client->setClientSecret('yoursecrethere');
$client->setRedirectUri('http://127.0.0.1/simplespatial/toolui.php');
//$client->setRedirectUri('http://simplespatial.net/tools/toolui.php');

$oauth2 = new Google_Oauth2Service($client);
$driveservice = new Google_DriveService($client);

include("head.php"); 
?>
<body onload="doInit()">

<div class="Base">
	 
<div id="Central-col">

<br>
     	
<div class='showhide'><table><tr><td><input type="checkbox" id='inputcheck' onClick='checkchangeaction()' checked="checked"></td><td><b>Step 1: Bring your spatial data into the tool</b></td></tr></table></div>   
<div id="inputtabs">
	Select a source of spatial data and bring it in to your workspace:
	<ul>
		<li><a href="#tabs-1">CSV</a></li>
		<li><a href="#tabs-2">Google Spreadsheet</a></li>
		<li><a href="#tabs-3">SharePoint List</a></li>
		<li><a href="#tabs-4">SQL Database</a></li>
		<li><a href="#tabs-5">NoSQL or Custom API</a></li>
	</ul>
	<div id="tabs-1">
<div id='inputarea' class='inputarea'>
	 <textarea id="csvarea" rows="5" cols="80">
Name, Latitude, Longitude, Time, Intensity
Flight at Dulles Airport, 38.946922,-77.449480,2012-08-01, 75
Lunch at Dulles Town Center,39.031942,-77.424264,August 3 2012, 100
Spotting on Snickersville Turnpike,38.979029,-77.652110,8/4/2012, 50
Event in Countryside,39.055719,-77.417352,Aug 5 2012, 0
Boat Ramp at Algonkian Park,39.061773,-77.378589,August 6th 2012, 68</textarea>
		<br>
		<button onclick="ingestcsvarea(document.getElementById('csvarea').value)">Input CSV Data</button>
		Delimeter: <input id='csvdelimeter' size=2 type='text' value=','><img src='question.png' height=25 id='csvdelimetertipimg'><br>
		</div>	
	</div>
	<div id="tabs-2">
<?php
if($user){
	$fileslist = $driveservice->files->listFiles();
	foreach($fileslist['items'] as $listedfile){
		if($listedfile['mimeType'] == "application/vnd.google-apps.spreadsheet"){
			$filedocslink = $listedfile['alternateLink'];
			$id = $listedfile['id'];
			$token = $_SESSION['token'];
			$csvdownloadurl = "https://docs.google.com/feeds/download/spreadsheets/Export?key=$id&exportFormat=csv";
			print "<table><tr><td><div><a><img src='googless.png' onclick=\"ingestgooglespreadsheet('$id')\"></a> - <a href='$filedocslink' target='_blank'>Edit</a> - <a href='$csvdownloadurl'>Csv</a> -</div></td><td> <div onclick=\"ingestgooglespreadsheet('$id')\">" . $listedfile['title'] . "</div></td></tr></table>";
		}
	}
}else{
	print "<p>Click <a class='login' href='$authUrl'>here to login</a> to Google and access your private Google Drive spreadsheets from Simple Spatial.</p>";
}
?>
	</div>
	
	<div id="tabs-3">
		<br>
		This functionality is disabled in the public version of Simple Spatial.<br>
		Contact us for more information if having this would help you.<br>
		<br>
	</div>
	<div id="tabs-4">
		<br>
		This functionality is disabled in the public version of Simple Spatial.<br>
		Contact us for more information if having this would help you.<br>
		<br>
	</div>
	<div id="tabs-5">
		<br>
		This functionality is disabled in the public version of Simple Spatial.<br>
		Contact us for more information if having this would help you.<br>
		<br>
	</div>
	
</div>

<br>
<div class='showhide'><table><tr><td><b>Step 2: Identify how you want to use your data</b></td></tr></table></div>
<div id='tableoutput' class='dataarea'>Your data will appear here.</div>

<br>
<div class='showhide'>
	<table><tr>
		<td><input type="checkbox" id='outputcheck' onClick='checkchangeaction()' checked="checked"></td>
		<td><b>Step 3: Choose what type of spatial visualization to create</b></td>
	</tr></table>
</div>


<div id="outputtabs">
	Select a type of visualization by clicking on the tabs.  Configure the options then click the build button.  Your kml/maps will show up as an icon below.
	<ul>
		<li><a href="#tabs-1">Placemarks</a></li>
		<li><a href="#tabs-2">Heatmap</a></li>
		<li><a href="#tabs-4">Number as Altitude</a></li>
		<li><a href="#tabs-5">Time as Altitude</a></li>
		<li><a href="#tabs-6">Track</a></li>
		<li><a href="#tabs-7">Data Terrain</a></li>
	</ul>
	<div id="tabs-1">
		<button id='kmlbuildbutton' onclick='buildKml()'>Build Placemarks KML</button><br>
		<table>
		<tr>
			<td align=center>Placemark Color:</td>
			<td><input type="text" id="pmcolorselect" class="color-picker" size="7" value="#abCdeF" /></td>
			<td><img id='pmcolorquestionimg' src='question.png' height=25></td>
		</tr>
		</table>
		<table>
		<tr>
			<td><b>Note:</b> Identifying a column as Date and or Time will enable timestamp playback in the visualizaiton.</td>	
		</tr>
		</table>
		<div id='pmkmloutput'></div>
	</div>
	
	<div id="tabs-2">
		<button id='kmlhmbuildbutton' onclick='buildHeatmapjs()'>Build Heatmap KMZ</button><br><br>
		<table border=0><tr>
			<td>Radius: </td>
			<td><input id='hmradius' size=2 type='text'  style="border:0; color:#f6931f; font-weight:bold;"></td>
			<td><div id='hmradiusslider' style="width:100px;"></div></td>
			<td><img id='hmradiusquestionimg' src='question.png' height=25></td>
		</tr></table>
		<table border=0><tr>
			<td>Intensity: </td>
			<td><input id='hmweight' size=2 type='text'  style="border:0; color:#f6931f; font-weight:bold;"></td>
			<td><div id='hmweightslider' style="width:100px;"></div></td>
			<td><img id='hmweightquestionimg' src='question.png' height=25></td>
		</tr></table>
		<input id='hmmaxweight' hidden=true size=3 type='text' value='100'>
		<table border=0><tr>
			<td>Timestamp </td>
			<td><table id='heatmaptstable'><tr>
				<td>begin:</td>
				<td><input id='heatmaptsbegin' type='text'></td>
				<td>end:</td><td><input id='heatmaptsend' type='text'></td>
				</tr></table></td>
			<td><img id='hmtsquestionimg' src='question.png' height=25></td>
		</tr></table>
		<br>
		<div id='hmkmloutput'></div>
	</div>
	
	<div id="tabs-4">
		<button id='kmlaibuildbutton' onclick='buildaltintensitykml()'>Build Altitude Intensity KML</button><br><br>
		<table><tr>
			<td align=center>Placemark Color:</td>
			<td><input type="text" id="aipmcolorselect" class="color-picker" size="7" value="#abCdeF" /></td>
			<td><img id='aipmcolorquestionimg' src='question.png' height=25></td>
		</tr></table>
		<table border=0><tr><td>Max Altitude: </td>
			<td><input id='aimaxalt' size=5 type='text'  style="border:0; color:#f6931f; font-weight:bold;"></td>
			<td><div id='aimaxaltslider' style="width:500px;"></div></td>
			<td><img id='aimaxaltquestionimg' src='question.png' height=25></td>
		</tr></table>
		<table>
		<tr>
			<td><b>Note:</b> Identifying a column as Date and or Time will enable timestamp playback in the visualizaiton.</td>	
		</tr>
		</table>
		<br>
		<div id='aikmloutput'></div>
	</div>
	
	<div id="tabs-5">
		<button id='kmltabuildbutton' onclick='buildtimealtkml()'>Build Time as Altitude KML</button><br><br>
		<table><tr>
			<td align=center>Placemark Color:</td>
			<td><input type="text" id="tapmcolorselect" class="color-picker" size="7" value="#abCdeF" /></td>
			<td><img id='tapmcolorquestionimg' src='question.png' height=25></td>
		</tr></table>
		<table border=0><tr><td>Max Altitude: </td>
			<td><input id='tamaxalt' size=5 type='text'  style="border:0; color:#f6931f; font-weight:bold;"></td>
			<td><div id='tamaxaltslider' style="width:500px;"></div></td>
			<td><img id='tamaxaltquestionimg' src='question.png' height=25></td>
		</tr></table>
		<table>
		<tr>
			<td><b>Note:</b> Identifying a column as Date and or Time will enable timestamp playback in the visualizaiton.</td>	
		</tr>
		</table>
		<br>
		<div id='takmloutput'></div>
	</div>
	
	<div id="tabs-6">
		Creates a visualization with the placemarks linked together by lines in the order that they are represented in your spreadsheet or csv.<br> 
		<button id='tkmlbuildbutton' onclick="buildKml('maketrack')">Build Track KML</button><br>
		<table><tr>
			<td align=center>Track and Placemark Color:</td>
			<td><input type="text" id="tpmcolorselect" class="color-picker" size="7" value="#abCdeF" /></td>
			<td><img id='tpmcolorquestionimg' src='question.png' height=25></td>
		</tr></table>
		<table>
		<tr>
			<td><b>Note:</b> Identifying a column as Date and or Time will enable timestamp playback in the visualizaiton.</td>	
		</tr>
		</table>
		<div id='tpmkmloutput'></div>
	</div>
	
	<div id="tabs-7">
		<button id='kmldtbuildbutton' onclick='builddataterrainkml()'>Build Data Terrain KML</button><br><br>
		<table><tr>
			<td align=center>Placemark Color:</td>
			<td><input type="text" id="dtpmcolorselect" class="color-picker" size="7" value="#abCdeF" /></td>
			<td><img id='dtpmcolorquestionimg' src='question.png' height=25></td>
		</tr></table>
		<table border=0><tr><td>Max Altitude: </td>
			<td><input id='dtmaxalt' size=5 type='text'  style="border:0; color:#f6931f; font-weight:bold;"></td>
			<td><div id='dtmaxaltslider' style="width:500px;"></div></td>
			<td><img id='dtmaxaltquestionimg' src='question.png' height=25></td>
		</tr></table>
		<br>
		<div id='dtkmloutput'></div>
	</div>
	
	
	
	<br>
	<div id='StatusWarnErrArea'>
	</div>	
		
</div>



<div id="heatmapArea"></div>





</div>

</div>


<div class="questiondialog" id="csvdelimetertipdialog" title="CSV Deimeters">
	<p>A delimiter is a sequence of one or more characters used to specify the boundary between separate, independent regions in plain text.</p><p>An example of a delimiter is the comma character, which often acts as a field delimiter in a sequence of comma-separated values.</p><p>Selecting a delimeter character is often an option in your spreadsheet application when you save as a .csv file.</p>
</div>
<div class="questiondialog" id="hmradiusquestiondialog" title="Heatmap Radius">
	<p>The heatmap radius number controls how much area each point will cover on the heatmap.</p>
</div>
<div class="questiondialog" id="hmweightquestiondialog" title="Heatmap Intensity">
	<p>The heatmap intensity controls how much intensity each point will produce on the heatmap.</p><p>If this is higher each point will contribute more to making that area of the heatmap darker.</p>
</div>
<div class="questiondialog" id="hmtsquestiondialog" title="Heatmap Time Stamp">
	<p>Timestamping allows you to use the time slider functionality in Google Earth.</p><p>Your heatmap will only be visible if the timeslider falls within this time frame.</p><p>Split your data into parts, build the heatmaps with adjacent timestamps, and bring them all into Google Earth at the same time to create a time series heatmap wich shows change over time.</p><p>Note: If these are empty they will be ignored.</p>
</div>
<div class="questiondialog" id="pmcolorquestiondialog" title="Placemark Color">
	<p>The placemarks on the map will be the color shown here.</p><p>Click on the color box to select a color.</p>
</div>
<div class="questiondialog" id="aipmcolorquestiondialog" title="Altitude Intensity Placemark Color">
	<p>The placemarks shown above the map will be the color shown here.</p><p>Click on the color box to select a color.</p>
</div>
<div class="questiondialog" id="maxaltquestiondialog" title="Max Altitude">
	<p>The data you choose to represent in the visualization as altitude will be normalized (linear map) from zero to the max altitude you choose.</p><p>This provides a simple way for you to choose how your visualization will look without modifying your data.</p>
</div>


<div class="questiondialog" id="tapmcolorquestiondialog" title="Time as Altitude Placemark Color">
	<p>The placemarks shown above the map will be the color shown here.</p><p>Click on the color box to select a color.</p>
</div>
<div class="questiondialog" id="tpmcolorquestiondialog" title="Track Placemark Color">
	<p>The placemarks on the map along tracks will be the color shown here.</p><p>Click on the color box to select a color.</p>
</div>
<div class="questiondialog" id="headerquestiondialog" title="Header Row">
	<p>This header comes from the first row of your csv file or spreadsheet.</p><p>This text in this row will be used as a label for the values when they are presented in a visualization (such as a placemark balloon).</p>
</div>

</body>
</html>
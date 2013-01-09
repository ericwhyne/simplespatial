<?php
$data = substr($_POST['imageData'], strpos($_POST['imageData'], ",") + 1);
$decodedImageData = base64_decode($data);

$randomnumber = rand(100000, 999999); //we derive all filenames off of this

$imagefilename = "kmlfiles/" . $randomnumber . ".png";
$kmzimghref = "images/" . $randomnumber . ".png";
$fp = fopen($imagefilename, 'wb');
fwrite($fp, $decodedImageData);
fclose();

$north = $_POST['heatmaplatlonbox']['north'];
$south = $_POST['heatmaplatlonbox']['south'];
$east = $_POST['heatmaplatlonbox']['east'];
$west = $_POST['heatmaplatlonbox']['west'];

$tsbegin = $_POST['heatmaptsbegin'];
$tsend = $_POST['heatmaptsend'];

//print "n $north s $south e $east w $west";

$pname = 'placemark name';
$description = 'an overlay';

    $dom = new DOMDocument('1.0', 'UTF-8'); 

    // Creates the root KML element and appends it to the root document.
    $node = $dom->createElementNS('http://earth.google.com/kml/2.1', 'kml');
    $parNode = $dom->appendChild($node);
    // Creates a KML Document element and append it to the KML element.
    $dnode = $dom->createElement('Document');
    $docNode = $parNode->appendChild($dnode);

				
    $groundoverlayNode = $docNode->appendChild($dom->createElement('GroundOverlay'));
	$groundoverlayNode->appendChild($dom->createElement('name', $pname));
	$groundoverlayNode->appendChild($dom->createElement('description', $description));
	
	
	if($tsbegin && $tsend){
		$timespanNode = $groundoverlayNode->appendChild($dom->createElement('TimeSpan'));
		$timespanNode->appendChild($dom->createElement('begin', $tsbegin));
		$timespanNode->appendChild($dom->createElement('end', $tsend));
	}
	
	
	$iconNode = $groundoverlayNode->appendChild($dom->createElement('Icon'));
	$iconNode->appendChild($dom->createElement('href', $kmzimghref));
	$iconNode->appendChild($dom->createElement('viewBoundScale', '1'));
	$latlonboxNode = $groundoverlayNode->appendChild($dom->createElement('LatLonBox'));
	$latlonboxNode->appendChild($dom->createElement('north', $north));
	$latlonboxNode->appendChild($dom->createElement('south', $south));
	$latlonboxNode->appendChild($dom->createElement('east', $east));
	$latlonboxNode->appendChild($dom->createElement('west', $west));
			         
    $kmlOutput = $dom->saveXML();
    //header('Content-type: application/vnd.google-earth.kml+xml');
    //echo $kmlOutput;
	
	$kmlfilename = "kmlfiles/" . $randomnumber . ".kml";
	$fh = fopen($kmlfilename, 'w') or die("can't open file");
	fwrite($fh, $kmlOutput);
	fclose($fh);
	
	$kmzfilename = "kmlfiles/" . $randomnumber . ".kmz";

// use this for error catching later: if(file_exists($file)) {}
$zip = new ZipArchive();
$zip->open($kmzfilename,ZIPARCHIVE::OVERWRITE);
$zip->addFile($imagefilename,$kmzimghref);
$zip->addFile($kmlfilename,'data.kml');
$zip->close();

print $kmzfilename;



?>







<?php
	if($_SERVER['REQUEST_METHOD'] == 'POST'){
		$stylecolor = $_POST['color']; // kml ready color and opacity hex value
		$placemarks = $_POST['placemarks']; // json object deconstructed below
		$maketrack = $_POST['maketrack']; // True or null
		$linestylewidth = 3;
		
	    $dom = new DOMDocument('1.0', 'UTF-8'); 
		$parNode = $dom->appendChild($dom->createElementNS('http://earth.google.com/kml/2.1', 'kml'));
		$kmlDocument = $parNode->appendChild($dom->createElement('Document'));
		$dom->formatOutput = true;//TODO Remove this line in production or suffer the consequences!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 
	    
	    $kmlStyle = $dom->createElement('Style');
	        $kmlStyle->setAttribute('id', 'simplespatialpmstyle');
	        $rpIconstyleNode = $dom->createElement('IconStyle');
				if($stylecolor){
		                $rpIconstyleNode->appendChild($dom->createElement('color', $stylecolor));
				}// $rpIconstyleNode->setAttribute('id', 'simplespatialpmstyle');
		        $rpIconNode = $dom->createElement('Icon');
			        $rpHref = $dom->createElement('href', 'http://maps.google.com/mapfiles/kml/paddle/wht-blank.png');
			        $rpIconNode->appendChild($rpHref);
		        $rpIconstyleNode->appendChild($rpIconNode);
	        $kmlStyle->appendChild($rpIconstyleNode);
			if($maketrack){
			$rpLinestyleNode = $dom->createElement('LineStyle');
				if($stylecolor){
		                $rpLinestyleNode->appendChild($dom->createElement('width', $linestylewidth));
				}
				$rpLinestyleNode->appendChild($dom->createElement('color', $stylecolor));
	        $kmlStyle->appendChild($rpLinestyleNode);	
			}
        $kmlDocument->appendChild($kmlStyle);
		
		for($id=0; $id < count($placemarks); $id++) {
			$pname = $placemarks[$id]['pname']; 
			$ddlat = $placemarks[$id]['ddlat'];
			$ddlon = $placemarks[$id]['ddlon'];
			$timestamp = $placemarks[$id]['timestamp'];
			$altintensity = $placemarks[$id]['altintensity'];
			$description = $placemarks[$id]['description'];
            $iconPlacemark = $dom->createElement('Placemark');
	            $iconPlacemark->setAttribute('id', 'iconplacemark' . $id);
	            $iconPlacemark->appendChild($dom->createElement('name', $pname));
	            $iconPlacemark->appendChild($dom->createElement('description', $description));
	            $iconPlacemark->appendChild($dom->createElement('styleUrl', '#simplespatialpmstyle'));
	            $pointNode = $dom->createElement('Point');
					if($timestamp){
						//<TimeStamp><when>2012-01-15T21:05:02Z</when></TimeStamp>
						$TimeStampNode = $dom->createElement('TimeStamp');
		                $iconPlacemark->appendChild($TimeStampNode);
						$whenNode = $dom->createElement('when', $timestamp);
		                $TimeStampNode->appendChild($whenNode);
		            }
					if($altintensity){
						// Creates a coordinates element with altitude
		                $coorStr = $ddlon . ','  . $ddlat . ','  . $altintensity;
		                $pointNode->appendChild($dom->createElement('coordinates', $coorStr));	
		            	$pointNode->appendChild($dom->createElement('altitudeMode', 'relativeToGround'));
						$pointNode->appendChild($dom->createElement('extrude', '1'));	
		
					}else{
		                // Creates a coordinates element and gives it the value of the lng and lat columns from the results.
		                $coorStr = $ddlon . ','  . $ddlat;
		                $coorNode = $dom->createElement('coordinates', $coorStr);
		                $pointNode->appendChild($coorNode);							
					}
					
				$iconPlacemark->appendChild($pointNode);
			$kmlDocument->appendChild($iconPlacemark);
			if($maketrack && $id < count($placemarks) - 1){
				// connect the points with a line
            	$linePlacemark = $dom->createElement('Placemark');
            		$linePlacemark->setAttribute('id', 'lineplacemark' . $id);
					$linePlacemark->appendChild($dom->createElement('name', "Track line " . $id));
					$linePlacemark->appendChild($dom->createElement('styleUrl', '#simplespatialpmstyle'));
					$lineNode = $dom->createElement('LineString');
						$lineNode->appendChild($dom->createElement('tesselate', '1'));
						$lineCoorStr = $placemarks[$id]['ddlon'] . ','  . $placemarks[$id]['ddlat'] . ',0 '  . $placemarks[$id + 1]['ddlon'] . ','  . $placemarks[$id + 1]['ddlat'] . ',0';
		                $lineNode->appendChild($dom->createElement('coordinates', $lineCoorStr));
						$linetimestamp = $placemarks[$id + 1]['timestamp'];
						if($linetimestamp){
							$TimeStampNode = $dom->createElement('TimeStamp');
			                	$TimeStampNode->appendChild($dom->createElement('when', $linetimestamp));
							$linePlacemark->appendChild($TimeStampNode);
		            	}	
					$linePlacemark->appendChild($lineNode);
				$kmlDocument->appendChild($linePlacemark);
			}				
	    }       
	    $kmlOutput = $dom->saveXML();
		
		$randomnumber = rand(100000, 999999);
		$kmlfilename = "kmlfiles/" . $randomnumber . ".kml";
		$fh = fopen($kmlfilename, 'w') or die("can't open file");
		fwrite($fh, $kmlOutput);
		fclose($fh);
		print $kmlfilename;
	}   
?>
<?php
	if($_SERVER['REQUEST_METHOD'] == 'POST'){
		$stylecolor = $_POST['color']; // kml ready color and opacity hex value
		$placemarks = $_POST['placemarks']; // json object deconstructed below
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
				}
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
            
            //Build a Placemark
            $iconPlacemark = $dom->createElement('Placemark');
	            $iconPlacemark->setAttribute('id', 'iconplacemark' . $id);
	            $iconPlacemark->appendChild($dom->createElement('name', $pname));
	            $iconPlacemark->appendChild($dom->createElement('description', $description));
	            $iconPlacemark->appendChild($dom->createElement('styleUrl', '#simplespatialpmstyle'));
	            $pointNode = $dom->createElement('Point');
		                $coorStr = $ddlon . ','  . $ddlat . ','  . $altintensity;
		                $pointNode->appendChild($dom->createElement('coordinates', $coorStr));	
		            	$pointNode->appendChild($dom->createElement('altitudeMode', 'relativeToGround'));
						$pointNode->appendChild($dom->createElement('extrude', '1'));	
				$iconPlacemark->appendChild($pointNode);
			$kmlDocument->appendChild($iconPlacemark);
			
			//Build a Polygon
			$polyPlacemark = $dom->createElement('Placemark');
	            $polyPlacemark->setAttribute('id', 'iconplacemark' . $id);
	            $polyPlacemark->appendChild($dom->createElement('name', $pname));
	            $polyPlacemark->appendChild($dom->createElement('styleUrl', '#simplespatialpmstyle'));
	            $polyNode = $dom->createElement('Polygon');
		                $polyNode->appendChild($dom->createElement('tesselate', '1'));
						$polyNode->appendChild($dom->createElement('altitudeMode', 'relativeToGround'));
						$polyNode->appendChild($dom->createElement('extrude', '1'));
						$outerBoundary = $dom->createElement('outerBoundaryIs');
							$LinearRing = $dom->createElement('LinearRing');
		                		//$coorStr = "-77.53431712686353,39.05948236555584,1000 -77.54953017879123,39.04032733009515,1000 -77.52101707777027,39.04107243530098,1000 -77.53431712686353,39.05948236555584,1000";
								$r = .01;
								$ax = $ddlon + $r;
								$ay = $ddlat + $r;
								$dx = $ddlon - $r;
								$dy = $ddlat - $r;
								$coorStr = 	$ax . ','  . $ay . ','  . $altintensity . ' ' . $ax . ','  . $dy . ','  . $altintensity . ' ' . $dx . ','  . $dy . ','  . $altintensity . ' ' . $dx . ','  . $ay . ','  . $altintensity . ' ' . $ax . ','  . $ay . ','  . $altintensity;
								
		                		$LinearRing->appendChild($dom->createElement('coordinates', $coorStr));													
							$outerBoundary->appendChild($LinearRing);						
						$polyNode->appendChild($outerBoundary);	
				$polyPlacemark->appendChild($polyNode);
			$kmlDocument->appendChild($polyPlacemark);				
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
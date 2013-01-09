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

if (isset($_GET['code'])) {
  $client->authenticate();
  $_SESSION['token'] = $client->getAccessToken();
  $redirect = 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['PHP_SELF'];
  header('Location: ' . filter_var($redirect, FILTER_SANITIZE_URL));
}
if (isset($_SESSION['token'])) {
 $client->setAccessToken($_SESSION['token']);
}
if (isset($_REQUEST['logout'])) {
  unset($_SESSION['token']);
  $client->revokeToken();
}
if ($client->getAccessToken()) {
  $user = $oauth2->userinfo->get();
  $useremail = filter_var($user['email'], FILTER_SANITIZE_EMAIL);
  $userimg = filter_var($user['picture'], FILTER_VALIDATE_URL);
  if($userimg){
  	$userimgMarkup = "<img src='$userimg?sz=50'>";
  }
  // The access token may have been updated lazily.
  $_SESSION['token'] = $client->getAccessToken();
  

//	print "<pre>";
//	print_r($fileslist);
//	print "</pre>";
} else {
  $authUrl = $client->createAuthUrl();
}
?>
<!doctype html>

<?php
if (isset($_SESSION['token'])) {
	print "<script> var accesstoken = "; print_r($_SESSION['token']); print "; console.log(accesstoken); </script>";
}
?>


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
<script type="text/javascript" src="depend/jquerycolors.js"></script>
<link rel="stylesheet" href="iphone-checkboxes.css" type="text/css" media="screen" />
<link rel="stylesheet" href="jquery-ui-eb.css" type="text/css">
<link rel="stylesheet" href="jquerycolors.css" type="text/css">


<div id='header'>
	<table<tr><td>
	<div id='logotext'>Simple Spatial</div><div id='versiontext'>version: public beta 20</div>
	</td><td>
	<div class='userinfo'>
		<table><tr>
			<td class='userinfo'><?php if(isset($useremail)){ print $useremail; } ?></td>
			<td><?php if(isset($userimgMarkup)){ print $userimgMarkup; } ?></td>
		</tr></table>
	</div>
	</td></tr></table>
</div>


















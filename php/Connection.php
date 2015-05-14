<?php
//
// FILE       : Connection.php
// PROJECT    : ClimateView
// PROGRAMMER : Ben Lorantfy, Grigory Kozyrev, Kevin Li, Michael Dasilva
// DATE       : April 19, 2015
//

//
// NAME    : Connection
// PURPOSE : The connection class acts as a wrapper for the mysqli connection logic
//           The main purpose of this file is to allow developers with different
//           mysql credentials and database names to only require editing this file
//           in order to use their databse setup
//
//           Alternativly, it also allows us to use .gitignore to ignore this 
//           file so it doesn't have to be changed, and so that the live version's
//           credentials don't get changed when deployhq runs on github hook
//
class Connection{
	static public function connect(){
		$db = new mysqli('localhost', 'root', 'root', 'climateview');
		if($db->connect_errno > 0){
			throw new Exception("Connect failed: " . $db->connect_error);
		}
		return $db;
	}
}
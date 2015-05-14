<?php
//
// FILE       : Connection.php
// PROJECT    : ClimateView
// PROGRAMMER : Ben Lorantfy, Grigory Kozyrev, Kevin Li, Michael Dasilva
// DATE       : April 19, 2015
//

//
// NAME    : Data
// PURPOSE : Acts as a wrapper class for database operations.  Allows for the DBMS or schema to be
//			 changed and only affect this single file.
//
class Data{
	private $db;

	public function __construct()
	{
		$this->db = Connection::connect();
	}	
		
	//
	// FUNCTION    : generateData
	// DESCRIPTION : Returns an array of user data given and id, series, and state code
	// PARAMETERS  : $user_id - the id of the user data belongs to
	//             : $series - the series to return
	//             : $stateCode - the state to filter by
	// RETURNS     : array : the user information
	//
	private function generateData($user_id, $series, $stateCode){
		if ($series == "")
		{
			return;
		}
		
		$sql = 'SELECT statecode, yearmonth,';	
		switch($series)
		{
			case "precipitation":
				$sql .= 'PCP';
				break;
			case "days":
				$sql .= 'CDD,HDD';
				break;
			case "temperature":
				$sql .= 'TMIN,TMAX,TAVG';
				break;
		}
		$sql .= ' FROM user' . $user_id . 'data';
		
		if ($stateCode != "")
		{
			$sql .= ' where statecode = ' . $stateCode;
		}
		
		$sql .= ' ORDER BY yearmonth';
		
		$query = $this->db->prepare($sql);
		
		if(!$query) throw new Exception($this->db->error);
		if(!$query->execute()) throw new Exception($this->db->error);
		if(!$query->store_result()) throw new Exception($this->db->error);

		$data = array();
		if($query->num_rows >= 1){
			switch($series)
			{
				case "precipitation":
					if($query->bind_result($stateCode, $yearMonth, $PCP)){
					$success = true;
						while($query->fetch()){
							array_push($data, array(
								 "STATECODE" => $stateCode
								,"YEARMONTH" => $yearMonth
								,"PCP" => $PCP
							));
						}								
					}
					break;
				case "days":
					if($query->bind_result($stateCode, $yearMonth, $CDD, $HDD)){
					$success = true;
						while($query->fetch()){
							array_push($data, array(
								 "STATECODE" => $stateCode
								,"YEARMONTH" => $yearMonth
								,"CDD" => $CDD
								,"HDD" => $HDD
							));
						}								
					}				
					break;
				case "temperature":
					if($query->bind_result($stateCode, $yearMonth, $TMIN, $TMAX, $TAVG)){
					$success = true;
						while($query->fetch()){
							array_push($data, array(
								 "STATECODE" => $stateCode
								,"YEARMONTH" => $yearMonth
								,"TMIN" => $TMIN
								,"TMAX" => $TMAX
								,"TAVG" => $TAVG
							));
						}								
					}				

					break;
			}
		}
	
		return $data;
	}

	//
	// FUNCTION    : getUserData
	// DESCRIPTION : Handles request to get user data
	// PARAMETERS  : $request - request object containing user_id, series, and state
	// RETURNS     : array : the user information
	//	
	public function getUserData($request){
		$user_id = $_SESSION["id"];
		$series = $request->series;
		$state = $request->state;

		// Automatically converted to JSON by Route
		return $this->generateData($user_id, $series, $state);
	}

	//
	// FUNCTION    : createTable
	// DESCRIPTION : Creates user table
	// PARAMETERS  : $tblName - name of table, should be UserXTable where X is user id
	// RETURNS     : none
	//		
	private function createTable($tblName){
		$query = $this->db->prepare("CALL createUserTable(?)");
		if(!$query) throw new Exception("prepare:" . $this->db->error);
		if(!$query->bind_param("s",$tblName)) throw new Exception("bind:" . $this->db->error);
		if(!$query->execute()) throw new Exception("execute:" . $this->db->error);
		if(!$query->store_result()) throw new Exception("store:" . $this->db->error);		
	}

	//
	// FUNCTION    : uploadUserData
	// DESCRIPTION : Handles a request to upload user data
	// PARAMETERS  : $request - request object
	// RETURNS     : none
	//	
	public function uploadUserData($request){
		$valid = true;
		
		//
		// Get path of uploaded file
		// This path is only temporary, but since we're not storing the actual csv file, we don't have to worry about
		//
		$csvPath = $_FILES["dataUploadInput"]["tmp_name"];
		$currentTime = date("Y-m-d H:i:s");
		
		//
		// Create unique user table
		//
		$tblName = "User" . $_SESSION["id"] . "Data";
		
		//
		// Create user table
		//
		$this->createTable($tblName);
		
		//
		// Open csv file
		// 
		$csv = fopen($csvPath,"r");
		
		//
		// Iterate over each line in csv file
		//
		while($row = fgetcsv($csv)){
			// Skip row if table header
			if(!ctype_alpha($row[0])){
			
				//
				// Extract required information from csv
				//
				$stateCode = trim($row[0]);
				$yearMonth = trim($row[2]);
				$pcp = trim($row[3]);
				$cdd = trim($row[9]);
				$hdd = trim($row[10]);
				$tmin = trim($row[18]);
				$tmax = trim($row[19]);
				$tavg = trim($row[4]);
				
				$query = $this->db->prepare("CALL transformProc(?,?,?,?,?,?,?,?,?)");
				if(!$query) throw new Exception("prepare:" . $this->db->error);
				if(!$query->bind_param("siidddddd",$tblName,$stateCode,$yearMonth,$pcp,$cdd,$hdd,$tmin,$tmax,$tavg)) throw new Exception("bind:" . $this->db->error);
				if(!$query->execute()) throw new Exception("execute:" . $this->db->error);
				if(!$query->store_result()) throw new Exception("store:" . $this->db->error);
			}
		}
		
		$endTime = date("Y-m-d H:i:s");
		
		$query = $this->db->prepare("SELECT MIN(YearMonth) FROM " . $tblName);
		if(!$query) throw new Exception("prepare:" . $this->db->error);
		if(!$query->execute()) throw new Exception("execute:" . $this->db->error);
		if(!$query->store_result()) throw new Exception("store:" . $this->db->error);
		if(!$query->bind_result($minYear)) throw new Exception($this->db->error);
		$query->fetch();

		$query = $this->db->prepare("SELECT MAX(YearMonth) FROM " . $tblName);
		if(!$query) throw new Exception("prepare:" . $this->db->error);
		if(!$query->execute()) throw new Exception("execute:" . $this->db->error);
		if(!$query->store_result()) throw new Exception("store:" . $this->db->error);
		if(!$query->bind_result($maxYear)) throw new Exception($this->db->error);
		$query->fetch();
		
		$query = $this->db->prepare("INSERT INTO log VALUES (?,?,?,?,?)");
		if(!$query) throw new Exception("prepare:" . $this->db->error);
		if(!$query->bind_param("issss",$_SESSION["id"], $currentTime, $endTime, $minYear, $maxYear));
		if(!$query->execute()) throw new Exception("execute:" . $this->db->error);
	
		return $valid;
	}

	//
	// FUNCTION    : getRegions
	// DESCRIPTION : Gets region names and codes
	// PARAMETERS  : none
	// RETURNS     : array of state codes and names
	//	
	public function getRegions(){
		$regions = array();
		$result = $this->db->query("SELECT * FROM State");

		while($row = $result->fetch_assoc()){
		    array_push($regions, array("code" => $row["StateCode"],"name" => $row["Name"]));
		}
		
		return $regions;
	}
}


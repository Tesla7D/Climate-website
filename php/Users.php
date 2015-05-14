<?php
//
// FILE       : Users.php
// PROJECT    : ClimateView
// PROGRAMMER : Ben Lorantfy, Grigory Kozyrev, Kevin Li, Michael Dasilva
// DATE       : April 19, 2015
//

//
// NAME    : Users
// PURPOSE : Provides functionality to manage users
//
class Users{
	private $db;
	public function __construct(){
		$this->db = Connection::connect();
	}
	
	//
	// FUNCTION    : randomString
	// DESCRIPTION : Gets a random string for random username generation
	// PARAMETERS  : $length - the length of the string to generate
	// RETURNS     : the random string
	//
	public function randomString($length){
		$str = "";
		for($i = 0; $i < $length; $i++){
			$char1 = chr(rand(48,90));
			$char2 = chr(rand(97,122));
			$which = rand(0,1);
			if($which == 0){
				$str .= $char1;
			}else{
				$str .= $char2;
			}
		}
		return $str;
	}
	
	//
	// FUNCTION    : login
	// DESCRIPTION : Handles a request to login
	// PARAMETERS  : $request - the request object containing username and password
	// RETURNS     : bool : wether login succeeded or not
	//
	public function login($request){
		$success = false;
		
		//
		// Get credentials from request
		//
		$username = $request->username;
		$password = $request->password;
		
		//
		// Check database for user
		//
		$query = $this->db->prepare("SELECT UserID,password FROM User WHERE Username = ? LIMIT 1");
		if(!$query) throw new Exception($this->db->error);
		if(!$query->bind_param("s",$username)) throw new Exception($this->db->error);
		if(!$query->execute()) throw new Exception($this->db->error);
		if(!$query->store_result()) throw new Exception($this->db->error);
		
		if($query->num_rows == 1){
			if(!$query->bind_result($id,$hashedPassword)) throw new Exception($this->db->error);
			
			//
			// Check if the provided password matches the db password
			//
			$query->fetch();
			if(password_verify($password,$hashedPassword)){
				$_SESSION["id"] 	  = $id;
				$_SESSION["username"] = $username;
				$_SESSION["password"] = $password;
				$success = true;
			}
		}	
		
		return $success;	
	}

	//
	// FUNCTION    : requestAccount
	// DESCRIPTION : Handles a request to create an account
	// PARAMETERS  : $request - the request object containing user info
	// RETURNS     : bool : wether or not the request succeedded
	//	
	public function requestAccount($request){
		$email = $request->email;
		$organization = $request->organization;
		$firstName = $request->firstName;
		$lastName = $request->lastName;
		
		$username = $this->randomString(10);
		$password = $this->randomString(10);
		
		
		$query = $this->db->query("SELECT * FROM User WHERE Username = '" . $username . "'");
		while($query->num_rows > 0){
			$username = $this->randomString(10);
			$password = $this->randomString(10);	
			$query = $this->db->query("SELECT * FROM User WHERE Username = '" . $username . "'");		
		}
		
		$insert = $this->db->query("INSERT INTO User (Username,Password) VALUES ('" . $username . "','" . password_hash($password,PASSWORD_DEFAULT) . "')");
		
		mail($email, "Account Approved", "Dear " . $firstName . " " . $lastName . "\nWe have revieved your application and verified your association with this reputable organization.  Your account has been approved.  You can find your login details below which can be changed once your login.\n\nUsername:" . $username . "\nPassword:" . $password . "\n\nWe hope you find the service useful.\n\nSincerly,\nClimateView");
		
		return true;
	}
}
<?php
//
// FILE       : Router.php
// PROJECT    : ClimateView
// PROGRAMMER : Ben Lorantfy, Grigory Kozyrev, Kevin Li, Michael Dasilva
// DATE       : April 19, 2015
//

//
// NAME    : Router
// PURPOSE : Routes a URL to functionality
//
class Router{
	static private $matched = false;
	
	static private function match($str,$pattern,$request){
		$match = false;
		if($pattern != "*"){
			trim($pattern, "/");
			trim($pattern,"/");
			$strParts = explode("/",$str);
			$patternParts = explode("/",$pattern);
			$numStrParts = count($strParts);
			$numPatternParts = count($patternParts);
			$parameters = array();
			
			$match = true;
			if($numStrParts == $numPatternParts){
				for($i = 0; $i < $numPatternParts; $i++){
					$isPlaceholder = preg_match('/^{.*?}$/', $patternParts[$i]) == 1;
					if(!$isPlaceholder){
						if($patternParts[$i] != $strParts[$i]){
							$match = false;
							break;
						}
					}else{
						$placeholderName = str_replace(array("{","}"), "", $patternParts[$i]);
						$request->$placeholderName = $strParts[$i];
					}
				}
			}else{
				$match = false;
			}		
		}else{
			$match = true;
		}
		return $match;
	}
	
	//
	//	The following code snippet placed in the .htaccess file will
	// 	redirect all requests to index.php. From there you can include 
	//	this file and setup routes. Routing will test if a request URL string
	//	matches a route and call the provided function. This essentially maps
	// 	a url to a function or page
	// 
	//		RewriteEngine on
	//		RewriteCond %{REQUEST_FILENAME} !-f
	//		RewriteCond %{REQUEST_FILENAME} !-d
	//		RewriteRule ^([^?]*)$ /index.php [NC,L,QSA]
	//
	static private function route($type="",$matchURI = "*",$callback = null){
		$match = false;
		$request = (object) array();
		$other = !Router::$matched && $type == "OTHER";
		$upload = $_SERVER['REQUEST_METHOD'] == "POST" && $type == "UPLOAD";
		
		if($other || $upload || $type == $_SERVER['REQUEST_METHOD']){
			if(!$other){
				$match = Router::match($_SERVER["REQUEST_URI"],$matchURI,$request);
			}

			if($other || $match){
				Router::$matched = true;
				//
				// Gets json request payload from php://input
				//
				if($upload){
					$content = $callback($request);
				}else{
					$payload = json_decode(file_get_contents("php://input"));

					//
					// Merges URL request information and payload request information
					//
					if(!empty($payload)){
						$request = (object)array_merge((array)$request, (array)$payload);
					}
				}
				
				
				if(is_callable($callback)){
					$content = $callback($request);
					if(isset($content)){
						echo json_encode($content);
					}
				}else if(is_string($callback) && !empty($callback)){
					// create a new scope
					call_user_func(function() use($request,$callback){
						require($callback);
					});
				}					
				

			}			
		}
	}
	
	static public function upload($matchURI = "*",$callback = null){
		Router::route("UPLOAD",$matchURI,$callback);
	}

	static public function page($matchURI = "*", $callback = null){
		Router::route("GET",$matchURI,$callback);
	}
	
	static public function func($matchURI = "*", $callback = null){
		Router::route("POST",$matchURI, $callback);
	}
	
	static public function proc($matchURI = "*", $callback = null){
		Router::route("POST",$matchURI, $callback);
	}
	
	static public function other($callback = null){
		Router::route("OTHER","*", $callback);
	}
}
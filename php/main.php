<?php
//
// Start Session
// =============
// Tells php to start sessions
// Since HTTP is stateless, php sessions are used to identify users with a session token
// This allows users to be identified across requests
//
session_start();

//
// Autoloading
// ===========
// spl_autoload_register calls the passed callback right before an unknown class is used
// Callback includes the class file so it can be used
// Included class defintioins get declared globally, even if they are included within a function
// The namespace tree of the class is converted to a file path
// Class name should have same name as file
// Directory path to class file should follow class's namespace tree
//
spl_autoload_register(function($class){
	require_once "php/" . str_replace("\\", "/", $class) . ".php";
});

//
// Routing
// =======
// Maps a request URI to a function or page
// Curly brackets indicate a placeholder
//
Router::page("/","home.phtml");
Router::page("/requestAccount","home.phtml");				 
Router::page("/chart","home.phtml");				  

Router::func("/getUserData",array(new Data(),"getUserData"));
Router::func("/requestAccount",array(new Users(),"requestAccount"));
Router::func("/login",array(new Users(),"login"));

Router::upload("/upload",array(new Data(),"uploadUserData"));

Router::other(function(){
	echo "Page not found";
});

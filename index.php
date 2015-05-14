<?php
//
// FILE       : index.php
// PROJECT    : EMS
// PROGRAMMER : Ben Lorantfy, Grigory Kozyrev, Kevin Li, Michael Dasilva
// DATE       : April 19, 2015
//

//
// Index.php doesn't do any work
// .htaccess redirects all traffic here, and then
// main is included 
// main can either do some work, or generate
// a page's html
// 
// If php stops working, this prevents users from
// being able to see php code
//
include("php/main.php");
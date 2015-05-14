//
// FILE       : App.js
// PROJECT    : ClimateView
// PROGRAMMER : Ben Lorantfy, Grigory Kozyrev, Kevin Li, Michael Dasilva
// DATE       : April 19, 2015
//
var App = {
	start:function(){
		//
		// Initilize $.msgBox
		//
		$.msgBox.init();
		
		//
		// Configure $.ajax, $.post, etc. to use json
		//
		$.ajaxSetup({
			dataType: "json"
		});

		var loginBox = new App.LoginBox();
		var dataBox = new App.DataBox();
		
		var path = window.location.pathname;
		switch(path){
			case "":
				loginBox.showLogin();
				break;
			case "/":
				loginBox.showLogin();
				break;
			case "/requestAccount":
				loginBox.showRequestAccount();
				break;
			case "/chart":
				dataBox.showChart(false);
				loginBox.hide();
				break;	
		}
		
		loginBox.onLogin(function(){
			loginBox.hide(true);
			dataBox.showChart(true);
			window.history.pushState("chart","chart","/chart");
		})
		
		window.onpopstate = function(){
			window.location.reload();
		}
	}
};
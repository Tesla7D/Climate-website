//
// FILE       : loginBox.js
// PROJECT    : ClimateView
// PROGRAMMER : Ben Lorantfy, Grigory Kozyrev, Kevin Li, Michael Dasilva
// DATE       : April 19, 2015
//
App.LoginBox = function(){
	//
	// Create custom events
	//
	var onLogin = $.customEvent();
	this.onLogin = onLogin;

	//
	// Toggle request account and login
	//
	$("#request").click(function(){
		if($("#request").text() == "Back"){
			// Set button text to request
			$("#loginAndRequestButton").val("Login");
	
			// Animate login fields up
			$("#requestContainer").animate({ top:"100%" },900,"easeOutQuart");
			$("#loginSubcontainer").animate({ top:"0%" },900,"easeOutQuart");
			$("#placeholder").animate({ height: $("#loginSubcontainer").height() },900,"easeOutQuart");
			
			$("#request").text("Request Account");		
			
			window.history.pushState("","","/");
		}else{
			// Set button text to request
			$("#loginAndRequestButton").val("Request");
	
			// Animate login fields up
			$("#loginSubcontainer").animate({ top:"-100%" },900,"easeOutQuart");
			$("#requestContainer").animate({ top:"0%" },900,"easeOutQuart");
			$("#placeholder").animate({ height: $("#requestContainer").height() },900,"easeOutQuart");
			$("#request").text("Back");	
			
			window.history.pushState("requestAccount","requestAccount","/requestAccount");
		}
	});
	
	//
	// On enter, login
	//
	$("#loginSubcontainer input").keyup(function(e){
		if(e.keyCode == 13){
			attempLogin();
		}
	});

	function attempLogin(){
		var username = $("#username").val() || "";
		var password = $("#password").val() || "";
		
	    var credentials = JSON.stringify({
		     username:username
		    ,password:password
	    });
	    
	    var request = $.post("/login",credentials);
	    
	    request.done(function(valid){
	    	if(valid){
	    		onLogin.trigger();
	    	}else{
		    	$.msgBox.error("Invalid credentials");
	    	}
	    });
	    
	    request.fail(function(){
	    	$.msgBox.error("An error occurred while trying to log in");
	    });	
	}
		
	//
	// Submit account request
	//
	$("#loginAndRequestButton").click(function(){
	
		//
		// Make sure user clicked login
		//
		if($("#loginAndRequestButton").val() == "Request"){
			var email = $("#email").val() || "";
			var firstName = $("#firstName").val() || "";
			var lastName = $("#lastName").val() || "";
			var organization = $("#organization").val() || "";
			
		    var info = JSON.stringify({
			     email:email
			    ,firstName:firstName
			    ,lastName:lastName
			    ,organization:organization
		    });
		    
		    var request = $.post("/requestAccount",info);
		    
		    request.done(function(data){
		    	$.msgBox.success("Your request has been sent");
		    });
		    
		    request.fail(function(){
		    	$.msgBox.error("Failed to send request");
		    });	
		}
	});

	//
	// Attempt login
	//
	$("#loginAndRequestButton").click(function(){
		
		//
		// Make sure user clicked request account
		//
		if($("#loginAndRequestButton").val() == "Login"){
			attempLogin();
		}
	});
		
	//
	// Adjust layout
	//
	$("#placeholder").height($("#loginSubcontainer").height());

	//
	// Show login box
	//
	this.showLogin = function(animate){
		if(animate){
			$("#title").delay(1000).animate({ opacity: 1 },1000,"easeOutQuart",function(){
				setTimeout(function(){
					$({ progress:0 }).stop().animate({ progress: 1 },{
						 duration:3000
						,easing:"easeOutQuart"
						,step:function(progress){
							$("#pageContainer").css("background-color","rgba(0,0,0," + progress*0.15 + ")");
							$("#pageContainer").css("border","1px solid rgba(0,0,0," + progress*0.1 + ")");
							$("#loginContainer").css("opacity",progress);
						}
						,complete:function(){
							
						}
					})		
				}, 500)
			});				
		}else{
			$("#title").css("opacity",1);
			$("#pageContainer").css("background-color","rgba(0,0,0," + 0.15 + ")");
			$("#pageContainer").css("border","1px solid rgba(0,0,0," + 0.1 + ")");
			$("#loginContainer").css("opacity",1);			
		}
	}
	
	//
	// Show login box with request account dialog
	//
	this.showRequestAccount = function(){
		$("#title").css("opacity",1);
		$("#pageContainer").css("background-color","rgba(0,0,0," + 0.15 + ")");
		$("#pageContainer").css("border","1px solid rgba(0,0,0," + 0.1 + ")");
		
		$("#loginContainer").css({ opacity:1 });
		$("#loginSubcontainer").css({ top:"-100%" });
		$("#requestContainer").css({ top:"0%" });
		$("#placeholder").css({ height: $("#requestContainer").height() });
		$("#request").text("Back");
		$("#loginAndRequestButton").val("Request");
	}
	
	//
	// Hide login box
	//
	this.hide = function(animate){
		if(animate){
			$("#loginBox").animate({ opacity: 0 },200,"easeOutQuart",function(){
				$(this).hide();
			});			
		}else{
			$("#loginBox").css("opacity",0).hide();
		}

	}
}
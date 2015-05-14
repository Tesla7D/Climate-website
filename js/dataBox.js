//
// FILE       : dataBox.js
// PROJECT    : ClimateView
// PROGRAMMER : Ben Lorantfy, Grigory Kozyrev, Kevin Li, Michael Dasilva
// DATE       : April 19, 2015
//
App.DataBox = function(){
	//
	// On file input change (when user selects file)
	//
	$("#fileInputContainer").on("change","input",function(){
		//
		// Upload file
		//
		$.msgBox.success("Uploading data",true);
		$("#fileInputContainer input").upload("/upload",{},function(data){
			$.msgBox.success("Data uploaded");
			console.log(data);
		});
	});
	
	updateChart = function(val, data){
		console.log(data);
		switch(val){
			case "precipitation":
				var chart = new App.PrecipitationChart();
				chart.start(data);
				break;
			case "days":
				var chart = new App.CHDaysChart();
				chart.start(data);
				break;
			case "temperature":
				var chart = new App.TemperatureChart();
				chart.start(data);
				break;
		}			
	};
	
	updateData = function(){
		var stateSelect = document.getElementById("stateSelect");
		var seriesSelect = document.getElementById("seriesSelect");
		
		var series = seriesSelect.options[seriesSelect.selectedIndex].value;		
		var state = stateSelect.options[stateSelect.selectedIndex].value;
		
		var url = "/getUserData";		
		var options = JSON.stringify({
			series:series
			,state:state
		});
		var request = $.post(url,options);
		
		request.done(function(data){
			// data contains recieved json
			updateChart(series, data);
		});
		
		request.fail(function(data){
			$.msgBox.error("Failed to get data");
		});	
	};
	
	$("#seriesSelect").on("change", function(){
		updateData();
	});
	
	$("#stateSelect").on("change", function(){
		updateData();
	});
	
	//
	// When user clicks uploadCSV button, trigger click on file input
	// This is done so the ugly and unstyleable file input can be hidden
	//
	$("#uploadCSV").click(function(){
		$("#fileInputContainer input").click();
	})
	
	this.showChart = function(animate){
		if(animate){
			$("#pageContainer").animate({ width:"70%", height:"100%", "border-radius":0 },900,"easeOutQuart");
			setTimeout(function(){
				$("#uploadBox").show();
				$("#uploadBox").animate({ opacity:1 }, 300, "easeOutQuart");	
				$("#logoutContainer").show();
				$("#logoutContainer").animate({ opacity:1 }, 300, "easeOutQuart");
			}, 600)
		}else{
			$("#pageContainer").css("background-color","rgba(0,0,0," + 0.15 + ")");
			$("#pageContainer").css("border","1px solid rgba(0,0,0," + 0.1 + ")");
			$("#pageContainer").css({ width:"70%", height:"100%", "border-radius":0 });
			$("#uploadBox").css("opacity",1).show();
			$("#logoutContainer").css("opacity",1).show();
			$("#title").css("opacity",1).show();
		}
	}
}
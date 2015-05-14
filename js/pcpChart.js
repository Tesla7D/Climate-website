//
// FILE       : pcpChart.js
// PROJECT    : ClimateView
// PROGRAMMER : Ben Lorantfy, Grigory Kozyrev, Kevin Li, Michael Dasilva
// DATE       : April 19, 2015
//
App.PrecipitationChart = (function() {		
	var Precipitation = {
		chart: {
			renderTo: 'chartRegion',
			type: 'line'
		},
		title: {
			text: 'Precipitation'                 
		},
		subtitle: {
			text: ''
		},
		xAxis: {
			categories: [],
			title: {
				text: 'Time'
			}
		},
		yAxis: {
			title: {
				text: 'Precipitation (mm)'
			}
		},
		series: [
		{showInLegend: false}
		]
	};
	
	var data = [];
	var time = [];
	var max_value;
	var startValue = 0;
	var endValue = 0;
	var chartType = Precipitation;
	
	
	//************************
	//************************
	//put the json data here
	//************************
	//************************
	this.start = function(json) {
		$.each(json, function(key, value) {
			data.push(value.PCP);
			time.push(value.YEARMONTH);	
		});
		max_value = parseInt(time.length);
		chartType.series[0].data = data;
		chartType.xAxis.categories = time;
		var chart = new Highcharts.Chart(chartType); 
		
		$( "#slider2" ).slider({
			min: 2,
			max: max_value,
			animate: "fast",
			values: [2, max_value],
			slide: function(event, ui) {
				endValue = ui.values[1];
				startValue = ui.values[0];
				chartType.series[0].data  = data.slice(startValue, endValue);
				chartType.xAxis.categories = time.slice(startValue, endValue);
				var chart = new Highcharts.Chart(chartType);
			}
		});
	};	
});
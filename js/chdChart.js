//
// FILE       : CHDaysChart.js
// PROJECT    : ClimateView
// PROGRAMMER : Ben Lorantfy, Grigory Kozyrev, Kevin Li, Michael Dasilva
// DATE       : April 19, 2015
//
App.CHDaysChart = (function() {					
	var CHDays = {
		chart: {
			renderTo: 'chartRegion',
			type: 'line'
		},
		title: {
			text: 'Cooling Days/Heating Days'                 
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
				text: 'Days (Degree)'
			}
		},
		 plotOptions: {
			column: {
				stacking: 'normal'
				}
		},
		series: [{
			"type": "line",
			"name": "CD",
			"color": "#d92b00",
			"stack": true
			}, {
				"type": "line",
					"name": "HD",
					"color": "#51626d",
					"stack": true
			}
		]
	};
			
	var dataCDD = [];
	var dataHDD = [];
	var time = [];
	var max_value;
	var startValue = 0;
	var endValue = 0;
	var chartType = CHDays;
	
	//************************
	//************************
	//put the json data here
	//************************
	//************************
	this.start = function(json) {
		$.each(json, function(key, value) {
			dataCDD.push(value.CDD);
			dataHDD.push(value.HDD);
			time.push(value.YEARMONTH);	
		});
		max_value = parseInt(time.length);
		chartType.series[0].data = dataCDD;
		chartType.series[1].data = dataHDD;
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
				chartType.series[0].data  = dataCDD.slice(startValue, endValue);
				chartType.series[1].data  = dataHDD.slice(startValue, endValue);
				chartType.xAxis.categories = time.slice(startValue, endValue);
				var chart = new Highcharts.Chart(chartType);
			}
		});
	};					
});

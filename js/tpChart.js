//
// FILE       : tpChart.js
// PROJECT    : ClimateView
// PROGRAMMER : Ben Lorantfy, Grigory Kozyrev, Kevin Li, Michael Dasilva
// DATE       : April 19, 2015
//
App.TemperatureChart = function() {				
	var Temperature = {
		chart: {
			renderTo: 'chartRegion',
			type: 'line'
		},
		title: {
			text: 'Temperature'                 
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
				text: 'Temperature (Celcius)'
			}
		},
		 plotOptions: {
			column: {
				stacking: 'normal'
				}
		},
		series: [{
			"type": "line",
			"name": "AVG",
			"color": "#ff9900",
			"stack": true
		},
		{"type": "line",
			"name": "MIN",
			"color": "#d92b00",
			"stack": true
			}, {
				"type": "line",
					"name": "MAX",
					"color": "#51626d",
					"stack": true
			}
		]
	};

	
	var dataAVG = [];
	var dataMIN = [];
	var dataMAX = [];
	var time = [];
	var max_value;
	var startValue = 0;
	var endValue = 0;
	var chartType = Temperature;
	
	//************************
	//************************
	//put the json data here
	//************************
	//************************

	this.start = function(json){
		$.each(json, function(key, value) {
			dataAVG.push(value.TAVG);
			dataMIN.push(value.TMIN);
			dataMAX.push(value.TMAX);
			time.push(value.YEARMONTH);	
		});
		max_value = parseInt(time.length);
		chartType.series[0].data = dataAVG;
		chartType.series[1].data = dataMIN;
		chartType.series[2].data = dataMAX;
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
				chartType.series[0].data  = dataAVG.slice(startValue, endValue);
				chartType.series[1].data  = dataMIN.slice(startValue, endValue);
				chartType.series[2].data  = dataMAX.slice(startValue, endValue);
				chartType.xAxis.categories = time.slice(startValue, endValue);
				var chart = new Highcharts.Chart(chartType);
			}
		});
	};	 
}

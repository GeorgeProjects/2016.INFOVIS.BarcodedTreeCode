/**
 * []
 * @param  {[type]} require         [description]
 * @param  {[type]} Mn              [description]
 * @param  {[type]} _               [description]
 * @param  {[type]} $               [description]
 * @param  {[type]} Backbone        [description]
 * @param  {[type]} d3              [description]
 * @param  {[type]} Datacenter      [description]
 * @param  {[type]} Config          [description]
 * @param  {[type]} Variables       [description]
 * @param  {[type]} SVGBase         [description]
 * @param  {[type]} event           [description]
 * @param  {[type]} initialize:     function(options [description]
 * @return {[type]}                 [description]
 */
define([
	'require',
	'marionette',
	'underscore',
	'jquery',
	'backbone',
	'd3',
	'datacenter',
	'config',
	'variables',
	'views/svg-base.addon'
],function(require, Mn, _, $, Backbone, d3, Datacenter, Config, Variables, SVGBase){
	'use strict';
	return Mn.ItemView.extend(_.extend({
		tagName: 'svg',
		template: false, //for the itemview, we must define the template value false
		attributes:{
			style: 'width: 100%; height: 100%;',
			id: 'histogram-main-svg'
		},
		event:{
			
		},
		initialize: function(options){
			var self = this;
			/**
			 * [he attribute in the model is the location and attribute of the rect in the histogram view
			 * and  we handle this values in the barcode.model.js]
			 * @type {[type]}
			 */
			var model = self.model;
			var fileInfoData = model.fileInfoData;
			console.log(model);
			console.log(fileInfoData);

			var sortMode = "value";//取"time"或"value"
			var valueDim = "sum_flowSize";//取"sum_flowSize"或"nonvirtual_sum_node"

			self.draw_histogram(fileInfoData,sortMode,valueDim);
		},
		draw_histogram: function(original_data,sort_mode,value_dim)
		{
			var self = this;
			var svg = self.d3el;//此处不能直接用id选svg，因为此时这个svg实际上还没有画出来，只能用self来找

			var data_array = _deep_copy(original_data);
			function _deep_copy(source) { 
				if (_.has(source,'length'))//如果是个数组
					var result = [];
				else
					var result = {};
				for (var key in source) {
					result[key] = typeof source[key] === 'object'? _deep_copy(source[key]): source[key];
				} 
				return result; 
			}
			if (sort_mode != "time")//一开始输入的时候是按时间排序的
			{
				data_array.sort(function(a,b){  
					var a_val = a[value_dim];
					var b_val = b[value_dim];
					return a_val - b_val;//比数字时不能换成>，否则会转成字符串排出错误结果
				})
			}
			console.log(data_array);

			var svgWidth = $("#histogram-main").width();				
			var svgHeight = $("#histogram-main").height();				
			svg.selectAll("*").remove();
		 	var margin = {top: 10, right: 40, bottom: 10, left: 40};	
		   	var width = svgWidth - margin.left - margin.right;			
		   	var height = svgHeight - margin.top - margin.bottom;		
		   	var axisTextY = 10;											
			var chart = svg.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
					.attr("id","histogram");
			
			var maxNum = _.max(data_array, function(d) {return d[value_dim]})[value_dim];
			var minNum = 0;

			// draw x-axis
			var xAxisScale = d3.scale.identity()
				.range([0, width]);
			var xAxis = d3.svg.axis()
				.scale(xAxisScale)
				.orient("bottom")
				.ticks(0)			
			var xAxisGroup = chart.append("g")
			   .attr("class","x axis")
			   .attr("transform","translate(" + 0 + "," + height + ")")
			   .call(xAxis)
			xAxisGroup.append("text")
			   .attr("class","label")
			   .attr("x",width)
			   .attr("y",axisTextY)
			   .style("text-anchor","end")
			   .text("Date");
			// draw y-axis
			var yAxisMin = 0;
			var yAxisMax = Math.round(Math.log(maxNum));

			var yAxisScale = d3.scale.linear()
				.domain([yAxisMax, yAxisMin])
				.range([0, height]);
			var yAxisTicks = [];
			yAxisTicks[0] = 0;
			
			for(var i = 1; ; i = i + 1){
				yAxisTicks[i] = yAxisTicks[i-1] + 2;//每隔2标一下
				if(yAxisTicks[i] > yAxisMax - 2){
					break;
				}
			}
			
			var yAxis = d3.svg.axis()
				.scale(yAxisScale)
				.orient("left")
				.tickValues(yAxisTicks);
			chart.append("g")
				.attr("class","y axis")
				.call(yAxis)
				.append("text")
				.attr("transform","rotate(-90)")
				.attr("class","label")
				.attr("x",10)
				.attr("y",-25)
				.style("text-anchor","end")
				.text(function(){
						if (value_dim == "sum_flowSize")
							return "log(Number\n(bytes))";
						else if (value_dim == "nonvirtual_sum_node")
							return "log(Number\n(nodes))";
					});
			//draw chart bars
			var xScale = d3.scale.linear()
						.domain([0, data_array.length])
						.range([0, width]);
			var yScale = d3.scale.linear()
								.domain([0, Math.log(maxNum)])
								.range([height, 0]);
			var hisWidth = xScale(1) - 1;

		
			pile_bars(1,value_dim);
			
			function pile_bars(level,value_dim)
			{
				var bias=2;//为了避免L0结点显示不出来而加的bias
				chart.selectAll(".bar"+" level-"+level)
		 		.data(data_array)
		 		.enter()
		 		.append("rect")
		 		.attr("id",function(d, i){
		 			console.log(d);
					return "his-" + d.time_index;
				})
				.attr("index", function(d, i) {
					return d.time_index;
				})
				.attr("class", function(d, i) {
					var className = "bar";
					return className;
				})
				.attr("width", function() {
					return xScale(1) - 1;
				})
				.attr("height",function(d,i){//height是柱子本身的高度
					return height - yScale(Math.log(d[value_dim])) - 1;
				})
				.attr("x",function(d){ 
					return xScale(d.position) + 1;
				})
				.attr("y",function(d){//y是柱子的位置
					return yScale(Math.log(d[value_dim]));
				})
				.classed(("level-" + level),true)
			}
			// draw x-axis ticks
			if (sort_mode == "time") {
				var xBegin = 0;
				for (var i = 0; i < data_array.length; i++) {
					if (data_array[i].time.substring(0, 4) != xBegin) {
						xBegin = data_array[i].time.substring(0, 4);
						xAxisGroup.append("text")
							.attr("class", "tick-label")
							.attr("y", axisTextY)
							.attr("x", chart.select("#his-" + i).attr("x"))
							.text(xBegin);
					}
				}			
			}
		}

	}, SVGBase));
});
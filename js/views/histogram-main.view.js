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
			var svg = this.el;

			console.log(model);
			console.log(fileInfoData);
			console.log(svg);

			var sortMode = "value";//取"time"或"value"
			var valueDim = "sum_flowSize";//取"sum_flowSize"或"nonvirtual_sum_node"

			/*
			var tip = d3.tip()
					.attr('class', 'd3-tip')
					.offset([-10, 0])
					.html(function(d, i) {
						var time = d.file_name;
						time = time.replace("XX.csv","");
						var nonvirtualNodeOfLevel = d.nonvirtual_node_of_level;
						var nonvirtualSumNode = d.nonvirtual_sum_node;
						var flowSize = d.sum_flowSize;

						var returnedString = 	"date: " + "<span style='color:red'>" + time + "</span>" + " " +
												"flowSize: " + "<span style='color:red'>" + flowSize + "</span>" + " " +
												"sumNode: " + "<span style='color:red'>" + nonvirtualSumNode + "</span>" + " ";
						for (var j = 0; j < nonvirtualNodeOfLevel.length;++j)
						{
							returnedString += "L"+j+ "Node: " + "<span style='color:red'>" + nonvirtualNodeOfLevel[j];
							if (j != nonvirtualNodeOfLevel.length-1)
								returnedString += "</span>" + " ";
						}
						return returnedString;
					});
		
			*/

			
			_draw_histogram(svg,fileInfoData,sortMode,valueDim);
			function _draw_histogram(svg,original_data,sort_mode,value_dim)
			{
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
				if (sort_mode != "time")
				{
					data_array.sort(function(a,b){  
						var a_val = a[value_dim];
						var b_val = b[value_dim];
						return a_val - b_val;//比数字时不能换成>，否则会转成字符串排出错误结果
					})
				}
				console.log(data_array);

				
				//svg.selectAll("*").remove();
			 	var margin = {top: 10, right: 40, bottom: 30, left: 40};	//
		    	var width = svgWidth - margin.left - margin.right;			//
		    	var height = svgHeight - margin.top - margin.bottom;		//
		    	var axisTextY = 10;											//

		    	/*
				var chart = svg.append("g")
						.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
						.attr("id","append-rect");
				var maxNum = _.max(dataArray, function(d) {return d.value}).value;
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
				//根据datadimMode决定y轴的值标多少
				if (datadimMode=="flowsize")
					var yAxisMax = Math.round(Math.log(1899375543148));//最大总流量
				else if (datadimMode=="nodenum")
					var yAxisMax = Math.round(Math.log(886));//最大结点数
				var yAxisScale = d3.scale.linear()
					.domain([yAxisMax, yAxisMin])
					.range([0, height]);
				var yAxisTicks = [];
				yAxisTicks[0] = 0;
				if (datadimMode=="flowsize")
				{
					for(var i = 1; ; i = i + 1){
						yAxisTicks[i] = yAxisTicks[i-1] + 2;//每隔2标一下
						if(yAxisTicks[i] > yAxisMax - 2){
							break;
						}
					}
				}
				else if (datadimMode=="nodenum")
				{
					for(var i = 1; ; i = i + 1){
						yAxisTicks[i] = yAxisTicks[i-1] + 2;//每隔2标一下
						if(yAxisTicks[i] > yAxisMax - 2){
							break;
						}
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
					//.attr("transform","translate(" + -5 + "," + 0 + ")")
					.attr("class","label")
					.attr("x",10)
					.attr("y",-25)
					.style("text-anchor","end")
					.text(function(){
							if (datadimMode=="flowsize")
								return "log(Number\n(bytes))";
							else if (datadimMode=="nodenum")
								return "log(Number\n(nodes))";
						});
				//draw chart bars
				var xScale = d3.scale.linear()
							.domain([0, dataArray.length])
							.range([0, width]);
							*/
			}





			
		}
	}, SVGBase));
});
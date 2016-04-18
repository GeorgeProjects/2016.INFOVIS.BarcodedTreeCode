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

	//'d3-tip',

	'datacenter',
	'config',
	'variables',
	'views/svg-base.addon'
],function(require, Mn, _, $, Backbone, d3, /*d3Tip,*/ Datacenter, Config, Variables, SVGBase){
	'use strict';
	return Mn.ItemView.extend(_.extend({
		tagName: 'svg',
		template: false, //for the itemview, we must define the template value false
		attributes:{
			style: 'width: 100%; height: 100%;',
			id: 'histogram-main-svg'
		},
		events:{

		},
		initialize: function(options){
			var self = this;
			var model = self.model;
			var fileInfoData = model.fileInfoData;
			self.listenTo(Variables,'change:histogramSortMode change:histogramValueDim',function(model,value){
				var sortMode = Variables.get('histogramSortMode');//取"time"或"value"
				var valueDim = Variables.get('histogramValueDim');//取"sum_flowSize"或"nonvirtual_sum_node"
				self.draw_histogram(fileInfoData,sortMode,valueDim);
				self.maintain_highlight();
			});
			
			self.on("UpdateHighlight",function(){
				self.maintain_highlight();
			})


		},
		default_display: function(options){
			var self = this;
			var model = self.model;
			var fileInfoData = model.fileInfoData;
			var sortMode = Variables.get('histogramSortMode');//取"time"或"value"
			var valueDim = Variables.get('histogramValueDim');//取"sum_flowSize"或"nonvirtual_sum_node"
			self.draw_histogram(fileInfoData,sortMode,valueDim);
			self.maintain_highlight();
		},
		draw_histogram: function(original_data,sort_mode,value_dim){
			console.log(original_data)
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

			/*
				var tip = d3.tip()
							.attr('class', 'd3-tip')
							.offset([-10, 0])
							.html(function(d, i) {
								console.log("hhhh");
							});
				svg.call(tip)			
			*/

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
			   .attr("class","x-axis")
			   .attr("transform","translate(" + 0 + "," + height + ")")
			   .call(xAxis)
			xAxisGroup.append("text")
			   .attr("class","label")
			   .attr("x",width)
			   .attr("y",axisTextY)
			   .style("text-anchor","end")
			   .text("Date");//x轴末端的轴标

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
				.attr("class","y-axis")
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

			//画柱状图
			chart.selectAll(".bar")
		 	.data(data_array)
		 	.enter()
		 	.append("rect")
		 	.attr("id",function(d, i){
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
			.attr("x",function(d,i){ 
				return xScale(i) + 1;
			})
			.attr("y",function(d){//y是柱子的位置
				return yScale(Math.log(d[value_dim]));
			})
			.on("mouseover",function(d,i){
				//tip.show(d);
			})
			.on("mouseout",function(d,i){
				//tip.hide(d);
			})
			.on("click",function(d,i){
				//维护全局变量
				Variables.set("currentSelectBarIndex",d.time_index);
				self.trigger("UpdateHighlight");//更新高亮
			})
			.on("dblclick",function(d,i){
				//维护全局变量
				var selectBarArray = Variables.get("selectBarArray");
				var index = selectBarArray.indexOf(d.time_index);
				if (index != -1)//以前双击选中过
				{
					selectBarArray.splice(index,1);
				}
				else
				{
					selectBarArray.push(d.time_index);
					selectBarArray.sort();
				}
				Variables.set("selectBarArray",selectBarArray);
				self.trigger("UpdateHighlight");//更新高亮

				//画barcode
				//changeComparedData(compareNum);
			})

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
		},
		maintain_highlight: function(){//按照全局变量的标记进行高亮
			var self = this;
			var svg = self.d3el;

			//恢复单击的高亮
			d3.selectAll('#histogram-main .bar').classed("oneclick-highlight",false);
			var currentSelectBarIndex = Variables.get('currentSelectBarIndex');
			svg.selectAll("#his-"+currentSelectBarIndex).classed('oneclick-highlight',true)

			//恢复双击的高亮
			d3.selectAll('#histogram-main .bar').classed("dbclick-selected",false);
			var selectBarArray = Variables.get('selectBarArray');
			for (var i = 0; i < selectBarArray.length;++i)
			{
				svg.selectAll("#his-"+selectBarArray[i]).classed('dbclick-selected',true)
			}
			console.log(currentSelectBarIndex,selectBarArray)
		}



	}, SVGBase));
});
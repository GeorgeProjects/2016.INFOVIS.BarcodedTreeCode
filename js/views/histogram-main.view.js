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
			
			var svg = this.el;

			var sortMode = "time";
			var datadimMode = "flowsize";

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

			//处理好四个数组
			function processStatData() {
				process_timeSortArray_flowsize();
				function process_timeSortArray_flowsize()
				{
					for (var i = 0; i < statData.length; i++) {
					 	timeSortArray_flowsize[i] = new Object();
					 	timeSortArray_flowsize[i].value = + statData[i].sumProportion;
					 	timeSortArray_flowsize[i].time = statData[i].file.replace("XX.csv","");
					 	timeSortArray_flowsize[i].index = i;
					 	timeSortArray_flowsize[i].position = i;
					 	timeSortArray_flowsize[i].sumNode =  + statData[i].sumNode;

					 	timeSortArray_flowsize[i].L0Node =  + statData[i].L0Node;
					 	timeSortArray_flowsize[i].L1Node =  + statData[i].L1Node;
					 	timeSortArray_flowsize[i].L2Node =  + statData[i].L2Node;
					 	timeSortArray_flowsize[i].L3Node =  + statData[i].L3Node;
					 	timeSortArray_flowsize[i].L4Node =  + statData[i].L4Node;
					}
				}

				process_propotionArray_flowsize();
				function process_propotionArray_flowsize()
				{
					for (var i = 0; i < statData.length; i++) {
					 	propotionArray_flowsize[i] = new Object();
					 	propotionArray_flowsize[i].value =+ statData[i].sumProportion;
					 	propotionArray_flowsize[i].time = statData[i].file.replace("XX.csv","");
					 	propotionArray_flowsize[i].index = i;	

					 	propotionArray_flowsize[i].L0Node = + statData[i].L0Node;
					 	propotionArray_flowsize[i].L1Node = + statData[i].L1Node;
					 	propotionArray_flowsize[i].L2Node = + statData[i].L2Node;
					 	propotionArray_flowsize[i].L3Node = + statData[i].L3Node;
					 	propotionArray_flowsize[i].L4Node = + statData[i].L4Node;
					}
				 	propotionArray_flowsize.sort(function(a, b) {
				 		return a.value - b.value;
				 	})
				 	for (var i = 0; i < propotionArray_flowsize.length; i++) {
				 		propotionArray_flowsize[i].position = i;
				 	}
				}

				process_timeSortArray_nodenum();
				function process_timeSortArray_nodenum()
				{
					for (var i = 0; i < statData.length; i++) {
					 	timeSortArray_nodenum[i] = new Object();
					 	timeSortArray_nodenum[i].value = + statData[i].sumNode;
					 	timeSortArray_nodenum[i].time = statData[i].file.replace("XX.csv","");
					 	timeSortArray_nodenum[i].index = i;
					 	timeSortArray_nodenum[i].position = i;

					 	timeSortArray_nodenum[i].L0Node = + statData[i].L0Node;
					 	timeSortArray_nodenum[i].L1Node = + statData[i].L1Node;
					 	timeSortArray_nodenum[i].L2Node = + statData[i].L2Node;
					 	timeSortArray_nodenum[i].L3Node = + statData[i].L3Node;
					 	timeSortArray_nodenum[i].L4Node = + statData[i].L4Node;
					}
				}

				process_propotionArray_nodenum();
				function process_propotionArray_nodenum()
				{
					for (var i = 0; i < statData.length; i++) {
					 	propotionArray_nodenum[i] = new Object();
					 	propotionArray_nodenum[i].value = + statData[i].sumNode;
					 	propotionArray_nodenum[i].time = statData[i].file.replace("XX.csv","");
					 	propotionArray_nodenum[i].index = i;	

					 	propotionArray_nodenum[i].L0Node = + statData[i].L0Node;
					 	propotionArray_nodenum[i].L1Node = + statData[i].L1Node;
					 	propotionArray_nodenum[i].L2Node = + statData[i].L2Node;
					 	propotionArray_nodenum[i].L3Node = + statData[i].L3Node;
					 	propotionArray_nodenum[i].L4Node = + statData[i].L4Node;
					}
				 	propotionArray_nodenum.sort(function(a, b) {
				 		return a.value - b.value;
				 	})
				 	for (var i = 0; i < propotionArray_nodenum.length; i++) {
				 		propotionArray_nodenum[i].position = i;
				 	}
				}
			}



			
		}
	}, SVGBase));
});
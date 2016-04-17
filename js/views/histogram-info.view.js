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
], function(require, Mn, _, $, Backbone, d3, Datacenter, Config, Variables, SVGBase){
	'use strict';

	return Mn.ItemView.extend(_.extend({
		tagName: 'svg',
		template: false,
		attributes:{
			style: 'width: 100%; height: 100%',
			id: 'histogram-info-svg'
		},
		event: {
			
		},
		initialize: function(options){
			var self = this;

			var model = self.model;
			var fileInfoData = model.fileInfoData;
			var svg = self.d3el;

			var currentSelectBarIndex = Variables.get('currentSelectBarIndex');

			//console.log(model);
			console.log(fileInfoData);
			//console.log(svg);
			console.log(currentSelectBarIndex)

			/*
			svg.append("text")
                        .attr("x", self.$el.width() / 2 )
                        .attr("y", self.margin.top / 2)
                        .style("text-anchor", "middle")
                        .attr("class","timelineTitle")
                        .text(function() {
                               return "Temporal Distribution of Reocrds";
                        });
			*/
			svg.append("span")
				.attr("class","date_description");
			svg.append("span")
				.attr("class","value_description");
			svg.append("span")
				.attr("class","level_description");
			svg.append("span")
				.attr("class","node_num_description");

			console.log(Variables);
			console.log(Variables.model)
			self.listenTo(Variables,'change:currentSelectBarIndex',function(model,value){
				console.log("ddd",value);
				update_inner_top_right_description(fileInfoData,value);
			})

			function update_inner_top_right_description(data_array,compareNum)
			{
				console.log(data_array)
				var curFile = data_array[compareNum];
				$("#histogram-info-svg .date_description").html(function() {
					return curFile.time;
				});
				$("#histogram-info-svg .value_description").text(function() {
					return curFile.sum_flowSize + "bytes";
				});
				$("#histogram-info-svg .level_description").text(function() {
					return curFile.nonvirtual_node_of_level.length;
				});
				$("#histogram-info-svg .node_num_description").text(function() {
					return curFile.nonvirtual_sum_node;
				});
				for (var i = 0;i < curFile.nonvirtual_node_of_level.length;++i)
				{
					$("#histogram-info-svg .L"+i+"node_num_description").text(function() {
						var nodeNumDescription = curFile.nonvirtual_node_of_level[i];
						return nodeNumDescription;
					});
				}
				
			}

		}
	}, SVGBase))
})
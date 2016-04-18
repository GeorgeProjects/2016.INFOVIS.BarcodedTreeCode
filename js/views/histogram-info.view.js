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
	'text!templates/histogramViewInfo.tpl'
], function(require, Mn, _, $, Backbone, d3, Datacenter, Config, Variables, Tpl){
	'use strict';
	return Mn.LayoutView.extend({
		tagName: 'div',
		template: false,
		attributes:{
			style: 'width: 100%; height: 100%',
			id: 'histogram-info-div'
		},
		 template: function() {
                return _.template(Tpl);
        },
		event: {
			
		},
		initialize: function(options){
			var self = this;
			var model = self.model;
			var fileInfoData = model.fileInfoData;
			self.listenTo(Variables,'change:currentSelectBarIndex',function(model,value){
				self.update_inner_top_right_description(fileInfoData,value);
			})
		},
		default_display: function(){
			var self = this;
			var model = self.model;
			var fileInfoData = model.fileInfoData;
			var currentSelectBarIndex = Variables.get('currentSelectBarIndex');
			self.update_inner_top_right_description(fileInfoData,currentSelectBarIndex);
		},
		update_inner_top_right_description: function(data_array,bar_index){
			var curFile = data_array[bar_index];
			$("#histogram-info .date_description").html(function() {
				return curFile.time;
			});
			$("#histogram-info .value_description").text(function() {
				return d3.format(".3s")(curFile.sum_flowSize) + "bytes";//转换成M，G之类的单位
			});
			$("#histogram-info .level_description").text(function() {
				return curFile.nonvirtual_node_of_level.length;
			});
			$("#histogram-info .node_num_description").text(function() {
				return curFile.nonvirtual_sum_node;
			});
			/*
			for (var i = 0;i < curFile.nonvirtual_node_of_level.length;++i)
			{
				$("#histogram-info .L"+i+"node_num_description").text(function() {
					var nodeNumDescription = curFile.nonvirtual_node_of_level[i];
					return nodeNumDescription;
				});
			}
			*/
		}

	})
})
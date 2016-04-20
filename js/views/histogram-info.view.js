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
		events: {
			
		},
		initialize: function(options){
			var self = this;
			var model = self.model;
			var fileInfoData = model.get('fileInfoData');
			self.listenTo(Variables,'change:lastSelectBarIndex change:maintainingLastSelectBar',function(model,value){
				if (Variables.get("maintainingLastSelectBar") == true)
					self.update_info_description(fileInfoData,Variables.get("lastSelectBarIndex"));
				else
					self.blank_info();
			})
		},
		default_display: function(){
			var self = this;
			var model = self.model;
			var fileInfoData = model.get('fileInfoData');
			var selectBarArray = Variables.get('selectBarArray');
			var lastSelectBarIndex = Variables.get('lastSelectBarIndex');
			self.update_info_description(fileInfoData,lastSelectBarIndex);
		},
		blank_info: function(){
			$("#histogram-info .date_description").text(function() {
				return "";
			});
			$("#histogram-info .value_description").text(function() {
				return "";//转换成M，G之类的单位
			});
			$("#histogram-info .level_description").text(function() {
				return "";
			});
			$("#histogram-info .node_num_description").text(function() {
				return "";
			});
		},
		update_info_description: function(data_array,bar_index){
			var curFile = data_array[bar_index];
			$("#histogram-info .date_description").text(function() {
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
		}

	})
})
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
	//'views/svg-base.addon', the function of this file
	'views/histogram-main.view',
	'views/histogram-info.view',
	'views/histogram-panel.view',
	'views/histogram-left.view',
	'text!templates/histogramView.tpl'
], function(require, Mn, _, $, Backbone, d3, Datacenter, Config, Variables, HistogramMain, HistogramInfo, HistogramPanel, HistogramLeft, Tpl){
	'use strict';
	
	return Mn.LayoutView.extend({
		tagName:'div',
		template: _.template(Tpl),

		regions:{
			'histogramLeft': '#histogram-left',
			'histogramInfo': '#histogram-info',
		},

		attributes:{
			'style': 'height: 100%; width: 100%',
			'id': 'graphSvg',
		},

		initialize: function(){
			var self = this;
			self.d3el = d3.select(self.el);
		},

		onShow: function(){
			var self = this;
			
			var histogramLeftView = new HistogramLeft();
			self.showChildView('histogramLeft', histogramLeftView);

			var histogramInfoView =  new HistogramInfo({model: Datacenter.histogramModel});
			self.showChildView('histogramInfo',histogramInfoView);
			
			histogramInfoView.default_display();
		},
	});
});
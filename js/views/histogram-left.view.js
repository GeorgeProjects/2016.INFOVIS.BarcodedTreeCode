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
	'views/histogram-panel.view',
	'text!templates/histogramLeft.tpl'
], function(require, Mn, _, $, Backbone, d3, Datacenter, Config, Variables, HistogramMain, HistogramPanel, Tpl){
	'use strict';
	
	return Mn.LayoutView.extend({
		tagName:'div',
		template: _.template(Tpl),

		regions:{
			'histogramMain': '#histogram-main',
			'histogramPanel': '#histogram-panel',
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

			var histogramMainView =  new HistogramMain({model: Datacenter.histogramModel});
			self.showChildView('histogramMain',histogramMainView);
			histogramMainView.default_display();
			
			var histogramPanelView = new HistogramPanel();
			self.showChildView('histogramPanel',histogramPanelView);
			histogramPanelView.bind();//按钮的绑定放在初始化以及template的绑定结束后，否则无法找到按钮来绑定
		},
	});
});
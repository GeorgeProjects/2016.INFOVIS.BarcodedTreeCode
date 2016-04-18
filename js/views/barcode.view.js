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
	'views/barcode-main.view',
	'views/barcode-panel.view',
	'text!templates/barcodeView.tpl'
], function(require, Mn, _, $, Backbone, d3, Datacenter, Config, Variables, BarcodeMain, BarcodePanel, Tpl){
	'use strict';
	
	return Mn.LayoutView.extend({
		tagName:'div',
		template: _.template(Tpl),

		regions:{
			'barcodeMain': '#barcode-main',
			'barcodePanel': '#barcode-panel',
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

			var barcodeMainView =  new BarcodeMain({model: Datacenter.barcodeModel});
			self.showChildView('barcodeMain',new BarcodeMain(barcodeMainView));
			
			var barcodePanelView = new BarcodePanel();
			self.showChildView('barcodePanel',barcodePanelView);
		},
	});
});
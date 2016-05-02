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
	'd3Tip',
	'datacenter',
	'config',
	'variables',
	'collections/barcode.collection',
	'views/svg-base.addon',
	'views/barcode-single.view',
	'text!templates/barcodeMainView.tpl'
],function(require, Mn, _, $, Backbone, d3, d3Tip, Datacenter, Config, Variables, BarcodeCollection, SVGBase, BarcodeSingle, Tpl){
	'use strict';
	return Mn.LayoutView.extend({
		tagName: 'div',
		template: false, //for the itemview, we must define the template value false
		attributes:{
			style: 'width: 100%; height: 100%;',
			id: 'barcode-main-div'
		},
		
		regions:{
			barcode1: "#selected-barcode-1"
		},
		
		template: function(){
			return _.template(Tpl)
		},
		events:{

		},
		initialize: function(options){
			var self = this;
			self.d3el = d3.select(self.el);

			var model = self.model;
			var barcodeCollection = window.Datacenter.barcodeCollection;

			var singleOriginalUnreducedSizeXposition = new Array();
			singleOriginalUnreducedSizeXposition = barcodeCollection.get("originalUnreducedSizeXposition");
			console.log(singleOriginalUnreducedSizeXposition);

		},
		//注意：函数的名字不能随便起成render，这边如果把draw_barcode名字换成render，那么region中的#selected-barcode-1就不会渲染上来了
		draw_barcode: function(){//利用collection中的信息画出barcode
			var self = this;
			var svg = self.d3el;//此处不能直接用id选svg，因为此时这个svg实际上还没有画出来，只能用self来找

			var barcodeCollection = window.Datacenter.barcodeCollection;//所有的bar的model的collection
			var selectBarArray = Variables.get('selectBarArray');//存储了需要画的barcode的标号

			var barcodeCollection = window.Datacenter.barcodeCollection;//所有的bar的model的collection
			var selectBarArray = Variables.get('selectBarArray');//存储了需要画的barcode的标号

			var barcodeSingleView = new BarcodeSingle();//{barcodeSingleLocation:singleBarcodeLocation, index: 0}
			self.showChildView('barcode1', barcodeSingleView);

			
		},

	});
});
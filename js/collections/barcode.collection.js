define([
	'require',
	'marionette',
	'underscore',
	'jquery',
	'backbone',
	'config',
	'd3',
	'models/barcode.model'
],function(require, Mn, _, $, Backbone, Config, d3, BarcodeModel){
	'use strict';

	return Backbone.Collection.extend({
		model: BarcodeModel,
		barcodeLocation:[],
		initialize: function(){
			var self = this;
			//console.log(self);
		},
		preprocess: function(){//负责计算collection中每个model的barLocationArray[]
			//已经有了每个collection中每个model的barcodeIndex,barcodeSingleDataArray[]，需要计算对应的barLocationArray[]
			var self = this;
			var modelsCollection = self.models;
			for(var i = 0;i < modelsCollection.length;i++){//
				var linearTree = modelsCollection[i].attributes.barcodeSingleDataArray;
				var barcodeSingleDataArray = self.get_origin_attr(linearTree);
				self.barcodeLocation[i] = barcodeSingleDataArray;
				//console.log(barcodeSingleDataArray);
			}
			console.log(self.barcodeLocation);
		},
		get_origin_attr: function(linear_tree){
			var originNodeArray = new Array();
			var xCompute = 0;
			var widthArray = [20, 15, 10, 5, 2];
			var rectAllHeight = 50; 
			var rectGap = 2;
			var level = 0;
			//var linear_tree = linearTreeArray[index];
			for(var i = 0; i < linear_tree.length; i++){
				originNodeArray[i] = new Object();
				originNodeArray[i].x = xCompute;
				level = +linear_tree[i]._depth;
				if(linear_tree[i].description != 'virtual'){
					xCompute = xCompute + widthArray[level] + rectGap; 
					originNodeArray[i].width = widthArray[level];
					originNodeArray[i].height = rectAllHeight;
				}else{
					originNodeArray[i].width = 0;
					originNodeArray[i].height = 0;
				}
			}
			return originNodeArray;
		}
	});
})
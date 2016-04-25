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
		initialize: function(){
			var self = this;
			//console.log(self);
		},
		preprocess: function(){//负责计算collection中每个model的barLocationArray[]
			//已经有了每个collection中每个model的barcodeIndex,barcodeSingleDataArray[]，需要计算对应的barLocationArray[]
			var self = this;
			console.log(self)
		}
	});
})
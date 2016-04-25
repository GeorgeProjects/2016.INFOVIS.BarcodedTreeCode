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
			
		},
	});
})
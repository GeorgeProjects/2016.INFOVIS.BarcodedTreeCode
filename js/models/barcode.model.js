define([
	'require',
	'marionette',
	'underscore',
	'jquery',
	'backbone',
	'config',
	'd3',
	'models/basicdata.model'
],function(require, Mn, _, $, Backbone, Config, d3, BasicDataModel){
	'use strict';

	return Backbone.Model.extend({
		defaults: {
			barcodeSingleDataArray:null,
			// the barLocationArray store the rect object with the attributes x, y, width, height, 
			barLocationArray: null
		},
		initialize: function(){
			// get the barcode location according the barcode information
			
		},

	});
})
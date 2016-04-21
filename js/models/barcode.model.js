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
			'barcodeIndex': 0, //这一棵tree在文件上的index
			'barcodeSingleDataArray':[],//这一棵tree的linear tree
			// the barLocationArray store the rect object with the attributes x, y, width, height, 
			'barLocationArray': []
		},
		initialize: function(){
			var self = this;
	//		Variables.get('fileLinearDataArray')
		},
		handle_location: function(){
			var self = this;
			
			
			/*
			var index = self.get('barcodeIndex');
			// get the barcode location according the barcode information
			self.set('barcodeSingleDataArray', fileLinearDataArray[index]);
			*/
		}
	});
})
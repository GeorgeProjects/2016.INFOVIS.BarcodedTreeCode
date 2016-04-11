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
		defaults: function(){
			histogramAttr:[]
		},
		initialize: function(){
			var self = this;
			self.basicDataModel = new BasicDataModel();
		},
		handle_histogram_attr: function(file_lineardata_array){
			console.log('handle');
			var self = this;
			self.basicDataModel.set('fileLinearDataArray',file_lineardata_array);
			console.log(file_lineardata_array);
		}	
	});
})
define([
	'require',
 	'marionette',
 	'underscore',
 	'jquery',
 	'backbone',
 	'variables',
 	'config',
 	'models/basicdata.model',
 	'models/histogram.model'
], function(require, Mn, _, $, Backbone, Variables, Config, BasicDataModel, HistogramModel){
	'use strict';

	return window.Datacenter = new (Backbone.Model.extend({
		defaults:function(){
			return {

			};
		},

		initialize: function(url){
			var self = this;
			self.basicDataModel = new BasicDataModel();
			self.histogramModel = new HistogramModel();
 		},

 		start: function(){
 			var self = this;
 			var deferLoadCSVDataArray = [];
 			var fileNameArray = Variables.get('fileNameArray');
 			var fileNameArrayLength = fileNameArray.length;
 			for(var i = 0;i < fileNameArrayLength;i++){
 				deferLoadCSVDataArray[i] = $.Deferred();
 			}
 			var deferLinearData = $.Deferred();
 			self.basicDataModel.load_csv_data(deferLoadCSVDataArray);
 			$.when(deferLoadCSVDataArray[fileNameArrayLength - 1]).done(function(){
 				//console.log(self.basicDataModel.get('fileCSVDataArray').length);
 				self.basicDataModel.linearlize_data(deferLinearData);
 			});
 			$.when(deferLinearData).done(function(){
 				self.pre_histogram_data();
 				console.log(self.basicDataModel.get('fileLinearDataArray').length);
 			});
 		},

 		pre_histogram_data: function(){
 			var self = this;
 			var fileLinearDataArray = self.basicDataModel.get('fileLinearDataArray');
			self.histogramModel.handle_histogram_attr(fileLinearDataArray);
 		}
	}))();
});
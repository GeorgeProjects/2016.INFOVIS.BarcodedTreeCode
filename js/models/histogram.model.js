/**
 * [description]
 * @param  {[type]} Config                 [description]
 * @param  {[type]} BasicDataModel 		   [description]
 * @return {[type]}                        [description]
 */
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
			histogramAttr:[]
		},
		initialize: function(){
			var self = this;
		},
		handle_histogram_attr: function(){
			var self = this;
			self.basicDataModel = window.Datacenter.basicDataModel;
			var fileLinearDataArray = self.basicDataModel.get('fileLinearDataArray');
			self.basicDataModel.set('fileLinearDataArray',fileLinearDataArray);
			//iterate the array to get the histogram information we needed when draw the histogram 
			//store into the histogramAttr
			console.log(fileLinearDataArray);
		}	
	});
})
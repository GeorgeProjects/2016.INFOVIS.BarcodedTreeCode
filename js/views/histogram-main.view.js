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
	'views/svg-base.addon'
],function(require, Mn, _, $, Backbone, d3, Datacenter, Config, Variables, SVGBase){
	'use strict';
	return Mn.ItemView.extend(_.extend({
		tagName: 'svg',
		template: false,
		attributes:{
			'style': 'width: 100%, height: 100%'
			
		},
		event:{
			//sort mode change(trigger drawHistogram)
			//value mode change(trigger drawHistogram)
			//click help document
			//double click on bars(trigger barcode drawing)
			//click on bars(trigger change in descriptions window)
			//listen to highlight message from barcode view
		},
		initialize: function(options){
			var self = this;
			console.log("reach")


			//use fileInfoData in model
			//svg (Width,Height)
			//tip

			//drawHistogram







		}
	}, SVGBase));
});
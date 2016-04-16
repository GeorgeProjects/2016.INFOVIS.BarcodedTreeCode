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
], function(require, Mn, _, $, Backbone, d3, Datacenter, Config, Variables, SVGBase){
	'use strict';

	return Mn.ItemView.extend(_.extend({
		tagName: 'svg',
		template: false,
		attributes:{
			style: 'width: 100%; height: 100%',
			id: 'histogram-info-svg'
		},
		event: {
			
		},
		initialize: function(options){
			var self = this;

			var model = self.model;
			var fileInfoData = model.fileInfoData;
			var svg = self.d3el;

			//console.log(model);
			//console.log(fileInfoData);
			//console.log(svg);
		}
	}, SVGBase))
})
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
			style: 'width: 100%; height: 100%'
		},
		event: {
			
		},
		initialize: function(options){
			var self = this;
		}
	}, SVGBase))
})
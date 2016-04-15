/**
 * []
 * @param  {[type]} require         [description]
 * @param  {[type]} Mn              [description]
 * @param  {[type]} _               [description]
 * @param  {[type]} $               [description]
 * @param  {[type]} Backbone        [description]
 * @param  {[type]} d3              [description]
 * @param  {[type]} Datacenter      [description]
 * @param  {[type]} Config          [description]
 * @param  {[type]} Variables       [description]
 * @param  {[type]} SVGBase         [description]
 * @param  {[type]} event           [description]
 * @param  {[type]} initialize:     function(options [description]
 * @return {[type]}                 [description]
 */
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
		template: false, //for the itemview, we must define the template value false
		attributes:{
			style: 'width: 100%; height: 100%;',
			id: 'histogram-main-svg'
		},
		event:{
			
		},
		initialize: function(options){
			var self = this;
			/**
			 * [he attribute in the model is the location and attribute of the rect in the histogram view
			 * and  we handle this values in the barcode.model.js]
			 * @type {[type]}
			 */
			var model = self.model;
			console.log(this.el);
		}
	}, SVGBase));
});
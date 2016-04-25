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
	'd3Tip',
	'datacenter',
	'config',
	'variables',
	'collections/barcode.collection',
	'views/svg-base.addon',
],function(require, Mn, _, $, Backbone, d3, d3Tip, Datacenter, Config, Variables, BarcodeCollection, SVGBase){
	'use strict';
	return Mn.ItemView.extend(_.extend({
		tagName: 'svg',
		index: 0,
		template: false, //for the itemview, we must define the template value false
		barcodeSingleLocation:[],
		attributes:{
			style: 'width: 100%; height: 100%;',
			class: 'barcode-single-div'
		},
		template: function(){
			return _.template(Tpl)
		},
		events:{

		},
		initialize: function(options){
			var self = this;
			var model = self.model;
		},
		draw_barcode: function(){
			var self = this;
			var svg = self.d3el;//此处不能直接用id选svg，因为此时这个svg实际上还没有画出来，只能用self来找
			svg.append("rect")
			.attr("x",0)
			.attr("y",0)
			.attr("height",30)
			.attr("width",30)
			.attr("fill",red);
		}
	}, SVGBase));
});
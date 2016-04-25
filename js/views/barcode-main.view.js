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
	'views/svg-base.addon'
],function(require, Mn, _, $, Backbone, d3, d3Tip, Datacenter, Config, Variables, BarcodeCollection, SVGBase){
	'use strict';
	return Mn.ItemView.extend(_.extend({
		tagName: 'svg',
		template: false, //for the itemview, we must define the template value false
		attributes:{
			style: 'width: 100%; height: 100%;',
			id: 'barcode-main-svg'
		},
		events:{

		},
		initialize: function(options){
			var self = this;
			var model = self.model;
			var barcodeCollection = window.Datacenter.barcodeCollection;
		},
		draw_barcode: function(){//利用collection中的信息画出barcode
			var barcodeCollection = window.Datacenter.barcodeCollection;//所有的bar的model的collection
			var selectBarArray = Variables.get('selectBarArray');//存储了需要画的barcode的标号

			var self = this;
			var svg = self.d3el;//此处不能直接用id选svg，因为此时这个svg实际上还没有画出来，只能用self来找

			/*
			var radialTip = d3.tip()
			  	.attr('class', 'd3-tip')
			 	.offset([-10, 0])
			  	.html(function(d) {
			    	return 	"Name:<span style='color:red'>" + d.name +"</span>" +
			    			"Value:<span style='color:red'>" +  "bytes" +"</span>" +
			    			"Depth:<span style='color:red'>" + d._depth + "</span>" +
			    		 	"Index:<span style='color:red'>" + d.linear_index + "</span>" +
			    		 	"Same pattern number:<span style='color:red'>" + d.maximum_continuous_repeat_group_size + "</span>"
			    		 	;
			  	});
			svg.call(radialTip);

			var patternTip = d3.tip()
		  	.attr('class', 'd3-tip')
		 	.offset([-10, 0])
		  	.html(function(d) {
		    	return "Name:<span style='color:red'>" + "</span>" +
		    		 "Description:<span style='color:red'>" + "</span>" +
		    		 "Index:<span style='color:red'>" + "</span>";
		  	});
			svg.call(patternTip);

			*/






		}

	}, SVGBase));
});
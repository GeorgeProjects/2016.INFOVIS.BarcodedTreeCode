define([
	'require',
	'marionette',
	'underscore',
	'jquery',
	'backbone',
	'config',
	'd3',
	'models/barcode.model'
],function(require, Mn, _, $, Backbone, Config, d3, BarcodeModel){
	'use strict';

	return Backbone.Collection.extend({
		model: BarcodeModel,
		defaults: {
			'compressBarcodeMode':false,//标记当前处在barcode的完全展开或者压缩状态
			'displayedLevel':[],//当前应该被展示的层级的集合
			
		},
		initialize: function(){
			var self = this;
			console.log(self)
		},
	});
})
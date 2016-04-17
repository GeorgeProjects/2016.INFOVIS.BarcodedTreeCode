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
	'text!templates/histogramViewPanel.tpl'
], function(require, Mn, _, $, Backbone, d3, Datacenter, Config, Variables, Tpl){
	'use strict';
	return Mn.LayoutView.extend({
		tagName: 'div',
		template: false,
		attributes:{
			style: 'width: 100%; height: 100%',
			id: 'histogram-panel-div'
		},
		 template: function() {
                return _.template(Tpl);
        },
		event: {
			
		},
		initialize: function(options){
			var self = this;
			var model = self.model;



		}
	})
})
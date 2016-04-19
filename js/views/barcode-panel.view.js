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
	'text!templates/barcodeViewPanel.tpl'
], function(require, Mn, _, $, Backbone, d3, Datacenter, Config, Variables, Tpl){
	'use strict';
	return Mn.LayoutView.extend({
		tagName: 'div',
		template: false,
		attributes:{
			style: 'width: 100%; height: 100%',
			id: 'barcode-panel-div'
		},
		 template: function() {
                return _.template(Tpl);
        },
		events: {

		},
		initialize: function(options){
			var self = this;
		},
		bind: function(){
			var self = this;
			var model = self.model;
			$(function() {
				$( "#barcode-panel #selectable" ).selectable({
					stop: function() {
						$("#barcode-panel .ui-widget-content").removeClass("active");
				        $( "#barcode-panel .ui-selected", this ).each(function() {
				        	$(this).addClass("active");
					        var index = $( "#barcode-panel #selectable li" ).index( this );
					        console.log(index);
				        });
				    }
				});
			});

			$( "#barcode-panel .width-item" ).each(function() {
				$( this ).slider({
					value: 0,
					range: "min",
					animate: true,
					orientation: "horizontal"
				});
		    });

		    $( "#barcode-panel .height-item" ).each(function() {
				$( this ).slider({
					value: 0,
					range: "min",
					animate: true,
					orientation: "horizontal"
				});
		    });


		}
	})
})
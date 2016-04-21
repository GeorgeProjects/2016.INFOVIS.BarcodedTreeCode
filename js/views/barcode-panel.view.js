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
	'text!collections/barcode.collection.js',
	'text!templates/barcodeViewPanel.tpl'
], function(require, Mn, _, $, Backbone, d3, Datacenter, Config, Variables, Barcodecollection, Tpl){
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

			var sumLevel = Variables.get('sumLevel');
			for (var i = 0; i < sumLevel;++i)//按照Variables中的sumLevel来append合适的按钮数
			{
				$("#barcode-panel .level_display_control").append( 
					"<span class=\"btn btn-default btn-xs active level-btn\" level=0>" + i + "</span>"
				);

				self.$el.find("#state-change").click(function() {

					if ($(this).hasClass("active"))
					{
						$(this).removeClass("active");
						Barcodecollection.get('compressBarcodeMode') = false;
					}
					else
					{
						$(this).addClass("active");
						Barcodecollection.get('compressBarcodeMode') = true;
					}
				});
			}

			

			for (var i = 0; i < sumLevel;++i)//按照Variables中的sumLevel来append合适的slider数
			{
				$("#barcode-panel #width-menu").append( 
					"<div class=\"menu-item\"><span class=\"menu-item-text\"> L" + i + "</span>" + "<span class=\"width-item\"></span> </div>"
				);
			}

			$(function() {
				$( "#barcode-panel #selectable" ).selectable({
					stop: function() {
						$("#barcode-panel .ui-widget-content").removeClass("active");
				        $(".ui-selected", this ).each(function() {
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
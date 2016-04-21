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
	'collections/barcode.collection',
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

			console.log(Barcodecollection);

			var sumLevel = Variables.get('sumLevel');
			for (var i = 0; i < sumLevel;++i)//按照Variables中的sumLevel来append合适的按钮数
			{
				$("#barcode-panel .level_display_control").append( 
					"<span class=\"btn btn-default btn-xs active ui-widget-content level-btn\" level=" + i + ">" + i + "</span>"
				);
			}

			for (var i = 0; i < sumLevel;++i)//按照Variables中的sumLevel来append合适的slider数
			{
				$("#barcode-panel #width-menu").append( 
					"<div class=\"menu-item\"><span class=\"menu-item-text\"> L" + i + "</span>" + "<span class=\"width-item\"></span> </div>"
				);
			}

			self.$el.find("#state-change").click(function() {
				if ($(this).hasClass("active"))
				{
					$(this).removeClass("active");
					//Barcodecollection.set('compressBarcodeMode',false);
				}
				else
				{
					$(this).addClass("active");
					//Barcodecollection.set('compressBarcodeMode',true);
				}
			});

			$(function() {
				$( "#barcode-panel #selectable" ).selectable({
					stop: function() {
						$("#barcode-panel .ui-widget-content").removeClass("active");
				        $(".ui-selected", this ).each(function() {
				        	$(this).addClass("active");
					        var index = $( "#barcode-panel #selectable span" ).index( this );
					        console.log(index);
				        });
				    }
				});
			});


			self.$el.find("#highlight_cousin").click(function() {
				console.log('1111111111111')
			});

			self.$el.find("#highlight_sibling").click(function() {
				console.log('22222')
			});


			$( "#barcode-panel .width-item" ).each(function() {
				$( this ).slider({
					value: 0,
					range: "min",
					min: 0,
      				max: 100,
					animate: true,
					orientation: "horizontal",
					slide: function( event, ui ) {
						console.log(ui.value);
				    }
				});
		    });

		    $( "#barcode-panel .height-item" ).each(function() {
				$( this ).slider({
					value: 0,
					range: "min",
					min: 0,
      				max: 100,
					animate: true,
					orientation: "horizontal",
					slide: function( event, ui ) {
						console.log(ui.value);
				    }
				});
		    });


		}
	})
})
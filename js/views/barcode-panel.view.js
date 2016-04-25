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
], function(require, Mn, _, $, Backbone, d3, Datacenter, Config, Variables,Tpl){
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
					"<span class=\"btn btn-default btn-xs active ui-widget-content level-btn\" level=" + i + ">L" + i + "</span>"
				);
			}

			for (var i = 0; i < sumLevel;++i)//按照Variables中的sumLevel来append合适的slider数
			{
				$("#barcode-panel #width-menu").append( 
					"<div class=\"menu-item\"><span class=\"menu-item-text\"> L" + i + "</span>" + "<span class=\"width-item\"></span> </div>"
					//"<div class=\"menu-item\"><span class=\"menu-item-text\"> L" + i + "</span>" + "<span class=\"width-item level-" + i + "></span> </div>"
				);
			}

			//1. 改变压缩模式的按钮的功能
			self.$el.find("#state-change").click(function() {
				if ($(this).hasClass("active"))
				{
					$(this).removeClass("active");
					Variables.set('compressBarcodeMode',false);
				}
				else
				{
					$(this).addClass("active");
					Variables.set('compressBarcodeMode',true);
				}
			});

			//2. 选层级的按钮的功能
			$(function() {
				$( "#barcode-panel #selectable" ).selectable({
					stop: function() {
						$("#barcode-panel .ui-widget-content").removeClass("active");
						var displayedLevel = [];
				        $(".ui-selected", this ).each(function() {
				        	$(this).addClass("active");
					        var index = $( "#barcode-panel #selectable span" ).index( this );
					        displayedLevel.push(index);
					        Variables.set('displayedLevel',displayedLevel);
				        });
				        //console.log( Variables.get('displayedLevel'))
				    }
				});
			});
			
			//3. sibling以及cousin的高亮选择
			self.$el.find("#highlight_sibling").click(function() {
				var highlightSibling = Variables.get('highlightSibling');
				Variables.set('highlightSibling', ! highlightSibling);
			});
			self.$el.find("#highlight_cousin").click(function() {
				var highlightCousin = Variables.get('highlightCousin');
				Variables.set('highlightCousin', ! highlightCousin);
			});

			//bar的宽度控制和高度控制
			$( "#barcode-panel .width-item" ).each(function() {
				var index = $( "#barcode-panel .width-item" ).index( this );
				$( this ).slider({
					value: Variables.get('barWidthOfLevel')[index],
					range: "min",
					min: Variables.get('minWidth'),
      				max: Variables.get('maxWidth'),
					animate: true,
					orientation: "horizontal",
					slide: function( event, ui ) {
						var barWidthOfLevel = Variables.get('barWidthOfLevel');
						barWidthOfLevel[index] = ui.value;
						Variables.set('barWidthOfLevel',barWidthOfLevel);
						console.log(Variables);
				    }
				});
		    });
		    $( "#barcode-panel .height-item" ).each(function() {
				$( this ).slider({
					value: Variables.get('barHeight'),
					range: "min",
					min: Variables.get('minHeight'),
      				max: Variables.get('maxHeight'),
					animate: true,
					orientation: "horizontal",
					slide: function( event, ui ) {
						Variables.set('barHeight', ui.value);
				    }
				});
		    });


		}
	})
})
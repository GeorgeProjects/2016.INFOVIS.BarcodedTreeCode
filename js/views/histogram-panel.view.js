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
		events: {

		},
		initialize: function(options){
			var self = this;
			var model = self.model;
		},
		bind: function(){
			var self = this;

			// click on sort buttons
			self.$el.find(".sort-btn").click(function() {
				$("#histogram-panel .sort-btn").removeClass("active");
				$(this).addClass("active");
				var sortMode = $(this).attr("sort-type");//取"time"或"value"
				Variables.set("histogramSortMode",sortMode);
			});
			
			// click on 按树的数值决定高度与树的结点数决定高度之间切换 的 按钮
			self.$el.find(".datadim-btn").click(function() {
				$("#histogram-panel .datadim-btn").removeClass("active");
				$(this).addClass("active");
				var datadimMode = $(this).attr("datadim-type");//取"sum_flowSize"或"nonvirtual_sum_node"
				Variables.set("histogramValueDim",datadimMode);
			});

			self.$el.find("#help").click(function(){
				$(".help_document").dialog("open");
				$(".help_document").append( 
					"<img src=\"css/images/signal_tree_interface_intro.png\" class=\"help_img\" width=\"800px\" >"
			    );
			});

			//帮助文档
			$(".help_document").dialog
			({
				width:"900",
				height:"600",
		        modal: false,             // 创建模式对话框
		        autoOpen: false,         // 只初始化，不显示
		        buttons: {
			        "Back": function() {
			        	d3.selectAll(".help_img").remove()
			        	$(".help_document").append( 
			        		"<img src=\"css/images/signal_tree_interface_intro.png\" class=\"help_img\" width=\"800px\" >"
			        		);
			        },
			        "Next": function() {
			        	d3.selectAll(".help_img").remove()
			        	$(".help_document").append( 
			        		"<img src=\"css/images/signal_tree.png\" class=\"help_img\" width=\"550px\" >"
			        		);
			        }
			    }
		    });

		}
	})
})
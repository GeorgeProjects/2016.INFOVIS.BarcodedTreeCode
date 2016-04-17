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
			console.log("reach!!!!")



			// click on sort buttons
			$("#histogram-panel .sort-btn").click(function() {
				$("#innerTopLeft .sort-btn").removeClass("active");
				$(this).addClass("active");
				sortMode = $(this).attr("sort-type");
				//sortMode为"time"或"size"
				
				console.log("click!!")
				//drawHistogram(choose_displayArray(sortMode,datadimMode),datadimMode);
			});

			// click on 按树的数值决定高度与树的结点数决定高度之间切换 的 按钮
			$("#histogram-panel .datadim-btn").click(function() {
				$("#innerTopLeft .datadim-btn").removeClass("active");
				$(this).addClass("active");
				datadimMode = $(this).attr("datadim-type");
				//datadimMode为"flowsize"或"nodenum"

				console.log("click!!")
				//drawHistogram(choose_displayArray(sortMode,datadimMode),datadimMode);
			});

			$('#histogram-panel #help').click(function(){
				console.log("!!!")
				$("#dialog-confirm").dialog("open");
			});
			$("#histogram-panel #dialog-confirm").dialog
			({
				width:"900",
				height:"600",
		        //modal: true,             // 创建模式对话框
		        autoOpen: false,         // 只初始化，不显示
		        buttons: {
			        "Back": function() {

			        	d3.selectAll(".help_img").remove()
			        	$( ".help_document" ).append( 
			        		"<img src=\"helpdocument/signal_tree_interface_intro.png\" class=\"help_img\" width=\"800px\" >"
			        		);
			        },
			        "Next": function() {
			        	d3.selectAll(".help_img").remove()
			        	$( ".help_document" ).append( 
			        		"<img src=\"helpdocument/signal_tree.png\" class=\"help_img\" width=\"550px\" >"
			        		);
			        }
			    }

		    });





		}
	})
})
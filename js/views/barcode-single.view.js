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


			//linear_tree是unionLinearTree;
			//originNodeArray是get_origin_attr(index);	
			//draw_barcoded_tree(linear_tree, index, real_tree_index, originNodeArray);
/*
			var svg = d3.select('#' + svg_id); 
			var originNodeArray = origin_node_array;
			draw_index(real_tree_index,cur_tree_index);
			repeat2Array = [];
			xCompute = originXCompute;//用于累积当前方块的横坐标
			var acc_depth_node_num=[];//记录各个深度的结点数
			for (var i=0;i<=4;++i){
				acc_depth_node_num[i]=0;
			}
			//先画条码
			for (var i=0;i<linear_tree.length;++i)//对于线性化的并集树中每个元素循环
			{
				acc_depth_node_num[linear_tree[i]._depth]=acc_depth_node_num[linear_tree[i]._depth]+1;
			}
			var selection = svg.selectAll(".rect_background_index-" + barcoded_tree_rectbackground_index)
			.data(linear_tree);
			selection.enter()
			.append('rect')
			.attr('class',function(d,i){
				return classHandler(d,i,barcoded_tree_rectbackground_index);
			})
			.attr('id',function(d,i){
				return idHandler(d,i,barcoded_tree_rectbackground_index);
			})
			.attr('x',function(d,i){
				return originNodeArray[i].x;
			})
			.attr('y',function(d,i){
				return rectY + barcoded_tree_biasy;
			})
			.attr('width',function(d,i){
				return originNodeArray[i].width;
			})
			.attr('height',function(d,i){
				return rectHeight;
			})
			.attr('fill',function(d,i){
				return fillHandler(d,i,real_tree_index,this);
			})
			.on('mouseover',function(d,i){
				if(d3.select(this).attr("fill") == removeColor || d3.select(this).classed('nonexisted'))//虚拟结点不允许交互
				{
					return;
				}
				mouseoverHandler(d,i,svg_id,cur_tree_index,this);
			})
			.on('mouseout',function(d,i){
				if(d3.select(this).attr("fill") == removeColor){
					return;
				}
				mouseoutHandler(d,i,svg_id,cur_tree_index);
			    if(d3.select(this).classed(radialSvgName)){
			    	var treeId = dataList[barcoded_tree_rectbackground_index].id;
			    	ObserverManager.post("percentage", [0 ,-1, treeId]);
			    }
			})
			.on('click',function(d,i){
				if(d3.select(this).attr("fill") == removeColor){
					return;
				}
				var id = d3.select(this).attr('id');
				clickHandlerOrigin(d, i ,id);
			});
			//--------------------------------
			selection.attr('class',function(d,i){
				return classHandler(d,i,barcoded_tree_rectbackground_index);
			})
			.attr('id',function(d,i){
				return idHandler(d,i,barcoded_tree_rectbackground_index);
			})
			.attr('x',function(d,i){
				return originNodeArray[i].x;
			})
			.attr('y',function(d,i){
				return rectY + barcoded_tree_biasy;
			})
			.attr('width',function(d,i){
				return originNodeArray[i].width;
			})
			.attr('height',function(d,i){
				return rectHeight;
			})
			.attr('fill',function(d,i){
				return fillHandler(d,i,real_tree_index,this);
			})
			.on('mouseover',function(d,i){
				if(d3.select(this).attr("fill") == removeColor || d3.select(this).classed('nonexisted'))//虚拟结点不允许交互
				{
					return;
				}
				mouseoverHandler(d,i,svg_id,cur_tree_index,this);
			})
			.on('mouseout',function(d,i){
				if(d3.select(this).attr("fill") == removeColor){
					return;
				}
				mouseoutHandler(d,i,svg_id,cur_tree_index);
			    if(d3.select(this).classed(radialSvgName)){
			    	var treeId = dataList[barcoded_tree_rectbackground_index].id;
			   		ObserverManager.post("percentage", [0 ,-1, treeId]);
			    }
			})
			.on('click',function(d,i){
				if(d3.select(this).attr("fill") == removeColor){
					return;
				}
				var id = d3.select(this).attr('id');
				var thisObj = d3.select(this);
				clickHandlerOrigin(d, i ,id, thisObj);
			});
			selection.exit().remove();
*/		

		}


		/*
		draw_grid: function(svg_id,biasx,biasy,width,height,repeattime)//repeattime决定网格的密度
		{
			var line_num=0;
			if (repeattime<=5)
			{
				console.log("draw_grid error");
			}
			else
			{
				if (reapttime<=20)
					line_num=3;
				else if (repeattime<=40)
					line_num=5;
				else
					line_num=7;
			}
				
			svg = d3.select('#'+svg_id);
			var group=svg.append("g")
						.attr("transform",function(d,i){  
								return "translate(" + (biasx) + "," + (biasy + rectY) + ")";  
							})
						.on("mouseover",function(d,i){
							d3.selectAll('.grid')
								.attr('fill','lightblue');
						})
						.on("click",function(d,i){
						
						})
						.on("mouseout",function(){
							d3.selectAll('.grid')
								.attr('fill','white');
						})
			//外边框
			var cur_button_shape=	"M" + (0) + "," + 0 +
									"L" + (0) + ","+ width + 
									"L" + (height) + ","+ width + 
									"L" + (height) + ","+ 0;
			group.append("path")	
					.attr('class', 'grid')							 		
					.attr("d",cur_button_shape)								 		
					.attr("stroke","black")								 		
					.attr("stroke-width",1)
					.attr("fill",function(d,i){  						
						return "white";  					
					})
			//左上到右下
			for (var i=1;i<line_num;++i)
			{		
				var cur_button_shape=	"M" + (sawToothW-sawToothWidth) + "," + rectHeight * 0.4 +
									"L" + (sawToothW * 0.8-sawToothWidth) + ","+ rectHeight * 0.4 + 
									"L" + (sawToothW-sawToothWidth) + "," + rectHeight * 0.2 +
									"L" + (sawToothW * 0.8-sawToothWidth) + ","+ rectHeight * 0.2 +
									"L" + (sawToothW-sawToothWidth) + ","+ 0 +
									"L" + (0-sawToothWidth) + ","+ 0 +
									"L" + (0-sawToothWidth) + ","+ rectHeight +
									"L" + (sawToothW * 0.8-sawToothWidth) + ","+ rectHeight +
									"L" + (sawToothW-sawToothWidth) + ","+ rectHeight * 0.8 +
									"L" + (sawToothW * 0.8-sawToothWidth) + ","+ rectHeight * 0.8 +
									"L" + (sawToothW-sawToothWidth) + ","+ rectHeight * 0.6 +
									"L" + (sawToothW * 0.8-sawToothWidth) + ","+ rectHeight * 0.6
		
				group.append("path")	
					.attr('class', 'grid')							 		
					.attr("d",cur_button_shape)								 		
					.attr("stroke","black")								 		
					.attr("stroke-width",1)
					.attr("fill",function(d,i){  						
						return "white";  					
					})
					
			}
			//右上到左下
			for (var i=1;i<line_num;++i)
			{				
				group.append("path")	
					.attr('class', 'grid')							 		
					.attr("d",cur_button_shape)								 		
					.attr("stroke","black")								 		
					.attr("stroke-width",1)
					.attr("fill",function(d,i){  						
						return "white";  					
					})
					
			}			
		}
		*/




	}, SVGBase));
});
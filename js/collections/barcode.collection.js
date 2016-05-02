define([
	'require',
	'marionette',
	'underscore',
	'jquery',
	'backbone',
	'config',
	'd3',
	//'models/variables.model',
	'models/barcode.model'
],function(require, Mn, _, $, Backbone, Config, d3, /*Variables,*/ BarcodeModel){
	'use strict';

	return Backbone.Collection.extend({
		model: BarcodeModel,
		
		originalUnreducedSizeXposition:[],//所有的树的unreduced状态下的方块的size和position的数组
		uniontreeReducedSizeXYposition:[],//uniontree的reduced状态下的方块的size和position的数组
		unionTree:[],//间接从basicdata.model获得的并集树的lineartree


		initialize: function(){
			var self = this;
		},
		preprocess: function(){//负责计算collection中每个model的barLocationArray[]
			//已经有了每个collection中每个model的barcodeIndex,barcodeSingleDataArray[]，需要计算对应的barLocationArray[]
			var self = this;

			//1. 计算self.originalUnreducedSizeXposition[]
			var modelsCollection = self.models;
			for(var i = 0;i < modelsCollection.length;i++){
				var linearTree = modelsCollection[i].attributes.barcodeSingleDataArray;
				var singleUnreducedSizeXpositionArray = self.get_origin_unreduced_node_size_xposition_attr(linearTree);
				self.originalUnreducedSizeXposition[i] = singleUnreducedSizeXpositionArray;
			}
			console.log(self.originalUnreducedSizeXposition);

			//2. 计算self.uniontreeReducedSizeXYposition
			self.uniontreeReducedSizeXYposition = self.get_origin_reduced_node_size_xyposition_attr(self.unionTree);
			console.log(self.uniontreeReducedSizeXYposition)
		},
		get_origin_unreduced_node_size_xposition_attr: function(linear_tree){//给定一个tree以后，计算其中每个结点初始渲染（即非压缩情况）的高度，宽度，横轴坐标		
			var widthArray = Variables.get('barWidthOfLevel');//barWidthOfLevel[]是存储每一层的结点的宽度的全局变量
			var rectAllHeight = Variables.get('barHeight'); //barHeight是记录所有bar的默认高度的全局变量
			var rectGap = Variables.get('barInterval');//相邻两个bar的横向间隔

			var originNodeSizeXpositionArray = new Array();
			var xCompute = 0;//记录到目前的结点位置的横坐标
			for(var i = 0; i < linear_tree.length; i++){
				originNodeSizeXpositionArray[i] = new Object();
				originNodeSizeXpositionArray[i].x = xCompute;
				var level = +linear_tree[i]._depth;
				if(linear_tree[i].description != 'virtual'){
					xCompute = xCompute + widthArray[level] + rectGap; 
					originNodeSizeXpositionArray[i].width = widthArray[level];
					originNodeSizeXpositionArray[i].height = rectAllHeight;
				}else{//在非压缩情况下，virtual不画出来，不占地方
					originNodeSizeXpositionArray[i].width = 0;
					originNodeSizeXpositionArray[i].height = 0;
				}
			}
			return originNodeSizeXpositionArray;
		},


		//finished,不确定的地方写在warning里面了
		get_origin_reduced_node_size_xyposition_attr: function(union_tree){//给定uniontree以后，计算其中每个结点初始渲染（即非压缩情况）的高度，宽度，横轴纵轴坐标		
			var widthArray = Variables.get('barWidthOfLevel');//barWidthOfLevel[]是存储每一层的结点的宽度的全局变量
			var rectAllHeight = Variables.get('barHeight'); //barHeight是记录所有bar的默认高度的全局变量
			var rectGap = Variables.get('barInterval');//相邻两个bar的横向间隔

			var uniontreeReducedSizeXYposition = new Array();
			var xCompute = 0;
			
			var initReduceLevel = Variables.get('sumLevel');//warning：原来代码里是10

			var colNum = Variables.get('squarenumOfColumn');//一列中方块的数量
			var divideNum = colNum * 3 - 1;//把每一列当做有这么多个小单元
			var barHeight = rectAllHeight / divideNum * 2;//一个bar占2个小单元
			var barGap = rectAllHeight / divideNum;//bar之间的间隔占1个小单元
			
			for(var i = 0; i < union_tree.length; i++){
				uniontreeReducedSizeXYposition[i] = new Object();
				//获取continuous_repeat_time和max_continuous_time
				var repeatTime = union_tree[i].continuous_repeat_time;
				var maxRepeatTime = union_tree[i].maximum_continuous_repeat_group_size;
				//----------------------------------------------------------
				//获取当前遍历的节点的深度
				var curDepth = union_tree[i]._depth;
				//如果当前的节点的重复次数大于1，并且比当前纪录的缩略的节点更上层，你们就会更新当前纪录的节点，如果比记录的depth更深，那么width为0
				if(repeatTime > 1 && curDepth <= initReduceLevel){
					initReduceLevel = curDepth;
				}else if(repeatTime == 1 && curDepth == initReduceLevel){
					//每个节点只会控制它的字节点，所以遇到相同深度的节点，那么会恢复到原始的level
					initReduceLevel = Variables.get('sumLevel');//warning：原来代码里是10
				}else if(curDepth < initReduceLevel){
					initReduceLevel = initReduceLevel;//warning：这一行的作用？
				}
				uniontreeReducedSizeXYposition[i].x = xCompute;
				if(repeatTime == 1 && curDepth <= initReduceLevel){//此时不被压缩
					//repeatTime为1并且没有受到父亲节点的控制，那么高度为原始的height
					xCompute = xCompute + widthArray[curDepth] + rectGap;
					uniontreeReducedSizeXYposition[i].width = widthArray[curDepth];
					uniontreeReducedSizeXYposition[i].height = rectAllHeight;//占整个列的高度
					uniontreeReducedSizeXYposition[i].y = 0;
				}else if(repeatTime > 1 && (repeatTime - 1)%colNum != 0 && curDepth == initReduceLevel){
					if(repeatTime == maxRepeatTime){//如果是这个模式中的第一个结点
						xCompute = xCompute + widthArray[curDepth] + rectGap;//需要把横坐标推进
					}
					uniontreeReducedSizeXYposition[i].width = widthArray[curDepth];
					uniontreeReducedSizeXYposition[i].height = barHeight;//占一个小方块的高度
					uniontreeReducedSizeXYposition[i].y = (repeatTime - 2) % colNum * (barGap + barHeight);
				}else if(repeatTime > 1 && (repeatTime - 1)%colNum == 0 && curDepth == initReduceLevel){
					xCompute = xCompute + widthArray[curDepth] + rectGap;
					uniontreeReducedSizeXYposition[i].width = widthArray[curDepth];
					uniontreeReducedSizeXYposition[i].height = barHeight;//占一个小方块的高度
					uniontreeReducedSizeXYposition[i].y = (repeatTime - 2) % colNum * (barGap + barHeight);
				}else if(curDepth > initReduceLevel){//第一个重复模式以后的重复模式的子树完全不显示
					uniontreeReducedSizeXYposition[i].width = 0;
					uniontreeReducedSizeXYposition[i].height = barHeight;
					uniontreeReducedSizeXYposition[i].y = 0;
				}
				//warning：原来有uniontreeReducedSizeXYposition[i].y += rectY + barcoded_tree_biasy;
			}
			//change_width(xCompute + margin_draw_svg.right);
			return uniontreeReducedSizeXYposition;
		}
	});
})
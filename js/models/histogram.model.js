define([
	'require',
	'marionette',
	'underscore',
	'jquery',
	'backbone',
	'config',
	'd3',
	'models/basicdata.model',
	'variables'
],function(require, Mn, _, $, Backbone, Config, d3, BasicDataModel,Variables){
	'use strict';

	return Backbone.Model.extend({
		defaults: {
			histogramAttr:[]
		},
		initialize: function(){
			var self = this;
			self.basicDataModel = new BasicDataModel();
		},
		handle_histogram_attr: function(file_lineardata_array){
			var self = this;
			self.basicDataModel.set('fileLinearDataArray',file_lineardata_array);
			//iterate the array to get the histogram information we needed when draw the histogram 
			//store into the histogramAttr

			var fileNameArray = Variables.get('fileNameArray');
			if (fileNameArray.length != file_lineardata_array.length)
				console.log("handle_histogram_attr error, incoherent array length");

			//II. 不同显示模式下需要的对象数组
			//显示结点数 or 显示流量 ； 按时间排序 or 按流量排序
			//histogramDataArray[value_dim][sortmode_dim][]
			//value_dim取"flowSize"或"nodenum"
			//sortmode_dim取"time"或"value
			//histogramDataArray[][][]是对fileInfoData[]的重排序以及不必要属性的筛除

			//histogram和右上角的框中的数据只依赖fileInfoData[]
			//I. fileInfoData[]对象数组, 包含
			//1. 每个数据文件的文件名 .file_name
			//2. 总结点数 .nonvirtual_sum_node
			//3. 各层的结点数的数组 .nonvirtual_node_of_level[]
			//4. 总流量 .sum_flowSize

			self.fileInfoData = [];
			for (var i = 0;i < file_lineardata_array.length;++i)
			{
				var curLinearTree = file_lineardata_array[i];
				var curRoot = curLinearTree[0];
				self.fileInfoData[i] = {};
				self.fileInfoData[i].sum_flowSize = curRoot.trees_values[i];//要求建树时curtree_index与文件的下标对应
				self.fileInfoData[i].file_name = fileNameArray[i];
				self.fileInfoData[i].nonvirtual_node_of_level = _cal_nonvirtual_node_of_level(curRoot);
				self.fileInfoData[i].nonvirtual_sum_node = 0;
				for (var j = 0;j < self.fileInfoData[i].nonvirtual_node_of_level.length;++j)
				{
					self.fileInfoData[i].nonvirtual_sum_node += self.fileInfoData[i].nonvirtual_node_of_level[j];
				}

				//不对root对应的树结构有任何假设，计算这棵树各层的结点数（排除虚拟结点），返回这个数组
				function _cal_nonvirtual_node_of_level(root)
				{
					var virtualNodeDescription = Variables.get('virtualNodeDescription');

					var nonvirtualNodeOfLevel = [];
					var curDepth = 0;

					_traverse(root,curDepth,nonvirtualNodeOfLevel);
					function _traverse(root,depth,nonvirtual_node_of_level)
					{
						if (typeof(root) == 'undefined')
							return;
						if (root.description == virtualNodeDescription)
							return;

						if (typeof(nonvirtual_node_of_level[depth]) == 'undefined')
							nonvirtual_node_of_level[depth] = 0;
						nonvirtual_node_of_level[depth] += 1;

						if (typeof(root.children) == 'undefined')
							return;

						for (var i = 0 ;i < root.children.length;++i)
						{
							_traverse(root.children[i],depth + 1,nonvirtual_node_of_level);
						}
					}
					return nonvirtualNodeOfLevel;
				}
			}
			console.log(self.fileInfoData)
		}	
	});
})
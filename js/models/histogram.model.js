/**
 * [description]
 * @param  {[type]} Config                 [description]
 * @param  {[type]} BasicDataModel 		   [description]
 * @return {[type]}                        [description]
 */
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
],function(require, Mn, _, $, Backbone, Config, d3, BasicDataModel){
	'use strict';

	return Backbone.Model.extend({
		defaults: {
			histogramAttr:[]
		},
		initialize: function(){
			var self = this;
		},
		handle_histogram_attr: function(){
			var self = this;
			self.basicDataModel = window.Datacenter.basicDataModel;
			var fileLinearDataArray = self.basicDataModel.get('fileLinearDataArray');
			self.basicDataModel.set('fileLinearDataArray',fileLinearDataArray);
			//iterate the array to get the histogram information we needed when draw the histogram 
			//store into the histogramAttr
			console.log(fileLinearDataArray);

			var fileNameArray = Variables.get('fileNameArray');
			if (fileNameArray.length != fileLinearDataArray.length)
				console.log("handle_histogram_attr error, incoherent array length");

			//histogram和右上角的框中的数据只依赖fileInfoData[]
			//I. fileInfoData[]对象数组, 包含
			//1. 每个数据文件的文件名 .file_name
			//2. 总结点数 .nonvirtual_sum_node
			//3. 各层的结点数的数组 .nonvirtual_node_of_level[]
			//4. 总流量 .sum_flowSize
			//5. 时间序号 .time_index
			//6. 年月日 .time
			self.fileInfoData = [];//model中真正要给view用的内容
			for (var i = 0;i < fileLinearDataArray.length;++i)
			{
				var curLinearTree = fileLinearDataArray[i];
				var curRoot = curLinearTree[0];
				self.fileInfoData[i] = {};
				self.fileInfoData[i].sum_flowSize = curRoot.trees_values[i];//要求建树时curtree_index与文件的下标对应
				self.fileInfoData[i].file_name = fileNameArray[i];
				self.fileInfoData[i].nonvirtual_node_of_level = _cal_nonvirtual_node_of_level(curRoot);
				self.fileInfoData[i].nonvirtual_sum_node = 0;
				self.fileInfoData[i].time_index = i;
				self.fileInfoData[i].time = fileNameArray[i].substring(0,fileNameArray[i].indexOf('-'));
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
		}	
	});
})
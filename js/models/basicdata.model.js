define([
	'require',
	'marionette',
	'underscore',
	'jquery',
	'backbone',
	'config',
	'd3',
	'variables'
], function(require, Mn, _, $, Backbone, Config, d3, Variables){
	'use strict';

	return Backbone.Model.extend({
		defaults: {
			'fileCSVDataArray': [],
			'fileLinearDataArray': [],
			'unionTree':[]
		},
		load_csv_data: function(def_array){
			var self = this;
			var _fileDataArray = [];
			var fileNameArray = Variables.get('fileNameArray');
			for(var i = 0;i < fileNameArray.length; i++){
				var fileName = fileNameArray[i];
				var def = def_array[i];
				self.load_single_data(fileName, def, i, _fileDataArray);
			}
			$.when.apply($, def_array).done(function(){
				self.set('fileCSVDataArray', _fileDataArray);
			});
		},
		load_single_data: function(file_name, def, index, data_array){
			var dataArray = [];
			d3.csv('data/' + file_name, function(d){
				dataArray = d;
				data_array[index] = d;
				def.resolve();
			});
		},
		linearlize_data: function(def){
			var self = this;
			var _fileCSVDataArray = self.get('fileCSVDataArray');
			var _fileLinearDataArray = [];
			for(var i = 0;i < _fileCSVDataArray.length;i++){
				_fileLinearDataArray[i] = self.packed_csvdata_to_lineartree(_fileCSVDataArray[i], i);
			}
			self.set('fileLinearDataArray', _fileLinearDataArray);
			def.resolve();
		},
		//输入csv读出的数组，返回用数组构建出的tree在线性化后的数组
		packed_csvdata_to_lineartree: function(csv_data_array,curtree_index)
		{
			var self = this;
			self.process_csv(csv_data_array);
			var filteredDataArray = self.filter(csv_data_array);//filteredDataArray是可以直接使用的datalist形式了
			//建树，计算._depth, ._father, .children[], .description, .name, 为叶子节点给出.trees_values[]
			var root = self.build_tree(filteredDataArray,curtree_index);
			self.aggregate_separate_tree_value(root);
			self.reorder_tree(root);
			self.cal_all_pattern_marking(root,true);
			self.cal_routes(root);
			
			var resultArray = self.linearlize(root);
			return resultArray;
		},
		//这个函数是与csv定义的数据结构直接相关的
		//给从csv读出的数组中每个元素增加atm,aal,vpi,cid,flowSize字段
		process_csv: function(csv_data_array)
		{
			var self = this;
			for (var i = 0;i < csv_data_array.length;++i)
			{
				var curElement = csv_data_array[i];
				curElement.atm = curElement['SPE号'];
				curElement.aal = curElement['适配层/百分比例'].substr(0,4);

				curElement.vpi = curElement["VPI/VCI"].substr(0,10);
				if (_has_chinese_character(curElement.vpi))
				{
					console.log('process_csv warning, original vpi contains chinese charater');
				}
				
				//注意cid的可能是两位数，可能是三位数，所以不能直接截两位
				var curCID = +curElement['VPI/VCI'].substr(19,curElement['VPI/VCI'].length-19);
				if (curCID != '')//如果没有cid，不要硬加上
				{
					curElement.cid = curCID;
				}

				var curFlowSize = curElement["比例"];
				curFlowSize = +curFlowSize.substring(curFlowSize.indexOf('：')+1, curFlowSize.indexOf('字'));
				curElement.flowSize = curFlowSize;
			}
			return;

			function _has_chinese_character(str)
			{
				return /.*[\u4e00-\u9fa5]+.*$/.test(str);
			}
		},
		//滤除.'ATM数据'不是'有效数据'的条目
		filter: function(init_data_list)
		{
			var resultDataList = _.filter(init_data_list,
				function (element){
					return (element['ATM数据'] == '有效数据') && (element['VPI/VCI'].length >= 10);//滤掉element['VPI/VCI']是"; CID编号: "的情况
				});
			return resultDataList;
		},
		//给定一个datalist后，将他做成一棵树，返回根结点
		build_tree: function(data_list,curtree_index)
		{
			var LEVEL_NAME_MAPPING = ['root','atm','aal','vpi','cid','undefined'];
			var LEVEL_MAX = LEVEL_NAME_MAPPING.length - 1;//最深是L4，不会有更深的情况
			var VALUE_NAME_MAPPING = ['flowSize'];//数值字段的名字
			return _build_tree(data_list,curtree_index,LEVEL_NAME_MAPPING,LEVEL_MAX,VALUE_NAME_MAPPING);

			//这个方法应该对于不同的深度的数据，叶子节点不都在同一层的数据，在修改后是可扩展的
			//以后只需要调整LEVEL_NAME_MAPPING和SIZE_NAME_MAPPING这两个地方就应该能适应很多不同的数据形式
			//LEVEL_NAME_MAPPING给出了root开始每一层的字段名
			//最高层永远都是手动加的root
			function _build_tree(data_list,curtree_index,level_name_mapping,level_max,value_name_mapping)
			{
				var resultRoot = {//用树结构存储公共树
						_depth:0,//结点所在的深度，在数据转换时d3的预处理函数已经用过depth了，所以这里要用_depth防止被覆盖
						name:"root",
						description:"root",
						_father: undefined
					};

				for (var i = 0;i < data_list.length;++i)//对数组中每条到达最底端的路径进行循环
				{
					var curRoute = data_list[i];
					var curValue = curRoute[VALUE_NAME_MAPPING[0]];//这条路径的最深处的结点的流量
					var prePosition = resultRoot;//记录之前的位置，初始化为resultRoot表示resultRoot已经建出来了

					//从第1层开始走，因为第0层的root已经建出来了
					for (var j = 1;j <= level_max;++j)//从树的root开始往下走，level_max是可以取到的
					{
						var curLevelEntry = level_name_mapping[j];//当前深度对应的条目
						if (typeof(curRoute[curLevelEntry]) != 'undefined')//如果这个route确实能达到这个深度，即确实有这个深度的条目
						{
							var curLevelName = curRoute[curLevelEntry];
							if (typeof(prePosition.children) != 'undefined')//如果建出来的树已经有了children，即以前就达到了这个深度
							{
								var flagFind = 0;
								for (var k = 0;k < prePosition.children.length;++k)//检查children中有没有当前要走的结点
								{
									if (prePosition.children[k].name == curLevelName)
									{
										prePosition = prePosition.children[k];//如果有当前要走的结点，走下去
										flagFind = 1;
										break;
									}
								}
								if (!flagFind)//如果没有当前要走的结点，新开这个结点
								{
									var preLength = prePosition.children.length;
									prePosition.children[preLength] = {
										_depth:j,//结点所在的深度，在数据转换时d3的预处理函数已经用过depth了，所以这里要用_depth防止被覆盖
										name:curLevelName,
										description:curLevelName,
										_father: prePosition
									}
									prePosition = prePosition.children[preLength];
								}
							}
							else//如果prePosition没有children，就需要新开children以达到这个新的深度，然后新建route在该层对应的结点
							{
								prePosition.children = [];
								prePosition.children[0] = {
									_depth:j,//结点所在的深度，在数据转换时d3的预处理函数已经用过depth了，所以这里要用_depth防止被覆盖
									name:curLevelName,
									description:curLevelName,
									_father: prePosition
								}
								prePosition = prePosition.children[0];
							}
						}
						else//如果这个route不能达到这个深度，说明prePosition已经走到底了，此时需要创建trees_values
						{
							if (typeof(prePosition.trees_values) != 'undefined')
							{
								prePosition.trees_values[curtree_index] = (typeof(prePosition.trees_values[curtree_index]) != 'undefined') ? prePosition.trees_values[curtree_index] : 0;
								prePosition.trees_values[curtree_index] += curValue;
							}
							else
							{
								prePosition.trees_values = [];
								prePosition.trees_values[curtree_index] = curValue;
							}
							break;//之前已经走到底了
						}
					}
				}

				return resultRoot;
			}
		},
		
		//返回一棵树的深拷贝，并且强行认为source是根，赋其._father为undefined
		//如果传入了father，会把source的._father取为father
		deep_copy_tree: function(source,father)
		{
			var result = _original_deep_copy(source);
			_add_father(result);
			if (typeof(father) != 'undefined')
				result._father = father;
			return result;

			//把除了_father以外的所有部分都深拷贝好，_father不能深拷贝，否则会无穷递归
			function _original_deep_copy(source) { 
				if (_.has(source,'length'))//如果是个数组
					var result = [];
				else
					var result = {};
				for (var key in source) {
					if (key != '_father')//确保不爆栈
						result[key] = typeof source[key] === 'object'? _original_deep_copy(source[key]): source[key];
				} 
				return result; 
			}

			//给没有._father字段的root对应的树中每个结点补上._father字段
			function _add_father(root)
			{
				root._father = undefined;
				_traverse_add_father(root);
				function _traverse_add_father(root)
				{
					if (_.has(root,'children'))
					{
						for (var i = 0;i < root.children.length;++i)
						{
							root.children[i]._father = root;
							_traverse_add_father(root.children[i]);
						}
					}
					return;
				}
			}	
		},
		//在只有最底层结点具有.trees_values[]的情况下，把数值往上层聚集
		aggregate_separate_tree_value:function(root)
		{
			//把root的children的值聚集到root上
			_traverse_aggregate_separate_tree_value(root);
			function _traverse_aggregate_separate_tree_value(root)
			{
				if ( ! _.has(root,'children'))
				{
					if ( ! _.has(root,'trees_values'))
					{
						console.log('_traverse_aggregate_separate_tree_value error',root)
					}
					return root.trees_values;
				}
				for (var i = 0;i < root.children.length;++i)
				{
					var curChild = root.children[i];
					//递归，获得当前的child的聚集后的.trees_values
					var curChildTreesValues = _traverse_aggregate_separate_tree_value(curChild);
					if ( ! _.has(root,'trees_values'))
					{
						root.trees_values = [];
					}
					for (var j = 0;j < curChildTreesValues.length;++j)
					{
						if ( ! _.has(curChildTreesValues,j))
						{
							continue;
						}
						root.trees_values[j] = (typeof(root.trees_values[j]) != 'undefined') ? root.trees_values[j] : 0;
						root.trees_values[j] = root.trees_values[j] + curChildTreesValues[j];
					}
				}
				return root.trees_values;
			}
			return;
		},
		//判断一个数字或者字符串里面有没有数字以外的值
		isInt: function(str){
			var reg = /^(-|\+)?\d+$/ ;
			return reg.test(str);
		},
		//传入root以后，将tree的每个结点的孩子的顺序，按照字典序从小到大，对每个结点的children重新排序
		reorder_tree:function(root)
		{
			_reorder_tree_traverse(root);
			function _reorder_tree_traverse(root)
			{
				if (typeof(root) == 'undefined')
					return;

				var curChildrenGroup = root.children;
				if (typeof(root.children) == 'undefined')
					return;
				
				curChildrenGroup.sort(function(a,b){
					if (a.name > b.name)//按名字的字典序排序
						return 1;
					else
						return -1;
					//不能直接写return a.name > b.name;否则会排序出错
				})
				
				//对每个子递归地整理顺序
				for (var i = 0;i < curChildrenGroup.length;++i)
				{
					_reorder_tree_traverse(root.children[i]);
				}
			}
			return;
		},	
		//为root对应的树中所有节点求
		//1. continuous_repeat_time
		//2. nth_different_subtree
		//3. maximum_continuous_repeat_group_size
		//4. should_add_virtual_node标记是否需要增加虚拟结点
		cal_all_pattern_marking: function(root,should_add_virtual_node)
		{
			var self = this;
			if (typeof(root._father) != 'undefined')//要求root不能有father
			{
				console.log('cal_all_pattern_marking, illegal input: root with father',root);
				return;
			}

			//1. 处理root本身
			root.continuous_repeat_time = 1;
			root.nth_different_subtree = 1;
			root.maximum_continuous_repeat_group_size = 1;

			//2. 处理root所在的树中root以外的部分
			_traverse_cal_pattern_marking(root);
			function _traverse_cal_pattern_marking(root)
			{
				//传入一个结点后，把这个结点对应的子树全都变成虚拟的点
				//1. 改description
				//2. 设置size为'undefined'，trees_values数组全为'undefined'
				//3. 设置root本身的.continuous_repeat_time为1
				function _virtualize(root)
				{
					root.continuous_repeat_time = 1;//假定虚拟结点root一定处在他所在的group中的第一个的位置
					var virtualNodeDescription = Variables.get('virtualNodeDescription');
					_traverse_virtualize(root, virtualNodeDescription);
					function _traverse_virtualize(root, virtual_node_description)
					{
						root.description = virtual_node_description;
						if (_.has(root,'size'))
							root.size = undefined;
						if ( ! _.has(root,'trees_values'))
						{
							console.log("_traverse_virtualize error, root has no .trees_values[]");
							return;
						}
						for (var i = 0;i < root.trees_values.length;++i)
						{
							if (_.has(root.trees_values,i))
								root.trees_values[i] = undefined;
						}
						//对每个子递归计算
						var cur_children_group = root.children;
						if ( !  _.has(root,'children'))
							return;
						var cur_children_group_size = cur_children_group.length;
						for (var i = 0;i < cur_children_group_size;++i)
						{
							_traverse_virtualize(root.children[i], virtual_node_description);
						}
					}
				}

				//比较root1和root2对应的树的结构是否完全相同，返回0或1
				function _tree_structural_equality_compare(root1,root2)
				{
					if (typeof(root1) == 'undefined' && typeof(root2) == 'undefined')
						return 1;
					if (typeof(root1) != 'undefined' && typeof(root2) != 'undefined')
					{
						if (typeof(root1.children) == 'undefined' && typeof(root2.children) == 'undefined')
							return 1;
						if (typeof(root1.children) != 'undefined' && typeof(root2.children) != 'undefined')
						{
							if (root1.children.length == root2.children.length)
							{
								var flag = 1;
								for (var i = 0;i < root1.children.length;++i)
								{
									flag = flag && _tree_structural_equality_compare(root1.children[i],root2.children[i]);
								}
								return flag;
							}
						}
					}
					return 0;
				}

				if (typeof(root) == 'undefined')
					return;
				if ( ! _.has(root,'children'))
					return;

				var rootChildrenGroup = root.children;
				for (var i = 0;i < rootChildrenGroup.length;++i)
				{
					var curChild = rootChildrenGroup[i];
					if (i == 0)//特殊处理.children[]中的第一个孩子
					{
						curChild.continuous_repeat_time = 1;
						curChild.nth_different_subtree = 1;
					}
					else//如果不是.children[]中第一个孩子，去比较这个孩子和前一个孩子的结构是否相同
					{
						var preChild = rootChildrenGroup[i-1];
						if (_tree_structural_equality_compare(curChild,preChild))//这一个节点和前一个节点结构相同，说明还在同一组
						{
							curChild.continuous_repeat_time = preChild.continuous_repeat_time + 1;
							curChild.nth_different_subtree = preChild.nth_different_subtree;
						}
						else//这一个节点和前一个节点结构不同，说明前一组结束，这一组开始
						{
							//1. 标记新一组的开始
							curChild.continuous_repeat_time = 1;
							curChild.nth_different_subtree = preChild.nth_different_subtree + 1;

							var groupSizeWithoutVirtualNode = preChild.continuous_repeat_time;
							var groupStartIndex = i - groupSizeWithoutVirtualNode;
							var groupEndIndex = i - 1;
							//2. 给出旧的组的maximum_continuous_repeat_group_size属性
							for (var j = groupStartIndex; j <= groupEndIndex;++j)
							{
								rootChildrenGroup[j].maximum_continuous_repeat_group_size = groupSizeWithoutVirtualNode;
							}

							//3. 对旧的组，如果需要的话，加virtual node进行修正
							if (should_add_virtual_node)
							{
								if (groupSizeWithoutVirtualNode >= 2)//如果旧的组中有至少2个结点，则需要加虚拟结点
								{
									for (var j = groupStartIndex; j <= groupEndIndex;++j)
									{
										rootChildrenGroup[j].maximum_continuous_repeat_group_size += 1;//增加虚拟结点的贡献
										rootChildrenGroup[j].continuous_repeat_time += 1;//增加虚拟结点的贡献
									}
									var virtualNode = self.deep_copy_tree(rootChildrenGroup[groupStartIndex],root);//复制第一个节点作为虚拟结点
									_virtualize(virtualNode);
									rootChildrenGroup.splice(groupStartIndex,0,virtualNode);
									++i;//补偿增加了一个结点造成的循环下标落后
								}
							}

						}
					}
					if (i == rootChildrenGroup.length-1)//特殊处理最后一个结点的情况，需要检查他是不是旧的组的结束
					{
						var groupSizeWithoutVirtualNode = curChild.continuous_repeat_time;
						var groupStartIndex = i - groupSizeWithoutVirtualNode + 1;
						var groupEndIndex = i;
						//1. 给出旧的组的maximum_continuous_repeat_group_size属性
						for (var j = groupStartIndex; j <= groupEndIndex;++j)
						{
							rootChildrenGroup[j].maximum_continuous_repeat_group_size = groupSizeWithoutVirtualNode;
						}

						//2. 对旧的组，如果需要的话，加virtual node进行修正
						if (should_add_virtual_node)
						{
							if (groupSizeWithoutVirtualNode >= 2)//如果旧的组中有至少2个结点，则需要加虚拟结点
							{		
								for (var j = groupStartIndex; j <= groupEndIndex;++j)
								{
									rootChildrenGroup[j].maximum_continuous_repeat_group_size += 1;//增加虚拟结点的贡献
									rootChildrenGroup[j].continuous_repeat_time += 1;//增加虚拟结点的贡献
								}
								var virtualNode = self.deep_copy_tree(rootChildrenGroup[groupStartIndex],root);//复制第一个节点作为虚拟结点
								_virtualize(virtualNode);
								rootChildrenGroup.splice(groupStartIndex,0,virtualNode);
								++i;//补偿增加了一个结点造成的循环下标落后
							}
						}
					}
				}
				//对每个子递归计算
				for (var i = 0;i < root.children.length;++i)
				{
					_traverse_cal_pattern_marking(root.children[i]);
				}
				return;
			}
			return;
		},
		//给root对应的树中的所有节点存储路径
		//调用前要求root对应的子树中所有节点的._father字段全部计算正确
		cal_routes: function (root)
		{
			var self = this;
			root.route = (typeof(root._father) != 'undefined') ? _.clone(root._father.route) : [];//赋值father的route时要深拷贝
			root.route.push(root.name);

			//对每个子递归计算
			if ( ! _.has(root,'children'))
				return;
			for (var i = 0;i < root.children.length;++i)
			{
				self.cal_routes(root.children[i]);
			}
		},
		//把root对应的树线性化以后返回线性化出来的数组
		linearlize: function (root)
		{
			var resultLinearTree = [];
			//traverse递归中要保持的static变量
			var cur_index = 0;
			//传入树根和用于存储线性化的树的数组
			//traverse中按深度优先进行线性化以及标记每个结点的linear_index
			function _traverse_linearlize(root,target_linear_tree)
			{
				if (typeof(root) == 'undefined')
					return;

				root.linear_index = cur_index;//记录每个结点在数组中的index
				target_linear_tree[cur_index] = root;

				if (typeof(root.children) == 'undefined')
					return;

				var curRootChildrenNum = root.children.length;
				for (var i = 0;i < curRootChildrenNum;++i)
				{
					cur_index = cur_index + 1;
					_traverse_linearlize(root.children[i],target_linear_tree);
				}
			}
			_traverse_linearlize(root,resultLinearTree);
			return resultLinearTree;
		},

		//计算自身的fileLinearDataArray中所有的树合成的并集树，存到uniontree里面
		cal_union_tree: function()
		{
			var self = this;
			var fileCSVDataArray = self.get('fileCSVDataArray');
			var unionRoot = [];
			for(var i = 0;i < fileCSVDataArray.length;i++){
				var curCsvDataArray = fileCSVDataArray[i];
				self.process_csv(curCsvDataArray);
				var filteredDataArray = self.filter(curCsvDataArray);//filteredDataArray是可以直接使用的datalist形式了
				//建树，计算._depth, ._father, .children[], .description, .name, 为叶子节点给出.trees_values[]
				var root = self.build_tree(filteredDataArray,i);
				//self.aggregate_separate_tree_value(root);
				if (i == 0){
					unionRoot = self.deep_copy_tree(root);
				}
				else{
					self.merge_trees(root,unionRoot);
				}
			}
			self.aggregate_separate_tree_value(unionRoot);
			self.reorder_tree(unionRoot);
			self.cal_all_pattern_marking(unionRoot,true);
			self.cal_routes(unionRoot);
			var unionTreeArray = self.linearlize(unionRoot);
			self.set('unionTree',unionTreeArray);
		},

		//将operator_root合并到target_root上，并且要求这两个root都是已经实际建出来的树的结点，而不能为空
		//只调整.trees_values[]和.children[]
		merge_trees: function(operator_root,target_root)
		{
			var self = this;
			if (operator_root.name != target_root.name)
			{
				console.log("merge_trees name error");
				return;
			}
				
			//1.合并.trees_values[]
			if (_.has(operator_root,'trees_values'))
			{
				if ( ! _.has(target_root,'trees_values'))
				{
					target_root.trees_values=[];
				}
				for (var i = 0;i < operator_root.trees_values.length;++i)
				{	
					if ( ! _.has(operator_root.trees_values,i))//跳掉没有的
					{
						continue;
					}
					target_root.trees_values[i] = _.has(target_root.trees_values,i) ? target_root.trees_values[i] : 0;//原来有就累加上去
					target_root.trees_values[i] += operator_root.trees_values[i];
				}
			}
			//2.合并.children[]
			if (_.has(operator_root,'children'))
			{
				if ( ! _.has(target_root,'children'))
				{
					target_root.children = [];
				}
				for (var i = 0;i < operator_root.children.length;++i)
				{
					var curOperatorChild = operator_root.children[i];
					var flagFind = 0;
					for (var j = 0; j < target_root.children.length;++j)
					{
						var curTargetChild = target_root.children[j];
						if (curTargetChild.name == curOperatorChild.name)
						{
							flagFind = 1;
							self.merge_trees(curOperatorChild,curTargetChild);//递归
						}
					} 
					if (flagFind == 0)
					{
						target_root.children[target_root.children.length] = self.deep_copy_tree(curOperatorChild,target_root);
					}
				}
			}
			return;
		}
	});
});
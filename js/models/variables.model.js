/**
 * []
 */
define([
	'require',
    'marionette',
    'underscore',
    'jquery',
    'backbone'
], function(require, Mn, _, $, Backbone){
	'use strict';

	return window.Variables = new (Backbone.Model.extend({
        defaults: {
            'finishInit':false,
            'loading':true, //whether loading page show

            //histogram和barcode都需要的变量
            'virtualNodeDescription' : 'virtual',//给virtual的结点的description的标签
            
            'lastSelectBarIndex' : 0,//存储最后一个被选中的bar对应的数据在文件数组中的index，即时间维的index
            'maintainingLastSelectBar' : true,//标记当前是否正在单击选着lastSelectBar
            'selectBarArray' : [0],//双击选中的一组bar

            //barcode需要的变量
            'sumLevel' : 5,//手动设置的总层数

            'compressBarcodeMode':false,//标记当前处在barcode的完全展开或者压缩状态
            'displayedLevel':[],//当前应该被展示的层级的集合
            'highlightSibling':false,//标记mouseover时是否highlightsibling
            'highlightCousin':false,//标记mouseover时是否highlightcousin
            'minWidth':1,//设置bar允许的最小宽度
            'maxWidth':30,//设置bar允许的最大宽度
            'barWidthOfLevel':[30,20,10,5,2],//标记各层的bar的宽度
            'minHeight':1,//设置bar允许的最小高度
            'maxHeight':100,//设置bar允许的最大高度
            'barHeight':20,//标记所有bar的高度
            
            //histogram需要的变量
            'histogramSortMode' : 'time',//取"time"或"value"
            'histogramValueDim' : 'sum_flowSize',//取"sum_flowSize"或"nonvirtual_sum_node"

            'fileNameArray': [  '20120121-R06-81XX.csv',
                                '20120121-R07-75XX.csv',
                                '20120121-R07-77XX.csv',
                                '20120121-R08-76XX.csv',
                                '20120122-R05-72XX.csv',
                                '20120122-R05-73XX.csv',
                                '20120123-R05-72XX.csv',
                                '20120124-R05-72XX.csv',
                                '20120125-R05-72XX.csv',
                                '20120126-R05-72XX.csv',
                                '20120127-R05-72XX.csv',
                                '20120128-R05-72XX.csv',
                                '20120129-R05-72XX.csv',
                                '20120601-R05-73XX.csv',
                                '20120602-R05-73XX.csv',
                                '20120603-R05-73XX.csv',
                                '20120605-R05-73XX.csv',
                                '20120606-R05-73XX.csv',
                                '20120607-R05-73XX.csv',
                                '20120608-R05-73XX.csv',
                                '20120609-R05-73XX.csv',
                                '20120610-R05-73XX.csv',
                                '20120611-R05-73XX.csv',
                                '20120612-R05-73XX.csv',
                                '20120613-R05-72XX.csv',
                                '20120613-R05-73XX.csv',
                                '20120614-R05-73XX.csv',
                                '20120615-R05-72XX.csv',
                                '20120615-R05-73XX.csv',
                                '20120616-R05-73XX.csv',
                                '20120617-R05-72XX.csv',
                                '20120617-R05-73XX.csv',
                                '20120618-R05-72XX.csv',
                                '20120618-R05-73XX.csv',
                                '20120619-R05-73XX.csv',
                                '20120621-R05-72XX.csv',
                                '20120621-R05-73XX.csv',
                                '20120622-R05-72XX.csv',
                                '20120622-R05-73XX.csv',
                                '20120623-R05-72XX.csv',
                                '20120623-R05-73XX.csv',
                                '20120625-R05-72XX.csv',
                                '20120625-R05-73XX.csv',
                                '20120729-R05-73XX.csv',
                                '20121210-R05-72XX.csv',
                                '20121211-R05-72XX.csv',
                                '20121212-R05-72XX.csv',
                                '20121217-R05-72XX.csv',
                                '20121217-R05-73XX.csv',
                                '20121218-R05-72XX.csv',
                                '20121218-R05-73XX.csv',
                                '20121220-R05-72XX.csv',
                                '20121220-R05-73XX.csv',
                                '20121222-R05-72XX.csv',
                                '20121222-R05-73XX.csv',
                                '20121223-R05-72XX.csv',
                                '20121223-R05-73XX.csv',
                                '20121224-R05-72XX.csv',
                                '20130101-R05-73XX.csv',
                                '20130101-R06-81XX.csv',
                                '20130101-R07-77XX.csv',
                                '20130101-R08-76XX.csv',
                                '20130102-R05-73XX.csv',
                                '20130103-R05-72XX.csv',
                                '20130103-R05-73XX.csv',
                                '20130104-R05-72XX.csv',
                                '20130104-R05-73XX.csv',
                                '20130105-R05-72XX.csv',
                                '20130105-R05-73XX.csv',
                                '20130106-R05-72XX.csv',
                                '20130106-R05-73XX.csv',
                                '20130107-R08-76XX.csv',
                                '20130108-R05-72XX.csv',
                                '20130108-R05-73XX.csv',
                                '20130108-R08-76XX.csv',
                                '20130109-R05-72XX.csv',
                                '20130109-R05-73XX.csv',
                                '20130109-R08-76XX.csv',
                                '20130110-R05-72XX.csv',
                                '20130110-R05-73XX.csv',
                                '20130111-R05-72XX.csv',
                                '20130508-R05-72XX.csv',
                                '20130508-R05-73XX.csv',
                                '20130801-R05-72XX.csv',
                                '20130801-R05-73XX.csv',
                                '20130802-R05-72XX.csv',
                                '20130802-R05-73XX.csv',
                                '20130803-R05-72XX.csv',
                                '20130803-R05-73XX.csv',
                                '20130804-R05-72XX.csv',
                                '20130804-R05-73XX.csv',
                                '20130805-R05-72XX.csv',
                                '20130805-R05-73XX.csv']
                },
        initialize: function(){
            
        },
    }))();
});
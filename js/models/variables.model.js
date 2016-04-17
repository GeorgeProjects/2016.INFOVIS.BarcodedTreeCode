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
            'virtualNodeDescription' : 'virtual',//给virtual的结点的description的标签
            'currentSelectBarIndex' : 0,//存储最后一个被选中的bar对应的数据在文件数组中的index，即时间维的index
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
    }))();
});
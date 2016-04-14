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
            'fileNameArray': ['20120121-R06-81XX.csv', '20120121-R07-75XX.csv']
        },
    }))();
});
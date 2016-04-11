define([
	'require',
    'marionette',
    'underscore',
    'jquery',
    'backbone'
], function(require, Mn, _, $, Backbone){
	'use strict';

	return window.Config = new (Backbone.Model.extend({
		defaults:{
		},

	}))();
});
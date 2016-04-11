/**
 * Created by aji on 15/8/29.
 * Backbone不支持namespace
 * 需要改写_createElement函数
 * 另外改写_setElement函数,this.d3为d3 selector
 */
define(['jquery', 'underscore', 'backbone', 'd3'], function ($, _, Backbone, d3) {
    'use strict';

    return {
        nameSpace: d3.ns.prefix.svg,

        _createElement: function(tagName) {
            return document.createElementNS(_.result(this, 'nameSpace'), tagName);
        },

        _setElement: function(el) {
            Backbone.View.prototype._setElement.apply(this, arguments);
            this.d3el = d3.select(this.el);
        },

        d3: function(selector) {
            return this.d3el.select(selector);
        },

        d3All: function(selector) {
            return this.d3el.selectAll(selector);
        }
    };
});

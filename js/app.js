define([
    'require',
    'marionette',
    'backbone',
    'underscore',
    'controller',
    'router',
    'jquery',
    'nprogress',
    'bootstrap',
], function (require, Mn, Backbone, _, Controller, Router, $, NProgress, highstock) {
    'use strict';

    var RootView = Mn.LayoutView.extend({
        el: 'body',
        regions: {
            'app': '#app'
        }
    });

    var App = Mn.Application.extend({
        onStart: function() {
            this.appRoot = new RootView();
            window.router = this.router = new Router({
                controller: new Controller({appRoot: this.appRoot})
            });
            if (Backbone.history) {
                Backbone.history.start({
                    root: '/',
                    pushState: true
                });
            }
        },
        onBeforeStart: function () { // 一些设置工作
            var _this = this;
            $(document).on('click', 'a[href]:not([data-bypass])', function (evt) {
                // Get the absolute anchor href.
                var href = { prop: $(this).prop("href"), attr: $(this).attr("href") };
                // Get the absolute root.
                var root = location.protocol + "//" + location.host + _this.root;
                // Ensure the root is part of the anchor href, meaning it's relative.
                if (href.prop.slice(0, root.length) === root) {
                    // Stop the default event to ensure the link will not cause a page
                    // refresh.
                    evt.preventDefault();
                    // `Backbone.history.navigate` is sufficient for all Routers and will
                    // trigger the correct events. The Router's internal `navigate` method
                    // calls this anyways.  The fragment is sliced from the root.
                    Backbone.history.navigate(href.attr, {trigger: true});
                }
            });
            NProgress.configure({
                showSpinner: false
            });
            window.NProgress = NProgress;
        }
    });
    return App;
});
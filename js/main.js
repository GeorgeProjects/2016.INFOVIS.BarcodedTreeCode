require.config({
    paths: {
        // libs loader
        'text': '../bower_components/requirejs-text/text',
        
        'jquery': ['../bower_components/jquery/dist/jquery.min'],
        'jquery-ui':['../bower_components/jquery-ui/jquery-ui'],
        'underscore': ['../bower_components/underscore/underscore-min'],
        'bootstrap': ['../bower_components/bootstrap/dist/js/bootstrap.min'],
        'backbone': ['../bower_components/backbone/backbone-min'],
        'nprogress': ['../bower_components/nprogress/nprogress'],
        'marionette': ['../bower_components/marionette/lib/backbone.marionette.min'],
        'backbone.relational': ['../bower_components/backbone-relational/backbone-relational'],
        'd3': ['../bower_components/d3/d3'],
        'd3Tip': ['../bower_components/d3-tip/d3-tip'],
        'highstock': ['../bower_components/highstock/highstock'],

        'backbone.routefilter': '../bower_components/backbone.routefilter/dist/backbone.routefilter.min',
        "reconnectingWebSocket":'../bower_components/reconnecting-websocket/reconnecting-websocket',

        // templates path
        'templates': '../templates',

        'communicator':'controller/communicator',
        'datacenter': 'models/datacenter.model',
        'config': 'models/config.model',
        'variables': 'models/variables.model',
        'barcodeCollection':'collections/barcode.collection'
    }
});

//在外面的require的内容加在完以后，才会加载内部的require中的内容
require(['jquery', 'underscore', 'd3'], function($, _, d3) {
    'use strict';
    require(['backbone', 'bootstrap', 'highstock', 'd3Tip'], function(Backbone, Bootstrap, BsDatapicker, d3Tip, barcodeCollection) {
        require(['app'], function (App) { // require.js shim不能与cdn同用,因此3层require,非amd module需要如此
            $(document).ready(function(){
                var app = new App();
                app.start();
            });
        });
    });
});

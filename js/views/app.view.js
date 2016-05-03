define([
    'require',
    'marionette',
    'underscore',
    'jquery',
    'backbone',
    'datacenter',
    'variables',
    'views/histogram.view',
    'views/barcode.view',
    'text!templates/layoutDiv.tpl',
    'jquery-ui',
], function(require, Mn, _, $, Backbone, Datacenter, Variables, HistogramView, BarcodeView, Tpl, jqueryUI) {
    'use strict';

    return Mn.LayoutView.extend({

        tagName: 'div',

        template:_.template(Tpl),

        attributes:{
            'style' : 'width: 100%; height:100%;',
            'id': 'graph-layout',
            'class':'menu-show',
        },

        regions:{
            'histogramView': '#histogram-view',
            'barcodeView': '#barcode-view',
        },

        initialize: function(options) {
            var self = this;
            options = options || {};
            $(document).ready(function(){
                self.listenTo(Variables, 'change:finishInit', function(model, finishInit){
                    if(finishInit) {
                        self.loaded();
                        console.log('init finish');
                        Variables.set("loading",false);
                    }
                });
                self.listenTo(Variables, 'change:loading', function(model, loading){
                    if(loading){
                        $("#loading").removeClass("hidden");
                    }else{
                        $("#loading").addClass("hidden");
                    }
                });
                Datacenter.start();
            });
        },
        loaded: function(){
            var self = this;
            self.showChildView('histogramView', new HistogramView());
            self.showChildView('barcodeView', new BarcodeView());

            //允许调整div的尺寸
            $(function() {
                $( "#histogram-view" ).resizable({
                    autoHide: true,
                    handles: 's',
                    stop: function(event,ui){
                        //TODO re-rendering
                        var deltaHeight = ui.size.height - ui.originalSize.height;
                        var barcodeViewOriginalHeight = $( "#barcode-view" ).height();
                        $( "#barcode-view" ).height(barcodeViewOriginalHeight - deltaHeight);
                        var barcodeViewTop = $( "#barcode-view").offset().top;
                        $( "#barcode-view").offset({top: (barcodeViewTop+deltaHeight)});
                    }
                });
            });
            $(function() {
                $( "#barcode-view" ).resizable({
                    autoHide: true,
                    handles: 'n',
                    stop: function(event,ui){
                        var deltaHeight = ui.size.height - ui.originalSize.height;
                        var histogramViewOriginalHeight = $( "#histogram-view" ).height();
                        $( "#histogram-view" ).height(histogramViewOriginalHeight - deltaHeight);
                    }
                });
            });
        }
    });
});
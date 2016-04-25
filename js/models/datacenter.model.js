/**
 * [description] control the data stream of this program, models only initialize once, 
 * 				 and other part get the model from the datacenter
 * @param  {[type]} Variables                 [Needed data]
 * @param  {[type]} Config                    [????????]
 * @param  {[type]} BasicDataModel            [correspond the overview initialize data]
 * @param  {[type]} HistogramModel            [correspond the histogram view]
 * @param  {[type]} BarcodeModel              [correspond one line barcode view]
 * @param  {[type]} BarcodeCollection 		  [correspond several barcode view ]
 */
define([
	'require',
 	'marionette',
 	'underscore',
 	'jquery',
 	'backbone',
 	'variables',
 	'config',
 	'models/basicdata.model',
 	'models/histogram.model',
 	'models/barcode.model',
 	'collections/barcode.collection'
], function(require, Mn, _, $, Backbone, Variables, Config, BasicDataModel, HistogramModel,
	BarcodeModel, BarcodeCollection){
	'use strict';

	return window.Datacenter = new (Backbone.Model.extend({
		defaults:{

		},
		initialize: function(url){
			var self = this;
			self.basicDataModel = new BasicDataModel();
			self.histogramModel = new HistogramModel();
			self.barcodeModel = new BarcodeModel();
			self.barcodeCollection = new BarcodeCollection();
 		},
 		/**
 		 * [start description: control the data stream]
 		 * @return {[type]} [description]
 		 */
 		start: function(){
 			var self = this;
 			var deferLoadCSVDataArray = [];
 			//get the fileNameArray from the variables model
 			var fileNameArray = Variables.get('fileNameArray');
 			var fileNameArrayLength = fileNameArray.length;
 			//set the defer object of loading data and linearize data
 			for(var i = 0;i < fileNameArrayLength;i++){
 				deferLoadCSVDataArray[i] = $.Deferred();
 			}
 			var deferLinearData = $.Deferred();
 			//load all the csv data
 			self.basicDataModel.load_csv_data(deferLoadCSVDataArray);
 			$.when.apply($, deferLoadCSVDataArray).done(function(){
 				self.basicDataModel.linearlize_data(deferLinearData);
 			});
 			//after getting the linear data, preprocess the data of histogramView and collectionView
 			$.when(deferLinearData).done(function(){
 				self.pre_histogram_data();
 				self.pre_collection_data();
 				//set the init process start
 				Variables.set("finishInit",true);
 			});
 		},
 		/**
 		 * [pre_histogram_data description: the preprocess for the histogram data]
 		 * @return {[type]} [description]
 		 */
 		pre_histogram_data: function(){
 			var self = this;
			self.histogramModel.handle_histogram_attr();
 		},
 		/**
 		 * [pre_collection_data description: the preprocess of the collection data]
 		 * @return {[type]} [description]
 		 */
 		pre_collection_data: function(){
 			var self = this;
 			var fileLinearDataArray = self.basicDataModel.get('fileLinearDataArray');
 			var barcodeList = new Array();
 			for(var i = 0; i < fileLinearDataArray.length;i++){
 				var barcodeModel = new BarcodeModel({barcodeIndex: i, barcodeSingleDataArray: fileLinearDataArray[i]});
 				self.barcodeCollection.push(barcodeModel)
 			}
 			self.barcodeCollection.preprocess();
 		}
	}))();
});
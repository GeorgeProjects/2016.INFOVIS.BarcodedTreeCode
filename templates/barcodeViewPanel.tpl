<span class="btn btn-default btn-xs" id="state-change">  
  	<span class="glyphicon glyphicon-transfer"></span>
</span>
<span class="btn-group level_display_control" role="group" id="selectable">
	<!-- 此处会在barcode-panel.view中按照Variables中的sumLevel来append合适的按钮数 -->
</span>
<span id="checkbox_group">
	<label>
		<input type="checkbox" class="highlight_control" id="highlight_sibling" unchecked>sibling
	</label>
	<label>
		<input type="checkbox" class="highlight_control" id="highlight_cousin" unchecked>cousin
	</label>
</span>
<span id="barcode_size_controller_group">
	<div class="btn-group" role="group">
	    <button type="button" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="slider-control-width">Width
	    	<span class="caret"></span><!--加上小三角-->
	    </button>
	    <ul class="dropdown-menu" id="width-menu">
	    	<!-- 此处会在barcode-panel.view中按照Variables中的sumLevel来append合适的slider数 -->
	    </ul>
  	</div>

  	<div class="btn-group" role="group">
	    <button type="button" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="slider-control-height">Height
	    	<span class="caret"></span><!--加上小三角-->
	    </button>
	    <ul class="dropdown-menu" id="height-menu">
	    	<span class="height-item"></span>
	    </ul>
  	</div>
</span>	
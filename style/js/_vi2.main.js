/*
  Javascript to init and configure viwiki.
  
  	@author: niels.seidel@nise81.com
  	@version: '0.01'
		@license: MIT License -- http://www.opensource.org/licenses/mit-license.php
  	@changes:
		@compile: sudo couchapp push . http://admin:test@127.0.0.1:5984/todoapp 
		@compile_alt: cd /var/www/elearning/vi2 && sudo couchapp push http://admin:test@127.0.0.1:5984/todoapp
		@run: http://127.0.0.1:5984/todoapp/_design/vi2/index.html
		@db_management: http://127.0.0.1:5984/_utils/database.html?vi2
		
		list:  http://127.0.0.1:5984/vi2/_design/vi2/_list/streams/videos
		single:  http://127.0.0.1:5984/vi2/_design/vi2/_show/stream/5d5345e6a281afc59a4c2f741abbbc74#

*/
$('#debug').empty();
function debug(msg){
  $('#debug').append('<p>'+msg+'</p>');
}


/*
*
*/
var Vi2List = $.inherit({
	app : null,
	selector : '',
	videos : [],

  __constructor : function(app, listSelector){			  
	  this.app = app;
	  this.selector = listSelector;
	  this.videos = new Array();
	},
					  
	//
	add : function(item) {
		$(this.selector).prepend(item.html());
		this.videos.push(item);
	},

	//
	remove : function(json) {
		var newVideos = new Array();
		for(var i=0;i<this.videos.length;i++) {
			if(this.videos[i]._id != json.id){
				newVideos.push(this.videos[i]);
			}
		}
		this.videos = newTasks;
		$("#video_"+json.id).remove();
	},

	//
	get : function(id) {
		for(var i=0;i<this.videos.length;i++) {
			if(this.videos[i]._id == id){
				return this.videos[i]};
		}
	},

	//
	reset : function () {
		$(this.selector).empty();
	},

	//
	update : function(json) {
		this.app.db.openDoc(json.id,{success:delegate(this,this._onUpdateItem)});
	},

	//
	_onUpdateItem : function(json) {
		var videoItem = new Video(this.app,json);
		for(var i=0;i<this.videos.length;i++) {
			if(this.videos[i]._id == videoItem._id){
				this.videos[i] = videoItem;
			}
		}
		$("#video_"+videoItem._id).replaceWith(videoItem.toHTML());
	},

	//
	load : function(list) {
		var list = list||"videos";
		$.ajax ({
			type: "GET",
			url: this.app.db.uri + "_design/todoapp/_view/videos/",//+list,
			success: delegate(this,this._onLoaded)
		})
	},

	//				  
	_onLoaded : function(json) {
		var response = JSON.parse(json);
		for (var i=0; i < response.rows.length; i++) {
            var item = new Vi2ListItem(this.app,response.rows[i].value, i);
			this.add(item);
        }
  var _this = this;
        VideoJS.DOMReady(function(){
		  _this.myPlayer = VideoJS.setup('All', {
			controlsBelow: false,
			controlsHiding: false,
			defaultVolume: 0.85,
			flashVersion: 9,
			linksHiding: false
		  });
		});
		//this.sort();
	},

	//				  
	sort : function() {
		var items = $(this.selector).children('li').get();
		items.sort(this._sortItems);
		$.each(items, function(idx, itm) { $("#tasklist").append(itm); });
	},

	//
	_sortItems : function(a,b) {
		var compA = $(a).text().toUpperCase();
		var compB = $(b).text().toUpperCase();
		return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
	},

	//
	upload : function(){
	  $("#addVideo").jqupload({"callback":"myfunc"});
	  $("#addVideo").jqupload_form();
	
	},
  

});

/*
*
*/
var Vi2ListItem = $.inherit({

	app : null,
  id : 0,
							
  myPlayer : null,
  width : 320,
  height : 164,
  controls : 'controls',
  preload : 'auto',
  poster : '',
  type : 'video/ogg; codecs="theora, vorbis',

  playerTemplate : '<video id="" class="video-js" width="100" height="120" controls="" preload="" poster=""></video>',
  sourceTemplate : '<source src="" type="" />',

  libraryPath : 'http://127.0.0.1/elearning/videos/',

  __constructor : function(app, options, id){
	this.app = app;
	this.id = id;
	this.obj = null;

	var video = $(this.playerTemplate)
	  .attr('id', 'video_'+id)
	  .attr('width', this.width)
	  .attr('height', this.height)
	  .attr('controls', this.controls)
	  .attr('preload', this.preload)
	  .attr('poster', this.poster) // xxx autogenerate poster
	  .html($(this.sourceTemplate)
			.attr('src', this.libraryPath+''+options.url)
			.attr('type', this.type) // xxx unterscheidung zw. versch. typen mp4/ogg/... notwending
	  );
	  this.obj = $('<li></li>').append('<h4>'+options.subject+'</h4>').append(video);
	// this.init();
	    //var myManyPlayers = VideoJS.setup("All");
	},


	//
	init : function(){
		var _this = this;
		VideoJS.DOMReady(function(){
		  _this.myPlayer = VideoJS.setup('video_'+this.id, {
			controlsBelow: false,
			controlsHiding: true,
			defaultVolume: 0.85,
			flashVersion: 9,
			linksHiding: true
		  });
		});
	},

	//
	html : function(){
		return this.obj;
	},


});


/*
*
*/
var Vi2 = $.inherit({
	

	pageName : null,
	markup : null,
	obj : null,
	classes : 'oip_ea_duration_101 oip_ea_start_0',
	//	poster : 'http://www.openbeelden.nl/images/21857/WEEKNUMMER364-HRE0000D9C6.png',
	width : 500,
	height : 380,
	codec : 'video/ogg; codecs=theora',

	overlays : [],
	myPlayer : null,

	//
	__constructor : function(pageName){
		this.obj = null;	
		this.pageName = pageName;
		$('#pageName').text(this.pageName);

		this.init();
	},
	
	//
	init : function(){
		var _this = this;
		
		VideoJS.DOMReady(function(){
		 	_this.myPlayer = VideoJS.setup("video_1", {
			controlsBelow: false, 
						 controlsHiding: true,
						 defaultVolume: 0.85, 
						   flashVersion: 9, 
						 linksHiding: true 
		  });
		});
		
		this.addAnnotation('<div>HALLO</div>', 'link', 100, 200, 1, 4 );
		this.clock();
		/*
		$.ajax({
			url: "../php/Wiki.php",
			dataType: 'json',
			type: 'GET',
			data: "?fn=get&pageName="+pageName,
			success: function(json) {
				_this.markup = json.markup;
				_this.parseMarkup();
			//	_this.editor();
				return true;
			}
		});*/
	},
	
	//
	html : function(){
		return this.obj;
	},
	

	//
	loadVideo : function(videoSource){
		var p = $('<p></p>');
		var video = $('<video id="thePlayer" width="'+this.width+'" height="'+this.height+'" class="'+this.classes+'" poster="'+this.poster+'"></video>');
		var sourcee = $('<source type="'+this.codec+'" src="'+videoSource+'"></source>');
	
		video.html(sourcee);
		p.html(video);
		//alert('You have clicked: ... on page: '+videoSource);
		//alert(p.html());
		this.obj = p;
    	//<source type="video/mp4; codecs=unknown" src="http://www.openimages.eu/files/09/9740.9730.WEEKNUMMER364-HRE0000D9C6.mp4"> </source>
		$('#video').html(this.html());	
		this.refreshPlayer();
		
		// dirty hack
		$('.oiplayer-example').find('li.play a').click();
		
	},
	
	refreshPlayer : function(){
			   $('.oiplayer-example').oiplayer({
			        server : 'http://www.openimages.eu',
			        jar : '/oiplayer/cortado-ovt-stripped-wm_r38710.jar',
			        flash : '/oiplayer/plugins/flowplayer-3.1.5.swf',
			        controls : 'top'
			    });	
	},
	
	//
	addOverLay : function(id, content, type){
		var _this = this;
		var o = null;
		switch(type){
			case 'link':
			 	o = $('<p id="ov'+id+'">'+content+'</p>').attr('class', 'overlay ov-'+id).click(function(){
						$('#video').html('');
						//_this.loadVideo('http://127.0.0.1:8888/ihi/proto/viWiki/videos/Compi.ogg');
					});
				break;
			 case 'signal':
				o = new SignalComprehension();
				o = o.html();
			default : ;
		}
		$('#overlay').html(o);
	},
	
	//
	removeOverlay : function(id){
		$('#overlay .ov-'+id).hide();
	},
	

	//
	clock : function(){
			var _this = this;
			this.interval = setInterval(function() { _this.checkAnnotation(); }, 100);		
	},
	
	//
	parseTime : function (strTime) {
	  	return strTime;
		// parsing is not necessary
		var aTime = strTime.toString().split(":");

		return parseInt(aTime[0],10) * 60 + parseInt(aTime[1],10) * 1;// + parseFloat(aTime[2]);
	},
	
	//
	getCurrentTime : function(){
		return this.myPlayer.currentTime();
	},
	
	//
	annotations : [],
	
	addAnnotation : function(content, type, x, y, t1, t2){
		this.annotations.push({content: content, type: type, displayPosition: {x: x, y: y, t1: t1, t2: t2}});
	},
	
	//
	checkAnnotation : 	function() {
		//if (!(oPlayer && oPlayer.	 && oPlayer.annotations)) return;
		var iTime = this.getCurrentTime();
		var aAnnotations = this.annotations;
		
		for (var i=0;i<aAnnotations.length;i++) {
			var oAnn = aAnnotations[i];
				if (this.parseTime(iTime) >= oAnn.displayPosition.t1 && this.parseTime(iTime) < oAnn.displayPosition.t2) {
					this.addOverLay(i, oAnn.content, oAnn.type);
				} else {
					this.removeOverlay(i);
				}
			}
	},
	
					
					
					
					//[[Video:Swim.ogg Schwimmen]]
					
					//[[File:Time Lapse of New York City.ogv | thumb |200px | caption]]
					
					//[[Video:http://www.polycrystal.org/lego/movies/A_New_Computer--med.ogg Computer]]
					//[[Video:bunny.ogg Bunny]]
					//+[[Hyperlink: hello_world#Bunny]#60|0:10]
					
					
					
					/*
					parseMarkup : function(){
					  var phrase = this.markup;
					  //		phrase = phrase.replace(/Video/i, "Hypervideo");
					  
					  
					  var lines = this.markup.replace(']]', '').split('[[');
					  $.each(lines, function(index, value){
						value = value.split(':');
						var type = value[0];
						//	value = (value[1]).split(' ');
						var file = null;
						switch(type){
						  case 'video' : 
							file = value[0].match(/ogg/g);
							break;
						}
						$('#debug').append(file);
					  });
					  
					  
					  this.loadVideo('http://127.0.0.1/elearning/viwiki/videos/Swim.ogg');
					  
					  
					  
					  
					  this.addAnnotation('<div>HALLO</div>', 'signal', 100, 200, 2, 4 );
					  //	this.addAnnotation(new SignalComprehension(), );
					  this.clock();
					  var _this = this;
					  $('h1').click(function(){
						$('#debug').html(_this.getCurrentTime());
					  });
					},
					*/
	
		/*
		editor : function(){

			var _this = this;

			var e_flag = false;
			var btn = $('<span class="edit-btn">edit</span>');
			var te = $('<textarea class="edit" name="edit">'+this.markup+'</textarea>');
			var sm = $('<span class="submit edit">submit</span>');
			var cancel = $('<span class="cancel edit">cancel</span>');
			var tools = $('<div></div>').attr('class', 'editor-tools');

			sm.click(function(){
				$.ajax({
					type: "GET",
				   	url: "../php/Wiki.php",
	//				dataType: 'json',
				   	data: "fn=set&pageName="+_this.pageName+"&markup="+te.val(),
				   	success: function(json){
						_this.markup = json.markup;
				     	$('#debug').html("Data Saved: " + json );
				   	}
				 });

				btn.show(); 
				$.each('.edit', function(){ $(this).hide(); });
			});

			cancel.click(function(){
				btn.show(); 			$.each('.edit', function(){ $(this).hide(); });
			});

			btn.click(function(){
				if(e_flag){
				$.each('.edit', function(){ $(this).hide(); });
				}else{
				$.each('.edit', function(){ $(this).show(); });
				}
				e_flag = ! e_flag;
			});

			// tools
			var videoTool = $('<span></span>').attr('class', 'tool-video').text('Video').click(function(){
				// upload new video
				var t = $('<form id="my_form" name="my_form" method="post" action="upload.php" enctype="multipart/form-data"><input type="file" name="file" id="file"><input type="submit">');

				$("#my_form").jqupload({"output":"demo_message"});

				// browse videos on server

			});
			var linkTool = $('<span></span>').attr('class', 'tool-link').text('Link');
			tools.append(videoTool).append(linkTool);


			// combine everything to an rich editor
			$('#edit').append(tools);
			$('#edit').append(btn);
			$('#edit').append(te);
			$('#edit').append(sm);
			$('#edit').append.(cancel);
				$.each('.edit', function(){ $(this).hide(); });

			
			//the simple way, use default alert message and callback
		   //$("#my_form").jqupload();

		   //the second way, use json object and set the message to a div/span
		   //$("#my_form").jqupload({"output":"demo_message"});

		   //advanced way, define your own logic to handle the return message
		   //$("#my_form").jqupload({"callback":"myfunc"});
		   //$("#my_form").jqupload_form();
			//<form id="my_form" name="my_form" method="post" action="upload.php" enctype="multipart/form-data">
			//<input type="file" name="file" id="file">
			//<input type="submit">

		},
					 */

});


var SignalComprehension  = $.inherit({
	
	__constructor : function(id){
		this.id = id;
	},
	
	id : -1,
	
	template : '<div class="signal"><input type="radio" class="red" value="comprende nada" /><input type="radio" class="orange" value="mas o menos" /><input type="radio" class="green" value="claro" /></div>',
	
	value : 0,
	
	html : function(){
		return $(this.template).attr('class', 'ov-'+this.id);;
	},
	
	getValue : function(){
		return this.value;
	}
	
});

/*
*
*/

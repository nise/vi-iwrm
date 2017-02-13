/*
 * has been build upon ghindaVideoPlayer
 
 - build solid class structure
 
 */
 
 
var Video = $.inherit(
{
	/**/
  __constructor : function(selector) {
  	this.selector = selector;
  	this.video = document.getElementById(selector);
  	this.gVideo = $(selector);

		// build main options before element iteration		
		var options = {theme: 'simpledark', childtheme: ''};
  		
  	this.init(options); 
  },
  
  video : null,
  gVideo : null,
  selector : '',
  video_volume : 1,
  video_container : null,
	video_controls : null,
	video_wrap : null,
	ghinda_play_btn : $(''),
	ghinda_video_seek : null,
	ghinda_video_timer : null,
	ghinda_volume : null,
	ghinda_volume_btn : null,
			
  /**/
  html : function(){
  	return $(this.gVideo).html();
  },
  
  /**/
  init : function(options) {
  		var _this = this;
			

			//create html structure
			//main wrapper
			var video_wrap = $('<div></div>').addClass('ghinda-video-player').addClass(options.theme).addClass(options.childtheme);
			//controls wraper
			this.video_controls = $('<div class="ghinda-video-controls"><a class="ghinda-video-play" title="Play/Pause"></a><div class="ghinda-video-seek"></div><div class="ghinda-video-timer">00:00</div><div class="ghinda-volume-box"><div class="ghinda-volume-slider"></div><a class="ghinda-volume-button" title="Mute/Unmute"></a></div></div>');						
			$(this.gVideo).wrap(video_wrap);

		this.gVideo.after(this.video_controls);
			this.video_container = this.gVideo.parent('.ghinda-video-player');

//			this.video_controls = this.video_container.find('.ghinda-video-controls');

	

			this.ghinda_play_btn = $('.ghinda-video-play', this.video_container);
//									alert(this.video_controls.find('a.ghinda-video-play').attr('title'));
			this.ghinda_video_seek = $('.ghinda-video-seek', this.video_container);
			this.ghinda_video_timer = $('.ghinda-video-timer', this.video_container);
			this.ghinda_volume = $('.ghinda-volume-slider', this.video_container);
			this.ghinda_volume_btn = $('.ghinda-volume-button', this.video_container);

			this.video_controls.hide(); // keep the controls hidden

			// event bindings
			this.ghinda_play_btn.click(this.gPlay());
			this.gVideo.click(this.gPlay());
			
			this.gVideo.bind('play', function() {
				_this.ghinda_play_btn.addClass('ghinda-paused-button');
			});
			
			this.gVideo.bind('pause', function() {
				_this.ghinda_play_btn.removeClass('ghinda-paused-button');
			});

			this.gVideo.bind('ended', function() {
				_this.ghinda_play_btn.removeClass('ghinda-paused-button');
			});
			
			// 
			this.createSeek();
			this.gVideo.bind('timeupdate', this.seekUpdate());	
												
			//
			this.ghinda_volume.slider({
				value: 1,
				orientation: "vertical",
				range: "min",
				max: 1,
				step: 0.05,
				animate: true,
				slide:function(e,ui){
						_this.video.attr('muted',false);
						_this.video_volume = ui.value;
						_this.video.attr('volume',ui.value);
					}
			});
			
			// 
			
			this.ghinda_volume_btn.click(this.muteVolume());


			this.gVideo.removeAttr('controls');				

	},
			
	/**/			
	gPlay : function() {
		if(this.gVideo.attr('paused') == false) {
			this.video.pause();					
		} else {					
			this.video.play();				
		}
	},
	
	seeksliding : null,
	interval : 0,			
	/**/
	createSeek : function() {
		var _this = this;
		if(this.video.readyState) {
			clearInterval(this.interval);
			clearInterval(this.interval);
			var video_duration = this.gVideo.attr('duration');
			this.ghinda_video_seek.slider({
				value: 0,
				step: 0.01,
				orientation: "horizontal",
				range: "min",
				max: video_duration,
				animate: true,					
				slide: function(){							
					_this.seeksliding = true;
				},
				stop:function(e,ui){
					seeksliding = false;						
					_this.gVideo.attr("currentTime",ui.value);
				}
			});
			this.video_controls.show();					
		} else {
			this.interval = setInterval(function() { _this.createSeek();  }, 150);	
		}
	},	

	
	/**/
	gTimeFormat : function(seconds){
		var m=Math.floor(seconds/60)<10?"0"+Math.floor(seconds/60):Math.floor(seconds/60);
		var s=Math.floor(seconds-(m*60))<10?"0"+Math.floor(seconds-(m*60)):Math.floor(seconds-(m*60));
		return m+":"+s;
	},
			
	/**/	
	seekUpdate : function() {
		var currenttime = this.currentTime();//this.gVideo.attr('currentTime');
		if(!this.seeksliding){ 
			this.ghinda_video_seek.slider('value', currenttime); 
		}
		this.ghinda_video_timer.text(this.gTimeFormat(currenttime));							
	},



	
	/**/
	muteVolume : function() {
		if(this.gVideo.attr('muted')==true) {
			this.gVideo.attr('muted', false);
			this.ghinda_volume.slider('value', video_volume);
					
			this.ghinda_volume_btn.removeClass('ghinda-volume-mute');					
		} else {
			this.gVideo.attr('muted', true);
			this.ghinda_volume.slider('value', '0');			
			this.ghinda_volume_btn.addClass('ghinda-volume-mute');
		}
	},
			
	/**/
	currentTime : function(x){
		if(x == null){
			return $(this.selector).attr('currentTime');
		}else{
			$(this.selector).attr('currentTime', x);
		}
	},
	
	/**/
	duration : function(x){
		return $(this.selector).attr('duration');
	},
	
	/**/
	pause : function(){
		$(this.selector).pause();
	},
	
	/**/
	play : function(){
		$(this.selector).play();
	},
	
	/**/
	load : function(wrapSelector, url, seek){
		$(this.selector).parent().remove();
		$(wrapSelector).append('<video id="video1" controls="controls" preload="auto" width="600"><source src="'+url+'" type="video/ogg; codecs=&quot;theora, vorbis&quot;"></video>');
//		this.get(0).currentTime = seek;
	},
	
	/**/
	destroy : function(){
		$(this.selector).remove();
	},
	
		


}); // end video class




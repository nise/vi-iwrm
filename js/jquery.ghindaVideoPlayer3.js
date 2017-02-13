/*
 * has been build upon ghindaVideoPlayer
 
 - reload video
 - playbackspeed
 - visualize loaded bytes
 - seqential videos
 - manage to play parts of a video: http://www.xiph.org/oggz/doc/group__seek__api.html
 - bug: slider jumps
 */
 
 
var Video = $.inherit(
{
	/**/
  __constructor : function(selector) {
  	this.selector = selector;
  	
  	this.loadVideo('http://127.0.0.1/elearning/videos/Compi.ogg');
  	this.loadUI();
  },


	video : null,
	video_controls : null,
	selector : '',
	video_volume : 1,
  video_container : null,
	video_wrap : null,
	ghinda_play_btn : $(''),
	video_seek : null,
	video_timer : null,
	ghinda_volume : null,
	ghinda_volume_btn : null,
	seeksliding : null,
	interval : 0,	
	
	/**/
	loadVideo : function(url, seek) {
		var _this = this;
	  this.video = document.getElementsByTagName('video')[0];
	  this.video.poster = "img/ff.png";
	  this.video.loop = false; // preload, autoplay, controls, width, height
	  this.video.insertBefore(this.createSource(url, 'video/ogg; codecs="theora, vorbis"'), this.video.firstChild);
//  this.video.insertBefore(createSource('video.mp4', 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'), video.firstChild.nextSibling);
	  this.video.onerror = function(e) {
	 // 	alert(_this.video.error.code == _this.video.error.MEDIA_ERR_SRC_NOT_SUPPORTED); // true
	 // 	alert(_this.video.networkState == _this.video.NETWORK_NO_SOURCE); // true
		}
		this.video.oncanplay = function(e) {
			// play_btn playpause.disabled = false;
			//alert('playable');
			if(seek > 0){
				_this.currentTime(seek);
			}
		}
	},
	
	/**/
	createSource : function(src, type) {
  	var source = document.createElement('source');
  	source.src = src;
  	source.type = type;
  	return source;
	},

	/**/
	loadUI : function(){
		var _this = this;
		var options = {theme: 'simpledark', childtheme: ''};
		var video_wrap = $('<div></div>').addClass('ghinda-video-player').addClass(options.theme).addClass(options.childtheme);
		this.video_controls = $('<div class="ghinda-video-controls"><a class="ghinda-video-play" title="Play/Pause"></a><div class="ghinda-video-seek"></div><div class="ghinda-video-timer">00:00</div><div class="ghinda-volume-box"><div class="ghinda-volume-slider"></div><a class="ghinda-volume-button" title="Mute/Unmute"></a></div></div>');						
		$(this.selector).wrap(video_wrap);

		$(this.selector).after(this.video_controls);
		this.video_container = $(this.selector).parent('.ghinda-video-player');

		this.ghinda_play_btn = $('.ghinda-video-play', this.video_container);
		this.video_seek = $('.ghinda-video-seek', this.video_container);
		this.video_timer = $('.ghinda-video-timer', this.video_container);
		this.ghinda_volume = $('.ghinda-volume-slider', this.video_container);
		this.ghinda_volume_btn = $('.ghinda-volume-button', this.video_container);

		this.video_controls.hide(); // keep the controls hidden
		$(this.video).removeAttr('controls');	
		this.createSeek();
		
		
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
			
		// event bindings
		$(this.video).parent().bind('mouseover', function() {
			_this.video_controls.show();					
		});

		$(this.video).parent().bind('mouseout', function() {
			_this.video_controls.hide();					
		});

		
		this.ghinda_play_btn.click(function(){ 
			_this.play();
		});
			
		$(this.video).bind('play', function() {
			_this.ghinda_play_btn.addClass('ghinda-paused-button');
		});
			
		$(this.video).bind('pause', function() {
			_this.ghinda_play_btn.removeClass('ghinda-paused-button');
		});

		$(this.video).bind('ended', function() {
			_this.ghinda_play_btn.removeClass('ghinda-paused-button');
		});
			 
		$(this.video).bind('timeupdate', function(){
			_this.seekUpdate();
		});
		
		this.ghinda_volume_btn.click(function(){
			_this.muteVolume();	
		});	
												
	},
	
	/**/
	muteVolume : function() {
		if($(this.selector).attr('muted')==true) {
			$(this.selector).attr('muted', false);
			this.ghinda_volume.slider('value', video_volume);
			this.ghinda_volume_btn.removeClass('ghinda-volume-mute');					
		} else {
			$(this.selector).attr('muted', true);
			this.ghinda_volume.slider('value', '0');			
			this.ghinda_volume_btn.addClass('ghinda-volume-mute');
		}
	},
	
	/**/
	createSeek : function() {
		var _this = this;
		if(this.video.readyState) {
			clearInterval(this.interval);
			clearInterval(this.interval);
			var video_duration = $(this.selector).attr('duration');
			this.video_seek.slider({
				value: 0,
				step: 0.01,
				orientation: "horizontal",
				range: "min",
				max: video_duration,
				animate: false,					
				slide: function(event, ui){							
					_this.seeksliding = true;
				},
				stop: function(e,ui){
					_this.seeksliding = false;				
					$(_this.selector).attr("currentTime", ui.value);
				},
				start: function(event, ui){
					_this.seeksliding = true;
				}
			});
			this.video_controls.show();					
		} else {
			// try reinitiate the slider as long th e
			this.interval = setInterval(function() { _this.createSeek();  }, 150);	
		}
	},	

	
	/**/
	timeFormat : function(seconds){
		var m=Math.floor(seconds/60)<10?"0"+Math.floor(seconds/60):Math.floor(seconds/60);
		var s=Math.floor(seconds-(m*60))<10?"0"+Math.floor(seconds-(m*60)):Math.floor(seconds-(m*60));
		return m+":"+s;
	},
			
	/**/
	seekUpdate : function() {
		var currenttime = $(this.selector).attr('currentTime');
		if(!this.seeksliding){ 
			this.video_seek.slider('value', currenttime); 
		}
		this.video_timer.text(this.timeFormat(currenttime));							
	},
	
	
	
	/** INTERFACES *************************/
	/**/
	play : function(){
		if($(this.selector).attr('paused') == false) {
			this.video.pause();					
		} else {					
			this.video.play();				
		}
	},
	
	/**/
	pause : function(){
		this.video.pause();
	},
	
	/**/	
	duration : function(){
		return $(this.selector).attr('duration');
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
	load : function(url, seek){
		this.video.autoplay = true;
		$(this.video).html('').append(this.createSource(url+'#t=10,20', 'video/ogg; codecs="theora, vorbis"'), this.video.firstChild);
		this.video.load();
	
		var _this = this;
		
		this.video.readyState = function(e) {
			//alert('bam');
			if(seek > 0){
				_this.currentTime(seek);

			}
		};
		
		// var lastBuffered = video.buffered.end(video.buffered.length-1);
//alert(this.video.buffered.length+''+this.video.buffered.start()+'___'+this.video.buffered.end(video.buffered.length-1));
		//this.video.currentTime = seek;

		
	},
	
	
	

	
	
	
	
	

/*????????????????*/
	playorpause : function() {
		if(this.video.ended || this.video.paused) {
			this.video.play();					
		} else {					
			this.video.pause();				
		}
	},





}); // end video class























/* video sequences
video.onended = function(e) {
  video.onended = null;
  video.src = 'video2.ogv';
}

video.addEventListener('ended', function(e) {
  video.removeEventListener('ended', arguments.callee, false);
  video.src = 'video2.ogv';
}, false);
*/


/* playback speed
var ratecontrol = document.getElementById('ratecontrol');
video.onratechange = function(e) {
  ratecontrol.value = video.playbackRate;
}
function changePlaybackRate() {
  video.playbackRate = ratecontrol.value;
}
*/


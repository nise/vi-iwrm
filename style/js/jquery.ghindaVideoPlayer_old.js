	/****************************************/
	/* Video Player



	*/
	

	/** class TemporalTagging **/ 
	var Video = $.inherit(
	{
	
		
			/**/
  		__constructor : function(options, selector) {
				this.options = options;
	  		this.video = $(selector).get(0);


				var wrap = $('<div></div>').addClass('ghinda-video-player').addClass('simpledark');//.addClass(this.options.childtheme),
				wrap.html(this.video);				
				video_controls = $('<div class="ghinda-video-controls"><a class="ghinda-video-play" title="Play/Pause"></a><div class="ghinda-video-seek"></div><div class="ghinda-video-timer">00:00</div><div class="ghinda-volume-box"><div class="ghinda-volume-slider"></div><a class="ghinda-volume-button" title="Mute/Unmute"></a></div></div>');
				
				wrap.parent().append(video_controls);
				
		 
				
				this.video_container = wrap;//$(this.video).parent('.ghinda-video-player'); 
			
				this.video_controls = $('.ghinda-video-controls', this.video_container);
				this.ghinda_play_btn = $('.ghinda-video-play', this.video_container);
				this.ghinda_video_seek = $('.ghinda-video-seek', this.video_container);
				this.ghinda_video_timer = $('.ghinda-video-timer', this.video_container);
				this.ghinda_volume = $('.ghinda-volume-slider', this.video_container);
				this.ghinda_volume_btn = $('.ghinda-volume-button', this.video_container);
//this.video.attr('controls', 'false');
				$(this.video_controls).show(); // keep the controls hidden
  		  
  		  /*		
  			// EVENTS
  			$(this.ghinda_play_btn).click(this.gPlay);
				$(this.video).click(this.gPlay);
				var _this = this;
				$(this.video).bind('play', function() {
					_this.ghinda_play_btn.addClass('ghinda-paused-button');
				});
			
				$(this.video).bind('pause', function() {
					_this.ghinda_play_btn.removeClass('ghinda-paused-button');
				});
			
				$(this.video).bind('ended', function() {
					_this.ghinda_play_btn.removeClass('ghinda-paused-button');
				});
			
  			this.createSeek();
  			$(this.video).bind('timeupdate', this.seekUpdate);	
  		
  		
		
				this.ghinda_volume.slider({
					value: 1,
					orientation: "vertical",
					range: "min",
					max: 1,
					step: 0.05,
					animate: true,
					slide:function(e,ui){
						this.video.attr('muted',false);
						this.video_volume = ui.value;
						this.video.attr('volume',ui.value);
					}
				});
			//	this.ghinda_volume_btn.click(this.muteVolume);
			
				
				*/
				//return $(this.video);
  		},

		
		
			// vars
			defaults : { theme: 'simpledark', childtheme: ''},
			options : '',//$.extend(this.defaults, this.options),

			
					
			video_container : null,
			video_controls : null,
			ghinda_play_btn : null,
			ghinda_video_seek : null,
			ghinda_video_timer : null,
			ghinda_volume : null,
			ghinda_volume_btn : null,
			seeksliding : 0,
			video_volume : 1,
			
			/**/			
			gPlay : function() {
				if(this.video.attr('paused') == false) {
					this.video[0].pause();					
				} else {					
					this.video[0].play();				
				}
			},
				
			/**/		
			createSeek : function() {
				var _this = this;
				
				if($(this.video).readyState) {
					var video_duration = this.video.attr('duration');
					this.ghinda_video_seek.slider({
						value: 0,
						step: 0.01,
						orientation: "horizontal",
						range: "min",
						max: this.video_duration,
						animate: true,					
						slide: function(){							
							_this.seeksliding = true;
						},
						stop:function(e,ui){
							_this.seeksliding = false;						
							this.video.attr("currentTime",ui.value);
						}
					});
					this.video_controls.show();					
				}else {
					setTimeout("this.createSeek", 150);
				}
			},
			
					/*INTERFACES********/
			currentTime : function(_time){
				if(time === null){ 
					return this.video.attr('currentTime');
				}else{
					this.video.attr('currentTime', _time);
				}
			},
			
			duration : function(){
				return this.video.duration;
			},

			
		
			gTimeFormat : function(seconds){
				var m=Math.floor(seconds/60)<10?"0"+Math.floor(seconds/60):Math.floor(seconds/60);
				var s=Math.floor(seconds-(m*60))<10?"0"+Math.floor(seconds-(m*60)):Math.floor(seconds-(m*60));
				return m+":"+s;
			},
			
			seekUpdate : function() {
				var currenttime = this.video.attr('currentTime');
				if(!this.seeksliding) this.ghinda_video_seek.slider('value', currenttime);
				this.ghinda_video_timer.text(this.gTimeFormat(currenttime));							
			},
			
		/*	
			
			muteVolume : function() {
				if(this.video.attr('muted')==true) {
					this.video.attr('muted', false);
					this.ghinda_volume.slider('value', this.video_volume);
					
					this.ghinda_volume_btn.removeClass('ghinda-volume-mute');					
				} else {
					this.video.attr('muted', true);
					this.ghinda_volume.slider('value', '0');
					
					this.ghinda_volume_btn.addClass('ghinda-volume-mute');
				};
			},
			
			*/
			
		});



/* docView Plugin 
 * Depends:
 *    ui.core.js
 *     ui.view.js
 *

 Author 
 cf AUTHORS.txt 

 License
 Copyright (c) 2010-2012 Massachusetts Institute of Technology.
 MIT License (cf. MIT-LICENSE.txt or http://www.opensource.org/licenses/mit-license.php)
*/
/*global YT:true jQuery:true console:true*/

var ytplayer = null;
var NB_vid = {};

	//Update a particular HTML element with a new value
	function updateHTML(elmId, value) {
		document.getElementById(elmId).innerHTML = value;
	}

	// This function is called when an error is thrown by the player
	function onPlayerError(errorCode) {
		alert("An error occured of type:" + errorCode);
	}

	// This function is called when the player changes state
	function onPlayerStateChange(newState) {
		//updateHTML("playerState", newState);
	}

	// Display information about the current state of the player
	// It’s called every 250 milliseconds in onYoutubePlayerReady()
	function updatePlayerInfo() {
		// Also check that at least one function exists since when IE unloads the
		// page, it will destroy the SWF before clearing the interval.
		if(ytplayer && ytplayer.getDuration) {
			NB_vid.methods.updateHTML("videoTimeDisplay", NB_vid.methods.calculateTime(ytplayer.getCurrentTime())); //seen under progressbar
			NB_vid.methods.updateHTML("videoTotalTimeDisplay", NB_vid.methods.calculateTime(ytplayer.getDuration()));
		}
	}


	// Allow the user to set the volume from 0-100
	function setVideoVolume(volume) {
	if(ytplayer){
		ytplayer.setVolume(volume);
		}
	}

	function playVideo() {
		if (ytplayer) {
			NB_vid.isPlaying = true;
			ytplayer.playVideo();
		}
	}

	function pauseVideo() {
		if (ytplayer) {
			NB_vid.isPlaying = false;
			ytplayer.pauseVideo();
		}
	}

	function muteVideo() {
		if(ytplayer) {
			ytplayer.mute();
		}
	}

	function unMuteVideo() {
		if(ytplayer) {
			ytplayer.unMute();
		}
	}
	
	//give the time in seconds, return the time as a string with (hours:)minutes:seconds
	function calculateTime(givenTime){
		var totalSec = parseInt(givenTime);
		var hours = 0;
		if (totalSec >= 3600){
			hours = parseInt(totalSec/3600);
			totalSec -= hours*3600;
		}
		var minutes = 0;
		if(totalSec >= 60){
			minutes = parseInt(totalSec/60);
			totalSec -= minutes*60;
		}
		var display = "";
		if(hours > 0){
			display += hours + ":";
		}
		if(hours > 0 && minutes <10){
			display += "0" + minutes + ":";
		}else{
			display += minutes + ":";
		}
		if (totalSec < 10){
			display+= "0" + totalSec;
		}else{
			display+= totalSec;
		}
		return display;
	}

	// Given the time as a string, return the time as a number of seconds
	function calculateTime_stringToNum(timeStr){
		var seconds = parseInt(timeStr.substring(timeStr.length-2, timeStr.length)); //gets seconds
		timeStr = timeStr.substring(0, timeStr.length-3); //gets rid of the seconds portion of string
		var minutes, hours = 0;
		if (timeStr.length === 1 || timeStr.length === 2){
			minutes = parseInt(timeStr);
		}else{//if the video has hours
			minutes = parseInt(timeStr.substring(timeStr.length-2, timeStr.length));
			timeStr = timeStr.substring(0, timeStr.length-3); //gets rid of the seconds portion of string
			hours = parseInt(timeStr);
		}

		var totalSeconds = hours*3600 + minutes*60 + seconds;
		return totalSeconds;	
	}
	
	function videoClicked() {
		NB_vid.methods.playORpause();
	}


	// This function is automatically called by the player once it loads
	function onYouTubePlayerReady(event) {
		console.log("ytplayer ready");
		
		NB_vid.ytLoaded = true;

		//ytplayer.addEventListener("onStateChange", "NB_vid.pbHover.gatherThumbnailHandler");

		//This hack is an attempt to eliminate the big red play button by default
		//it prevents the default play button from playing the video without changing my own play button
		//it also starts the loading of the video sooner
		window.setTimeout(function() {
			ytplayer.playVideo();
			ytplayer.pauseVideo(); //comment this out if using the gatherThumbnailHandler
		}, 0);

		// This causes the updatePlayerInfo function to be called every 250ms to
		// get fresh data from the player
		NB_vid.methods.updatePlayerInfo();		
		ytplayer.addEventListener("onStateChange", "onPlayerStateChange");
		ytplayer.addEventListener("onError", "onPlayerError");
		//Load an initial video into the player
		ytplayer.cueVideoById("ylLzyHk54Z0");
	}

	function defineYouTubePlayer() {
		console.log("defining ytplayer");
		ytplayer = new YT.Player('videoDiv', {
			height: '423',
			width: '752',
			videoId: 'ylLzyHk54Z0',
			playerVars: {
				'controls': 0,
				'showinfo': 0
			},
			events: {
				'onReady': onYouTubePlayerReady
			}
		});
		if (ytplayer) {console.log("ytplayer defined");}
		else {console.log("ytplayer definition failed");}
	}


	
	function defineYouTubeIfReady() {
		console.log("YouTube ready check");
		if (NB_vid.apiLoaded) {defineYouTubePlayer();}
		else {setTimeout(defineYouTubeIfReady, 100);}
	}
	
	NB_vid = {
		"methods": {
			"updateHTML": updateHTML,
			"onPlayerError": onPlayerError,
			"onPlayerStateChange": onPlayerStateChange,
			"updatePlayerInfo": updatePlayerInfo,
			"calculateTime": calculateTime,
			"calculateTime_stringToNum": calculateTime_stringToNum,
			"setVideoVolume": setVideoVolume,
			"playVideo": playVideo,
			"pauseVideo": pauseVideo,
			"muteVideo": muteVideo,
			"unMuteVideo": unMuteVideo
		},
		"define": defineYouTubeIfReady,
		"defaultTickWidth": 2,
		"isPlaying": false,
		"wasPlaying": false, // Whether the player was playing before a note was started
		"hoveredTick": null,
		"selectedTick": null,
		"currentID": "",
		"ytLoaded": false,
		"apiLoaded": false
		};

	
	
	function onYouTubeIframeAPIReady() {
		console.log("Iframe API Ready");
		//defineYouTubePlayer();
		NB_vid.apiLoaded = true;
		//setTimeout(defineYouTubePlayer, 1000);
	}
		
(function($) {
    var PLAYER_HTML_TEMPLATE = 
    ['<div class = "videoView">',
		'<div class = "videoContainer">',
			'<div id="videoDiv">Loading...</div>',
			'<div id = "videoCover">',
			'</div>',
			'<div class="selections"></div>',
		'</div>',
		'<div class = "videoMenu">',
			'<div class = "playORpause_holder"><img class = "playORpause" src="/content/data/images/play.png"></div>',
			'<div class = "playback"><img class = "playback" src="/content/data/images/refresh.png"></div>',
			'<div class = "progressbar_container">',
				'<div id= "dragRangeContainer">',
					'<div id="rangeTick">',
						'<div class = "rightTooltipDiv" style = "float: right"></div>',
					'</div>',
				'</div>',
				'<div id= "progressbar">',
					'<div class = "mouseTooltipDiv"></div>',
					'<div id = "progressbar_filler"></div>',
				'</div>',
				'<div id = "zoomTick"><div class = "rightTooltipDiv" style = "float: right"></div></div>',
				'<div class = "tickmark_holder">',

				'</div>',

				'<div id ="showTime">',
					'<div id = "videoTimeDisplay">--:--</div><text> /</text>',
					'<div id = "videoTotalTimeDisplay">--:--</div>',
				'</div>',
			'</div>',
			'<div class = "muteORunmute_holder"><img class = "muteORunmute" src = "/content/data/images/volume_up.png"></div>',
		'</div>',
		'<div class = "enlargedTickContainer">',
			'<div class = "enlargedTickStart">--:--</div>',
			'<div class = "enlargedTickBar"><div class = "tickmark currentPlayerLocationTick"></div></div>',
			
			'<button onclick = "NB_vid.zoom.zoomClose()" type="button" class="close closeEnlarged" style = "margin-top: 10px; margin-right: 8px; float: right">&times;</button>',
			'<div class = "enlargedTickEnd">--:--</div>',
		'</div>',
	'</div>'].join('\n');
	
	function completeMethods() {
		// called when the play/pause button is clicked
		// syncs the correct image with the action
		function playORpause(){
			if (!NB_vid.isPlaying){
				$(".playORpause").attr("src", "/content/data/images/pause.png");
				NB_vid.methods.playVideo();
				return true;
			}else{
				$(".playORpause").attr("src", "/content/data/images/play.png");
				NB_vid.methods.pauseVideo();
				return false;
			}
		}
			
		// called when the mute/unmute button is clicked
		// syncs the correct image with the action
		function muteORunmute(){
			if ($(".muteORunmute").attr("src") === "/content/data/images/volume_up.png"){
				$(".muteORunmute").attr("src", "/content/data/images/mute.png");
				NB_vid.methods.muteVideo();
			}else{
				$(".muteORunmute").attr("src", "/content/data/images/volume_up.png");
				NB_vid.methods.unMuteVideo();
			}
		}
			
		//given the time in seconds, goes to corresponding time in the video
		function goToTime(seconds){
			ytplayer.seekTo(seconds,true);
			NB_vid.methods.updatePlayerInfo();
			NB_vid.methods.updateProgressbar();
		}
			
		// called when the playback/"refresh" button is clicked
		function playback(){
			var time = ytplayer.getCurrentTime();
			if (time > 5){
				NB_vid.methods.goToTime(time - 5);
			}else{
				NB_vid.methods.goToTime(0);
			}
		}
		
		function videoClicked() {
			NB_vid.methods.playORpause();
		}
		
		// This function is called every 500 milliseconds
		// It gets the current time from the youtube player and adjusts the progressbar_filler to match to the corresponding time
		function updateProgressbar(){
			var percentage = 100*ytplayer.getCurrentTime()/ytplayer.getDuration();
			$("#progressbar_filler").css("width", percentage+"%");
		} 
	
		//update the time of the ytplayer given the mouse x-location
		function progressbar_click(xloc){
			var percentage = xloc/$("#progressbar").width();  
			//console.log(percentage);
			$("#progressbar_filler").css("width", percentage*100 + "%"); //updates progressbar location
			var currentSec = percentage*ytplayer.getDuration();

			//updates ytplayer location in video
			ytplayer.seekTo(currentSec, true); 
		}

		//If progressbar is clicked (mouseup), calculate the position of the mouse relative to the progressbar
		function updateProgressbarClick(){
			//update progressbar if clicked
			$("#progressbar").mouseup(function(e){
				var parentOffset = $(this).parent().offset(); 
				//or $(this).offset(); if you really just want the current element's offset
				var relX = e.pageX - parentOffset.left;
				var relY = e.pageY - parentOffset.top;
				$('#offset').html(relX + ', ' + relY);
				NB_vid.methods.progressbar_click(relX);
			});
		}

		//returns the pixel value of the parent left offset
		function progressbarOffsetX(){
			return $("#progressbar").parent().offset().left; //progressbar x offset
		}
		
		//calculate the tick location given the time in ms where the associated comment is given
		function calculateTickLoc(milliseconds){
			var duration = ytplayer.getDuration()*100;
			var ratio = milliseconds/duration;
			//console.log(milliseconds, duration, ratio);
			var xLoc = $("#progressbar").width()*ratio;
			return xLoc;
		}

		//calculate the tick width given the starting and end time associated with the comment
		function calculateTickWidth(startTime, endTime){
			if (endTime !== 0){
				var leftLoc = NB_vid.methods.calculateTickLoc(startTime);
				var rightLoc = NB_vid.methods.calculateTickLoc(endTime);
				var width = rightLoc - leftLoc;
				return width;
			}else{
				return "1";
			}
		}

		//given the tick location and ID, it creates the string of HTML to create the tick
		function tickHTML(xLoc, width, ID){
			var style = "'left:" + xLoc + "px; width:"+width + "px'";
			var html = "<div class = 'tickmark' id = 'tickmark"+ID + "' style="+style+"></div>";
			return html;
		}
		
		//This function should be called to add ticks to the tick bar
		function addAllTicks(payload) {
			var newNoteObj;
			var tickStr;
			var tickmark;
			function clickHandlerFactory() {
				return function(evt) {
					console.log("click handle win");
					console.log(evt.target);
				};
			}
			function hoverHandlerFactory() {
				return function(evt) {
					console.log("hover handle win");
					console.log(evt.target);
				};
			}
			for (var id in payload.diff) {
				newNoteObj = payload.diff[id];
				var tickX = NB_vid.methods.calculateTickLoc(newNoteObj.page);
				var newTickHTML = NB_vid.methods.tickHTML(tickX, NB_vid.defaultTickWidth, id);
				
				//copy the htmlText - stores the current tick mark divs (if any)
				var htmlText = $(".tickmark_holder").html();
				//clear the content in the tickholder div
				$(".tickmark_holder").html("");
				//get the html of the new tick mark as a string then insert it (bc .append was buggy)
				htmlText += newTickHTML;
				$(".tickmark_holder").html(htmlText);
			}
			
			// Attach Listeners to tickmarks
			$(".tickmark").click(NB_vid.methods.tickClickListen).mouseenter(NB_vid.methods.tickMouseEnterListen).mouseleave(NB_vid.methods.tickMouseLeaveListen);
		}

		// Highlights the given tickmark the given color
		function highlightTick(tickmark, color) {
			NB_vid.methods.changeTickCSS(tickmark, color, "No Change", "1");
		}
		
		// Unhighlights a given tick
		function unhighlightTick(tickmark) {
			NB_vid.methods.changeTickCSS(tickmark, "red", "No Change", ".4");
		}
		
		// Highlights a selected tick green and saves it as selected
		function tickSelect(id) {
			var idStr = "tickmark" + id;
			var tickStr = "#" + idStr;
			var tickmark = $(tickStr);
			NB_vid.methods.highlightTick(tickmark, "green");
			if (NB_vid.selectedTick !== null) {
				NB_vid.methods.unhighlightTick(NB_vid.selectedTick);
			}
			NB_vid.selectedTick = tickmark;
			NB_vid.currentID = NB_vid.methods.tickNumFromIdStr(idStr);
		}
		
		// Removes tick selecting
		function removeTickSelect() {
			if (NB_vid.highlightedTick !== null) {
				NB_vid.methods.unhighlightTick(NB_vid.selectedTick);
			}
			NB_vid.selectedTick = null;
			NB_vid.currentID = "";
		}
		
		// Highlights a hovered tick green and saves it as hovered
		function tickHover(id) {
			var tickStr = "#tickmark" + id;
			var tickmark = $(tickStr);
			NB_vid.methods.highlightTick(tickmark, "blue");
			if (NB_vid.hoveredTick !== null) {
				NB_vid.methods.unhighlightTick(NB_vid.hoveredTick);
			}
			NB_vid.hoveredTick = tickmark;
		}
		
		// Removed tick hovering
		function removeTickHover() {
			if (NB_vid.hoveredTick !== null) {
				NB_vid.methods.unhighlightTick(NB_vid.hoveredTick);
			}
			NB_vid.hoveredTick = null;
		}
		
		//This function should be called the the page is loading, it appends all the ticks to the tickholder
		// NOT IMPLEMENTED
		function createTickPopover(ID){
//			for (var i = 0; i <= NB_vid.commentObj.length - 1; i++){
//				if (NB_vid.commentObj[i].ID == ID){
//					var tickContent = NB_vid.commentObj[i].text;
//					var tickTitle = NB_vid.commentObj[i].userName;
//					$("#tickmark" + ID).popover({trigger: "hover", placement: "bottom",title: tickTitle, content: tickContent});
//				}
//			}
		}

		//changes the tick css given the necessary information
		//give "No Change" as a parameter if not necessary to change
		function changeTickCSS(tick, color, width, opacity){
			if(color !=="No Change"){
				tick.css("background", color);
			}
			if(width !=="No Change"){
				tick.css("width", width);
			}
			if(opacity !=="No Change"){
				tick.css("opacity", opacity);
			}
		}
		
		// Returns just the number of the tickmark (as a string) from the full ID string
		function tickNumFromIdStr(idStr) {
			return idStr.substr(8, idStr.length-1);
		}
		
		// Selects thread of given id
		function threadSelect(id){
			$.concierge.trigger({type:"select_thread", value: String(id)});
		}
		
		// Listener for clicks on ticks
		function tickClickListen(evt) {
			var idStr = evt.target.getAttribute("id");
			var tickNum = NB_vid.methods.tickNumFromIdStr(idStr);
			NB_vid.methods.threadSelect(tickNum);
		}
		
		// Listener for mouseenter on ticks
		function tickMouseEnterListen(evt) {
			console.log("mouseenter");
			var idStr = evt.target.getAttribute("id");
			var tickNum = NB_vid.methods.tickNumFromIdStr(idStr);
			NB_vid.methods.tickHover(tickNum);
		}
		
		// Listener for mouseleave on ticks
		function tickMouseLeaveListen(evt) {
			console.log("mouseleave");
			var idStr = evt.target.getAttribute("id");
			NB_vid.methods.removeTickHover();
			var currentSelectStr = "tickmark" + NB_vid.currentID;
			if (idStr === currentSelectStr) {
				NB_vid.methods.highlightTick(NB_vid.selectedTick, "green");
			}
		}
		
		var new_methods = {
				"videoClicked": videoClicked,
				"playORpause": playORpause,
				"playback": playback,
				"muteORunmute": muteORunmute,
				"goToTime" : goToTime,
				"updateProgressbar": updateProgressbar,
				"progressbar_click": progressbar_click,
				"updateProgressbarClick": updateProgressbarClick,
				"progressbarOffsetX": progressbarOffsetX,
				"calculateTickLoc": calculateTickLoc,
				"calculateTickWidth": calculateTickWidth,
				"tickHTML": tickHTML,
				"addAllTicks": addAllTicks,
				"highlightTick": highlightTick,
				"unhighlightTick": unhighlightTick,
				"tickSelect": tickSelect,
				"tickHover": tickHover,
				"removeTickSelect": removeTickSelect,
				"removeTickHover": removeTickHover,
				"createTickPopover": createTickPopover,
				"changeTickCSS": changeTickCSS,
				"threadSelect": threadSelect,
				"tickNumFromIdStr": tickNumFromIdStr,
				"tickClickListen": tickClickListen,
				"tickMouseEnterListen": tickMouseEnterListen,
				"tickMouseLeaveListen": tickMouseLeaveListen
		};
		
		$.extend(NB_vid["methods"], new_methods);
	}
	completeMethods();
    
	var METRONOME_STATES = {
		PLAYING: 1, 
		PAUSED: 2
    };
    //youtube player seems to only support 16/9 parameters, and fills in with black bands when not the case: 
    //cf https://developers.google.com/youtube/2.0/reference#youtube_data_api_tag_yt:aspectratio
    var ASPECT_RATIO = 16.0/9;
    var pretty_print_time = function(t){
	var n = Math.floor(t);
	var n_minutes = Math.floor(n / 60);
	var n_seconds = n % 60;
	if (n_seconds <10){
        n_seconds = "0" + n_seconds;
	}
	return n_minutes+":"+n_seconds;
    };

	// Returns a metronome given t_metronome in seconds
	function initializeYouTubeMetronome(t_metronome) {
		var Metronome = function( position_helper, position, refresh_ms){
			this.position = position || 0; 
			this.refresh_ms = refresh_ms || 1000;
			this.state = METRONOME_STATES.PAUSED;
			this.position_helper = position_helper;
		};
		Metronome.prototype.play = function(){
			if (this.state === METRONOME_STATES.PAUSED){
				this.state = METRONOME_STATES.PLAYING;
				this.__go();
			}
			else{
				console.log("[metronome.play] ignoring since state is already playing");
			}
		};
	
		Metronome.prototype.__go = function(){
			if (!( this.position_helper)){
				console.error("[metronome] position helper not set !");
				return;
			}
			if (this.state === METRONOME_STATES.PLAYING){
				this.value = this.position_helper();
				$.concierge.trigger({type: "metronome", value:this.value});
				window.setTimeout(this.__go.bind(this), this.refresh_ms);
			}
		};

		Metronome.prototype.pause = function(){
			this.state = METRONOME_STATES.PAUSED;
		};
		
		return new Metronome(function(){return  ytplayer.getCurrentTime();}, 0, t_metronome*1000);
    }

    var V_OBJ = $.extend({},$.ui.view.prototype,{
        _create: function() {	
		$.ui.view.prototype._create.call(this);
			var self = this;
			self.element.append(PLAYER_HTML_TEMPLATE);
			NB_vid.define();
			
			self._last_clicked_selection =  0;
			// Fill in width and height of player; Only tested with current values
			var playerWidth = 752;
			var playerHeight = 423;
			// This hack compensates for the numbers not being quite right in Sacha's player
			// Might be worth getting rid of if you ever wipe the video database
			var factorX = 1.012;
			var factorY = 1.009;
			self._w = playerWidth * factorX;
			self._h = playerHeight * factorY;
			// Other Initializations
			self._scale = 33;
			self.SEC_MULT_FACTOR = $.concierge.get_component("get_sec_mult_factor")();
			self.T_METRONOME = $.concierge.get_component("get_metronome_period_s")();
			self._page =  null; 
			self._id_source =  null;
			self._id_location = null; //location_id of selected thread
			self._metronome = null;
			self._ignoremetronome = false;
				
				self._attachListeners();
        },
        _playORpause: function() {
			var self = this;
			var playing = NB_vid.methods.playORpause();
			if (playing) {self._metronome.play();}
			else {self._metronome.pause();}
        },
		_play: function() {
			var self = this;
			if (!NB_vid.isPlaying) {
				self._playORpause();
			}
		},
		_pause: function() {
			var self = this;
			if (NB_vid.isPlaying) {
				self._playORpause();
			}
		},
        _attachListeners: function() {
			var self = this;
			
			$(".playORpause").click(function(evt){
				self._playORpause();
            });
            
            $(".muteORunmute").click(function(evt) {
				NB_vid.methods.muteORunmute();
           });  
           
           $(".playback").click(function(evt){
				NB_vid.methods.playback();
            });
            
            NB_vid.methods.updateProgressbarClick();
        },
        _defaultHandler: function(evt){
			var self	= this;
			var id_source	= self._id_source;
			var model	= self._model;
			if (id_source !== $.concierge.get_state("file")){
				return;
			}
			/*
			* From now on, we assume the event is directed to this view ! 
			*/ 
			switch (evt.type){
			case "note_hover": 
				$("div.selection[id_item="+evt.value+"]", self.element).addClass("hovered");
			break;
			case "note_out":
				$("div.selection[id_item="+evt.value+"]", self.element).removeClass("hovered");
			break;
			case "visibility":
				var fct = evt.value ? "show":"hide";
				$("div.selections, self.element")[fct]();
			break;
			case "global_editor": 
				var $editor = $("<div/>");
				$("div.global-editors", this.element).append($editor);
				$editor.editor();
			break;
			case "select_thread":
				var o = model.o.location[evt.value];
				self._id_location = evt.value;
				self._page = self._model.o.location[self._id_location].page;
				//move player if it was far enough: 
				if (Math.abs(self._page/self.SEC_MULT_FACTOR - ytplayer.getCurrentTime()) > self.T_METRONOME){
					ytplayer.seekTo(self._page/self.SEC_MULT_FACTOR);
				}
				NB_vid.methods.updatePlayerInfo();
				NB_vid.methods.updateProgressbar();
				NB_vid.methods.tickSelect(self._id_location);
				self._render();
			break;
			case "doc_scroll_down": 
				$.L("[docView11] TODO: doc_scroll_down");		
			break;
			case "doc_scroll_up": 
				$.L("[docView11] TODO: doc_scroll_up");		
			break;
			case "drawable_start":
				NB_vid.wasPlaying = NB_vid.isPlaying;
				self._pause();
				// Update store time as an attribute for the editorView to grab later
				self._page = Math.floor(self.SEC_MULT_FACTOR*ytplayer.getCurrentTime());
				$("#videoCover").attr("page", self._page);
			break;
			case "editor_prepare":
				// Update store time as an attribute for the editorView to grab later
				self._page = Math.floor(self.SEC_MULT_FACTOR*ytplayer.getCurrentTime());
				$("#videoCover").attr("page", self._page);
			break;
			case "editor_saving":
				if (NB_vid.wasPlaying) {
					self._play();
				} else {
					self._pause();
				}
			break;
			case "editor_delete":
				if (NB_vid.wasPlaying) {
					self._play();
				} else {
					self._pause();
				}
			break;
			case "metronome":
				if (!self._ignoremetronome){
					NB_vid.methods.updatePlayerInfo();
					NB_vid.methods.updateProgressbar();
				}
			break;
			}
        },
        select: function(){
			var id = this._id_source;
			if (id && id !== $.concierge.get_state("file")){
				$.concierge.trigger({type:"file", value:this._id_source });
			}
		}, 
        set_model: function(model, init_event){
			var self=this;
			
			// Register for location updates
			model.register($.ui.view.prototype.get_adapter.call(this),  {location: null});
			//build view: 
			var id_source = $.concierge.get_state("file");
			self._id_source =  id_source; 
			self._model =  model;
			self._generate_contents();
			self._render();
			if (init_event){
				$.concierge.trigger(init_event);
			}
			else{
				$.concierge.trigger({type:"page", value: 1});
			}
			if ($.concierge.activeView == null){
				$.concierge.activeView = self; //init. 
			}
        },
        _keydown: function(event){
			var thread_codes = {37: {sel: "prev", no_sel: "last", dir: "up", msg:"No more comments above..."}, 39: {sel: "next", no_sel:"first", dir: "down", msg:"No more comments below..."}}; 
			var scroll_codes = {38: "-=", 40: "+="};
			var new_sel, id_item, id_new;
			if (event.keyCode in thread_codes){
				var sel = $("div.selection.selected", this.element);
				if (sel.length){
					new_sel = sel[thread_codes[event.keyCode].sel]();
					if (new_sel.length){
						new_sel.click();
					}
					else { // we need to find next location on subsequent pages
						id_item = sel.attr("id_item");
						id_new = $.concierge.get_component("location_closestpage")({id: Number(id_item), model: this._model, direction: thread_codes[event.keyCode].dir});
						if (id_new != null){
							$.concierge.trigger({type:"select_thread", value: id_new});
						}else{
							$.I( thread_codes[event.keyCode].msg);
						}
					}
				}
				else{ // no selection on the page
					new_sel = $("div.selection")[thread_codes[event.keyCode].no_sel]();
					if (new_sel.length){
						new_sel.click();
					}
				}
				return false;
			}
			else if (event.keyCode in scroll_codes){
				$.L("[docView11] TODO _keydown");
			}
			else{
				return true; // let the event be captured for other stuff
			}
		}, 
        update: function(action, payload, items_fieldname){            //TODO: this is exactly the same code as ui.notepaneview7.js: maybe we should factor it out ?             
            var self = this;
            var warnIfUsingFlash = function(){
                if ("cueVideoByFlashvars" in ytplayer && $(".nb-flash-warning", self.element).length===0){
                    // http://stackoverflow.com/questions/12486655/detect-if-client-using-html5-youtube-player                    
                    $("div.contents", self.element).prepend("<div class='nb-flash-warning'>NB detected that you are using the Flash version of the YouTube player. You need to be using the HTML5 YouTube player in order to be able to annotate YouTube videos and see other's annotations. To do so, visit <a href='http://youtube.com/html5'>http://youtube.com/html5</a> and click on the <b>Join the HTML5 Trial</b> button.</div>");
                }
            };

			if (action === "add" && items_fieldname==="location"){
				var id_source	= this._id_source; 
				var page		= this._page;
				if (page == null || id_source == null ){
					//initial rendering: Let's render the first page. We don't check the id_source here since other documents will most likely have their page variable already set. 
					this._page =  1;
					this._render();
					var autoProgress = $.Deferred();
					var f_poll = function(){
						if (!ytplayer) {
							console.log("NULL ytplayer");
							setTimeout(f_poll, 100);
						}
						else if ("getDuration" in ytplayer){
							autoProgress.resolve();
						}
						else{
							setTimeout(f_poll, 100);
						}
					};
					f_poll(); //initiate polling 
					autoProgress.done(function () {
						warnIfUsingFlash();
						NB_vid.methods.addAllTicks(payload);
						NB_vid.methods.updatePlayerInfo();
					});
					//TODO: in other  "add location" cases we may have to use different method, that forces a to redraw the pages that have been rendered already.
				}
				else{
					NB_vid.methods.addAllTicks(payload);
					for (var o in payload.diff){
						this._page = payload.diff[o].page;
						this._render();
					}
				}
			}
            else if (action === "remove" && items_fieldname === "location"){ //just re-render the pages where locations were just removed. 
                var D		= payload.diff;
                $.L("[docView11] TODO: remove");
            } 
        },
        _generate_contents: function() {
			var self = this;
			
			// Wait until ytplayer is loaded
			if (!NB_vid.ytLoaded) {
				window.setTimeout(function() {
				self._generate_contents();
				}, 100);
				return;
			}
			
			self._metronome = initializeYouTubeMetronome(self.T_METRONOME);
			// Play and pause to load metadata
			ytplayer.loadVideoById(self._model.get("youtubeinfo", {}).first().key);
			ytplayer.pauseVideo();
			self.element.addClass("docView");
			$("#videoCover").drawable({model: self._model});
        },
        _update: function(){
			$.ui.view.prototype._update.call(this);
			var self = this;
			/*
			//TODO: If we just do this, we loose the place we were at in the video
			self._generate_contents();
			self._render();
			*/
        },
        close: function(){
			var id =  this._id_source;
			delete $.concierge.features["doc_viewer"][id];
			$.ui.view.prototype.close.call(this);
			$.L("closing docviewer",  id);
        },
        _render: function(){
			/*
			* this is where we implement the caching strategy we want...
			*/
			var p = this._page;
			this._render_one(p);
        }, 
        _render_one: function(page){
			var self	= this;
			self._draw_selections(page);
        }, 
        _draw_selections: function(page){
			var self = this;
			var contents;
			var id_source = parseInt(self._id_source, 10) ;
			var model = this._model;		
			var t,l,w,h, ID, locs, o, sel_contents, s_w=self._w/1000.0, s_h=self._h/1000.0;
			var file = model.o.file[id_source];
			contents="";
			locs = model.get("location", {id_source: id_source, page: page}).sort(self.options.loc_sort_fct);
			var me =  $.concierge.get_component("get_userinfo")();
			for (var i=0;i<locs.length;i++){
				o = locs[i];
				ID=o.ID;
				t=o.top*s_h;
				l=o.left*s_w;
				w=o.w*s_w;
				h=o.h*s_h;
				sel_contents = "";
				if (!(model.get("comment", {ID_location: ID, admin: 1}).is_empty())){
					sel_contents += "<div class='nbicon adminicon' title='An instructor/admin has participated to this thread'/>";
				}
				if (!(model.get("comment", {ID_location: ID, id_author: me.id}).is_empty())){
					if (model.get("comment", {ID_location: ID, type: 1}).is_empty()){
						sel_contents += "<div class='nbicon meicon' title='I participated to this thread'/>";
					}
					else{
						sel_contents += "<div class='nbicon privateicon' title='I have private comments in this thread'/>";
					}
				}
				contents+=("<div class='selection' id_item='"+ID+"' style='top: "+t+"px; left: "+l+"px; width: "+w+"px; height: "+h+"px'>"+sel_contents+"</div>");
			}    
			$(".selections",  self.element).html(contents).children(".selection").mouseover(function(evt){
				$.concierge.trigger({type:"note_hover", value: evt.currentTarget.getAttribute("id_item")});
            }).mouseout(function(evt){
                $.concierge.trigger({type:"note_out", value: evt.currentTarget.getAttribute("id_item")});
			}).click(function(evt){
				$.concierge.trigger({type:"select_thread", value: evt.currentTarget.getAttribute("id_item")});
            });
			var sel = model.o.location[self._id_location];
			if (sel && sel.page===page){//highlight selection
				$(".selection[id_item="+self._id_location+"]",self.element).addClass("selected");
			}
        }
	});
    
    $.widget("ui.docView",V_OBJ );
    $.ui.docView.prototype.options = {
		img_server: "http://localhost", 
		loc_sort_fct: function(o1, o2){return o1.top-o2.top;},
		provides: ["doc"], 
		listens: {
			note_hover: null, 
			note_out: null, 
			visibility: null, 
			global_editor: null, 
			select_thread: null,
			drawable_start: null,
			editor_saving: null,
			metronome: null,
			editor_delete: null,
			editor_prepare: null
		}
	};
})(jQuery);
	

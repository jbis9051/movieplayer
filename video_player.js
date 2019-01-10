var timeline;
var video;
var video_wrapper;
var play_pause_toggle;
var volume_wrapper;
var past_volume;
var volume_button;
var toolbar;
var control_wrapper;
var full_screen_supported = document.documentElement.requestFullScreen || document.documentElement.mozRequestFullScreen || document.documentElement.webkitRequestFullScreen;
$(document).ready(function (){
    video = document.querySelector('.video_wrapper video');
    timeline = $('.timeline_container');
    volume_wrapper = $('.volume_slider_container');
    video_wrapper = $('.video_wrapper');
    play_pause_toggle = $('.play_pause_toggle');
    volume_button = $('.volume_button');
    toolbar = $('.toolbar_time');
    control_wrapper = $('.controls_wrapper');
    timeline.on("mouseenter",function (event) {
        toolbarStart(event);
    });
    timeline.on("mousedown touchstart",function (event){
        scrubDragStart(event)
    });
    volume_wrapper.on("mousedown touchstart",function (event) {
       volume_scrub_start(event);
    });
    $(video).on("mousedown", function () {
        if(video.playing){
            pause();
        } else {
            play();
        }
    });
    $(video).on("volumechange",function () {
        volume_scrub(video.volume);
    });
    /*
    video_wrapper.mouseleave(function () {
        disappear();
    });
    video_wrapper.mouseenter(function () {
        appear();
    });
         */
    $(video).on("loadstart",function () {
        $('.loader').css('display','block');

    });
    $(video).on("loadeddata",function () {
        appear();
        $('.loader').css('display','none');
    });
    $(video).on("loadedmetadata",function () {
        setInterval(function () {
            php_info_data.time = video.currentTime;
            $.ajax({
                type:"POST",
                url: "https://brownmovies.ddns.net/api/resume/setter.php",
                data: {'json': JSON.stringify(php_info_data)},
            });
        }, 10000);
    });
    video.playing = false;
    $(video).on('playing play',function () {
        this.playing = true;
        play_pause_toggle.removeClass('fa-play');
        play_pause_toggle.addClass('fa-pause');
    });
    $(video).on('pause',function () {
        this.playing = false;
        play_pause_toggle.removeClass('fa-pause');
        play_pause_toggle.addClass('fa-play');
    });
    $(video).on('timeupdate',function () {
        $('.time_elapsed').html(String(video.currentTime).toHHMMSS());
        $('.time_left').html(String(video.duration-video.currentTime).toHHMMSS());
       var percent_done = (video.currentTime/video.duration)*100;
        $('.timeline_progress').css('width',percent_done+"%");
    });
    $(video).on('progress',function () { /* https://github.com/sahat/vplayer/blob/master/js/main.js */
        if (video.buffered.length > 0) {
            var bufferedEnd = video.buffered.end(video.buffered.length - 1);
            var duration = video.duration;
            var bufferedAmount = (bufferedEnd / duration) * 100;
            if (duration > 0) {
                $('.timeline_loaded').css('width', bufferedAmount + "%");
            }
        }
    });
    control_wrapper.mouseleave(function (){
        startTimer();
    });
    volume_button.click(function () {
       mute_toggle();
    });
    play_pause_toggle.click(function () {
        if(video.playing){
            pause();
        } else {
            play();
        }
    });
    video_wrapper.dblclick(function (event) {
        if($(event.target).is($(video))){
            toggleFullScreen();
        }
    });
    $('.fullscreen_toggle').click(function () {
        toggleFullScreen();
    });
    $(video).on("webkitendfullscreen",function () {
       $(this).removeAttr("controls");
    });
});
function play(){
    video.play();
}
function pause(){
   video.pause();
}
function scrub(event) {
    var percent_done = ((event.pageX - timeline.offset().left)/timeline.get(0).offsetWidth);
    lastScrubPercent = percent_done;
    if(percent_done<=1){
        $('.timeline_progress').css('width',(percent_done*100+"%"));
        video.currentTime = video.duration*percent_done;
    }
}
var lastScrub;
var pastScrubAmount;
var scrubDisabled = false;
var scrubTime;
function scrubAttempt(event){
    var percent_done = ((event.pageX - timeline.offset().left)/timeline.get(0).offsetWidth);
    if(!scrubDisabled){
        if(Math.abs(pastScrubAmount*100-percent_done*100)<=2){
            scrub(event);
        } else {
            if(percent_done<=1) {
                $('.timeline_progress').css('width', (percent_done * 100 + "%"));
            }
            scrubDisabled = true;
            pastScrubAmount = percent_done;
            scrubTime = setTimeout(function () {
                scrubDisabled = false;

            },500);
        }
    } else {
        if(percent_done<=1) {
            $('.timeline_progress').css('width', (percent_done * 100 + "%"));
            lastScrub = event;
        }
    }

}
function scrubDragStart(event){
    pause();
    pastScrubAmount = ((event.pageX - timeline.offset().left)/timeline.get(0).offsetWidth);
    scrubAttempt(event);
    $(window).on("mousemove touchmove",function (event){
        scrubAttempt(event);
    });
    $(document).on("mouseup touchend",function (event){
        scrubDragStop(event);
    });
}
function scrubDragStop(event) {
    clearTimeout(scrubTime);
    scrub(event);
    // play();'
    $(window).off("mousemove touchmove");
    $(document).off('mouseup touchend');
}
function toolBarMove(event) {
    var percent_hover = ((event.pageX - timeline.offset().left)/timeline.get(0).offsetWidth);
   toolbar.css('left',(event.pageX-timeline.offset().left-(toolbar.width()/2))+'px');
  var seconds =  video.duration*percent_hover;
  if(seconds>0){
      toolbar.html(String(seconds).toHHMMSS());
  } else {
      toolbar.html(String(0).toHHMMSS());
  }

}
function toolbarStart(event){
    toolBarMove(event);
    $(document).on("mousemove touchmove",function (event){
        toolBarMove(event);
        appear();
    });
    timeline.on("mouseleave touchend",function (){
        toolbarStop();
    });
}
function toolbarStop() {
    // play();
    $(document).off('mousemove touchmove');
    $(timeline).off('mouseleave touchend');
    $(document).on("mousemove touchmove",function () {
        appear();
    });
}
var dis_timer;
function appear(){
    video_wrapper.removeAttr('data-disappear');
    restartTimer();
}
function disappear(){
    video_wrapper.attr('data-disappear','');
}
var canceled = false;
function restartTimer() {
    if(full_screen_supported && !canceled) {
       stopTimer();
        dis_timer = setTimeout(function () {
            disappear();
        }, 2000)
    }
}
function stopTimer() {
    clearTimeout(dis_timer);
    canceled = true;
}
function startTimer() {
    canceled = false;
    restartTimer();
}
function toggleFullScreen() {
    if(full_screen_supported) {
        if ((document.fullScreenElement && document.fullScreenElement !== null) ||
            (!document.mozFullScreen && !document.webkitIsFullScreen)) {
            if (document.documentElement.requestFullScreen) {
                document.documentElement.requestFullScreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullScreen) {
                document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
        }
    } else {
        play();
    }
}
function volume_scrub(percent_done) {
    if(percent_done>=0 && percent_done <= 1){
        video.volume = percent_done;
        $('.volume_progress').css('width',(percent_done*100+"%"));
        volume_button.removeClass('fa-volume-down').removeClass('fa-volume-up').removeClass('fa-volume-off');
        if(percent_done < 0.05){
            volume_button.addClass('fa-volume-off');
        } else if(percent_done >= 0.5){
            volume_button.addClass('fa-volume-up');
        } else {
            volume_button.addClass('fa-volume-down');
        }

    }
}
function volume_scrub_start(event){
    volume_scrub(((event.pageX - volume_wrapper.offset().left)/volume_wrapper.get(0).offsetWidth));
    $(document).on("mousemove touchmove",function (event){
        volume_scrub(((event.pageX - volume_wrapper.offset().left)/volume_wrapper.get(0).offsetWidth))
    });
    $(document).on("mouseup touchend",function (){
        volume_scrub_stop();
    });
}
function volume_scrub_stop() {
    // play();
    $(document).off('mousemove touchmove');
    $(document).off('mouseup touchend');
    $(document).on("mousemove touchmove",function () {
        appear();
    });
}
function mute_toggle() {
    if (video.volume === 0) {
        video.volume = past_volume;
    } else {
        past_volume = video.volume;
        video.volume = 0;
    }
}
String.prototype.toHHMMSS = function () { /* https://stackoverflow.com/a/6313008/7886229 */
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours + ':' + minutes + ':' + seconds;
};
$(document).keydown(function (event) {
    var code = event.keyCode || event.which;
    event.preventDefault()
    if(code === 402 || code === 403){
        toggleFullScreen();
    }
    if(code === 32){
        if(video.playing){
            pause();
        } else {
            play();
        }
    }
    if(code===37){
        video.currentTime-=10;
    }
    if(code===39){
        video.currentTime+=10;
    }
});
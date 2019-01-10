<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" type="text/css" href="css/video_player.css">
    <script src="/jquery.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <script src="md5.js"></script>
    <title>Big Buck Bunny</title>
    <meta property="og:title" content="Test Video - Brown Movies"/>
    <meta property="og:type" content="video/mp4"/>
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
</head>
<body>
<div class="video_wrapper" data-disappear data-first>
    <video autoplay preload="metadata" class="main_video" src="big_buck_bunny.mp4"></video>
    <a href="javascript:history.go(-1)"><button class="back_arrow fa fa-arrow-left"></button></a>
    <a href="/"><button class="exit">&times;</button></a>
    <div class="loader">
        <div class="sk-circle">
            <div class="sk-circle1 sk-child"></div>
            <div class="sk-circle2 sk-child"></div>
            <div class="sk-circle3 sk-child"></div>
            <div class="sk-circle4 sk-child"></div>
            <div class="sk-circle5 sk-child"></div>
            <div class="sk-circle6 sk-child"></div>
            <div class="sk-circle7 sk-child"></div>
            <div class="sk-circle8 sk-child"></div>
            <div class="sk-circle9 sk-child"></div>
            <div class="sk-circle10 sk-child"></div>
            <div class="sk-circle11 sk-child"></div>
            <div class="sk-circle12 sk-child"></div>
        </div>
    </div>
    <div class="controls_wrapper">
        <div class="controls_container">
            <div class="timeline_container">
                <div class="timeline_loaded"></div>
                <div class="timeline_progress">
                        <div class="timeline_scrubhead"></div>
                </div>
                <div class="toolbar_time"></div>
            </div>
            <div class="button_wrapper">
                <button class="play_pause_toggle fa fa-play"></button>
                <span class="time_elapsed">00:00:00</span>
                <div class="spacer">
                    <span>Big Buck Bunny</span>
                </div>
                <span class="time_left">00:00:00</span>
                <div class="info_button">
                    <button class="fa fa-info"></button>
                    <div class="movie_info">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Big_buck_bunny_poster_big.jpg/220px-Big_buck_bunny_poster_big.jpg">
                        <h1 class="title">Big Buck Bunny</h1>
                        <h3 class="year">2008</h3>
                        <h3 class="rating">N/A</h3>
                        <p class="description">A large and lovable rabbit deals with three tiny bullies, led by a flying squirrel, who are determined to squelch his happiness.</p>
                    </div>
                </div>
                <a href="big_buck_bunny.mp4" download="Big Buck Bunny (2008).mp4">
                    <button class="fa fa-download"></button>
                </a>
                <button class="volume_button fa fa-volume-up"></button>
                <div class="volume_slider_container">
                    <div class="volume_progress">
                        <div class="volume_slidehead"></div>
                    </div>
                </div>
                <button class="fullscreen_toggle fa fa-expand"></button>
            </div>
        </div>
    </div>
</div>
<script   src="https://code.jquery.com/jquery-3.3.1.js"   integrity="sha256-2Kok7MbOyxpgUVvAk/HJ2jigOSYS2auK4Pfzbm7uH60="   crossorigin="anonymous"></script>
<script src="video_player.js"></script>
<script>
    var first_time = true;
    $(document).ready(function() {
        $('.main_video').on("canplay", function () {
            $(document).on("mousemove touchmove",function () {
                appear();
            });
            control_wrapper.mouseenter(function (){
                appear();
                stopTimer();
            });
            if(first_time) {
                first_time = false;
            }
        });
    });
</script>
</body>
</html>

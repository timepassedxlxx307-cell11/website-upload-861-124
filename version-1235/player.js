function initMoviePlayer(source, videoId, buttonId) {
    var video = document.getElementById(videoId);
    var button = document.getElementById(buttonId);
    var hls = null;
    var attached = false;

    if (!video || !source) {
        return;
    }

    function attach() {
        if (attached) {
            return;
        }
        attached = true;
        if (window.Hls && window.Hls.isSupported()) {
            hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(source);
            hls.attachMedia(video);
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
        } else {
            video.src = source;
        }
    }

    function hideButton() {
        if (button) {
            button.classList.add('is-hidden');
        }
    }

    function start() {
        attach();
        hideButton();
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function() {});
        }
    }

    if (button) {
        button.addEventListener('click', start);
    }

    video.addEventListener('click', function() {
        if (video.paused) {
            start();
        }
    });

    video.addEventListener('play', hideButton);

    window.addEventListener('pagehide', function() {
        if (hls) {
            hls.destroy();
            hls = null;
        }
    });
}

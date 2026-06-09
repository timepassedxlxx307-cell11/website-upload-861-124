(function() {
    window.initMoviePlayer = function(url, elementId) {
        var container = document.getElementById(elementId);

        if (!container) {
            return;
        }

        var video = container.querySelector('video');
        var button = container.querySelector('.player-start');
        var attached = false;
        var hlsInstance = null;

        function attachVideo() {
            if (!video || attached) {
                return;
            }

            attached = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = url;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(url);
                hlsInstance.attachMedia(video);
            } else {
                video.src = url;
            }

            if (button) {
                button.classList.add('is-hidden');
            }

            var playPromise = video.play();

            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function() {});
            }
        }

        if (button) {
            button.addEventListener('click', attachVideo);
        }

        if (video) {
            video.addEventListener('click', function() {
                if (!attached) {
                    attachVideo();
                }
            });

            video.addEventListener('play', function() {
                if (button) {
                    button.classList.add('is-hidden');
                }
            });
        }

        window.addEventListener('beforeunload', function() {
            if (hlsInstance && typeof hlsInstance.destroy === 'function') {
                hlsInstance.destroy();
            }
        });
    };
})();

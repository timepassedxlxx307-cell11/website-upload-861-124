import { H as Hls } from './hls-dru42stk.js';

function prepareVideo(wrapper) {
    var video = wrapper.querySelector('video');
    var button = wrapper.querySelector('.player-overlay');
    var source = wrapper.getAttribute('data-video');
    var loaded = false;
    var hlsInstance = null;

    if (!video || !button || !source) {
        return;
    }

    function loadSource() {
        if (loaded) {
            return;
        }

        loaded = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
        } else if (Hls && Hls.isSupported()) {
            hlsInstance = new Hls({
                maxBufferLength: 36,
                enableWorker: true,
                lowLatencyMode: true
            });
            hlsInstance.loadSource(source);
            hlsInstance.attachMedia(video);
        } else {
            video.src = source;
        }
    }

    function playVideo() {
        loadSource();
        button.classList.add('is-hidden');
        video.play().catch(function () {
            button.classList.remove('is-hidden');
        });
    }

    button.addEventListener('click', playVideo);

    video.addEventListener('click', function () {
        if (video.paused) {
            playVideo();
        }
    });

    video.addEventListener('play', function () {
        button.classList.add('is-hidden');
    });

    video.addEventListener('pause', function () {
        if (video.currentTime === 0 || video.ended) {
            button.classList.remove('is-hidden');
        }
    });

    window.addEventListener('beforeunload', function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
}

document.querySelectorAll('[data-player]').forEach(prepareVideo);

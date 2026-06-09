(function() {
  window.initMoviePlayer = function(videoId, maskId, streamUrl) {
    var video = document.getElementById(videoId);
    var mask = document.getElementById(maskId);
    var loaded = false;
    var hls = null;

    if (!video || !streamUrl) {
      return;
    }

    function loadStream() {
      if (loaded) {
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
      } else {
        video.src = streamUrl;
      }

      loaded = true;
    }

    function startPlayback() {
      loadStream();
      video.controls = true;
      if (mask) {
        mask.classList.add("is-hidden");
      }
      var promise = video.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(function() {});
      }
    }

    if (mask) {
      mask.addEventListener("click", function(event) {
        event.preventDefault();
        startPlayback();
      });
    }

    video.addEventListener("click", function() {
      if (video.paused) {
        startPlayback();
      }
    });

    video.addEventListener("play", function() {
      if (mask) {
        mask.classList.add("is-hidden");
      }
    });

    window.addEventListener("beforeunload", function() {
      if (hls) {
        hls.destroy();
      }
    });
  };
})();

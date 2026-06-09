(function () {
  function createMoviePlayer(settings) {
    var video = document.getElementById(settings.videoId);
    var button = document.getElementById(settings.buttonId);
    var hlsInstance = null;

    if (!video || !button || !settings.source) {
      return;
    }

    function attach() {
      return new Promise(function (resolve) {
        if (video.getAttribute("data-ready") === "true") {
          resolve();
          return;
        }

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = settings.source;
          video.setAttribute("data-ready", "true");
          resolve();
          return;
        }

        if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({ enableWorker: true });
          hlsInstance.loadSource(settings.source);
          hlsInstance.attachMedia(video);
          hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
            video.setAttribute("data-ready", "true");
            resolve();
          });
          hlsInstance.on(window.Hls.Events.ERROR, function () {
            video.setAttribute("data-ready", "true");
            resolve();
          });
          return;
        }

        video.src = settings.source;
        video.setAttribute("data-ready", "true");
        resolve();
      });
    }

    function play() {
      attach().then(function () {
        button.classList.add("is-hidden");
        video.controls = true;
        var promise = video.play();
        if (promise && typeof promise.catch === "function") {
          promise.catch(function () {
            button.classList.remove("is-hidden");
          });
        }
      });
    }

    button.addEventListener("click", function (event) {
      event.preventDefault();
      play();
    });

    video.addEventListener("click", function () {
      if (video.paused) {
        play();
      }
    });

    video.addEventListener("play", function () {
      button.classList.add("is-hidden");
    });

    video.addEventListener("ended", function () {
      button.classList.remove("is-hidden");
    });

    window.addEventListener("beforeunload", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }

  window.createMoviePlayer = createMoviePlayer;
})();

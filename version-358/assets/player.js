(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function mount(source) {
    ready(function () {
      var shell = document.querySelector("[data-player-shell]");
      var video = document.querySelector("[data-player-video]");
      var overlay = document.querySelector("[data-play-overlay]");
      var playButton = document.querySelector("[data-play-button]");
      var errorBox = document.querySelector("[data-player-error]");
      var hlsInstance = null;
      var attached = false;

      if (!shell || !video || !source) {
        return;
      }

      function showError() {
        if (errorBox) {
          errorBox.textContent = "播放暂时不可用，请稍后重试";
          errorBox.classList.add("visible");
        }
      }

      function attachSource() {
        if (attached) {
          return;
        }

        attached = true;

        if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
          });

          hlsInstance.loadSource(source);
          hlsInstance.attachMedia(video);
          hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
            if (data && data.fatal) {
              showError();
            }
          });
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = source;
        } else {
          showError();
        }
      }

      function startPlayback() {
        attachSource();

        if (overlay) {
          overlay.classList.add("hidden");
        }

        video.setAttribute("controls", "controls");
        var promise = video.play();

        if (promise && typeof promise.catch === "function") {
          promise.catch(function () {
            if (overlay) {
              overlay.classList.remove("hidden");
            }
          });
        }
      }

      if (playButton) {
        playButton.addEventListener("click", startPlayback);
      }

      if (overlay) {
        overlay.addEventListener("click", startPlayback);
      }

      video.addEventListener("play", function () {
        if (overlay) {
          overlay.classList.add("hidden");
        }
      });

      window.addEventListener("beforeunload", function () {
        if (hlsInstance) {
          hlsInstance.destroy();
        }
      });
    });
  }

  window.MoviePlayer = {
    mount: mount
  };
})();

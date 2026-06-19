(function () {
    function setupPlayer(box) {
        var video = box.querySelector('video');
        var source = box.getAttribute('data-src');
        var loading = box.querySelector('.player-loading');
        var playButton = box.querySelector('.player-play');
        var muteButton = box.querySelector('.player-mute');
        var fullscreenButton = box.querySelector('.player-fullscreen');
        var startButton = document.querySelector('[data-start-player]');
        var hls = null;
        if (!video || !source) {
            return;
        }
        function ready() {
            if (loading) {
                loading.classList.add('ready');
            }
        }
        function attachSource() {
            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: false,
                    maxBufferLength: 30,
                    maxMaxBufferLength: 60
                });
                hls.loadSource(source);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.MANIFEST_PARSED, ready);
                hls.on(window.Hls.Events.ERROR, function () {
                    ready();
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
                video.addEventListener('loadedmetadata', ready, { once: true });
            } else {
                video.src = source;
                ready();
            }
        }
        function updatePlayState() {
            if (playButton) {
                playButton.textContent = video.paused ? '▶' : '❚❚';
            }
        }
        function togglePlay() {
            if (video.paused) {
                var action = video.play();
                if (action && typeof action.catch === 'function') {
                    action.catch(function () {
                        ready();
                    });
                }
            } else {
                video.pause();
            }
        }
        function toggleMute() {
            video.muted = !video.muted;
            if (muteButton) {
                muteButton.textContent = video.muted ? '🔇' : '🔊';
            }
        }
        function toggleFullscreen() {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else if (box.requestFullscreen) {
                box.requestFullscreen();
            }
        }
        if (playButton) {
            playButton.addEventListener('click', togglePlay);
        }
        if (startButton) {
            startButton.addEventListener('click', togglePlay);
        }
        if (muteButton) {
            muteButton.addEventListener('click', toggleMute);
        }
        if (fullscreenButton) {
            fullscreenButton.addEventListener('click', toggleFullscreen);
        }
        box.addEventListener('click', function (event) {
            if (!event.target.closest('button') && event.target !== video) {
                togglePlay();
            }
        });
        video.addEventListener('play', updatePlayState);
        video.addEventListener('pause', updatePlayState);
        video.addEventListener('canplay', ready);
        attachSource();
        updatePlayState();
        window.addEventListener('beforeunload', function () {
            if (hls) {
                hls.destroy();
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('[data-player]').forEach(setupPlayer);
    });
})();

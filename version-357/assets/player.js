async function prepareVideo(video) {
  const stream = video.dataset.stream;
  if (!stream || video.dataset.ready === 'true') {
    return;
  }

  video.dataset.ready = 'true';

  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = stream;
    return;
  }

  try {
    const module = await import('./hls-vendor-bbsaiqh1.js');
    const Hls = module.H;

    if (Hls && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(stream);
      hls.attachMedia(video);
      video.hlsInstance = hls;
      return;
    }
  } catch (error) {
    video.dataset.ready = 'native';
  }

  video.src = stream;
}

function attachPlayer(shell) {
  const video = shell.querySelector('video[data-stream]');
  const overlay = shell.querySelector('.player-overlay');

  if (!video || !overlay) {
    return;
  }

  async function play() {
    await prepareVideo(video);
    const playback = video.play();

    if (playback && typeof playback.then === 'function') {
      playback.catch(function () {
        shell.classList.remove('is-playing');
      });
    }
  }

  overlay.addEventListener('click', play);
  video.addEventListener('click', function () {
    if (video.paused) {
      play();
    }
  });
  video.addEventListener('play', function () {
    shell.classList.add('is-playing');
  });
  video.addEventListener('pause', function () {
    shell.classList.remove('is-playing');
  });
  video.addEventListener('ended', function () {
    shell.classList.remove('is-playing');
  });
}

document.querySelectorAll('[data-player]').forEach(attachPlayer);

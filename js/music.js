var YT_PLAYER = null;
var YT_READY = false;
var YT_PLAYING = false;

function onYouTubeIframeAPIReady() {
  YT_PLAYER = new YT.Player("yt-bg-player", {
    videoId: "2lKw4IL2Hks",
    playerVars: { autoplay: 0, controls: 0, loop: 1, playlist: "2lKw4IL2Hks" },
    events: {
      onReady: function() {
        YT_READY = true;
        if (sessionStorage.getItem("music_on") === "1") {
          YT_PLAYER.playVideo();
        }
      },
      onStateChange: function(e) {
        YT_PLAYING = e.data === YT.PlayerState.PLAYING;
        sessionStorage.setItem("music_on", YT_PLAYING ? "1" : "0");
        updateMusicBtn();
      }
    }
  });
}

function toggleMusic() {
  if (!YT_READY || !YT_PLAYER) return;
  if (YT_PLAYING) { YT_PLAYER.pauseVideo(); }
  else { YT_PLAYER.playVideo(); }
}

function startMusicAfterInteraction() {
  sessionStorage.setItem("music_on", "1");
  if (YT_READY && YT_PLAYER) YT_PLAYER.playVideo();
}

function updateMusicBtn() {
  var label = document.getElementById("music-label");
  if (label) label.textContent = YT_PLAYING ? "🔊" : "🔇";
  var btn = document.getElementById("music-btn");
  if (btn) {
    if (YT_PLAYING) btn.classList.add("playing");
    else btn.classList.remove("playing");
  }
}

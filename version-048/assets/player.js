function setupMoviePlayer(sourceUrl) {
    var video = document.getElementById("movie-video");
    var button = document.getElementById("movie-play-button");
    if (!video || !button || !sourceUrl) {
        return;
    }
    var initialized = false;
    var hlsInstance = null;

    function attachSource(callback) {
        if (initialized) {
            callback();
            return;
        }
        initialized = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = sourceUrl;
            video.addEventListener("loadedmetadata", callback, { once: true });
            return;
        }
        if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({ enableWorker: true });
            hlsInstance.loadSource(sourceUrl);
            hlsInstance.attachMedia(video);
            hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, callback);
            hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
                if (data && data.fatal && hlsInstance) {
                    hlsInstance.destroy();
                    hlsInstance = null;
                    video.src = sourceUrl;
                }
            });
            return;
        }
        video.src = sourceUrl;
        callback();
    }

    function play() {
        attachSource(function () {
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

    button.addEventListener("click", play);
    video.addEventListener("click", function () {
        if (video.paused) {
            play();
        }
    });
}

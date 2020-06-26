$(document).ready(function() {
    var get = [];
    location.search
        .replace("?", "")
        .split("&")
        .forEach(function(val) {
            split = val.split("=", 2);
            get[split[0]] = split[1];
        });

    var token = get["token"];
    var live = get["l"];
    var stream_id = "";

    $.getJSON(
        "http://localhost:3333/chat_information/" + live + "?access_token=" + token,
        function(result) {
            var stream_id = result.stream_id;
            $("#live-title").html(result.title);
            $("#live-description").html(result.description);

            $.getJSON(
                "http://localhost:3333/stream/validate/playback/" + stream_id,
                function(result) {
                    var playback_id = "";
                    playback_id = result.payload.playback_id;
                    var video = document.getElementById("video");
                    var videoSrc = "https://stream.mux.com/" + playback_id + ".m3u8";

                    if (Hls.isSupported()) {
                        var hls = new Hls();
                        hls.loadSource(videoSrc);
                        hls.attachMedia(video);
                        hls.on(Hls.Events.MANIFEST_PARSED, function() {
                            video.play();
                        });
                    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
                        video.src = videoSrc;
                        video.addEventListener("loadedmetadata", function() {
                            video.play();
                        });
                    }
                }
            );
        }
    );

    function scrollMin() {
        var messageBody = document.querySelector("#mensagens");
        messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
    }

    let user = "";
    let user_color = "";
    let user_id = "";
    $.getJSON("http://localhost:3333/stream/information/user/" + token, function(
        result
    ) {
        nome = result.payload.fullName;
        user_id = result.payload.id;
    });

    var socket = io();
    $("#form").submit(function(e) {
        e.preventDefault(); // prevents page reloading
        socket.emit("chat message", { nome, user_id, message: $("#m").val() });
        $("#m").val("");
        return false;
    });
    socket.on("savedMessages", (messages) => {
        messages.map(({ nome, user_id, message, user_color }) =>
            $("#messages").append(
                `<small style="color:${user_color};">${nome}: </small>${message}<br />`
            )
        );
        scrollMin();
    });
    socket.on("chat message", function({ nome, user_id, message, user_color }) {
        $("#messages").append(
            `<small style="color:${user_color};">${nome}: </small>${message}<br />`
        );
        scrollMin();
    });
});
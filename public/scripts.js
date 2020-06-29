var live_url = 'http://localhost:3333' // URL PARA O SITE LIVE CAMAROTE

$(document).ready(function() {
    var get = []
    location.search
        .replace('?', '')
        .split('&')
        .forEach(function(val) {
            split = val.split('=', 2)
            get[split[0]] = split[1]
        })

    var token = get['token']
    var live = get['l']
    var stream_id = ''

    $.getJSON(
        live_url + '/chat_information/' + live + '?access_token=' + token,
        function(result) {
            var stream_id = result.stream_id
            $('#live-title').html(result.title)
            $('#live-description').html(result.description)

            $.getJSON(live_url + '/stream/validate/playback/' + stream_id, function(
                result
            ) {
                var playback_id = ''
                playback_id = result.payload.playback_id
                var video = document.getElementById('video')
                var videoSrc = 'https://stream.mux.com/' + playback_id + '.m3u8'

                if (Hls.isSupported()) {
                    var hls = new Hls()
                    hls.loadSource(videoSrc)
                    hls.attachMedia(video)
                    hls.on(Hls.Events.MANIFEST_PARSED, function() {
                        video.play()
                    })
                } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = videoSrc
                    video.addEventListener('loadedmetadata', function() {
                        video.play()
                    })
                }
            })
        }
    )

    function scrollMin() {
        var messageBody = document.querySelector('#mensagens')
        messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight
    }

    let name = ''
    let user_color = ''
    let user_id = ''
    $.getJSON(live_url + '/stream/information/user/' + token, function(result) {
        name = result.payload.fullName
        user_id = result.payload.id
        user_color = result.payload.color

        var socket = io('http://localhost:3000', {
            query: {
                user_id,
                name,
                user_color,
                live_id: live
            }
        })

        $('#form').submit(function(e) {
            e.preventDefault() // prevents page reloading
            socket.emit('chat message' + live, { user_id, message: $('#m').val() })
            $('#m').val('')
            return false
        })
        socket.on('savedMessages', (messages) => {
            messages.map(({ _id, name, message, user_color }) =>
                $('#messages').append(
                    `<div id="${_id}"><small style="color:${user_color};">${name}: </small>${message}<br /></div>`
                )
            )
            scrollMin()
        })
        socket.on('chat message' + live, function({
            _id,
            name,
            message,
            user_color
        }) {
            $('#messages').append(
                `<div id="${_id}"><small style="color:${user_color};" id="${_id}">${name}: </small>${message}<br /></div>`
            )
            scrollMin()
        })
    })
})
var express = require("express");
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
var getJSON = require("get-json");
app.use(express.static("public/"));

const messages = [];

let access_token = "";
let live_id = "";
app.get("/", async(req, res) => {
    access_token = req.query.token;
    live_id = req.query.l;

    try {
        const validate = await getJSON(
            "http://localhost:3333/stream/validate/user/" +
            live_id +
            "?token=" +
            access_token
        );

        res.sendFile(__dirname + "/index.html");
    } catch (err) {
        res.redirect("http://beta.camarote.live");
        return;
    }
});

io.on("connection", async(socket) => {
    let nome = "";
    let user_color = "";
    let user_id = "";

    const users = await getJSON(
        "http://localhost:3333/stream/information/user/" + access_token
    );
    user_id = users.payload.id;

    const user_active = messages.find((message) => message.user_id === user_id);

    if (user_active) {
        user_color = user_active.user_color;
    } else {
        user_color = users.payload.color;
    }

    io.to(socket.id).emit("savedMessages", messages);

    socket.on("chat message", ({ nome, user_id, message }) => {
        messages.push({ nome, user_id, message, user_color });
        io.emit("chat message", { nome, user_id, message, user_color });
    });
});

http.listen(3000, () => {
    console.log("listening on *:3000");
});
const express = require("express");
const line = require("@line/bot-sdk");
const request = require("request");

require("dotenv").config();

const app = express();

const config = {
  channelAccessToken: "5bUkBdnDH5cKpjmZz6k5WBKveWLYq2SV7YzHxinuaXyoVBR4pYl0aN7W0PXv/1GS2UuNeuuk12KJ3YEPYxdbld8BJ8vpxPHsDMp09xWpgDqWkFdE5oUf6ZsNjEcyTCoqoM+5P9zMPJrzExutaiZzYQdB04t89/1O/w1cDnyilFU=",
  channelSecret: "402afab3fec3d25e5fe92ef83ea75cf7"
};

const client = new line.Client(config);

var mysql = require("mysql");

var con = mysql.createConnection({
  host: "128.199.214.155",
  user: "savemom",
  password: "savemom@aclab1201",
  database: "line_bot"
});

app.post("/webhook", line.middleware(config), (req, res) => {
  console.log("event");
  Promise.all(req.body.events.map(handleEvent)).then(result =>
    res.json(result)
  );
});

function handleEvent(event) {
  // console.log(event);
  if (event.type === "message" && event.message.type === "text") {
    handleMessageEvent(event);
  } else {
    return Promise.resolve(null);
  }

}

function handleMessageEvent(event) {
  var eventText = event.message.text.toLowerCase();
  console.log(eventText)
  if (eventText === "ประวัติส่วนตัว") {
    var msg = {
      type: "flex",
      altText: "Flex Message",
      contents: {
        type: "bubble",
        direction: "ltr",
        body: {
          type: "box",
          layout: "vertical",
          contents: [{
              type: "image",
              url: "https://www.img.in.th/images/633ae8afdb0b1ad06d7e457c341b32cd.jpg",
              align: "center",
              gravity: "center",
              size: "full",
              aspectRatio: "2:1",
              aspectMode: "cover",
              action: {
                type: "uri",
                label: "QR Code ของฉัน",
                uri: "https://liff.line.me/1654248577-B07Zaz7m"
              }
            },
            {
              type: "image",
              url: "https://www.img.in.th/images/72c3eef9a745bc4aaeb3249471002757.jpg",
              align: "center",
              gravity: "center",
              size: "full",
              aspectRatio: "2:1",
              aspectMode: "cover",
              action: {
                type: "uri",
                label: "ประวัติส่วนตัว",
                uri: "https://www.youtube.com/watch?v=EhKqy4Xd0YU"
              }
            }
          ]
        }
      }
    };
    return client.replyMessage(event.replyToken, msg);
  } else if (eventText === "ประเมินสุขภาพ") {
    var msg = {
      type: "flex",
      altText: "Flex Message",
      contents: {
        type: "bubble",
        direction: "ltr",
        body: {
          type: "box",
          layout: "vertical",
          contents: [{
              type: "image",
              url: "https://sv1.picz.in.th/images/2020/05/25/qTrOqS.jpg",
              align: "center",
              gravity: "center",
              size: "full",
              aspectRatio: "2:1",
              aspectMode: "cover",
              action: {
                type: "uri",
                label: "กรอกเลขบัตรประชาชน",
                uri: "https://liff.line.me/1654248577-NLxe1gxl"
              }
            },
            {
              type: "image",
              url: "https://sv1.picz.in.th/images/2020/05/25/qTrD22.jpg",
              align: "center",
              gravity: "center",
              size: "full",
              aspectRatio: "2:1",
              aspectMode: "cover",
              action: {
                type: "uri",
                label: "สแกน QRcode",
                uri: "line://nv/QRCodeReader/"
              }
            }
          ]
        }
      }
    };
    return client.replyMessage(event.replyToken, msg);
  } else if (eventText.split(" ")[0] == "signin") {
    var query = `SELECT * FROM PERSON WHERE CID = '${eventText.split(" ")[1]}'`;
    console.log(query);
    var jj = "";

    con.connect(function (err) {

      con.query(query, function (err, result, fields) {
        // if (err) throw err;
        jj = result[0];
        setTimeout(function () {
          if (jj.STATUS == "ประชาชนทั่วไป") {
            const options = {
              url: "https://api.line.me/v2/bot/user/" +
                event.source.userId +
                "/richmenu/richmenu-cdadeaecf573ea9bc890cdb8da427c6e",
              method: "POST",
              headers: {
                Authorization: process.env.authenhead
              }
            };
            request(options);
          } else if (jj.STATUS == "อสม") {
            const options = {
              url: "https://api.line.me/v2/bot/user/" +
                event.source.userId +
                "/richmenu/richmenu-75c2e803d39ecb59a1b3b05b0b0aeb1c",
              method: "POST",
              headers: {
                Authorization: process.env.authenhead
              }
            };
            request(options);
          } else if (jj.STATUS == "หมอ") {
            const options = {
              url: "https://api.line.me/v2/bot/user/" +
                event.source.userId +
                "/richmenu/richmenu-cadc9581c3a74ee72cbac02f940d55a1",
              method: "POST",
              headers: {
                Authorization: process.env.authenhead
              }
            };
            request(options);
          }
          // console.log(jj);
          // return client.replyMessage(event.replyToken, {
          //   type: "text",
          //   text: JSON.stringify(jj)
          // });
          console.log(jj.USERID, "undefined");
          console.log(!jj.USERID);
          if (!jj.USERID) {
            con.connect(function (err) {
              // if (err) { console.log(err)};
              var sql = `UPDATE PERSON SET USERID = '${event.source.userId}' WHERE CID = '${jj.CID}'`;
              console.log(sql);
              con.query(sql, function (err, result) {
                // if (err) { console.log(err)};
                //console.log(result.affectedRows + " record(s) updated");
              });
            });
          }
        }, 1000);
      });
    });

  }  else if (eventText.split(" ")[0] == "search") {
    var query = `SELECT * FROM PERSON WHERE CID = '${eventText.split(" ")[1]}'`;
    console.log(query);
    var kk = "";
    con.connect(function (err) {
      con.query(query, function (err, result, fields) {
        // if (err) throw err;
        console.log(result);
      });
    });
  }

}
const listener = app.listen(process.env.PORT, () => {
  console.log("♥ ♥ l Your app is listening  p on port " + listener.address().port);
});
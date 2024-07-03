const WebSocket = require("ws");

const chatClientToken =
  "AQICAHg6NcEa06cJt8_5UnjipPWDfjCw2WJK_t_EJOvwB1RH3wFSxl4sUo-Vo3y7h76KoomEAAACTTCCAkkGCSqGSIb3DQEHBqCCAjowggI2AgEAMIICLwYJKoZIhvcNAQcBMB4GCWCGSAFlAwQBLjARBAzhzRO72ykwCrz49zACARCAggIAT4N0F3l6GQAwZNHHJwc2lQn6FlMY8AZUgnf8SLclPIJhWbHW-M2AgNgi-IUMHoYpFa1R45inb-Rcoz_hxG-7jgOiNBlnlF79NKeTBaPTW0ap-H6njIwk6lqyu_Xqa5OT3MaQDlGm18CCXc_NwpmSTBCsIrOxpDvjO072mmPbw_koknZNr_CXWIyJQ2HuR11dSgSorJbF5mmJXqDTEVeYO8VSjgllnG6_YhJl7nXXGFPU02-fGZuTrNwym1D3XFtue001bJJebAQV19hnpkxCA2fSM-xlflwYGbUfd00zMtTqWd8CJ6wSxhAkWQcV3IUU8sekopi9tcTUhiQJKnAXH9GlXTn17pksvDU8KLjwDv0nyUvlfdSim0Df8ESCs9GsCM8xBmFW_i7ZID_Lma8GJmgpxCiyp-ZhNhDIlV9YSPn56IKYMdR5fJ6KmlDNxCbt6SIY3haCoC4TvaJx4koRtJ7Jqa0Wg2baeiHTBV19-w6WiewcMri6HKuLlqtvpBXSqr_W70Gkveu0D6_UmiRfUQ1EAq_UMyzhVrPVGOHKX7RQG1OtRdKWH2-GlyO6afcY7IoNxcPvEgwVEs-w9_EKK0mpJ5zu_T3IDNbw1W4tlZV9YiSe4vGIisz8uImQ_-KDtNwmkoe9nFKIBJeKyo8TrYroaANhaJRlARbRp4s-ueg!#0";
const socket = "wss://edge.ivschat.us-east-1.amazonaws.com";

const connection = new WebSocket(socket, chatClientToken);

connection.on("open", () => {
  console.log("WebSocket connection established");

  // Example: Send a message
  connection.send(
    JSON.stringify({
      action: "JOIN",
      token: chatClientToken,
    })
  );
});

connection.on("message", (data) => {
  console.log("Received message:", data);
});

connection.on("close", () => {
  console.log("WebSocket connection closed");
});

connection.on("error", (err) => {
  console.error("WebSocket error:", err);
});

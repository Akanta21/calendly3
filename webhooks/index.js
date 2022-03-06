require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const twilioData = require('./twilio')
const isValidSignature = require('./middleware')

const app = express();
const PORT = 3100;

// set up twilio client
const client = require('twilio')(twilioData.accountSid, twilioData.authToken);

// this application will receive JSON data
app.use(bodyParser.json());

// start the server on port 3100
app.listen(PORT, () => console.log(`Running on port ${PORT}`));

// process a GET request to http://localhost:3100/hello
app.get("/hello", (request, response) => {
    response.send("hi!");
});

app.post("/webhook", isValidSignature, (request, response) => {

    const activity = request.body.activity;
    const message = `${activity[0].fromAddress} paid you ${activity[0].value} ETH. TXI:${activity[0].hash}`;

    client.messages
        .create({
            body: message,
            from: twilioData.fromPhone,
            to: twilioData.toPhone
        })
        .then(message => console.log(message.sid));

    response.send(message);
});
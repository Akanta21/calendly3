const twilioData = {
    accountSid: process.env.TWILIO_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    fromPhone: process.env.FROM_NO,
    toPhone: process.env.TO_NO
}

module.exports = twilioData
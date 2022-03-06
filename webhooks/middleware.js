const crypto = require('crypto')

function isValidSignature(request, res, next) {    
    const token = 'Auth token provided by Alchemy on the Webhook setup page';
    const headers = request.headers;
    const signature = headers['x-alchemy-signature']; // Lowercase for NodeJS
    const body = request.body;    
    const hmac = crypto.createHmac('sha256', token) // Create a HMAC SHA256 hash using the auth token
    hmac.update(JSON.stringify(body), 'utf8') // Update the token hash with the request body using utf8
    const digest = hmac.digest('hex');

    if(process.env.ENVIRONMENT === 'test'){
        return next()
    }

    
    if(signature === digest) {
        return next()
    } else {
        console.log('signature', signature)
        console.log('digest', digest)
        return res.status(400).json("Invalid Signature")
    }
}

module.exports = isValidSignature
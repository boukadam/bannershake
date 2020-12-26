// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
require('dotenv').config()
const {MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE, FROM_EMAIL_ADDRESS, CONTACT_TO_EMAIL_ADDRESS} = process.env
const mailjet = require('node-mailjet').connect(MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE)

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {statusCode: 405, body: 'Method Not Allowed', headers: {'Allow': 'POST'}}
    }

    const data = JSON.parse(event.body)
    if (!data.message) {
        return {statusCode: 422, body: 'Message are required.'}
    }
    if (!data.contactEmail) {
        data.contactEmail = "unknown"
    }

    const request = mailjet
        .post("send", {'version': 'v3.1'})
        .request({
            "Messages": [{
                "From": {
                    "Email": FROM_EMAIL_ADDRESS,
                    "Name": "BannerShake"
                },
                "To": [{
                    "Email": CONTACT_TO_EMAIL_ADDRESS,
                    "Name": "BannerShake Admin"
                }],
                "Subject": "BannerShake Feedback",
                "TextPart": `From ${data.contactEmail} \n\n${data.message}`
            }]
        })
    return request
        .then(() => ({
            statusCode: 200,
            body: "Your message was sent successfully! We'll be in touch."
        }))
        .catch((error) => ({
            statusCode: 422,
            body: `Error: ${error}`
        }))

}

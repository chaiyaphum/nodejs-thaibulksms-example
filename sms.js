require('dotenv').config()
const express = require('express')
const {
    body,
    validationResult
} = require('express-validator');
const thaibulksmsApi = require('thaibulksms-api')

const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))


const options = {
    apiKey: process.env.SMS_API_KEY,
    apiSecret: process.env.SMS_API_SECRET,
}


const sms = thaibulksmsApi.sms(options)

app.post('/send-sms', body('phone_number').isMobilePhone('th-TH'), body('message').not().isEmpty(), async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    try {

        let phoneNumber = req.body.phone_number
        let message = req.body.message
        let sender = req.body.sender
        let body = {
            msisdn: phoneNumber,
            message: message,
            // sender: sender,
            // scheduled_delivery: '',
            // force: ''
        }
        console.log(body)
        const response = await sms.sendSMS(body)
        console.log(response)
        res.json(response.data)

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errors: error
        });
    }

})

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
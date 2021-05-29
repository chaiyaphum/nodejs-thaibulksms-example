require('dotenv').config()

const express = require('express')
const { body, validationResult } = require('express-validator');
const thaibulksmsApi = require('thaibulksms-api')

const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


const options = {
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET,
}

const otp = thaibulksmsApi.otp(options)

app.post('/request-otp', body('phone_number').isMobilePhone('th-TH'), async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        let phoneNumber = req.body.phone_number
        const response = await otp.request(phoneNumber)
        res.json(response.data)

    } catch (error) {
        return res.status(500).json({ errors: error });
    }

})

app.post('/verify-otp', body('token').notEmpty(), body('otp_code').notEmpty(), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        let token = req.body.token
        let otpCode = req.body.otp_code
        const response = await otp.verify(token, otpCode)
        res.json(response.data)

    } catch (error) {
        return res.status(500).json({ errors: error });
    }
})

app.get('/big', function (req, res) {
    res.send(options);
  });

app.get('/', function (req, res) {
    res.send('Hello World!');
  });

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
const express = require('express');
const twilio = require('twilio');
const router = express.Router();
require('dotenv').config();

const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

router.post('/send', async (req, res) => {
    const { phoneNumber, message } = req.body;

    try {
        await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber
        });
        res.status(200).send({ success: true, message: 'SMS sent successfully!' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;

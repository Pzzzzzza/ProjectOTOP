const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
require('dotenv').config();  // โหลดค่า environment จากไฟล์ .env
const smsRoutes = require('./routes/smsRoutes');  // รวมเส้นทาง SMS
const twilio = require('twilio');  // เพิ่ม Twilio API

const app = express();
const PORT = process.env.PORT || 3000;

// ใช้ body-parser เพื่ออ่านข้อมูลจากฟอร์มและ JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // เพิ่มการรองรับ JSON body

// เสิร์ฟไฟล์ static จากโฟลเดอร์ public
app.use(express.static('public'));

// เชื่อมต่อเส้นทาง SMS
app.use('/sms', smsRoutes);

// รับข้อมูลสมัครสมาชิก
app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;

    // ข้อมูลสมาชิกที่ได้รับ
    const userData = { name, email, password };

    // บันทึกข้อมูลลงไฟล์ (หรือฐานข้อมูล)
    fs.appendFile('users.txt', JSON.stringify(userData) + '\n', (err) => {
        if (err) {
            console.error('Error saving user:', err);
            return res.status(500).send('บันทึกข้อมูลไม่สำเร็จ');
        }
        console.log('User saved:', userData);
        
        // ส่ง SMS เมื่อสมัครสมาชิกสำเร็จ
        sendWelcomeSMS(req.body.phone); // สมมติว่าเรามีหมายเลขโทรศัพท์ใน req.body.phone
        
        res.send('สมัครสมาชิกสำเร็จ!');
    });
});

// ฟังก์ชันการส่ง SMS โดยใช้ Twilio
function sendWelcomeSMS(phoneNumber) {
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    client.messages
        .create({
            body: 'ขอบคุณที่สมัครสมาชิกกับเรา!',
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber
        })
        .then(message => console.log('Message sent:', message.sid))
        .catch(error => console.error('Error sending message:', error));
}

// เพิ่มเส้นทางใหม่สำหรับการส่ง SMS
app.post('/send-sms', (req, res) => {
    const { phoneNumber, message } = req.body;

    if (!phoneNumber || !message) {
        return res.status(400).send('ต้องการหมายเลขโทรศัพท์และข้อความ');
    }

    sendSMS(phoneNumber, message)
        .then(() => {
            res.send('ส่งข้อความสำเร็จ!');
        })
        .catch(error => {
            res.status(500).send('ไม่สามารถส่งข้อความได้');
        });
});

// ฟังก์ชันส่ง SMS
function sendSMS(phoneNumber, message) {
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    return client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber
    });
}

// เริ่มเซิร์ฟเวอร์
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs'); // ใช้บันทึกข้อมูลในไฟล์ชั่วคราว
const app = express();
const PORT = 3000;

// ใช้ body-parser เพื่ออ่านข้อมูลจากฟอร์ม
app.use(bodyParser.urlencoded({ extended: true }));

// เสิร์ฟไฟล์ static จากโฟลเดอร์ public
app.use(express.static('public'));

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
        res.send('สมัครสมาชิกสำเร็จ!');
    });
});

// เริ่มเซิร์ฟเวอร์
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

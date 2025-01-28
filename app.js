const mysql = require('mysql2');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('Public'));

// เชื่อมต่อฐานข้อมูล MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'online_store'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL!');
});

// เส้นทางแสดงหน้าหลัก
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'index.html'));
});

// เส้นทางแสดงหน้า Login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'login.html'));
});

// เส้นทางแสดงหน้า Signup
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'signup.html'));
});

// เส้นทางสมัครสมาชิก
app.post('/signup', (req, res) => {
    const { name, email, password, birth_date, address } = req.body;
    const query = 'INSERT INTO users (name, email, password, birth_date, address) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [name, email, password, birth_date, address], (err, result) => {
        if (err) {
            console.error('Error inserting user:', err);
            return res.status(500).send('Error inserting user');
        }
        res.send('User registered successfully!');
    });
});

// เส้นทางเข้าสู่ระบบ
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM users WHERE TRIM(email) = ? AND TRIM(password) = ?';
    db.query(query, [email.trim(), password.trim()], (err, results) => {
        if (err) {
            console.error('Error during login:', err);
            return res.status(500).send('Internal Server Error');
        }

        if (results.length > 0) {
            res.send({ message: 'Login successful!', redirect: '/'});
        } else {
            res.status(401).send('Invalid email or password');
        }
    });
});

// เส้นทางแสดงรายการสินค้า
app.get('/products', (req, res) => {
    const query = 'SELECT * FROM products';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).send('Error fetching products');
        }
        res.json(results);
    });
});

// เส้นทางเพิ่มสินค้า
app.post('/add-product', (req, res) => {
    const { name, description, price, stock } = req.body;
    const query = 'INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)';
    db.query(query, [name, description, price, stock], (err, result) => {
        if (err) {
            console.error('Error adding product:', err);
            return res.status(500).send('Error adding product');
        }
        res.send('Product added successfully!');
    });
});

// เริ่มต้นเซิร์ฟเวอร์
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

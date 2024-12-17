
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// เส้นทางสำหรับจัดการสินค้า
const productsFile = './products.json';

// ดึงข้อมูลสินค้า
app.get('/products', (req, res) => {
    fs.readFile(productsFile, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ message: 'ไม่สามารถดึงข้อมูลสินค้าได้' });
        res.json(JSON.parse(data || '[]'));
    });
});

// เพิ่มสินค้าใหม่
app.post('/products', (req, res) => {
    const { name, price, description } = req.body;

    if (!name || !price || !description) {
        return res.status(400).json({ message: 'กรุณากรอกข้อมูลสินค้าให้ครบถ้วน' });
    }

    fs.readFile(productsFile, 'utf8', (err, data) => {
        const products = data ? JSON.parse(data) : [];
        const newProduct = { id: Date.now(), name, price, description };
        products.push(newProduct);

        fs.writeFile(productsFile, JSON.stringify(products, null, 2), (err) => {
            if (err) return res.status(500).json({ message: 'ไม่สามารถบันทึกสินค้าได้' });
            res.json(newProduct);
        });
    });
});

// แก้ไขสินค้า
app.put('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id, 10);
    const { name, price, description } = req.body;

    fs.readFile(productsFile, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ message: 'ไม่สามารถดึงข้อมูลสินค้าได้' });

        const products = JSON.parse(data || '[]');
        const productIndex = products.findIndex((p) => p.id === productId);

        if (productIndex === -1) {
            return res.status(404).json({ message: 'ไม่พบสินค้า' });
        }

        products[productIndex] = { ...products[productIndex], name, price, description };

        fs.writeFile(productsFile, JSON.stringify(products, null, 2), (err) => {
            if (err) return res.status(500).json({ message: 'ไม่สามารถบันทึกสินค้าได้' });
            res.json(products[productIndex]);
        });
    });
});

// ลบสินค้า
app.delete('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id, 10);

    fs.readFile(productsFile, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ message: 'ไม่สามารถดึงข้อมูลสินค้าได้' });

        const products = JSON.parse(data || '[]');
        const filteredProducts = products.filter((p) => p.id !== productId);

        fs.writeFile(productsFile, JSON.stringify(filteredProducts, null, 2), (err) => {
            if (err) return res.status(500).json({ message: 'ไม่สามารถลบสินค้าได้' });
            res.json({ message: 'ลบสินค้าสำเร็จ' });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

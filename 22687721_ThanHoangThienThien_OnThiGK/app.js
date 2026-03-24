require('dotenv').config();
const express = require('express');
const app = express();
const ticketRoutes = require('./routes/ticketRoutes');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Sử dụng Routes đã định nghĩa
app.use('/', ticketRoutes);

app.listen(3000, () => console.log("🔥 Server Ready: http://localhost:3000"));
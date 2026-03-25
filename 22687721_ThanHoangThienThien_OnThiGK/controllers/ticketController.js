const { docClient } = require('../config/aws');
const { ScanCommand, PutCommand, DeleteCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require('uuid');

const TABLE_NAME = "EventTickets";

// Logic tính toán (Câu 3)
const calculateLogic = (category, quantity, price) => {
    let total = quantity * price;
    let discount = 0;
    let note = "Không giảm giá";
    if (category === "VIP" && quantity >= 4) { discount = 0.1; note = "Được giảm giá 10%"; }
    else if (category === "VVIP" && quantity >= 2) { discount = 0.15; note = "Được giảm giá 15%"; }
    return { totalAmount: total, finalAmount: total * (1 - discount), discountNote: note };
};

// 1. Lấy danh sách + Tìm kiếm
exports.getAllTickets = async (req, res) => {
    try {
        const { search } = req.query;
        const data = await docClient.send(new ScanCommand({ TableName: TABLE_NAME }));
        let tickets = data.Items || [];
        if (search) {
            tickets = tickets.filter(t => 
                t.eventName.toLowerCase().includes(search.toLowerCase()) || 
                t.holderName.toLowerCase().includes(search.toLowerCase())
            );
        }
        res.render('index', { tickets });
    } catch (err) { res.send(err.message); }
};

// 2. Xem chi tiết sản phẩm (MỚI)
exports.getDetailPage = async (req, res) => {
    try {
        const data = await docClient.send(new GetCommand({ 
            TableName: TABLE_NAME, 
            Key: { ticketId: req.params.id } 
        }));
        res.render('detail', { ticket: data.Item });
    } catch (err) { res.send("Không tìm thấy!"); }
};

// 3. Trang sửa
exports.getEditPage = async (req, res) => {
    try {
        const data = await docClient.send(new GetCommand({ 
            TableName: TABLE_NAME, 
            Key: { ticketId: req.params.id } 
        }));
        res.render('edit', { ticket: data.Item, errors: [] });
    } catch (err) { res.send(err.message); }
};

// 4. Lưu (Thêm/Sửa)
exports.saveTicket = async (req, res) => {
    const { ticketId, eventName, holderName, category, quantity, pricePerTicket, eventDate, status, oldImageUrl } = req.body;
    const { totalAmount, finalAmount, discountNote } = calculateLogic(category, parseInt(quantity), parseFloat(pricePerTicket));

    const item = {
        ticketId: ticketId || uuidv4(),
        eventName, holderName, category, eventDate, status,
        quantity: parseInt(quantity),
        pricePerTicket: parseFloat(pricePerTicket),
        totalAmount, finalAmount, discountNote,
        imageUrl: req.file ? req.file.location : (oldImageUrl || ""),
        updatedAt: new Date().toISOString()
    };

    try {
        await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));
        res.redirect('/');
    } catch (err) { res.send(err.message); }
};

// 5. Xóa
exports.deleteTicket = async (req, res) => {
    try {
        await docClient.send(new DeleteCommand({ TableName: TABLE_NAME, Key: { ticketId: req.params.id } }));
        res.redirect('/');
    } catch (err) { res.send(err.message); }
};
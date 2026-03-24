const { docClient } = require('../config/aws');
const { ScanCommand, PutCommand, DeleteCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require('uuid');

const TABLE_NAME = "EventTickets";

// Hàm bổ trợ tính toán tiền (Câu 3) - GIỮ NGUYÊN
const calculateLogic = (category, quantity, price) => {
    let total = quantity * price;
    let discount = 0;
    let note = "Không giảm giá";
    if (category === "VIP" && quantity >= 4) {
        discount = 0.1; note = "Được giảm giá 10%";
    } else if (category === "VVIP" && quantity >= 2) {
        discount = 0.15; note = "Được giảm giá 15%";
    }
    return { totalAmount: total, finalAmount: total * (1 - discount), discountNote: note };
};

// READ: Lấy danh sách (ĐÃ CẬP NHẬT TÌM KIẾM & LỌC)
exports.getAllTickets = async (req, res) => {
    try {
        // Lấy từ khóa từ thanh tìm kiếm (URL query)
        const { search, status } = req.query;

        const data = await docClient.send(new ScanCommand({ TableName: TABLE_NAME }));
        let tickets = data.Items;

        // Logic Tìm kiếm theo tên sự kiện hoặc người mua (Câu 2)
        if (search) {
            tickets = tickets.filter(t => 
                t.eventName.toLowerCase().includes(search.toLowerCase()) || 
                t.holderName.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Logic Lọc theo trạng thái (Câu 3)
        if (status) {
            tickets = tickets.filter(t => t.status === status);
        }

        res.render('index', { tickets });
    } catch (err) { res.status(500).send("Lỗi đọc dữ liệu: " + err.message); }
};

// CREATE & UPDATE: Lưu dữ liệu - GIỮ NGUYÊN
exports.saveTicket = async (req, res) => {
    const { ticketId, eventName, holderName, category, quantity, pricePerTicket, eventDate, status, oldImageUrl } = req.body;
    
    const { totalAmount, finalAmount, discountNote } = calculateLogic(category, parseInt(quantity), parseFloat(pricePerTicket));

    const item = {
        ticketId: ticketId || uuidv4(),
        eventName, holderName, category,
        quantity: parseInt(quantity),
        pricePerTicket: parseFloat(pricePerTicket),
        totalAmount, finalAmount, discountNote,
        eventDate, status,
        imageUrl: req.file ? req.file.location : (oldImageUrl || ""),
        updatedAt: new Date().toISOString()
    };

    try {
        await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));
        res.redirect('/');
    } catch (err) { res.status(500).send("Lỗi lưu dữ liệu: " + err.message); }
};

// DELETE: Xóa vé - GIỮ NGUYÊN
exports.deleteTicket = async (req, res) => {
    try {
        await docClient.send(new DeleteCommand({ TableName: TABLE_NAME, Key: { ticketId: req.params.id } }));
        res.redirect('/');
    } catch (err) { res.status(500).send("Lỗi xóa: " + err.message); }
};

// Form sửa: Lấy dữ liệu cũ - GIỮ NGUYÊN
exports.getEditPage = async (req, res) => {
    try {
        const data = await docClient.send(new GetCommand({ TableName: TABLE_NAME, Key: { ticketId: req.params.id } }));
        res.render('edit', { ticket: data.Item });
    } catch (err) { res.status(500).send("Không tìm thấy vé"); }
};
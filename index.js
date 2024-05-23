const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const yfinance = require('yfinance');
const path = require('path');

const TOKEN = "7162689454:AAHtsbUd5NrVjVASmJ1MzjXc9K9Uy8p6Wh8";
const BOT_USERNAME = "@airdropQUX_bot";

const bot = new TelegramBot(TOKEN, { polling: true });

const filePath = "usersnames.txt";


// Handlers
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const keyboard = {
        inline_keyboard: [
        
            [{ text: "Claim Tokens", callback_data: "1" }],
            [{ text: "Join Chanel", url: "https://t.me/kienthucluongtu" }],
            [{ text: "Smart Contract QUX", callback_data: "2" }, { text: "Smart Contract Bloch", callback_data: "3" }],
            [{ text: "Hướng dẫn thêm QUX và Bloch vào ví", url: "https://vt.tiktok.com/ZSYR8nJEt/" }, { text: "Hướng dẫn Swap QUX", url: "https://vt.tiktok.com/ZSYR8nJEt/" }],
            [{ text: "Buy Book", url: "https://tiki.vn/cua-hang/qubitx-cach-mang-luong-tu?source_screen=product_detail&source_engine=organic" }]
        ]
    };
    
    const photoPath = fs.readFileSync('welcome.jpg');
    try {
        // Send the photo
        await bot.sendPhoto(chatId, photoPath, {
            caption: "Welcome to the Airdrop QubitX Bot!",
        });


        // Send the message with the inline keyboard
        await bot.sendMessage(chatId, "Press Claim Tokens to receive your tokens.", { reply_markup: keyboard });
    } catch (error) {
        console.error('Error sending photo or message:', error);
    }
});

bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    let responseText = '';
    let keyboard = [];

    switch (query.data) {
        case "1":
            responseText = "Vui lòng xem hết video sau để lấy mã code nhận airdrop.";
            keyboard = [
                [{ text: "Video", url: "https://youtu.be/AjQ-k8RmBGM?si=ZqMf2PqcblBKa0VM" }],
                [{ text: "Back", callback_data: "4" }]
            ];
            break;
        case "2":
            responseText = "0xC38665e4f6C63c3dbe088C1de7b79B4D54CB6b50";
            keyboard = [[{ text: "Back", callback_data: "4" }]];
            break;
        case "3":
            responseText = "0xf5149f93C18Be488002DB8A7Ab308f0514900f4C";
            keyboard = [[{ text: "Back", callback_data: "4" }]];
            break;
        case "4":
            responseText = "Press Claim Tokens to receive your tokens.";
            keyboard = [
                [{ text: "Claim Tokens", callback_data: "1" }],
                [{ text: "Join Chanel", url: "https://t.me/kienthucluongtu" }],
                [{ text: "Smart Contract QUX", callback_data: "2" }, { text: "Smart Contract Bloch", callback_data: "3" }],
                [{ text: "Buy Book", url: "https://tiki.vn/cua-hang/qubitx-cach-mang-luong-tu?source_screen=product_detail&source_engine=organic" }]
            ];
            break;
        default:
            break;
    }

    bot.editMessageText(responseText, {
        chat_id: chatId,
        message_id: query.message.message_id,
        reply_markup: { inline_keyboard: keyboard }
    });

    bot.answerCallbackQuery(query.id);
});

const handleResponse = (text) => {
    const processed = text.toLowerCase();

    if (processed.includes('hi')) {
        return 'Nhap /start de bat dau';
    }

    if (processed.includes('qubitx_cachmangluongtu')) {
        return 'Vui long gửi địa chỉ ví nhận airdrop';
    }

    if (processed.length === 42) {
        return 'Token sẽ được gửi vào ví vào 10h ngày hôm sau';
    }

    return "Vui lòng nhập lại";
};

const writeToCsv = (username, message) => {
    fs.appendFileSync("user_adresss", message + '\n');
    fs.appendFileSync("user_name", username + '\n');
};

const checkAddress = (text) => {
    const addresses = fs.readFileSync("user_address.txt", 'utf-8').split('\n');
    return addresses.includes(text);
};

const checkUser = (username) => {
    const users = fs.readFileSync("user_name.txt", 'utf-8').split('\n');
    return users.includes(username);
};

bot.on('message', (msg) => {
    const messageType = msg.chat.type;
    const text = msg.text;

    // Skip handling command messages
    if (text.startsWith('/')) {
        return;
    }

    console.log(`user(${msg.from.username}) in ${messageType}: "${text}"`);

    let response = handleResponse(text);

    if (text.length === 42) {
        if (!checkUser(msg.from.username)) {
            if (!checkAddress(text)) {
                writeToCsv(msg.from.username, text);
            } else {
                response = "Ví đã nhận airdrop";
            }
        } else {
            response = "User đã nhận airdrop";
        }
    }

    console.log('Bot: ', response);
    bot.sendMessage(msg.chat.id, response);
});

bot.on('polling_error', (error) => {
    console.log(`Polling error: ${error.message}`);
});

console.log('Bot is running...');

// Import thư viện Telegram Bot
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios')


// Import cấu hình bot từ file config
const { botToken ,weatherApikey ,newsApikey} = require('./src/config/botConfig');

// Khởi tạo một instance của TelegramBot với token
const bot = new TelegramBot(botToken, { polling: true });

// Xử lý sự kiện khi người dùng gửi tin nhắn
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text.toLowerCase();

    // Xử lý và đáp ứng tin nhắn từ người dùng
    if (messageText === '/start') {
        // Gửi một tin nhắn chào hỏi khi người dùng bắt đầu trò chuyện
        bot.sendMessage(chatId, 'Xin chào! Tôi là Javis. Có gì tôi có thể giúp bạn?');
    } else if (messageText.includes('xin chào') || messageText.includes('chào') || messageText.includes('hi') || messageText.includes('hello')) {
        // Phản hồi lại với một lời chào ngẫu nhiên
        const greetings = ['Xin chào!', 'Chào bạn!', 'Hello!', 'Hi!'];
        const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
        bot.sendMessage(chatId, randomGreeting);
    } else {
        // Phản hồi lại với một câu trả lời mẫu khi bot không hiểu yêu cầu của người dùng
        bot.sendMessage(chatId, 'Xin lỗi, tôi không hiểu yêu cầu của bạn. Vui lòng thử lại hoặc sử dụng lệnh /start để xem menu.');
    }
});  


// Xử lý yêu cầu lấy thông tin thời tiết  
bot.onText(/\/weather (.+)/ ,async (msg,match) =>{
    const chatId =  msg.chat.id  
    const city = match[1] 
    
    try {
        const response = await axios.get('https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric')
        const weatherData = response.data  
        const weatherDescription = weatherData.weather[0].description 
        const temparature = weatherData.main.temp 
        bot.sendMessage(chatId, `Thời tiết tại ${city}: ${weatherDescription}, nhiệt độ: ${temperature}°C`);
    } catch (error) {
        bot.sendMessage(chatId,)
    }
})

// Xử lý yêu cầu lấy tin tức
bot.onText(/\/news/, async (msg) => {
    const chatId = msg.chat.id;
    try {
        const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${newsApiKey}`);
        const articles = response.data.articles;
        const newsMessage = articles.map(article => `${article.title}\n${article.url}`).join('\n\n');
        bot.sendMessage(chatId, newsMessage);
    } catch (error) {
        bot.sendMessage(chatId, 'Không thể lấy tin tức.');
    }
})

// Bắt đầu lắng nghe các sự kiện từ bot
bot.startPolling();


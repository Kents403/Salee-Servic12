// bot.js - GitHub Pages uchun optimallashtirilgan
class SaleeBot {
    constructor() {
        this.BOT_TOKEN = '8426398720:AAEd-mMqpc_dPNQSqmAMht67t3I16nc2b3A';
        this.CHANNEL_ID = '@salee_servis';
        this.API_URL = 'https://api.telegram.org/bot';
        
        console.log('🤖 Salee Bot GitHub Pages uchun yuklandi');
        this.testConnection();
    }
    
    async testConnection() {
        try {
            // Oddiy test
            const response = await fetch(`${this.API_URL}${this.BOT_TOKEN}/getMe`);
            const data = await response.json();
            
            if (data.ok) {
                console.log('✅ Bot ulanadi:', data.result.username);
            } else {
                console.warn('⚠️ Bot test xatosi:', data.description);
            }
        } catch (error) {
            console.error('❌ Bot test catch:', error.message);
        }
    }
    
    // GitHub Pages uchun optimallashtirilgan yuborish
    async sendToChannel(orderData) {
        console.log('📤 Kanalga yuborish boshlanmoqda...', orderData.id);
        
        try {
            const message = this.formatMessage(orderData);
            
            // GitHub Pages CORS muammosini hal qilish
            const telegramUrl = `${this.API_URL}${this.BOT_TOKEN}/sendMessage`;
            
            console.log('Telegram API ga so\'rov:', telegramUrl);
            
            const response = await fetch(telegramUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                mode: 'cors', // CORS mode
                body: JSON.stringify({
                    chat_id: this.CHANNEL_ID,
                    text: message,
                    parse_mode: 'HTML',
                    disable_web_page_preview: true
                })
            });
            
            console.log('API javob status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            console.log('API javob:', result);
            
            if (result.ok) {
                console.log('✅ Kanalga yuborildi!');
                return true;
            } else {
                console.error('❌ Telegram API xatosi:', result.description);
                // Agar bot ishlamasa, fallback
                this.fallbackToDirect(orderData);
                return false;
            }
            
        } catch (error) {
            console.error('🔥 Bot yuborish xatosi:', error);
            // Xatolik bo'lsa, to'g'ridan-to'g'ri link orqali yuborish
            this.fallbackToDirect(orderData);
            return false;
        }
    }
    
    // Format message (oldingi kabi)
    formatMessage(order) {
        let message = '';
        message += `<b>🆕 #${order.id}</b>\n\n`;
        message += `<b>👤 Mijoz:</b> ${order.customerName}\n`;
        message += `<b>📱 Telegram:</b> ${order.telegramUsername}\n`;
        message += `<b>🎮 O'yin ID:</b> ${order.gameId}\n\n`;
        message += `<b>📦 Mahsulotlar:</b>\n`;
        
        order.items.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            message += `▫️ <b>${item.name}</b>\n`;
            message += `   Narxi: ${item.price.toLocaleString('uz-UZ')} UZS\n`;
            message += `   Soni: ${item.quantity} ta\n`;
            message += `   Summa: ${itemTotal.toLocaleString('uz-UZ')} UZS\n\n`;
        });
        
        message += `<b>💰 JAMI:</b> ${order.totalAmount.toLocaleString('uz-UZ')} UZS\n`;
        
        const date = new Date(order.date);
        const time = date.toLocaleTimeString('uz-UZ', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        message += `<b>⏰ Vaqt:</b> ${time}\n`;
        message += `<i>⚡ Salee Servis</i>`;
        
        return message;
    }
    
    // Agar bot ishlamasa, to'g'ridan-to'g'ri yuborish
    fallbackToDirect(orderData) {
        console.log('🔄 Fallback: To\'g\'ridan-to\'g\'ri yuborish...');
        
        const message = this.formatMessage(orderData);
        // Telegram Web link
        const directUrl = `https://t.me/salee_servis?text=${encodeURIComponent(message)}`;
        
        // Yangi tabda ochish
        setTimeout(() => {
            window.open(directUrl, '_blank');
        }, 1000);
        
        return true;
    }
}

// Global bot obyekti
window.saleeBot = new SaleeBot();

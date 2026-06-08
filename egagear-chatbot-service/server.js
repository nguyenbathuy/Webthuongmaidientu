require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        const systemPrompt = "Bạn là nhân viên tư vấn của cửa hàng laptop EgaGear. Trả lời thân thiện, ngắn gọn: " + userMessage;
        
        // 🌟 CHƯƠNG 8: TÍNH CHỊU LỖI (FAULT TOLERANCE) - CƠ CHẾ AUTO-FALLBACK
        // Danh sách các model đã được Google cấp phép, sắp xếp từ xịn nhất trở xuống
        const modelsToTry = [
            "gemini-3.5-flash",       // Ưu tiên 1 (Xịn nhất, nhưng hay quá tải)
            "gemini-3.1-flash-lite",  // Ưu tiên 2 (Bản rút gọn, siêu nhanh)
            "gemini-2.5-flash",       // Ưu tiên 3 (Ổn định)
            "gemini-2.0-flash"        // Ưu tiên 4 (Phương án chót)
        ];
        
        let responseText = "";
        let isSuccess = false;

        // Vòng lặp tự phục hồi: Thử gọi từng model, nếu lỗi tự động nhảy sang model tiếp theo
        for (const modelName of modelsToTry) {
            try {
                console.log(`⏳ Đang thử gọi AI: ${modelName}...`);
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent(systemPrompt);
                
                responseText = result.response.text();
                isSuccess = true;
                
                console.log(`✅ Thành công với model: ${modelName}`);
                break; // Có kết quả là thoát vòng lặp ngay
            } catch (e) {
                console.log(`⚠️ Model ${modelName} sập/quá tải, đang tự động chuyển model khác...`);
            }
        }

        if (isSuccess) {
            // Trả kết quả về cho Laravel
            res.json({ answer: responseText, status: 'success' });
        } else {
            // Chỉ quăng lỗi khi MỌI model đều sập
            throw new Error("Tất cả máy chủ Google hiện đang quá tải.");
        }

    } catch (error) {
        console.error("❌ Lỗi AI tổng:", error.message);
        res.status(500).json({ answer: "Hệ thống AI của Google đang bảo trì tạm thời, anh/chị vui lòng thử lại sau ít phút nhé.", status: 'error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🤖 Chatbot Service đang chạy tại http://localhost:${PORT}`);
});
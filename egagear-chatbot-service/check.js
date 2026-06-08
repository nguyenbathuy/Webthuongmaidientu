require("dotenv").config();

async function checkModels() {
  console.log("⏳ Đang quét máy chủ Google để tìm model sống...");
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`,
    );
    const data = await response.json();

    if (data.models) {
      console.log("\n✅ CÁC MODEL MÀ API KEY CỦA EM ĐƯỢC PHÉP DÙNG:");
      data.models.forEach((m) => {
        // Chỉ lọc ra những model hỗ trợ chat
        if (
          m.supportedGenerationMethods &&
          m.supportedGenerationMethods.includes("generateContent")
        ) {
          console.log(`👉 ${m.name.replace("models/", "")}`);
        }
      });
      console.log(
        "\n💡 (Hãy copy một cái tên có chữ 'flash' hoặc 'pro' ở trên gửi cho thầy nhé)",
      );
    } else {
      console.log("\n❌ Google báo lỗi thẳng thừng:", data);
    }
  } catch (error) {
    console.log("\n❌ Lỗi mạng:", error.message);
  }
}

checkModels();

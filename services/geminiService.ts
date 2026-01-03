
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ImageData, ProcessingResult } from "../types";

export const performTryOn = async (
  modelImage: ImageData,
  garmentImage: ImageData
): Promise<ProcessingResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  const systemInstruction = `
    Bạn là một chuyên gia AI Virtual Try-On cao cấp.
    Nhiệm vụ: Thay thế trang phục của người trong 'MODEL_IMAGE' bằng trang phục hiển thị trong 'GARMENT_IMAGE'.

    Quy trình xử lý bắt buộc:
    1. Phân tích MODEL_IMAGE: Xác định vùng cơ thể và tư thế (vai, cổ, ngực, eo, hông...). Giữ nguyên gương mặt, tóc, màu da, tay/chân, tư thế và nền ảnh.
    2. Phân tích GARMENT_IMAGE: Nhận diện loại trang phục (áo, đầm, quần, áo khoác...). Ghi nhớ màu sắc, họa tiết, logo, đường may và chi tiết cổ/tay áo.
    3. Thực hiện Virtual Try-On: Mặc trang phục lên người mẫu sao cho đúng tỉ lệ cơ thể, nếp vải và độ rủ hợp lý. Ánh sáng và bóng đổ phải khớp với ảnh gốc.
    4. An toàn: Từ chối nếu ảnh có trẻ vị thành niên, nội dung khỏa thân hoặc yêu cầu nhạy cảm.
    
    Chỉ trả về DUY NHẤT ảnh kết quả cuối cùng.
  `;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: "MODEL_IMAGE (Ảnh người mẫu):" },
        { inlineData: { data: modelImage.data, mimeType: modelImage.mimeType } },
        { text: "GARMENT_IMAGE (Ảnh trang phục):" },
        { inlineData: { data: garmentImage.data, mimeType: garmentImage.mimeType } },
        { text: "Hãy thực hiện thay trang phục cho người mẫu dựa trên ảnh trang phục được cung cấp." }
      ]
    },
    config: {
      systemInstruction: systemInstruction,
    }
  });

  let generatedBase64 = "";
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      generatedBase64 = part.inlineData.data;
      break;
    }
  }

  if (!generatedBase64) {
    throw new Error("Không thể tạo được ảnh kết quả. Vui lòng kiểm tra lại ảnh đầu vào và thử lại.");
  }

  const imageUrl = `data:image/png;base64,${generatedBase64}`;
  
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        imageUrl,
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };
    img.src = imageUrl;
  });
};

import { api } from "../api"

interface PresignedUrlResponse {
  url: string
  key: string
  expiresIn: number
}

export const customerService = {
  // S3 Presigned URL 요청
  getPresignedUrl: async (customerEmail: string): Promise<PresignedUrlResponse> => {
    const response = await api.post("/s3-presigned-url/customer", {
      customerEmail,
    })
    return response.data
  },

  // S3에 이미지 업로드
  uploadImageToS3: async (url: string, file: File): Promise<void> => {
    try {
      const response = await fetch(url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type
        },
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error("S3 upload error:", error);
      throw new Error("이미지 업로드에 실패했습니다.");
    }
  },
} 
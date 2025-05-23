import { api } from "../api"

interface PresignedUrlResponse {
  url: string
  key: string
  expiresIn: number
}

export const customerService = {
  // S3 Presigned URL 요청
  getPresignedUrl: async (customerEmail: string): Promise<PresignedUrlResponse> => {
    return await api.post<PresignedUrlResponse>("/s3-presigned-url/customer", {
      customerEmail,
    })
  },

  // S3에 이미지 업로드
  uploadImageToS3: async (url: string, file: File): Promise<void> => {
    await fetch(url, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    })
  },
} 
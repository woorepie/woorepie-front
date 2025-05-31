// notice.ts
import { api } from "./api"
import type { Notice } from "../types/notice/notice"
import type { NoticeDetail } from "../types/notice/noticeDetail"

interface ApiResponse<T> {
  data: T
}

// 공시 리스트 조회
export const getNotices = async (): Promise<Notice[]> => {
  const res = await api.get<ApiResponse<Notice[]>>("/notice")
  return res.data
}

// 공시 상세 조회
export const getNoticeDetail = async (noticeId: number): Promise<NoticeDetail> => {
  const res = await api.get<ApiResponse<NoticeDetail>>("/notice", { noticeId })
  return res.data
}

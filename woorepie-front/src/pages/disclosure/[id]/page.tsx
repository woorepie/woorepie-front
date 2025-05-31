// disclosure/[id]/page.tsx
"use client"

import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { getNoticeDetail } from "../../../api/notice"
import type { NoticeDetail } from "../../../types/notice/noticeDetail"

const NoticeDetailPage = () => {
  const { noticeId } = useParams<{ noticeId: string }>()
  const [notice, setNotice] = useState<NoticeDetail | null>(null)

  useEffect(() => {
  if (!noticeId) return
  const fetchNotice = async () => {
    try {
      const data = await getNoticeDetail(Number(noticeId))
      console.log("📦 상세 공시 응답:", data) // <-- 여기에 로그 추가
      setNotice(data)
    } catch (err) {
      console.error("공시 상세 조회 실패:", err)
    }
  }
  fetchNotice()
}, [noticeId])


  if (!notice) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">공시를 찾을 수 없습니다</h1>
        <p className="text-gray-600">존재하지 않는 공시이거나 삭제되었습니다.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">{notice.noticeTitle}</h1>
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <span className="mr-4">{notice.estateName}</span>
        <span>{new Date(notice.noticeDate).toLocaleDateString()}</span>
      </div>

      <div className="prose max-w-none text-gray-800 whitespace-pre-line">
        {notice.noticeContent || "내용이 없습니다."}
      </div>

      {notice.noticeFileUrl && (
        <div className="mt-6">
          <a
            href={notice.noticeFileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            첨부파일 보기
          </a>
        </div>
      )}
    </div>
  )
}

export default NoticeDetailPage
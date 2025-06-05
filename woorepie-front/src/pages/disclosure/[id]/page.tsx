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
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        {/* 헤더 섹션 */}
        <div className="border-b border-gray-200 pb-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {notice.estateName}
            </span>
            <span className="text-gray-500 text-sm">
              {new Date(notice.noticeDate).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{notice.noticeTitle}</h1>
        </div>

        {/* 본문 섹션 */}
        <div className="prose prose-lg max-w-none text-gray-700 mb-8">
          <div className="whitespace-pre-line leading-relaxed">
            {notice.noticeContent || (
              <div className="text-gray-500 italic">내용이 없습니다.</div>
            )}
          </div>
        </div>

        {/* 첨부파일 섹션 */}
        {notice.noticeFileUrl && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              <span className="text-gray-600 font-medium">첨부파일</span>
            </div>
            <a
              href={notice.noticeFileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              첨부파일 다운로드
            </a>
          </div>
        )}

        {/* 목록으로 돌아가기 버튼 */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <a
            href="/disclosure"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            공시 목록으로 돌아가기
          </a>
        </div>
      </div>
    </div>
  )
}

export default NoticeDetailPage
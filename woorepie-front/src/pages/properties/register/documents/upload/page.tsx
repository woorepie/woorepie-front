"use client"

import type React from "react"

import { useState } from "react"

interface DocumentFile {
  id: string
  name: string
  file: File | null
}

const PropertyDocumentsUploadPage = () => {
  const [documents, setDocuments] = useState<DocumentFile[]>([
    { id: "prospectus", name: "공모 청약 안내문", file: null },
    { id: "securities", name: "증권신고서", file: null },
    { id: "investment", name: "투자 설명서", file: null },
    { id: "trust", name: "부동산관리처분신탁계약서", file: null },
    { id: "appraisal", name: "감정평가서", file: null },
  ])
  const [confirmInfo, setConfirmInfo] = useState(false)
  const [error, setError] = useState("")

  const handleFileChange = (id: string, file: File) => {
    setDocuments(documents.map((doc) => (doc.id === id ? { ...doc, file } : doc)))
  }

  const handleDeleteFile = (id: string) => {
    setDocuments(documents.map((doc) => (doc.id === id ? { ...doc, file: null } : doc)))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 모든 문서 업로드 확인
    const missingDocuments = documents.filter((doc) => !doc.file)
    if (missingDocuments.length > 0) {
      setError(`다음 문서를 업로드해주세요: ${missingDocuments.map((doc) => doc.name).join(", ")}`)
      return
    }

    // 정보 확인 체크 확인
    if (!confirmInfo) {
      setError("입력한 정보가 사실과 다르지 않음을 확인해주세요.")
      return
    }

    // 매물 등록 로직 (실제로는 API 호출)
    console.log("매물 등록 성공", documents)
    // 매물 목록 페이지로 이동
    window.location.href = "/properties"
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mr-2">✓</div>
            <span className="font-medium">1. 매물 기본 정보 입력</span>
          </div>
          <div className="w-8 h-1 bg-gray-300 mx-2"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-2">2</div>
            <span className="font-medium">2. 매물 서류 업로드</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">매물 서류 업로드</h1>

        <form onSubmit={handleSubmit}>
          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

          {documents.map((doc) => (
            <div key={doc.id} className="mb-6">
              <label className="block mb-2 font-medium">{doc.name} 업로드</label>
              <div className="border-2 border-dashed border-gray-300 p-4 rounded-md">
                {doc.file ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-600 mr-2"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      <span>{doc.file.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteFile(doc.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      첨부 파일 삭제
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <input
                      type="file"
                      id={doc.id}
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          handleFileChange(doc.id, e.target.files[0])
                        }
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor={doc.id}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer inline-block"
                    >
                      첨부파일 선택
                    </label>
                  </div>
                )}
              </div>
            </div>
          ))}

          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={confirmInfo}
                onChange={(e) => setConfirmInfo(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">입력한 정보가 사실과 다르지 않음을 확인합니다.</span>
            </label>
          </div>

          <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            매물 등록
          </button>
        </form>
      </div>
    </div>
  )
}

export default PropertyDocumentsUploadPage

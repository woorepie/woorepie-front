"use client"

import { useState } from "react"
import { Link } from "react-router-dom"

const PropertyDocumentsPage = () => {
  const [documents, setDocuments] = useState([
    { id: 1, name: "공시", uploaded: false },
    { id: 2, name: "등기부등본", uploaded: false },
    { id: 3, name: "건축물대장", uploaded: false },
    { id: 4, name: "임대차계약서", uploaded: false },
    { id: 5, name: "감정평가서", uploaded: false },
  ])

  const handleUpload = (id: number) => {
    setDocuments(documents.map((doc) => (doc.id === id ? { ...doc, uploaded: true } : doc)))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">투자 관련 문서 등록</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-6">
          <p className="text-gray-600">
            매물 등록을 위해 필요한 문서를 업로드해주세요. 모든 문서는 PDF 형식으로 업로드해야 합니다.
          </p>
        </div>

        <div className="space-y-6">
          {documents.map((doc) => (
            <div key={doc.id} className="border rounded-md p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{doc.name}</h3>
                  <p className="text-sm text-gray-500">{doc.uploaded ? "업로드 완료" : "아직 업로드되지 않았습니다"}</p>
                </div>
                <button
                  onClick={() => handleUpload(doc.id)}
                  className={`px-4 py-2 rounded-md ${
                    doc.uploaded ? "bg-green-100 text-green-800" : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                  disabled={doc.uploaded}
                >
                  {doc.uploaded ? "완료" : "업로드"}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex gap-4">
          <Link to="/properties/register" className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
            이전 단계
          </Link>
          <Link to="/properties" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            등록 완료
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PropertyDocumentsPage

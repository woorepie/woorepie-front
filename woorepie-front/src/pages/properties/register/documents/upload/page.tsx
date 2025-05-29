"use client"

import type React from "react"

import { useState } from "react"
import { agentService } from "@/api/agent"
import { estateService } from "@/api/estate"
import { api } from "@/api/api"
import { useLocation } from "react-router-dom"

interface DocumentFile {
  id: string
  name: string
  file: File | null
}

const PropertyDocumentsUploadPage = () => {
  const location = useLocation();
  const propertyImage = location.state?.propertyImage || null;
  const [documents, setDocuments] = useState<DocumentFile[]>([
    { id: "prospectus", name: "공모 청약 안내문", file: null },
    { id: "securities", name: "증권신고서", file: null },
    { id: "investment", name: "투자 설명서", file: null },
    { id: "trust", name: "부동산관리처분신탁계약서", file: null },
    { id: "appraisal", name: "감정평가서", file: null },
  ])
  const [confirmInfo, setConfirmInfo] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleFileChange = (id: string, file: File) => {
    setDocuments(documents.map((doc) => (doc.id === id ? { ...doc, file } : doc)))
  }

  const handleDeleteFile = (id: string) => {
    setDocuments(documents.map((doc) => (doc.id === id ? { ...doc, file: null } : doc)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      // 모든 문서 업로드 확인
      const missingDocuments = documents.filter((doc) => !doc.file)
      if (missingDocuments.length > 0) {
        setError(`다음 문서를 업로드해주세요: ${missingDocuments.map((doc) => doc.name).join(", ")}`)
        setLoading(false)
        return
      }
      if (!confirmInfo) {
        setError("입력한 정보가 사실과 다르지 않음을 확인해주세요.")
        setLoading(false)
        return
      }

      // 매물 주소 가져오기
      const estateInfo = sessionStorage.getItem('estateInfo')
      const estateAddress = estateInfo ? JSON.parse(estateInfo).address : null
      if (!estateAddress) {
        setError("매물 주소 정보가 없습니다. 이전 단계로 돌아가주세요.")
        setLoading(false)
        return
      }

      // propertyImage 유효성 검사
      if (!propertyImage) {
        setError("대표 이미지를 다시 등록해주세요.")
        setLoading(false)
        return
      }

      // presigned url 발급
      const presignedUrls = await estateService.getEstatePresignedUrls(
        estateAddress,
        propertyImage.type,  // 대표 이미지
        documents.find(d => d.id === "prospectus")?.file?.type || "",  // 공모 청약 안내문
        documents.find(d => d.id === "securities")?.file?.type || "",  // 증권신고서
        documents.find(d => d.id === "investment")?.file?.type || "",  // 투자 설명서
        documents.find(d => d.id === "trust")?.file?.type || "",  // 부동산관리처분신탁계약서
        documents.find(d => d.id === "appraisal")?.file?.type || ""  // 감정평가서
      )
      
      // 파일 업로드 및 S3 key 저장
      const s3Keys: { [key: string]: string } = {}

      // 파일 업로드 순서 정의
      const uploadOrder = [
        { key: "estate-image", file: propertyImage },
        { key: "prospectus", file: documents.find(d => d.id === "prospectus")?.file },
        { key: "securities", file: documents.find(d => d.id === "securities")?.file },
        { key: "investment", file: documents.find(d => d.id === "investment")?.file },
        { key: "trust", file: documents.find(d => d.id === "trust")?.file },
        { key: "appraisal", file: documents.find(d => d.id === "appraisal")?.file }
      ]

      // 순서대로 파일 업로드
      for (let i = 0; i < uploadOrder.length; i++) {
        const { key, file } = uploadOrder[i]
        const presigned = presignedUrls[i]
        
        if (!file || !presigned) {
          throw new Error(`Missing file or presigned URL for ${key}`)
        }

        try {
          console.log(`Starting upload for ${key} with content-type: ${file.type}`)
          await estateService.uploadFileToS3(presigned.url, file)
          s3Keys[key] = presigned.key
          console.log(`Successfully uploaded ${key}`)
        } catch (error) {
          console.error(`Failed to upload ${key}:`, error)
          setError(`${key} 파일 업로드 중 오류가 발생했습니다.`)
          setLoading(false)
          return
        }
      }

      // 모든 필요한 키가 있는지 확인
      const requiredKeys = [
        "estate-image",
        "prospectus",
        "securities",
        "investment",
        "trust",
        "appraisal"
      ]

      const missingKeys = requiredKeys.filter(key => !s3Keys[key])
      if (missingKeys.length > 0) {
        setError(`다음 파일들의 업로드가 실패했습니다: ${missingKeys.join(", ")}`)
        setLoading(false)
        return
      }

      // S3 key들을 세션 스토리지에 저장
      sessionStorage.setItem('estateDocuments', JSON.stringify(s3Keys))
      
      // 매물 정보 가져오기
      const estateInfoParsed = JSON.parse(sessionStorage.getItem('estateInfo') || '{}')

      // RegisterEstateRequest 생성
      const registerEstateRequest = {
        estateName: estateInfoParsed.name,
        estateState: estateInfoParsed.estate_state,
        estateCity: estateInfoParsed.estate_city,
        estatePrice: Number(estateInfoParsed.publicPrice),  // 개별공시지가
        estateAddress: estateInfoParsed.address,
        estateLatitude: estateInfoParsed.estate_latitude,
        estateLongitude: estateInfoParsed.estate_longitude,
        totalEstateArea: Number(estateInfoParsed.totalArea),  // 전체 대지 면적
        tradeEstateArea: Number(estateInfoParsed.tradingArea),  // 거래 대지 면적
        estateUseZone: estateInfoParsed.zoning,  // 용도 지역
        tokenAmount: Number(estateInfoParsed.tokenAmount),
        estateDescription: estateInfoParsed.description,
        estateImageUrlKey: s3Keys["estate-image"],
        subGuideUrlKey: s3Keys["prospectus"],
        securitiesReportUrlKey: s3Keys["securities"],
        investmentExplanationUrlKey: s3Keys["investment"],
        propertyMngContractUrlKey: s3Keys["trust"],
        appraisalReportUrlKey: s3Keys["appraisal"]
      }

      // API 호출
      await api.post("/subscription/create", registerEstateRequest)
      
      // 세션 스토리지 정리
      sessionStorage.removeItem('estateInfo')
      sessionStorage.removeItem('estateDocuments')
      
      // 성공 시 메인 페이지로 이동
      window.location.href = "/"
    } catch (error) {
      console.error("매물 등록 중 오류:", error)
      setError("매물 청약 등록 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
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

          <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700" disabled={loading}>
            {loading ? "등록 중..." : "매물 등록"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default PropertyDocumentsUploadPage

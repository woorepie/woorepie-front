"use client"

import { useState, useEffect } from "react"
import { agentService } from "@/api/agent"
import type { GetAgentResponse } from "@/types/agent/agent"

const AgentProfilePage = () => {
  const [profile, setProfile] = useState<GetAgentResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchAgentInfo = async () => {
      try {
        const data = await agentService.getAgentInfo()
        setProfile(data)
      } catch (err) {
        console.error("Error fetching agent info:", err)
        setError("중개인 정보를 불러오는 데 실패했습니다.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAgentInfo()
  }, [])

  if (isLoading) return <div className="text-center py-8">로딩 중...</div>
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>
  if (!profile) return <div className="text-center py-8">데이터 없음</div>

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">내 정보</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-gray-500 mb-1">이름</h3>
          <p className="font-medium">{profile.agentName}</p>
        </div>
        <div>
          <h3 className="text-gray-500 mb-1">이메일</h3>
          <p className="font-medium">{profile.agentEmail}</p>
        </div>
        <div>
          <h3 className="text-gray-500 mb-1">전화번호</h3>
          <p className="font-medium">{profile.agentPhoneNumber}</p>
        </div>
        <div>
          <h3 className="text-gray-500 mb-1">생년월일</h3>
          <p className="font-medium">{profile.agentDateOfBirth}</p>
        </div>
        <div>
          <h3 className="text-gray-500 mb-1">사업자명</h3>
          <p className="font-medium">{profile.businessName}</p>
        </div>
        <div>
          <h3 className="text-gray-500 mb-1">사업자등록번호</h3>
          <p className="font-medium">{profile.businessNumber}</p>
        </div>
        <div>
          <h3 className="text-gray-500 mb-1">사업장 주소</h3>
          <p className="font-medium">{profile.businessAddress}</p>
        </div>
        <div>
          <h3 className="text-gray-500 mb-1">사업장 연락처</h3>
          <p className="font-medium">{profile.businessPhoneNumber}</p>
        </div>
      </div>
    </div>
  )
}

export default AgentProfilePage

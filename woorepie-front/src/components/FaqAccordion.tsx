"use client"

import { useState } from "react"

// FAQ 데이터
const faqData = [
  {
    question: "WOORE PIE는 어떤 서비스인가요?",
    answer:
      "WOORE PIE는 우리투자증권에서 제공하는 부동산 토큰증권 플랫폼입니다. 소액으로도 부동산에 투자할 수 있는 기회를 제공합니다.",
  },
  {
    question: "최소 투자 금액은 얼마인가요?",
    answer: "최소 투자 금액은 매물마다 다르지만, 일반적으로 10만원부터 시작할 수 있습니다.",
  },
  {
    question: "배당금은 어떻게 받나요?",
    answer:
      "배당금은 분기별로 지급되며, 등록된 계좌로 자동 입금됩니다. 배당 일정은 각 매물의 상세 페이지에서 확인하실 수 있습니다.",
  },
  {
    question: "토큰은 어떻게 거래할 수 있나요?",
    answer: "WOORE PIE 플랫폼 내의 거래소에서 토큰을 매수하거나 매도할 수 있습니다. 24시간 언제든지 거래가 가능합니다.",
  },
  {
    question: "KYC 인증은 왜 필요한가요?",
    answer:
      "KYC(Know Your Customer) 인증은 금융 규제 준수와 사용자 보호를 위해 필요합니다. 본인 확인을 통해 안전한 투자 환경을 제공합니다.",
  },
]

const FaqAccordion = () => {
  // 각 FAQ 항목의 열림/닫힘 상태를 관리하는 state
  const [openItems, setOpenItems] = useState<number[]>([])

  // 항목 클릭 시 열림/닫힘 상태 토글
  const toggleItem = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((item) => item !== index) : [...prev, index]))
  }

  return (
    <div>
      {faqData.map((item, index) => (
        <div key={index} className="border-b pb-4 mb-4">
          <div className="flex justify-between items-center cursor-pointer py-2" onClick={() => toggleItem(index)}>
            <h3 className="text-xl font-medium">{item.question}</h3>
            <button className="text-2xl">{openItems.includes(index) ? "−" : "+"}</button>
          </div>

          {/* 답변 - 열린 상태일 때만 표시 */}
          {openItems.includes(index) && (
            <div className="mt-4 text-gray-600 pl-2 transition-all duration-300 ease-in-out">{item.answer}</div>
          )}
        </div>
      ))}
    </div>
  )
}

export default FaqAccordion

"use client"

import type React from "react"
import { useParams, Link, useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"

// 상단에 import 수정
import { subscriptionService } from "../../../api/subscription"
// accountService import 제거

// 청약 단계 정의
type SubscriptionStep = "info" | "terms" | "payment" | "confirm"

const PropertySubscriptionPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()

  // location.state에서 전달받은 데이터 추출
  const customerInfo = location.state?.customerInfo
  const subscriptionDetail = location.state?.subscriptionDetail
  const estateId = location.state?.estateId || id

  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState<SubscriptionStep>("info")
  const [errors, setErrors] = useState<Record<string, string>>({})

  console.log("전달받은 데이터:", { customerInfo, subscriptionDetail, estateId })

  const [formData, setFormData] = useState({
    name: customerInfo?.name || "",
    email: customerInfo?.email || "",
    phone: customerInfo?.phone || "",
    address: customerInfo?.address || "",
    quantity: "1",
    paymentMethod: "bank",
    agreeTerms1: false,
    agreeTerms2: false,
    agreeTerms3: false,
  })

  // 토큰 가격 계산 (subscriptionDetail에서 가져오기)
  const tokenPrice = subscriptionDetail
    ? Math.floor(subscriptionDetail.estatePrice / subscriptionDetail.tokenAmount)
    : 10000
  const totalAmount = tokenPrice * Number(formData.quantity)

  useEffect(() => {
    // 필요한 데이터가 없으면 이전 페이지로 리다이렉트
    if (!customerInfo || !subscriptionDetail) {
      console.error("필요한 데이터가 전달되지 않았습니다.")
      navigate(`/subscription/${id}`)
      return
    }
    setLoading(false)
  }, [customerInfo, subscriptionDetail, id, navigate])

  // 입력 필드 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // 에러 메시지 제거
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // 다음 단계로 이동
  const handleNextStep = () => {
    const newErrors: Record<string, string> = {}

    // 각 단계별 유효성 검사
    if (currentStep === "info") {
      if (!formData.name) newErrors.name = "이름을 입력해주세요."
      if (!formData.email) newErrors.email = "이메일을 입력해주세요."
      if (!formData.phone) newErrors.phone = "전화번호를 입력해주세요."
      if (!formData.address) newErrors.address = "주소를 입력해주세요."
      if (!formData.quantity || Number(formData.quantity) < 1)
        newErrors.quantity = "최소 1개 이상의 토큰을 선택해주세요."
    } else if (currentStep === "terms") {
      if (!formData.agreeTerms1) newErrors.agreeTerms1 = "필수 약관에 동의해주세요."
      if (!formData.agreeTerms2) newErrors.agreeTerms2 = "필수 약관에 동의해주세요."
      if (!formData.agreeTerms3) newErrors.agreeTerms3 = "필수 약관에 동의해주세요."
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // 다음 단계로 이동
    if (currentStep === "info") setCurrentStep("terms")
    else if (currentStep === "terms") setCurrentStep("payment")
    else if (currentStep === "payment") setCurrentStep("confirm")
  }

  // 이전 단계로 이동
  const handlePrevStep = () => {
    if (currentStep === "terms") setCurrentStep("info")
    else if (currentStep === "payment") setCurrentStep("terms")
    else if (currentStep === "confirm") setCurrentStep("payment")
  }

  // 청약 완료 처리 - 수정된 부분
  const handleComplete = async () => {
    console.log("청약 완료 navigate estateId:", estateId)

    // 계좌 잔액 확인
    const myAccountBalance = customerInfo?.accountBalance ?? 0

    // 잔액 부족 시 처리
    if (myAccountBalance < totalAmount) {
      alert(
        `계좌 잔액이 부족합니다. 현재 잔액: ${myAccountBalance.toLocaleString()}원, 필요 금액: ${totalAmount.toLocaleString()}원`,
      )
      return
    }

    try {
      setLoading(true)

      // 청약 번호 생성
      const subscriptionNumber = `SUB${Date.now().toString().slice(-8)}`

      // 청약 신청 API 호출 - 기존 API 패턴에 맞게 수정
      const response = await subscriptionService.createSubscription({
        estateId: estateId,
        subAmount: Number(formData.quantity),
      })

      // 청약 신청 성공 후 처리
      console.log("청약 신청 성공:", response)

      // endpage로 전달할 데이터 구조 생성
      const subscriptionInfo = {
        id: subscriptionNumber,
        propertyId: estateId,
        propertyName: subscriptionDetail?.estateName || "",
        propertyImage: subscriptionDetail?.estateImageUrl || "",
        subscriptionNumber: subscriptionNumber,
        status: "pending" as const,
        quantity: Number(formData.quantity),
        price: tokenPrice,
        totalAmount: totalAmount,
        paymentMethod: "account" as "bank" | "card" | "crypto" | "account", // 계좌 잔액 결제로 변경
        paymentStatus: "completed" as const, // 결제 완료 상태로 변경
        subscriptionDate: new Date().toISOString().split("T")[0],
        completionDate: new Date().toISOString().split("T")[0], // 완료 일자 추가
        userName: formData.name,
        userEmail: formData.email,
        userPhone: formData.phone,
        userAddress: formData.address,
        // 추가 정보
        property: subscriptionDetail,
        formData: formData,
        // 계좌 정보 추가
        accountBalance: {
          before: myAccountBalance,
          after: myAccountBalance - totalAmount,
          deducted: totalAmount,
          transactionId: response?.data?.transactionId || `TRX${Date.now()}`, // API 응답에서 거래 ID 가져오기
        },
      }

      console.log("navigate로 넘기는 데이터:", subscriptionInfo)

      alert("청약이 완료되었습니다. 계좌에서 " + totalAmount.toLocaleString() + "원이 차감되었습니다.")
      navigate(`/subscription/${estateId}/endpage`, {
        state: {
          subscriptionInfo: subscriptionInfo,
        },
      })
    } catch (error) {
      console.error("청약 처리 중 오류 발생:", error)
      alert("청약 처리 중 오류가 발생했습니다: " + (error instanceof Error ? error.message : "알 수 없는 오류"))
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!subscriptionDetail) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">청약 정보를 찾을 수 없습니다</h1>
        <Link to={`/subscription/${id}`} className="text-blue-600 hover:underline">
          청약 상세로 돌아가기
        </Link>
      </div>
    )
  }

  // 단계별 컨텐츠 렌더링
  const renderStepContent = () => {
    switch (currentStep) {
      case "info":
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">청약 정보 입력</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1 text-sm font-medium">이름 *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-md bg-gray-100 ${errors.name ? "border-red-500" : "border-gray-300"}`}
                  placeholder="이름을 입력하세요"
                  readOnly
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">이메일 *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-md bg-gray-100 ${errors.email ? "border-red-500" : "border-gray-300"}`}
                  placeholder="이메일을 입력하세요"
                  readOnly
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">전화번호 *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-md bg-gray-100 ${errors.phone ? "border-red-500" : "border-gray-300"}`}
                  placeholder="전화번호를 입력하세요"
                  readOnly
                />
                {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">주소 *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-md bg-gray-100 ${errors.address ? "border-red-500" : "border-gray-300"}`}
                  placeholder="주소를 입력하세요"
                  readOnly
                />
                {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
              </div>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">청약 수량 *</label>
              <div className="flex items-center">
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="1"
                  max="100"
                  className={`w-full p-3 border rounded-md ${errors.quantity ? "border-red-500" : "border-gray-300"}`}
                  placeholder="청약할 토큰 수량을 입력하세요"
                />
                <span className="ml-2">DABS</span>
              </div>
              {errors.quantity && <p className="mt-1 text-sm text-red-500">{errors.quantity}</p>}
              <p className="mt-1 text-sm text-gray-500">
                1 DABS = {tokenPrice.toLocaleString()}원 (총 {totalAmount.toLocaleString()}원)
              </p>
            </div>
          </div>
        )
      case "terms":
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">약관 동의</h2>

            <div className="space-y-4">
              <div>
                <div className="flex items-start mb-2">
                  <input
                    type="checkbox"
                    id="agreeTerms1"
                    name="agreeTerms1"
                    checked={formData.agreeTerms1}
                    onChange={handleChange}
                    className="mt-1"
                  />
                  <label htmlFor="agreeTerms1" className="ml-2 block">
                    <span className="font-medium">[필수] 부동산 토큰 투자 위험 고지 동의</span>
                  </label>
                </div>
                <div className="bg-gray-50 p-3 rounded-md text-sm h-40 overflow-y-auto">
                  부동산 토큰 투자는 원금 손실의 위험이 있으며, 투자 결정 전 반드시 투자설명서와 위험고지사항을
                  확인하시기 바랍니다. 부동산 가격은 시장 상황에 따라 변동될 수 있으며, 배당금은 임대 상황 및 운영
                  비용에 따라 달라질 수 있습니다. 또한 유동성 제약으로 인해 원하는 시점에 투자금을 회수하지 못할 수
                  있습니다.
                </div>
                {errors.agreeTerms1 && <p className="mt-1 text-sm text-red-500">{errors.agreeTerms1}</p>}
              </div>

              <div>
                <div className="flex items-start mb-2">
                  <input
                    type="checkbox"
                    id="agreeTerms2"
                    name="agreeTerms2"
                    checked={formData.agreeTerms2}
                    onChange={handleChange}
                    className="mt-1"
                  />
                  <label htmlFor="agreeTerms2" className="ml-2 block">
                    <span className="font-medium">[필수] 개인정보 수집 및 이용 동의</span>
                  </label>
                </div>
                <div className="bg-gray-50 p-3 rounded-md text-sm h-40 overflow-y-auto">
                  회사는 청약 및 투자 서비스 제공을 위해 아래와 같이 개인정보를 수집 및 이용합니다.
                  <br />
                  <br />
                  1. 수집항목: 이름, 이메일, 전화번호, 주소, 계좌정보
                  <br />
                  2. 수집목적: 청약 신청 및 처리, 투자 관련 정보 제공, 배당금 지급
                  <br />
                  3. 보유기간: 투자 종료 후 5년
                  <br />
                  <br />
                  귀하는 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있으나, 동의 거부 시 청약 신청이 제한됩니다.
                </div>
                {errors.agreeTerms2 && <p className="mt-1 text-sm text-red-500">{errors.agreeTerms2}</p>}
              </div>

              <div>
                <div className="flex items-start mb-2">
                  <input
                    type="checkbox"
                    id="agreeTerms3"
                    name="agreeTerms3"
                    checked={formData.agreeTerms3}
                    onChange={handleChange}
                    className="mt-1"
                  />
                  <label htmlFor="agreeTerms3" className="ml-2 block">
                    <span className="font-medium">[필수] 청약 신청 약관 동의</span>
                  </label>
                </div>
                <div className="bg-gray-50 p-3 rounded-md text-sm h-40 overflow-y-auto">
                  본 약관은 Woore 플랫폼을 통해 제공되는 부동산 토큰 청약 서비스 이용에 관한 사항을 규정합니다.
                  <br />
                  <br />
                  1. 청약 신청 후 취소는 청약 기간 내에만 가능합니다.
                  <br />
                  2. 청약 금액은 지정된 계좌로 입금해야 하며, 입금 확인 후 청약이 완료됩니다.
                  <br />
                  3. 청약 경쟁률에 따라 배정 수량이 신청 수량보다 적을 수 있습니다.
                  <br />
                  4. 미배정 금액은 입금 계좌로 환불됩니다.
                  <br />
                  5. 청약 완료 후 발행되는 토큰은 지정된 지갑으로 전송됩니다.
                </div>
                {errors.agreeTerms3 && <p className="mt-1 text-sm text-red-500">{errors.agreeTerms3}</p>}
              </div>
            </div>
          </div>
        )
      case "payment":
        const myAccountBalance = customerInfo?.accountBalance ?? 0
        const insufficientBalance = myAccountBalance < totalAmount

        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">결제 정보</h2>

            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <h3 className="font-medium mb-3">청약 정보 확인</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">매물명:</div>
                <div className="font-medium">{subscriptionDetail.estateName}</div>
                <div className="text-gray-600">청약 수량:</div>
                <div className="font-medium">{formData.quantity} DABS</div>
                <div className="text-gray-600">토큰 가격:</div>
                <div className="font-medium">{tokenPrice.toLocaleString()}원 / DABS</div>
                <div className="text-gray-600">총 결제 금액:</div>
                <div className="font-bold text-blue-600">{totalAmount.toLocaleString()}원</div>
              </div>
            </div>

            <div
              className={`p-4 rounded-md border ${insufficientBalance ? "bg-red-50 border-red-100" : "bg-blue-50 border-blue-100"}`}
            >
              <h3 className={`font-medium mb-2 ${insufficientBalance ? "text-red-800" : "text-blue-800"}`}>
                내 계좌 결제
              </h3>
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-gray-600">내 계좌 잔액</span>
                <span className="font-bold text-gray-800">{myAccountBalance.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">차감될 금액</span>
                <span className={`font-bold ${insufficientBalance ? "text-red-600" : "text-blue-600"}`}>
                  {totalAmount.toLocaleString()}원
                </span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-600">결제 후 잔액</span>
                <span className="font-bold text-gray-800">{(myAccountBalance - totalAmount).toLocaleString()}원</span>
              </div>

              {insufficientBalance && (
                <div className="mt-3 p-3 bg-white rounded-md text-sm text-red-600 border border-red-200">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <span className="font-medium">잔액이 부족합니다</span>
                  </div>
                  <p className="mt-1 ml-7">
                    계좌에 {(totalAmount - myAccountBalance).toLocaleString()}원을 추가로 입금해주세요.
                  </p>
                </div>
              )}

              {!insufficientBalance && (
                <div className="mt-3 p-3 bg-white rounded-md text-sm text-green-600 border border-green-200">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-medium">결제 가능</span>
                  </div>
                  <p className="mt-1 ml-7">
                    '청약 신청 완료' 버튼을 클릭하면 계좌에서 즉시 {totalAmount.toLocaleString()}원이 차감됩니다.
                  </p>
                </div>
              )}
            </div>
          </div>
        )
      case "confirm":
        return (
          <div className="space-y-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold">청약 신청이 완료되었습니다</h2>
            <p className="text-gray-600">청약 신청이 정상적으로 접수되었습니다. 결제 확인 후 최종 청약이 완료됩니다.</p>

            <div className="bg-gray-50 p-4 rounded-md my-6 text-left">
              <h3 className="font-medium mb-3">청약 정보</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">청약 번호:</div>
                <div className="font-medium">SUB{Date.now().toString().slice(-8)}</div>
                <div className="text-gray-600">매물명:</div>
                <div className="font-medium">{subscriptionDetail.estateName}</div>
                <div className="text-gray-600">청약자:</div>
                <div className="font-medium">{formData.name}</div>
                <div className="text-gray-600">청약 수량:</div>
                <div className="font-medium">{formData.quantity} DABS</div>
                <div className="text-gray-600">결제 금액:</div>
                <div className="font-bold text-blue-600">{totalAmount.toLocaleString()}원</div>
                <div className="text-gray-600">결제 방법:</div>
                <div className="font-medium">
                  {formData.paymentMethod === "bank"
                    ? "계좌이체"
                    : formData.paymentMethod === "card"
                      ? "신용카드"
                      : "암호화폐"}
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <p>청약 관련 정보는 입력하신 이메일({formData.email})로 발송되었습니다.</p>
              <p>추가 문의사항은 고객센터(1588-1234)로 연락주세요.</p>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to={`/subscription/${id}`} className="text-blue-600 hover:underline flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          청약 상세로 돌아가기
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">{subscriptionDetail.estateName} 청약 신청</h1>
          <p className="text-gray-600">
            청약 기간: {new Date(subscriptionDetail.subStartDate).toLocaleDateString()} ~{" "}
            {new Date(subscriptionDetail.subEndDate).toLocaleDateString()}
          </p>
        </div>

        {/* 진행 단계 표시 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div
              className={`flex flex-col items-center ${
                currentStep === "info" ||
                currentStep === "terms" ||
                currentStep === "payment" ||
                currentStep === "confirm"
                  ? "text-blue-600"
                  : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                  currentStep === "info" ||
                  currentStep === "terms" ||
                  currentStep === "payment" ||
                  currentStep === "confirm"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                1
              </div>
              <span className="text-xs">정보 입력</span>
            </div>
            <div className="flex-1 h-1 mx-2 bg-gray-200">
              <div
                className={`h-full bg-blue-600 ${
                  currentStep === "terms" || currentStep === "payment" || currentStep === "confirm" ? "w-full" : "w-0"
                }`}
              ></div>
            </div>
            <div
              className={`flex flex-col items-center ${
                currentStep === "terms" || currentStep === "payment" || currentStep === "confirm"
                  ? "text-blue-600"
                  : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                  currentStep === "terms" || currentStep === "payment" || currentStep === "confirm"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                2
              </div>
              <span className="text-xs">약관 동의</span>
            </div>
            <div className="flex-1 h-1 mx-2 bg-gray-200">
              <div
                className={`h-full bg-blue-600 ${
                  currentStep === "payment" || currentStep === "confirm" ? "w-full" : "w-0"
                }`}
              ></div>
            </div>
            <div
              className={`flex flex-col items-center ${
                currentStep === "payment" || currentStep === "confirm" ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                  currentStep === "payment" || currentStep === "confirm"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                3
              </div>
              <span className="text-xs">결제</span>
            </div>
            <div className="flex-1 h-1 mx-2 bg-gray-200">
              <div className={`h-full bg-blue-600 ${currentStep === "confirm" ? "w-full" : "w-0"}`}></div>
            </div>
            <div
              className={`flex flex-col items-center ${currentStep === "confirm" ? "text-blue-600" : "text-gray-400"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                  currentStep === "confirm" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                4
              </div>
              <span className="text-xs">완료</span>
            </div>
          </div>
        </div>

        {/* 단계별 컨텐츠 */}
        <div className="mb-8">{renderStepContent()}</div>

        {/* 버튼 */}
        <div className="flex justify-between">
          {currentStep !== "info" && currentStep !== "confirm" ? (
            <button onClick={handlePrevStep} className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              이전
            </button>
          ) : currentStep === "confirm" ? (
            <button
              onClick={() => navigate(`/subscription/${id}`)}
              className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              청약 상세로 돌아가기
            </button>
          ) : (
            <div></div>
          )}

          {currentStep !== "confirm" ? (
            <button onClick={handleNextStep} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              {currentStep === "payment" ? "청약 신청 완료" : "다음"}
            </button>
          ) : (
            <button onClick={handleComplete} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              확인
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default PropertySubscriptionPage

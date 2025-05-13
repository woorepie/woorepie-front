"use client"

import type React from "react"

import { useState } from "react"

const MyProfilePage = () => {
  const [profile, setProfile] = useState({
    name: "홍길동",
    email: "user@example.com",
    phone: "010-1234-5678",
    address: "서울특별시 강남구 테헤란로 123",
    joinDate: "2023년 4월 30일",
  })

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(profile)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setProfile(formData)
    setIsEditing(false)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">내 정보</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            정보 수정하기
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">이름</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">이메일</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">전화번호</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">주소</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
          </div>
          <div className="mt-6 flex gap-4">
            <button
              type="button"
              onClick={() => {
                setFormData(profile)
                setIsEditing(false)
              }}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              취소
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              저장
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-gray-500 mb-1">이름</h3>
              <p className="font-medium">{profile.name}</p>
            </div>
            <div>
              <h3 className="text-gray-500 mb-1">이메일</h3>
              <p className="font-medium">{profile.email}</p>
            </div>
            <div>
              <h3 className="text-gray-500 mb-1">전화번호</h3>
              <p className="font-medium">{profile.phone}</p>
            </div>
            <div>
              <h3 className="text-gray-500 mb-1">가입일</h3>
              <p className="font-medium">{profile.joinDate}</p>
            </div>
            <div className="md:col-span-2">
              <h3 className="text-gray-500 mb-1">주소</h3>
              <p className="font-medium">{profile.address}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyProfilePage

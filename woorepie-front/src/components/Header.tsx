// components/Header.tsx
"use client"

import { Link, useLocation } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import { logout } from "../api/auth"
import { useAuth } from "../context/AuthContext"
import { getAllNotifications, markNotificationAsRead } from "../api/notification"
import type { NotificationDisplay } from "../api/notification"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationDisplay[]>([])
  const location = useLocation()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const notificationRef = useRef<HTMLDivElement>(null)
  const { isAuthenticated, loading, checkAuth } = useAuth()

  const userInfo = JSON.parse(sessionStorage.getItem("userInfo") || "{}")
  const isAgent = userInfo.role === "ROLE_AGENT"

  useEffect(() => {
    checkAuth()
  }, [location.pathname])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
  if (isAuthenticated && !isAgent) {
    getAllNotifications()
      .then((data) => {
        setNotifications(data)
      })
      .catch((err) => console.error("개요 조회 실패", err))
  }
}, [isAuthenticated])


  const handleLogout = async () => {
    try {
      const response = await logout()
      if (response.success) {
        setIsDropdownOpen(false)
        await checkAuth()
        window.location.href = "/"
      } else {
        console.error("로그아웃 실패:", response.message)
      }
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await Promise.all(
        notifications.filter((n) => !n.read).map((n) => markNotificationAsRead(Number(n.id)))
      )
      setNotifications(notifications.map((n) => ({ ...n, read: true })))
    } catch (err) {
      console.error("전체 알림 읽음 처리 실패", err)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(Number(id))
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
      )
    } catch (err) {
      console.error("알림 읽음 처리 실패", err)
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  const isActive = (path: string) => {
    if (path === "/properties") {
      return location.pathname === "/properties" ? "font-bold text-blue-600" : ""
    }
    if (path === "/subscription") {
      return location.pathname === "/subscription" ? "font-bold text-blue-600" : ""
    }
    return location.pathname === path ? "font-bold text-blue-600" : ""
  }

  return (
    <header className="bg-white shadow-sm z-50 relative">
      <div className="max-w-[1600px] mx-auto px-12 py-5 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logos/logo.png" alt="WOORE PIE Logo" className="h-10 w-10 z-10" />
          <span className="text-2xl font-bold">WOORE PIE</span>
        </Link>

        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isMenuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
          </svg>
        </button>

        <nav className="hidden md:flex items-center gap-20">
          {isAgent ? (
            <Link to="/properties/register" className="text-lg font-medium hover:text-blue-600 transition-colors duration-200">매물 등록</Link>
          ) : (
            <>
              <Link to="/subscription" className={`text-lg font-medium hover:text-blue-600 transition-colors duration-200 ${isActive("/subscription")}`}>청약</Link>
              <Link to="/properties" className={`text-lg font-medium hover:text-blue-600 transition-colors duration-200 ${isActive("/properties")}`}>매물 보기</Link>
              <Link to="/disclosure" className={`text-lg font-medium hover:text-blue-600 transition-colors duration-200 ${isActive("/disclosure")}`}>공시 보기</Link>
            </>
          )}

          {isAuthenticated ? (
            <div className="flex items-center gap-8">
              {/* ✅ 고객에게만 알림 아이콘 표시 */}
              {!isAgent && (
                <div className="relative z-50" ref={notificationRef}>
                  <button
                    onClick={() => {
                      setIsNotificationOpen(!isNotificationOpen)
                      setIsDropdownOpen(false)
                    }}
                    className="relative p-1.5 hover:text-blue-600 transition-colors duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {isNotificationOpen && (
                    <div className="absolute right-0 mt-2 w-96 bg-white rounded-md shadow-lg z-50 py-1 origin-top-right transition-all">
                      <div className="flex justify-between items-center px-4 py-2 border-b">
                        <h3 className="font-medium">알림</h3>
                        {unreadCount > 0 && (
                          <button onClick={markAllAsRead} className="text-xs text-blue-600 hover:text-blue-800">
                            모두 읽음 표시
                          </button>
                        )}
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((n) => (
                            <div
                              key={n.id}
                              className={`px-4 py-3 border-b hover:bg-gray-50 ${!n.read ? "bg-blue-50" : ""}`}
                              onClick={() => markAsRead(n.id)}
                            >
                              <div className="flex justify-between">
                                <h4 className="font-medium text-sm truncate w-64">{n.title}</h4>
                                <span className="text-xs text-gray-500 whitespace-nowrap">{n.date}</span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1 whitespace-pre-line leading-snug">
                                {n.message}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-center text-gray-500 text-sm">알림이 없습니다.</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 마이페이지 및 로그아웃 */}
              <Link to={isAgent ? "/agent-mypage" : "/mypage"} className="font-medium text-lg hover:text-blue-600">
                마이페이지
              </Link>
              <button onClick={handleLogout} className="font-medium text-lg hover:text-blue-600">
                로그아웃
              </button>
            </div>
          ) : (
            <Link to="/auth/login" className="font-medium text-lg hover:text-blue-600">
              로그인
            </Link>
          )}
        </nav>
      </div>

      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white shadow-md z-50 md:hidden">
          <div className="container mx-auto px-4 py-2 flex flex-col">
            {isAgent ? (
              <Link to="/properties/register" className="py-2.5 border-b hover:text-blue-600 transition-colors duration-200">매물 등록</Link>
            ) : (
              <>
                <Link to="/subscription" className="py-2.5 border-b hover:text-blue-600 transition-colors duration-200">청약</Link>
                <Link to="/properties" className="py-2.5 border-b hover:text-blue-600 transition-colors duration-200">매물 보기</Link>
                <Link to="/disclosure" className="py-2.5 border-b hover:text-blue-600 transition-colors duration-200">공시 보기</Link>
              </>
            )}
            {isAuthenticated ? (
              <>
                <Link to={isAgent ? "/agent-mypage" : "/mypage"} className="py-2.5 border-b hover:text-blue-600 transition-colors duration-200">마이페이지</Link>
                <button onClick={handleLogout} className="py-2.5 text-left">로그아웃</button>
              </>
            ) : (
              <Link to="/auth/login" className="py-2.5">로그인</Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Header

"use client"

import { Link, useLocation } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import { checkAuthStatus, logout } from "../api/auth"

// 알림 타입 정의
interface Notification {
  id: string
  title: string
  message: string
  date: string
  read: boolean
}

// 샘플 알림 데이터
const sampleNotifications: Notification[] = [
  {
    id: "1",
    title: "청약 성공",
    message: "교보타워 청약이 성공적으로 완료되었습니다.",
    date: "2025/03/15",
    read: false,
  },
  {
    id: "2",
    title: "배당금 지급",
    message: "코엑스 배당금이 지급되었습니다.",
    date: "2025/03/10",
    read: false,
  },
  {
    id: "3",
    title: "KYC 인증 완료",
    message: "KYC 인증이 완료되었습니다.",
    date: "2025/03/05",
    read: true,
  },
]

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications)
  const location = useLocation()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const notificationRef = useRef<HTMLDivElement>(null)

  // 페이지 로드 및 경로 변경 시 로그인 상태 확인
  useEffect(() => {
    const checkAuth = async () => {
      const result = await checkAuthStatus()
      setLoggedIn(result.success && (result.authenticated ?? false))
    }
    checkAuth()
  }, [location.pathname])

  // 드롭다운 외부 클릭 시 닫기
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

  const handleLogout = () => {
    logout()
    setLoggedIn(false)
    setIsDropdownOpen(false)
    window.location.href = "/"
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
  }

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const unreadCount = notifications.filter((notification) => !notification.read).length

  const isActive = (path: string) => {
    // 정확한 경로 매칭을 위해 startsWith 대신 정확한 경로 비교 또는 더 구체적인 조건 사용
    if (path === "/properties") {
      return location.pathname === "/properties" ? "font-bold text-blue-600" : ""
    }
    if (path === "/properties/subscription") {
      return location.pathname === "/properties/subscription" ? "font-bold text-blue-600" : ""
    }
    return location.pathname === path ? "font-bold text-blue-600" : ""
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-[1600px] mx-auto px-12 py-5 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logos/logo.png" alt="WOORE PIE Logo" className="h-10 w-10" />
          <span className="text-2xl font-bold">WOORE PIE</span>
        </Link>

        {/* Mobile menu button */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
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
          >
            {isMenuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
          </svg>
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-16">
          <Link to="/properties/subscription" className={`text-lg ${isActive("/properties/subscription")}`}>
            청약
          </Link>
          <Link to="/properties" className={`text-lg ${isActive("/properties")}`}>
            매물 보기
          </Link>
          <Link to="/disclosure" className={`text-lg ${isActive("/disclosure")}`}>
            공시 보기
          </Link>
          <Link to="/customer" className={`text-lg ${isActive("/customer")}`}>
            문의하기
          </Link>

          {loggedIn ? (
            <>
              {/* 알림 아이콘 */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => {
                    setIsNotificationOpen(!isNotificationOpen)
                    setIsDropdownOpen(false)
                  }}
                  className="relative p-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* 알림 드롭다운 */}
                {isNotificationOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-10 py-1 origin-top-right transition-all duration-200 ease-out transform scale-100 opacity-100">
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
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`px-4 py-3 border-b hover:bg-gray-50 ${!notification.read ? "bg-blue-50" : ""}`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex justify-between">
                              <h4 className="font-medium text-sm">{notification.title}</h4>
                              <span className="text-xs text-gray-500">{notification.date}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-center text-gray-500 text-sm">알림이 없습니다.</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* MY 드롭다운 */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => {
                    setIsDropdownOpen(!isDropdownOpen)
                    setIsNotificationOpen(false)
                  }}
                  className="flex items-center gap-1 font-medium text-lg"
                >
                  MY
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>

                {/* MY 드롭다운 메뉴 */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1 origin-top-right transition-all duration-200 ease-out transform scale-100 opacity-100">
                    <Link
                      to="/mypage"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      마이페이지
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link to="/auth/login" className="font-medium text-lg">
              로그인
            </Link>
          )}
        </nav>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white shadow-md z-50 md:hidden">
          <div className="container mx-auto px-4 py-2 flex flex-col">
            <Link to="/properties/subscription" className="py-2 border-b">
              청약
            </Link>
            <Link to="/properties" className="py-2 border-b">
              매물 보기
            </Link>
            <Link to="/disclosure" className="py-2 border-b">
              공시 보기
            </Link>
            <Link to="/customer" className="py-2 border-b">
              문의하기
            </Link>

            {loggedIn ? (
              <>
                <Link to="/mypage" className="py-2 border-b">
                  마이페이지
                </Link>
                <button onClick={handleLogout} className="py-2 text-left">
                  로그아웃
                </button>
              </>
            ) : (
              <Link to="/auth/login" className="py-2">
                로그인
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Header

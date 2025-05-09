"use client"

import { Link, useLocation } from "react-router-dom"
import { useState } from "react"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path ? "font-bold text-blue-600" : ""
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          WOORE PIE
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
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/properties" className={`${isActive("/properties")}`}>
            매물 보기
          </Link>
          <Link to="/exchange" className={`${isActive("/exchange")}`}>
            거래소
          </Link>
          <Link to="/disclosure" className={`${isActive("/disclosure")}`}>
            공시 보기
          </Link>
          <Link to="/customer" className={`${isActive("/customer")}`}>
            고객 문의
          </Link>
          <Link to="/mypage" className={`${isActive("/mypage")}`}>
            MY
          </Link>
          <Link to="/login" className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md">
            로그인
          </Link>
        </nav>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white shadow-md z-50 md:hidden">
            <div className="container mx-auto px-4 py-2 flex flex-col">
              <Link to="/properties" className="py-2 border-b">
                매물 보기
              </Link>
              <Link to="/exchange" className="py-2 border-b">
                거래소
              </Link>
              <Link to="/disclosure" className="py-2 border-b">
                공시 보기
              </Link>
              <Link to="/customer" className="py-2 border-b">
                고객 문의
              </Link>
              <Link to="/mypage" className="py-2 border-b">
                MY
              </Link>
              <Link to="/login" className="py-2">
                로그인
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header

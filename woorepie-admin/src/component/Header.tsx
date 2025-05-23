"use client"

import { useNavigate } from "react-router-dom"

const Header = () => {
  const navigate = useNavigate()

  const menuItems = [
    { name: "매물 승인", path: "/" },
    { name: "청약 승인", path: "/subscription" },
    { name: "매각 승인", path: "/sale-approval" },
    { name: "공시등록", path: "/disclosure" },
    { name: "배당금 승인", path: "/dividend" },
  ]

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img src="/logo.png" alt="WOORE PIE" className="h-8 mr-3" />
            <h1 className="text-xl font-bold text-gray-800">WOORE PIE</h1>
          </div>

          <nav className="hidden md:flex space-x-8">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className="text-gray-600 hover:text-[#0F62FE] px-2 py-1 text-sm font-medium"
              >
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header

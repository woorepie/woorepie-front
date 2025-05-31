"use client"

import React, { useState } from "react"
import { FileText, Users, ShoppingBag, FileCheck, BarChart3, Home, Settings, LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface MenuItem {
  id: string
  icon: React.ReactNode
  label: string
  badge?: string
  path: string
}

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState("menu1")
  const navigate = useNavigate()

  const menuItems: MenuItem[] = [
    { id: "menu1", icon: <FileText size={18} />, label: "메뉴 승인", badge: "admin", path: "/" },
    { id: "menu2", icon: <FileCheck size={18} />, label: "청약 승인", badge: "admin", path: "/subscription" },
    { id: "menu3", icon: <ShoppingBag size={18} />, label: "매각 요청 승인(주후)", badge: "", path: "/sale-request" },
    { id: "menu4", icon: <Users size={18} />, label: "매각 승인", badge: "admin", path: "/sale-approval" },
    { id: "menu5", icon: <BarChart3 size={18} />, label: "공시 등록", badge: "admin", path: "/disclosure" },
    { id: "menu6", icon: <FileText size={18} />, label: "배당금 승인", badge: "admin", path: "/dividend" },
  ]

  const handleNavigation = (path: string, id: string) => {
    setActiveItem(id)
    navigate(path)
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 shadow-sm">
      <div className="flex flex-col h-full">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <Home size={20} className="text-[#0F62FE]" />
            <h2 className="text-lg font-bold text-gray-800">관리자 대시보드</h2>
          </div>

          <nav>
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    className={`flex items-center w-full px-4 py-3 text-left rounded-lg transition-colors ${
                      activeItem === item.id ? "bg-[#0F62FE] text-white" : "text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={() => handleNavigation(item.path, item.id)}
                  >
                    <span className={`${activeItem === item.id ? "text-white" : "text-[#0F62FE]"} mr-3`}>
                      {item.icon}
                    </span>
                    <span className="text-sm font-medium">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`ml-auto px-2 py-0.5 text-xs font-medium rounded-full ${
                          activeItem === item.id ? "bg-white text-[#0F62FE]" : "bg-red-100 text-red-600"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-gray-200">
          <button className="flex items-center w-full px-4 py-3 text-left rounded-lg text-gray-600 hover:bg-gray-100">
            <Settings size={18} className="text-gray-500 mr-3" />
            <span className="text-sm font-medium">설정</span>
          </button>
          <button className="flex items-center w-full px-4 py-3 text-left rounded-lg text-gray-600 hover:bg-gray-100">
            <LogOut size={18} className="text-gray-500 mr-3" />
            <span className="text-sm font-medium">로그아웃</span>
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar

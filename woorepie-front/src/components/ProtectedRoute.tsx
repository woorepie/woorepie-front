// src/components/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import { checkAuthStatus } from "@/api/auth"

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const location = useLocation()

  useEffect(() => {
    const checkAuth = async () => {
      const userInfo = sessionStorage.getItem('userInfo')
      
      if (!userInfo) {
        const status = await checkAuthStatus()
        setIsAuthenticated(status.authenticated)
        setUserRole(status.userRole)
      } else {
        const parsedUserInfo = JSON.parse(userInfo)
        setIsAuthenticated(true)
        setUserRole(parsedUserInfo.role)
      }
    }

    checkAuth()
  }, [])

  if (isAuthenticated === null) {
    // 로딩 상태
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    // 인증되지 않은 경우 로그인 페이지로 리다이렉트
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  // 마이페이지 접근 제어
  if (location.pathname.startsWith('/mypage')) {
    if (userRole !== 'ROLE_CUSTOMER') {
      return <Navigate to="/" replace />
    }
  }

  // 인증된 경우 자식 라우트 렌더링
  return <Outlet />
}

export default ProtectedRoute
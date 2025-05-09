import { Link, Outlet, useLocation } from "react-router-dom"

const MyPage = () => {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path ? "font-bold text-blue-600 border-b-2 border-blue-600" : ""
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">마이페이지</h1>

      <div className="mb-8">
        <nav className="flex border-b">
          <Link to="/mypage" className={`px-4 py-2 ${isActive("/mypage")}`}>
            내 정보
          </Link>
          <Link to="/mypage/account" className={`px-4 py-2 ${isActive("/mypage/account")}`}>
            계좌 정보
          </Link>
          <Link to="/mypage/subscription" className={`px-4 py-2 ${isActive("/mypage/subscription")}`}>
            청약 정보 <span className="ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">2</span>
          </Link>
          <Link to="/mypage/transactions" className={`px-4 py-2 ${isActive("/mypage/transactions")}`}>
            거래내역 <span className="ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">99+</span>
          </Link>
        </nav>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <Outlet />
      </div>
    </div>
  )
}

export default MyPage

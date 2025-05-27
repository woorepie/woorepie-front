import { Link, Outlet, useLocation } from "react-router-dom"

const MyPage = () => {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path ? "bg-blue-50 text-blue-600 font-medium" : ""
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">마이페이지</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* 사이드바 메뉴 */}
        <div className="w-full md:w-1/4">
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            <Link
              to="/mypage"
              className={`block px-4 py-3 hover:bg-blue-50 border-b border-gray-200 ${isActive("/mypage")}`}
            >
              내 정보
            </Link>
            <Link
              to="/agent-mypage/profile"
              className={`block px-4 py-3 hover:bg-blue-50 border-b border-gray-200 ${isActive("/mypage/account")}`}
            >
              계좌 정보
            </Link>
            <Link
              to="/agent-mypage/estate"
              className={`block px-4 py-3 hover:bg-blue-50 border-b border-gray-200 ${isActive("/mypage/subscription")}`}
            >
              <div className="flex justify-between items-center">
                <span>청약 정보</span>
                <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">2</span>
              </div>
            </Link>
          </div>
        </div>

        {/* 내용 영역 */}
        <div className="w-full md:w-3/4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyPage

import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
          {/* WOORE PIE 소개 */}
          <div>
            <h3 className="font-bold text-lg mb-4">WOORE PIE</h3>
            <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
              우리투자증권에서 시작하는 <br />안전한 토큰증권 플랫폼
            </p>
          </div>

          {/* 우리금융그룹 컬럼 */}
          <div>
            <h4 className="font-semibold mb-3">우리금융그룹</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="https://www.wooribank.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">우리은행</a></li>
              <li><a href="https://www.wooriib.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">우리투자증권</a></li>
              <li><a href="https://www.woorifni.co.kr" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">우리금융캐피탈</a></li>
              <li><a href="https://www.woorifg.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">우리금융지주</a></li>
              <li><a href="https://www.woorifs.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">우리펀드서비스</a></li>
              <li><a href="https://www.wooriinvest.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">우리글로벌자산운용</a></li>
            </ul>
          </div>

          {/* 고객지원 */}
          <div>
            <h4 className="font-semibold mb-3">고객지원</h4>
            <ul className="space-y-2">
              {[1, 2, 3, 4, 5].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    자주 묻는 질문 {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 회사정보 */}
          <div>
            <h4 className="font-semibold mb-3">회사정보</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>상호: (주)우리파이</li>
              <li>사업자등록번호: 123-45-67890</li>
              <li>대표자: 클엔 2팀 </li>
              <li>주소: 서울특별시 중구 을지로 123</li>
              <li>고객센터: 1800-0000 </li>
            </ul>
          </div>

          {/* 이용 안내 */}
          <div>
            <h4 className="font-semibold mb-3">이용 안내</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/notices" className="hover:text-blue-600 transition-colors">공지사항</Link></li>
              <li><Link to="/guide" className="hover:text-blue-600 transition-colors">이용 가이드</Link></li>
              <li><Link to="/about" className="hover:text-blue-600 transition-colors">서비스 소개</Link></li>
              <li><Link to="/risk" className="hover:text-blue-600 transition-colors">투자 유의사항</Link></li>
            </ul>
          </div>
        </div>

        {/* 하단 바 */}
        <div className="mt-8 pt-8 border-t border-gray-200 text-sm text-gray-600">
          <p>© 2024 WOORE PIE. All rights reserved.</p>
          <div className="flex flex-wrap gap-4 mt-2">
            <Link to="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</Link>
            <Link to="/cookies" className="hover:text-blue-600 transition-colors">Cookies Settings</Link>
          </div>
          <div className="text-xs text-gray-500 mt-4">
            * 본 서비스는 투자판단의 참고자료이며, 법적 책임을 지지 않습니다. <br />
            * 토큰증권은 원금손실의 위험이 있으며, 투자 전 설명서를 꼭 확인하세요.
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
import { Link } from "react-router-dom"
import InfiniteLogoSlider from "../components/InfiniteLogoSlider"
import FaqAccordion from "../components/FaqAccordion"

// 우리 금융 계열사 로고 데이터
const financialLogos = [
  { id: 1, src: "../../public/logos/woori-group.png", alt: "우리금융그룹" },
  { id: 2, src: "../../public/logos/woori-invest.svg", alt: "우리투자증권" },
  { id: 3, src: "../../public/logos/woori-fni.svg", alt: "우리에프앤아이" },
  { id: 4, src: "../../public/logos/woori-sintak.svg", alt: "우리자산신탁" },
]

const HomePage = () => {
  return (
    <div>
      {/* Hero Section with Infinite Logo Slider Background */}
      <section className="hero-background py-16">
        <div className="logo-background">
          <div className="mb-auto">
            <InfiniteLogoSlider logos={financialLogos} speed={40} direction="left" />
          </div>
          <div className="mt-auto">
            <InfiniteLogoSlider logos={financialLogos} speed={30} direction="right" />
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center hero-content">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              소액으로 부동산 소유의 시작,
              <br />
              WOORE PIE
            </h1>
            <p className="text-xl mb-8">우리투자증권에서 시작하는 안전한 토큰증권 플랫폼</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/auth/login" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                로그인 하기
              </Link>
              <Link
                to="/auth/signup"
                className="px-6 py-3 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
              >
                회원 가입
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties - 세로 형식 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">대표 매물</h2>

          <div className="space-y-24">
            {/* 대표 매물 1 - 텍스트 왼쪽, 이미지 오른쪽 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-1/2 order-2 md:order-1">
                <h3 className="text-2xl font-bold mb-4">대표 매물 1</h3>
                <p className="text-gray-600 mb-6">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum
                  tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero
                  vitae erat.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                    수익률 5.2% 달성!
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                    평균 배당률 4.8% 달성!
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                    3일만에 청약 완료!
                  </li>
                </ul>
              </div>
              <div className="w-full md:w-1/2 order-1 md:order-2">
                <div className="bg-gray-200 rounded-lg aspect-square flex items-center justify-center">
                  <img
                    src="/modern.png"
                    alt="대표 매물 1"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* 대표 매물 2 - 이미지 왼쪽, 텍스트 오른쪽 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-1/2">
                <div className="bg-gray-200 rounded-lg aspect-square flex items-center justify-center">
                  <img
                    src="/modern2.png"
                    alt="대표 매물 2"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <h3 className="text-2xl font-bold mb-4">대표 매물 2</h3>
                <p className="text-gray-600 mb-6">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum
                  tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero
                  vitae erat.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                    수익률 4.7% 달성!
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                    평균 배당률 4.2% 달성!
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                    5일만에 청약 완료!
                  </li>
                </ul>
              </div>
            </div>

            {/* 대표 매물 3 - 텍스트 왼쪽, 이미지 오른쪽 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-1/2 order-2 md:order-1">
                <h3 className="text-2xl font-bold mb-4">대표 매물 3</h3>
                <p className="text-gray-600 mb-6">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum
                  tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero
                  vitae erat.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                    수익률 5.5% 달성!
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                    평균 배당률 5.0% 달성!
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                    2일만에 청약 완료!
                  </li>
                </ul>
              </div>
              <div className="w-full md:w-1/2 order-1 md:order-2">
                <div className="bg-gray-200 rounded-lg aspect-square flex items-center justify-center">
                  <img
                    src="/luxury.png"
                    alt="대표 매물 3"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center">WOORE PIE의 Q&A</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            자주 묻는 질문들을 모아봤습니다. 아직 궁금한 점이 있으시다면 문의하기를 통해 질문해주세요.
          </p>

          <div className="max-w-3xl mx-auto space-y-6">
            <FaqAccordion />
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage

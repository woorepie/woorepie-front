import { Link } from "react-router-dom"

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-blue-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              소액으로 부동산 소유의 시작,
              <br />
              WOORE PIE
            </h1>
            <p className="text-xl mb-8">우리투자증권에서 시작하는 안전한 토큰증권 플랫폼</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/login" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                로그인 하기
              </Link>
              <Link to="/signup" className="px-6 py-3 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50">
                회원 가입
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">WOORE PIE와 함께 하는 기업들</h2>
          <div className="flex flex-wrap justify-center gap-8 items-center">
            {["Webflow", "Relume", "W Webflow"].map((partner, index) => (
              <div key={index} className="text-xl font-bold text-gray-400">
                {partner}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">대표 매물</h2>
          <div className="grid md:grid-cols-2 gap-12">
            {/* Property 1 */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/2 bg-gray-200 rounded-lg h-64"></div>
              <div className="w-full md:w-1/2">
                <h3 className="text-2xl font-bold mb-4">대표 매물 1</h3>
                <p className="text-gray-600 mb-6">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum
                  tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero
                  vitae erat.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                    수익률 ~% 달성!
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                    평균 배당률 ~% 달성!
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                    ~일만에 청약 완료!
                  </li>
                </ul>
              </div>
            </div>

            {/* Property 2 */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/2 bg-gray-200 rounded-lg h-64"></div>
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
                    Benefit one of this feature
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                    Benefit two of this feature
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                    Benefit three of this feature
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center">WOORE PIE의 Q&A</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Frequently asked questions ordered by popularity. Remember that if the visitor has not committed to the call
            to action, they may still have questions (doubts) that can be answered.
          </p>

          <div className="max-w-3xl mx-auto space-y-6">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="border-b pb-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-medium">Question text goes here</h3>
                  <button className="text-2xl">×</button>
                </div>
                <div className="mt-4 text-gray-600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum
                  tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero
                  vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus
                  tristique posuere.
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage

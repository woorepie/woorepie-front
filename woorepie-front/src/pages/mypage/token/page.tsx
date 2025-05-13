import { mockTokenHoldings } from "../../../data/mockData"

const MyTokensPage = () => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-6">토큰 정보</h2>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold">보유 토큰</h3>
          <div className="relative">
            <input type="text" placeholder="Search" className="pl-8 pr-4 py-2 border rounded-md" />
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
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">토큰명</th>
                <th className="p-3 text-right">수량</th>
                <th className="p-3 text-right">평균가</th>
                <th className="p-3 text-right">현재가</th>
                <th className="p-3 text-right">수익률</th>
              </tr>
            </thead>
            <tbody>
              {mockTokenHoldings.map((token) => (
                <tr key={token.id} className="border-b">
                  <td className="p-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full mr-2 flex items-center justify-center">
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
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </div>
                      {token.name}
                    </div>
                  </td>
                  <td className="p-3 text-right">{token.quantity}</td>
                  <td className="p-3 text-right">{token.averagePrice.toLocaleString()}</td>
                  <td className="p-3 text-right">{token.currentValue.toLocaleString()}</td>
                  <td className="p-3 text-right text-green-600">+{token.dividendRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default MyTokensPage

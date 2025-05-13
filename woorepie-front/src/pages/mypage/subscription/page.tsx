import { mockSubscriptions } from "../../../data/mockData"

const MySubscriptionPage = () => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-6">청약 정보</h2>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold">매물 정보</h3>
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
                <th className="p-3 text-left">매물 정보</th>
                <th className="p-3 text-right">수량</th>
                <th className="p-3 text-right">토큰 가격</th>
                <th className="p-3 text-right">총 가격</th>
                <th className="p-3 text-center">청약 결과</th>
                <th className="p-3 text-right">신청 날짜</th>
              </tr>
            </thead>
            <tbody>
              {mockSubscriptions.map((subscription) => (
                <tr key={subscription.id} className="border-b">
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
                      {subscription.propertyName}
                    </div>
                  </td>
                  <td className="p-3 text-right">{subscription.quantity}</td>
                  <td className="p-3 text-right">{subscription.tokenPrice.toLocaleString()}</td>
                  <td className="p-3 text-right">{subscription.totalPrice.toLocaleString()}</td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        subscription.status === "대기중"
                          ? "bg-yellow-100 text-yellow-800"
                          : subscription.status === "청약 성공"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {subscription.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">{subscription.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default MySubscriptionPage

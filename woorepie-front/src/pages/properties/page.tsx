// ✅ pages/properties/page.tsx - 필터에 맞게 수정 완료
"use client"

import { useState, useEffect } from "react"
import PropertyCard from "../../components/PropertyCard"
import PropertyFilter from "./filter/page"
import { estateService } from "../../api/estate"

const PropertiesPage = () => {
  const [filters, setFilters] = useState({
    city: "",
    neighborhood: "",
<<<<<<< Updated upstream
    dividendRange: "all",
    showWooriOnly: false,
=======
<<<<<<< Updated upstream
    yieldMin: 0,
    yieldMax: 100,
    dividendMin: 0,
    dividendMax: 100,
=======
    dividendRange: "all", // ✅ 문자열 타입으로 수정
    showWooriOnly: false,
>>>>>>> Stashed changes
>>>>>>> Stashed changes
  })

  const [appliedFilters, setAppliedFilters] = useState({ ...filters })
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEstates = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await estateService.getTradableEstates()
        setProperties(res)
      } catch (err) {
        setError("매물 정보를 불러오지 못했습니다.")
      } finally {
        setLoading(false)
      }
    }
    fetchEstates()
  }, [])

  const filteredProperties = properties.filter((property) => {
<<<<<<< Updated upstream
    const dividendYield = Number(property.dividendYield ?? 0)
=======
    const dividendYield = property.dividendYield ?? 0
>>>>>>> Stashed changes

    const matchCity = appliedFilters.city ? property.estateState?.includes(appliedFilters.city) : true
    const matchNeighborhood = appliedFilters.neighborhood ? property.estateCity?.includes(appliedFilters.neighborhood) : true
    const matchWoori = appliedFilters.showWooriOnly ? property.estateIsWoori : true

    let matchDividend = true
    switch (appliedFilters.dividendRange) {
<<<<<<< Updated upstream
      case "lt0.03":
        matchDividend = dividendYield < 0.03
        break
      case "0.03to0.05":
        matchDividend = dividendYield >= 0.03 && dividendYield <= 0.05
        break
      case "gt0.05":
        matchDividend = dividendYield > 0.05
=======
      case "lt3":
        matchDividend = dividendYield < 3
        break
      case "3to5":
        matchDividend = dividendYield >= 3 && dividendYield <= 5
        break
      case "gt5":
        matchDividend = dividendYield > 5
>>>>>>> Stashed changes
        break
      default:
        matchDividend = true
    }

    return matchCity && matchNeighborhood && matchWoori && matchDividend
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/4">
<<<<<<< Updated upstream
=======
<<<<<<< Updated upstream
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Filters</h2>
              <button
                className="text-blue-600 text-sm"
                onClick={() => {
                  setFilters({
                    city: "",
                    neighborhood: "",
                    yieldMin: 0,
                    yieldMax: 100,
                    dividendMin: 0,
                    dividendMax: 100,
                  })
                }}
              >
                Clear all
              </button>
            </div>

            {/* City Filter */}
            <div className="mb-6">
              <label className="block mb-2 font-medium">시</label>
              <select
                className="w-full p-2 border rounded-md"
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              >
                <option value="">Select</option>
                <option value="서울">서울</option>
                <option value="부산">부산</option>
                <option value="인천">인천</option>
                <option value="대구">대구</option>
              </select>
              <button className="text-sm text-blue-600 mt-1" onClick={() => setFilters({ ...filters, city: "" })}>
                Clear
              </button>
            </div>

            {/* Neighborhood Filter */}
            <div className="mb-6">
              <label className="block mb-2 font-medium">세부 행정동</label>
              <select
                className="w-full p-2 border rounded-md"
                value={filters.neighborhood}
                onChange={(e) => setFilters({ ...filters, neighborhood: e.target.value })}
              >
                <option value="">Select</option>
                <option value="강남구">강남구</option>
                <option value="서초구">서초구</option>
                <option value="마포구">마포구</option>
                <option value="송파구">송파구</option>
              </select>
              <button
                className="text-sm text-blue-600 mt-1"
                onClick={() => setFilters({ ...filters, neighborhood: "" })}
              >
                Clear
              </button>
            </div>

            {/* Keywords */}
            <div className="mb-6">
              <label className="block mb-2 font-medium">추천 키워드</label>
              <div className="flex flex-wrap gap-2">
                {["부산 배당율 4.2%", "서울 배당율 4.2%", "성수동 아크로포레스트"].map((keyword, index) => (
                  <button key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {keyword}
                  </button>
                ))}
              </div>
            </div>

            {/* Yield Range */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <label className="font-medium">수익률</label>
                <button
                  className="text-sm text-blue-600"
                  onClick={() => setFilters({ ...filters, yieldMin: 0, yieldMax: 100 })}
                >
                  Clear
                </button>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={filters.yieldMax}
                onChange={(e) => setFilters({ ...filters, yieldMax: Number.parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>{filters.yieldMin}</span>
                <span>{filters.yieldMax}</span>
              </div>
            </div>

            {/* Dividend Range */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <label className="font-medium">배당률</label>
                <button
                  className="text-sm text-blue-600"
                  onClick={() => setFilters({ ...filters, dividendMin: 0, dividendMax: 100 })}
                >
                  Clear
                </button>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={filters.dividendMax}
                onChange={(e) => setFilters({ ...filters, dividendMax: Number.parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>{filters.dividendMin}</span>
                <span>{filters.dividendMax}</span>
              </div>
            </div>

            <button className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Apply</button>
          </div>
=======
>>>>>>> Stashed changes
          <PropertyFilter
            filters={filters}
            setFilters={setFilters}
            onApply={() => setAppliedFilters(filters)}
          />
<<<<<<< Updated upstream
=======
>>>>>>> Stashed changes
>>>>>>> Stashed changes
        </div>

        <div className="w-full lg:w-3/4">
          {loading ? (
            <div className="flex justify-center items-center h-40 text-lg">로딩 중...</div>
          ) : error ? (
            <div className="flex justify-center items-center h-40 text-red-600">{error}</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => {
                const mappedProperty = {
                  id: property.estateId?.toString() ?? "",
                  name: property.estateName ?? "",
                  city: property.estateState ?? "",
                  district: property.estateCity ?? "",
                  location: `${property.estateState ?? ''} ${property.estateCity ?? ''}`,
                  address: property.estateAddress ?? "",
                  price: property.estateTokenPrice?.toString() ?? "",
                  tokenAmount: property.tokenAmount?.toString() ?? "",
                  tokenPrice: property.estateTokenPrice?.toString() ?? "",
                  tenant: "",
                  subscriptionPeriod: "",
                  availableTokens: property.tokenAmount?.toString() ?? "",
                  expectedYield: property.dividendYield?.toString() ?? "",
                  targetPrice: "",
                  priceIncreaseRate: "",
                  registrationDate: property.estateRegistrationDate?.toString().slice(0, 10) ?? "",
                  dividendRate: property.dividendYield?.toString() ?? "",
                  balance: "",
                  image: property.estateImageUrl ?? "",
                  latitude: property.estateLatitude ? Number(property.estateLatitude) : undefined,
                  longitude: property.estateLongitude ? Number(property.estateLongitude) : undefined,
                }
                return <PropertyCard key={mappedProperty.id} property={mappedProperty} />
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PropertiesPage

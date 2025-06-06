// ✅ pages/properties/page.tsx - 최종 정리본
"use client"

import { useState, useEffect } from "react"
import PropertyCard from "../../components/PropertyCard"
import PropertyFilter from "./filter/page"
import { estateService } from "../../api/estate"

const PropertiesPage = () => {
  const [filters, setFilters] = useState({
    city: "",
    neighborhood: "",
    dividendRange: "all",
    showWooriOnly: false,
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
    const dividendYield = Number(property.dividendYield ?? 0)

    const matchCity = appliedFilters.city ? property.estateState?.includes(appliedFilters.city) : true
    const matchNeighborhood = appliedFilters.neighborhood ? property.estateCity?.includes(appliedFilters.neighborhood) : true
    const matchWoori = appliedFilters.showWooriOnly ? property.estateIsWoori : true

    let matchDividend = true
    switch (appliedFilters.dividendRange) {
      case "lt0.03":
        matchDividend = dividendYield < 0.03
        break
      case "0.03to0.05":
        matchDividend = dividendYield >= 0.03 && dividendYield <= 0.05
        break
      case "gt0.05":
        matchDividend = dividendYield > 0.05
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
          <PropertyFilter
            filters={filters}
            setFilters={setFilters}
            onApply={() => setAppliedFilters(filters)}
          />
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
                  expectedYield: property.dividendYield 
                    ? `${(property.dividendYield * 100).toFixed(2)}%` 
                    : "미정",
                  targetPrice: "",
                  priceIncreaseRate: "",
                  registrationDate: property.estateRegistrationDate?.toString().slice(0, 10) ?? "",
                  dividendRate: property.dividendYield 
                    ? `${(property.dividendYield * 100).toFixed(2)}%` 
                    : "미정",
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

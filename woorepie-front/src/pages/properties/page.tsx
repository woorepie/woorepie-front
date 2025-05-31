"use client"

import { useState, useEffect } from "react"
import PropertyCard from "../../components/PropertyCard"
import PropertyFilter from "./filter/page"
import { estateService } from "../../api/estate"

const PropertiesPage = () => {
  const [filters, setFilters] = useState({
    city: "",
    neighborhood: "",
    yieldMin: 0,
    yieldMax: 100,
    dividendMin: 0,
    dividendMax: 100,
    showWooriOnly: false,
  })
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-1/4">
          <PropertyFilter filters={filters} setFilters={setFilters} />
        </div>

        {/* Property Listings */}
        <div className="w-full lg:w-3/4">
          {loading ? (
            <div className="flex justify-center items-center h-40 text-lg">로딩 중...</div>
          ) : error ? (
            <div className="flex justify-center items-center h-40 text-red-600">{error}</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => {
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
                  tenant: "", // 정보 없음
                  subscriptionPeriod: "", // 정보 없음
                  availableTokens: property.tokenAmount?.toString() ?? "",
                  expectedYield: property.dividendYield?.toString() ?? "",
                  targetPrice: "", // 정보 없음
                  priceIncreaseRate: "", // 정보 없음
                  registrationDate: property.estateRegistrationDate?.toString().slice(0, 10) ?? "",
                  dividendRate: property.dividendYield?.toString() ?? "",
                  balance: "", // 정보 없음
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

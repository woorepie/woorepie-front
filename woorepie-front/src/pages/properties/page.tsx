"use client"

import { useState } from "react"
import PropertyCard from "../../components/PropertyCard"
import { mockProperties } from "../../data/mockData"
import PropertyFilter from "./filter/page"

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-1/4">
          <PropertyFilter filters={filters} setFilters={setFilters} />
        </div>

        {/* Property Listings */}
        <div className="w-full lg:w-3/4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertiesPage

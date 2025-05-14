import { Link } from "react-router-dom"
import type { Property } from "../types/property"

interface PropertyCardProps {
  property: Property
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48 bg-gray-200">
        {property.image ? (
          <img src={property.image || "/placeholder.svg"} alt={property.name} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-400"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center text-sm text-gray-500 mb-1">
          <span>{property.location}</span>
          <span className="mx-1">•</span>
          <span className="text-blue-600">{property.dividendRate}</span>
        </div>
        <h3 className="font-bold text-lg mb-2">{property.name}</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p>현재 토큰가격 : {property.toLocaleString()}</p>
          <p>매물 등록 날짜 : {property.registrationDate}</p>
        </div>
        <Link to={`/properties/${property.id}`} className="mt-4 inline-block text-blue-600 hover:text-blue-800">
          Read more &gt;
        </Link>
      </div>
    </div>
  )
}

export default PropertyCard

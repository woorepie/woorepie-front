"use client"

import { useState } from "react"

interface InfiniteLogoSliderProps {
  logos: { id: number; src: string; alt: string }[]
  speed?: number
  direction?: "left" | "right"
  pauseOnHover?: boolean
}

const InfiniteLogoSlider = ({
  logos,
  speed = 30,
  direction = "left",
  pauseOnHover = true,
}: InfiniteLogoSliderProps) => {
  const [isHovered, setIsHovered] = useState(false)

  // 로고 배열을 두 번 복제하여 무한 슬라이드 효과를 만듭니다
  const duplicatedLogos = [...logos, ...logos]

  return (
    <div
      className="infinite-logo-slider-container overflow-hidden whitespace-nowrap"
      onMouseEnter={() => pauseOnHover && setIsHovered(true)}
      onMouseLeave={() => pauseOnHover && setIsHovered(false)}
    >
      <div
        className={`inline-block ${isHovered ? "animate-pause" : ""}`}
        style={{
          animation: `scroll${direction === "left" ? "Left" : "Right"} ${speed}s linear infinite`,
        }}
      >
        {duplicatedLogos.map((logo, index) => (
          <div key={`${logo.id}-${index}`} className="inline-block mx-8 align-middle">
            <img src={logo.src || "/placeholder.svg"} alt={logo.alt} className="h-12 w-auto opacity-70" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default InfiniteLogoSlider

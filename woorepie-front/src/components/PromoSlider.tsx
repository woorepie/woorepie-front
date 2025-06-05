import { useEffect, useRef, useState } from "react"

interface PromoSliderProps {
  slides: string[]
  interval?: number // ms
}

type FadeState = "fade-in" | "fade-out"

const PromoSlider = ({ slides, interval = 4000 }: PromoSliderProps) => {
  const [idx, setIdx] = useState(0)
  const [fade, setFade] = useState<FadeState>("fade-in")
  const timer = useRef<NodeJS.Timeout | null>(null)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    timer.current = setTimeout(() => {
      setFade("fade-out")
      setTimeout(() => {
        setIdx((prev) => (prev + 1) % slides.length)
        setFade("fade-in")
      }, 300)
    }, interval)
    return () => timer.current && clearTimeout(timer.current)
  }, [idx, paused, interval, slides.length])

  const handlePrev = () => {
    setFade("fade-out")
    setTimeout(() => {
      setIdx((prev) => (prev - 1 + slides.length) % slides.length)
      setFade("fade-in")
    }, 300)
  }
  const handleNext = () => {
    setFade("fade-out")
    setTimeout(() => {
      setIdx((prev) => (prev + 1) % slides.length)
      setFade("fade-in")
    }, 300)
  }

  return (
    <div
      className="flex items-center bg-white rounded-xl shadow px-8 py-6 gap-6 w-full max-w-3xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <button onClick={handlePrev} className="text-2xl px-3 py-2 hover:text-blue-600" aria-label="이전 홍보">
        &#8592;
      </button>
      <div className="flex-1 text-center text-xl font-semibold text-gray-800 overflow-hidden h-8 flex items-center justify-center relative">
        <span
          className={`inline-block absolute left-0 right-0 top-0 transition-opacity duration-300 ${
            fade === "fade-in" ? "opacity-100" : "opacity-0"
          }`}
          key={idx}
          style={{ minWidth: 0 }}
        >
          {slides[idx]}
        </span>
      </div>
      <button onClick={handleNext} className="text-2xl px-3 py-2 hover:text-blue-600" aria-label="다음 홍보">
        &#8594;
      </button>
    </div>
  )
}

export default PromoSlider 
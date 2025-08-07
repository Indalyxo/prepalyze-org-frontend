import { useState, useEffect } from 'react'
import "./login-image-section.scss"

const images = [
  '../../assets/banner.jpg',
  '../../assets/banner2.jpg',
  '../../assets/banner3.jpg',
]

export default function LoginImageSection() {
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="image-slider-container">
      <div className="slider-wrapper">
        {images.map((image, index) => (
          <div
            key={index}
            className={`slider-image ${index === currentImage ? 'active' : ''}`}
            style={{
              backgroundImage: `url(${image})`
            }}
          />
        ))}
      </div>
      
      <div className="slide-indicators">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`indicator ${index === currentImage ? 'active' : ''}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      <div className="image-overlay">
        <div className="overlay-content">
          <h2>Join thousands of teams</h2>
          <p>Experience seamless collaboration and boost your productivity with our innovative platform.</p>
        </div>
      </div>
    </div>
  )
}

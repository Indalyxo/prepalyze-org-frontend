import { useState, useEffect } from 'react'
import "./login-image-section.scss"
import image1 from '../../assets/banner.jpg'
import image2 from '../../assets/banner2.jpg'
import image3 from '../../assets/banner3.jpg'

const images = [
  image1,
  image2,
  image3,
]

const slideContent = [
  {
    title: "Conduct Exams with Ease",
    subtitle: "Create and manage online tests effortlessly for your students or employees.",
    features: ["Easy exam creation", "Flexible scheduling", "Question bank support"]
  },
  {
    title: "Empower Student Success",
    subtitle: "Enable learners to take tests anytime, anywhere with a smooth experience.",
    features: ["User-friendly interface", "Timed assessments", "Instant submission"]
  },
  {
    title: "Analyze Results Instantly",
    subtitle: "Track performance and gain insights to improve learning outcomes.",
    features: ["Detailed analytics", "Automated grading", "Performance reports"]
  }
];


export default function LoginImageSection() {
  const [currentImage, setCurrentImage] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let interval
    let progressInterval

    if (isAutoPlaying) {
      // Progress bar animation
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            return 0
          }
          return prev + 2
        })
      }, 100)

      // Slide change
      interval = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % images.length)
        setProgress(0)
      }, 5000)
    }

    return () => {
      clearInterval(interval)
      clearInterval(progressInterval)
    }
  }, [isAutoPlaying])

  const handleIndicatorClick = (index) => {
    setCurrentImage(index)
    setProgress(0)
  }

  const handleMouseEnter = () => {
    setIsAutoPlaying(false)
  }

  const handleMouseLeave = () => {
    setIsAutoPlaying(true)
    setProgress(0)
  }

  return (
    <div 
      className="image-slider-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Animated background particles */}
      <div className="background-particles">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
        <div className="particle particle-5"></div>
        <div className="particle particle-6"></div>
      </div>

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
            onClick={() => handleIndicatorClick(index)}
            className={`indicator ${index === currentImage ? 'active' : ''}`}
            aria-label={`Go to slide ${index + 1}`}
          >
            {index === currentImage && (
              <div 
                className="progress-ring"
                style={{
                  background: `conic-gradient(white ${progress * 3.6}deg, transparent ${progress * 3.6}deg)`
                }}
              />
            )}
          </button>
        ))}
      </div>
            
      <div className="image-overlay">
        <div className="overlay-content">
          <div className="content-wrapper">
            <div className="floating-icon">
              <div className="icon-circle">
                <span className="icon">✨</span>
              </div>
            </div>
            
            <h2 className="slide-title">
              {slideContent[currentImage].title}
            </h2>
            
            <p className="slide-subtitle">
              {slideContent[currentImage].subtitle}
            </p>

            <div className="features-list">
              {slideContent[currentImage].features.map((feature, index) => (
                <div 
                  key={index} 
                  className="feature-item"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="feature-icon">✓</div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="decorative-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
    </div>
  )
}

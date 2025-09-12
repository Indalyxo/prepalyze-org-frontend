import { useState, useEffect, useRef } from "react";
import { Image, Text, Title, Button } from "@mantine/core";
import { gsap } from "gsap";
import styles from "./exam-start-page.module.scss";
import { useLocation, useNavigate } from "react-router-dom";

const motivationalContent = [
  {
    image:
      "https://res.cloudinary.com/diviaanea/image/upload/v1757575038/CM_PUNK_Poster_1_oxct5m.avif",
    quote: "If your dream doesn't scare you, then you need a bigger dream.",
    author: "Phil Brooks",
  },
  {
    image:
      "https://res.cloudinary.com/diviaanea/image/upload/v1757573115/Transform_the_upload_njte5o.avif",
    quote: "Have a dream, hold onto it, and shoot for the sky.",
    author: `"The American Dream" Dusty Rhodes`,
  },
  {
    image:
      "https://res.cloudinary.com/diviaanea/image/upload/v1757576772/APJ_Abdul_Kalam_dtsiaf.avif",
    quote:
      "Man needs difficulties in life because they are necessary to enjoy success.",
    author: `A.P.J. Abdul Kalam`,
  },
  {
    image:
      "https://res.cloudinary.com/diviaanea/image/upload/v1757586235/StanLee_jmregp.avif",
    quote:
      "Don’t just read, experience. Don’t just learn, create.",
    author: `Stan Lee`,
  },
];

export default function ExamPage() {
  const location = useLocation();
  const { examTitle, examId, instruction } = location.state || {};
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const quoteRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      gsap.to(quoteRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => {
          setCurrentIndex((prev) => (prev + 1) % motivationalContent.length);
          gsap.fromTo(
            quoteRef.current,
            { opacity: 0, y: -30 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
          );
        },
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleStartExam = () => {
    navigate(`/exam/${examId}`);
  };

  return (
    <div className={styles.examContainer}>
      {/* Left Section */}
      <div className={styles.leftSection}>
        <Image
          src={motivationalContent[currentIndex].image}
          alt="Motivational"
          className={styles.motivationalImage}
        />

        <div className={styles.carouselContent} ref={quoteRef}>
          <Text className={styles.motivationalQuote}>
            "{motivationalContent[currentIndex].quote}"
          </Text>
          <Text className={styles.motivationalAuthor}>
            - {motivationalContent[currentIndex].author}
          </Text>

          <div className={styles.progressDots}>
            {motivationalContent.map((_, idx) => (
              <span
                key={idx}
                className={`${styles.dot} ${
                  idx === currentIndex ? styles.active : ""
                }`}
              ></span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className={styles.rightSection}>
        <div className={styles.instructionsCard}>
          <Title order={1} className={styles.instructionsTitle}>
            {examTitle}
          </Title>

          <div dangerouslySetInnerHTML={{ __html: instruction }} />

          <Button
            size="xl"
            mt={"xl"}
            className={styles.startButton}
            onClick={handleStartExam}
          >
            Start Exam
          </Button>
        </div>
      </div>
    </div>
  );
}

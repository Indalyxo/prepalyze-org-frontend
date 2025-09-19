import { useRef } from 'react';
import { Container, Title, Text, SimpleGrid, Paper, ThemeIcon, rem } from '@mantine/core';
// --- Import new, more specific icons ---
import {
  IconStethoscope, // For NEET (Medical)
  IconAtom,        // For JEE (Science/Engineering)
  IconBuildingCommunity, // For UPSC (Civil Services)
  IconCertificate, // For GATE (Graduate Level)
} from '@tabler/icons-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import './SupportExams.scss';

// Register the ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);

// --- UPDATED: Data for specific competitive exams ---
const supportedExams = [
  {
    title: 'NEET',
    description: 'Comprehensive mock tests and question banks covering Physics, Chemistry, and Biology.',
    icon: <IconStethoscope size={28} />,
  },
  {
    title: 'JEE',
    description: 'Tackle complex problem-solving with our advanced editor and timed exam simulations.',
    icon: <IconAtom size={28} />,
  },
];

export function SupportedExams() {
  const containerRef = useRef(null);

  // --- GSAP Animation Logic (No changes needed here) ---
  useGSAP(
    () => {
      // Animate the main title and description
      gsap.from(['.section-title', '.section-description'], {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        },
        duration: 0.7,
        y: 60,
        opacity: 0,
        ease: 'power3.out',
        stagger: 0.2,
      });

    },
    { scope: containerRef }
  );

  return (
    <section className="supported-exams-section" ref={containerRef}>
      <Container size="lg">
        {/* --- UPDATED: More specific title --- */}
        <Title order={2} className="section-title" ta="center">
          Comprehensive Support for Major Competitive Exams
        </Title>

        {/* --- UPDATED: More specific description --- */}
        <Text className="section-description" ta="center" mt="md" size="lg" c="dimmed">
          Our platform is finely tuned to handle the unique formats and challenges of exams like NEET, JEE, and more.
        </Text>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: rem(24),
            marginTop: rem(60)
          }}
        >
          {supportedExams.map((exam, index) => (
            <Paper withBorder radius="md" className="exam-card" key={index} style={{ textAlign: 'center', maxWidth: rem(280) }}>
              <ThemeIcon size={60} radius="md" className="exam-card-icon" style={{ margin: '0 auto' }}>
                {exam.icon}
              </ThemeIcon>
              <Title order={4} fw={600} mt="md">
                {exam.title}
              </Title>
              <Text size="sm" mt="sm" c="dimmed">
                {exam.description}
              </Text>
            </Paper>
          ))}
        </div>
      </Container>
    </section>
  );
}
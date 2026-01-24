import React, { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";

import {
  Container,
  Title,
  Text,
  Button,
  Grid,
  Card,
  Group,
  Stack,
  Badge,
  ThemeIcon,
  Divider,
  Box,
  Burger,
  Drawer,
  ScrollArea,
  SimpleGrid,
  Image,
} from "@mantine/core";
import {
  IconFileText,
  IconClipboardCheck,
  IconChartBar,
  IconTrophy,
  IconUsers,
  IconBrain,
  IconShield,
  IconRocket,
  IconSparkles,
  IconDeviceDesktop,
  IconDatabase,
  IconPalette,
  IconLock,
  IconCheck,
  IconX,
  IconMan,
  IconUser,
  IconBuilding,
  IconBuildingSkyscraper,
  IconSchool,
  IconCertificate,
  IconMedicalCross,
  IconScale,
  IconCode,
  IconLanguage,
  IconMath,
  IconAtom,
  IconBusinessplan,
  IconClock,
  IconStar,
  IconMail,
  IconPhone,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import "./landing-page.scss";
import N8nChat from "./N8n/N8nChat";

const appSections = [
  {
    title: "Organization Dashboard",
    description:
      "Comprehensive overview of all your exams, students, and performance metrics in one place",
    image:
      "https://res.cloudinary.com/diviaanea/image/upload/v1757255634/dasboard_cinofn.avif",
    icon: IconDeviceDesktop,
    features: ["Real-time analytics", "Quick actions", "Performance overview"],
  },
  {
    title: "Exam Page",
    description:
      "Create and manage your exams with ease using our intuitive repository interface",
    image:
      "https://res.cloudinary.com/diviaanea/image/upload/v1757255637/utk3d6fa5fzj9ppobuil_q7z8cr.avif",
    icon: IconDatabase,
    features: ["Manage exams", "Schedule Exams", "Online/Offline modes"],
  },
  {
    title: "Exam Builder",
    description:
      "Intuitive interface to create professional exam papers in minutes",
    image:
      "https://res.cloudinary.com/diviaanea/image/upload/v1757255606/create-option_az50j2.avif",
    icon: IconPalette,
    features: ["Single/Multi Subject", "Templates", "Preview mode"],
  },
  {
    title: "Online Exams",
    description:
      "Secure online testing environment with anti-cheating measures and real-time results",
    image:
      "https://res.cloudinary.com/diviaanea/image/upload/v1757255636/exam-interface_x01edq.avif",
    icon: IconLock,
    features: ["Live testing", "Anti-Cheat", "Time management"],
  },
  {
    title: "Group Students",
    description:
      "Easily organize students into groups for targeted exams and performance tracking",
    image:
      "https://res.cloudinary.com/diviaanea/image/upload/v1757255636/group-page_zqqknf.avif",
    icon: IconUsers,
    features: ["Create groups", "Assign exams", "Track performance"],
  },
  {
    title: "Downloadable Questions Editor",
    description:
      "Easily create and edit downloadable question papers with worksheet support",
    image:
      "https://res.cloudinary.com/diviaanea/image/upload/v1757255635/downloa-page_tr9yhj.avif",
    icon: IconClipboardCheck,
    features: ["Worksheet support", "Customization", "Multiple formats"],
  },
  {
    title: "Student Performance Dashboard",
    description:
      "Deep insights into student performance with detailed reports and recommendations",
    image:
      "https://res.cloudinary.com/diviaanea/image/upload/v1757255607/student-dashboard_raqehq.avif",
    icon: IconChartBar,
    features: ["Performance trends", "Comparative analysis", "Custom reports"],
  },
];

export default function PrepalyzeLanding() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  // GSAP refs
  const availableExamsRef = useRef(null);
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % appSections.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // GSAP Animations
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Available Exams section animation
    gsap.fromTo(
      ".exam-card",
      { y: 30, opacity: 0, scale: 0.9 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: availableExamsRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Feature highlight cards animation
    gsap.fromTo(
      ".feature-highlight-card",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".exam-features-grid",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Floating animation for exam icons
    gsap.to(".exam-card .mantine-ThemeIcon-root", {
      y: -5,
      duration: 2,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1,
      stagger: 0.1,
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    closeDrawer();
  };

  // ================= FOOTER CONTACT FORM =================
const contactForm = useForm({
  initialValues: {
    name: "",
    phone: "",
    email: "",
    message: "",
  },
  validate: {
    name: (v) => (v.length < 2 ? "Enter your name" : null),
    phone: (v) =>
      /^\d{10}$/.test(v) ? null : "Enter valid 10-digit phone number",
    email: (v) => (/^\S+@\S+$/.test(v) ? null : "Invalid email"),
    message: (v) =>
      v.length < 10 ? "Message should be at least 10 characters" : null,
  },
});

const handleContactSubmit = async (values) => {
  try {
    const res = await fetch("http://localhost:5000/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const data = await res.json();

    if (data.success) {
      alert("Message sent successfully!");
      contactForm.reset();
    } else {
      alert("Failed to send message");
    }
  } catch (error) {
    console.error(error);
    alert("Server error. Try again later.");
  }
};




  return (
    <Box className="prepalyze-landing">
      {/* Header */}
      <header className="prepalyze-header">
        <Container size="md">
          <Group justify="space-between" align="center">
            <Group align="center" gap="xs">
              <Image
                className="logo"
                src="/Prepalyze-logo.svg"
                alt="Prepalyze Logo"
              />
            </Group>

            {/* Desktop Navigation */}
            <Group gap="xl" visibleFrom="md">
              <Text component="a" href="#home" className="nav-link">
                Home
              </Text>
              <Text component="a" href="#features" className="nav-link">
                Features
              </Text>
              <Text component="a" href="#available-exams" className="nav-link">
                Exams
              </Text>
              <Text component="a" href="#app-showcase" className="nav-link">
                App Showcase
              </Text>
              <Text component="a" href="#pricing" className="nav-link">
                Pricing
              </Text>
            </Group>

            <Group>
              <Button
                onClick={() => handleNavigation("/login")}
                variant="white"
                color="blue"
                size="sm"
                className="login-btn"
                visibleFrom="sm"
              >
                Login
              </Button>

              {/* Mobile Menu Button */}
              <Burger
                opened={drawerOpened}
                onClick={toggleDrawer}
                color="white"
                hiddenFrom="md"
              />
            </Group>
          </Group>
        </Container>

        {/* Mobile Drawer */}
        <Drawer
          opened={drawerOpened}
          onClose={closeDrawer}
          size="300px"
          position="right"
          title={
            <Group align="center" gap="xs">
              <Image
                width={100}
                height={100}
                src="/Prepalyze-logo.svg"
                alt="Prepalyze Logo"
              />
            </Group>
          }
          hiddenFrom="md"
        >
          <ScrollArea>
            <Stack gap={0}>
              <Text
                component="a"
                href="#home"
                className="mobile-menu-item"
                onClick={closeDrawer}
              >
                Home
              </Text>
              <Text
                component="a"
                href="#features"
                className="mobile-menu-item"
                onClick={closeDrawer}
              >
                Features
              </Text>
              <Text
                component="a"
                href="#available-exams"
                className="mobile-menu-item"
                onClick={closeDrawer}
              >
                Exams
              </Text>
              <Text
                component="a"
                href="#app-showcase"
                className="mobile-menu-item"
                onClick={closeDrawer}
              >
                App Showcase
              </Text>
              <Text
                component="a"
                href="#pricing"
                className="mobile-menu-item"
                onClick={closeDrawer}
              >
                Pricing
              </Text>
              <Box p="md">
                <Button
                  onClick={() => handleNavigation("/login")}
                  variant="filled"
                  color="blue"
                  fullWidth
                  size="md"
                >
                  Login
                </Button>
              </Box>
            </Stack>
          </ScrollArea>
        </Drawer>
      </header>

      {/* Hero Section */}
      <section className="prepalyze-hero" id="home">
        <Container size="xl">
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="xl">
                <div>
                  <Title
                    className={`hero-title ${isVisible ? "fade-in" : ""}`}
                    fw={800}
                    c="var(--color-foreground)"
                  >
                    Revolutionize Your{" "}
                    <Text
                      span
                      c="var(--color-primary)"
                      inherit
                      className="gradient-text"
                    >
                      Exam Management
                    </Text>
                  </Title>

                  <Text
                    className={`hero-subtitle ${isVisible ? "fade-in" : ""}`}
                    c="var(--color-muted-foreground)"
                  >
                    Seamless question paper generation, online testing, and
                    comprehensive analytics for students and organizations.
                    Transform how you create, conduct, and analyze exams with
                    AI-powered precision.
                  </Text>
                </div>

                <Group
                  className={`hero-buttons mobile-stack ${
                    isVisible ? "fade-in" : ""
                  }`}
                >
                  <Button
                    size="lg"
                    onClick={() => handleNavigation("/login")}
                    className="pulse-btn responsive-button"
                    leftSection={<IconRocket size={20} />}
                    style={{ background: "var(--color-primary)" }}
                  >
                    Get Started
                  </Button>
                </Group>

                <Group
                  gap="xl"
                  mt="xl"
                  justify={{ base: "center", md: "flex-start" }}
                >
                  <Group gap="xs">
                    <ThemeIcon size="sm" color="green" variant="light">
                      <IconShield size={16} />
                    </ThemeIcon>
                    <Text size="sm" c="var(--color-muted-foreground)" fw={500}>
                      Secure & Reliable
                    </Text>
                  </Group>
                  <Group gap="xs">
                    <ThemeIcon size="sm" color="orange" variant="light">
                      <IconBrain size={16} />
                    </ThemeIcon>
                    <Text size="sm" c="var(--color-muted-foreground)" fw={500}>
                      AI-Powered
                    </Text>
                  </Group>
                </Group>
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Box ta="center">
                <Box className="hero-video">
                  <Stack align="center" gap="md" p="xl">
                    <video
                      src="/prepowl animation.mp4"
                      autoPlay
                      loop
                      muted
                      playsInline
                      style={{ width: "100%", borderRadius: "8px" }}
                    />
                  </Stack>
                </Box>
              </Box>
            </Grid.Col>
          </Grid>
        </Container>
        <N8nChat/>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <Container size="xl">
          <Stack align="center" mb="xl">
            <Badge
              size="lg"
              variant="light"
              color="blue"
              className="badge-responsive"
            >
              Features
            </Badge>
            <Title className="section-title" fw={800}>
              Everything You Need for{" "}
              <Text
                span
                c="var(--color-primary)"
                inherit
                className="gradient-text"
              >
                Exam Success
              </Text>
            </Title>
            <Text
              className="section-subtitle"
              c="var(--color-muted-foreground)"
            >
              Comprehensive tools designed to streamline exam creation,
              delivery, and analysis with cutting-edge technology
            </Text>
          </Stack>

          <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="xl">
            <Card className="feature-card-enhanced" p="xl">
              <ThemeIcon
                size="xl"
                color="blue"
                variant="light"
                mb="md"
                className="feature-icon"
              >
                <IconFileText size={32} />
              </ThemeIcon>
              <Title order={4} mb="sm" fw={700}>
                Question Paper Generation
              </Title>
              <Text c="var(--color-muted-foreground)" size="sm" lh={1.6}>
                Create professional question papers with our AI-powered
                generator. Multiple formats, difficulty levels, and question
                types supported.
              </Text>
            </Card>

            <Card className="feature-card-enhanced" p="xl">
              <ThemeIcon
                size="xl"
                color="green"
                variant="light"
                mb="md"
                className="feature-icon"
              >
                <IconClipboardCheck size={32} />
              </ThemeIcon>
              <Title order={4} mb="sm" fw={700}>
                Online Testing
              </Title>
              <Text c="var(--color-muted-foreground)" size="sm" lh={1.6}>
                Secure, proctored online exams with real-time monitoring.
                Anti-cheating measures and seamless user experience.
              </Text>
            </Card>

            <Card className="feature-card-enhanced" p="xl">
              <ThemeIcon
                size="xl"
                color="orange"
                variant="light"
                mb="md"
                className="feature-icon"
              >
                <IconChartBar size={32} />
              </ThemeIcon>
              <Title order={4} mb="sm" fw={700}>
                Advanced Analytics
              </Title>
              <Text c="var(--color-muted-foreground)" size="sm" lh={1.6}>
                Comprehensive performance analytics with detailed insights.
                Track progress, identify weak areas, and optimize learning.
              </Text>
            </Card>

            <Card className="feature-card-enhanced" p="xl">
              <ThemeIcon
                size="xl"
                color="purple"
                variant="light"
                mb="md"
                className="feature-icon"
              >
                <IconTrophy size={32} />
              </ThemeIcon>
              <Title order={4} mb="sm" fw={700}>
                Results & Reports
              </Title>
              <Text c="var(--color-muted-foreground)" size="sm" lh={1.6}>
                Instant results with detailed performance reports. Automated
                grading and customizable result formats.
              </Text>
            </Card>
          </SimpleGrid>
        </Container>
      </section>

      {/* Available Exams Section */}
      <section
        className="available-exams-section"
        id="available-exams"
        ref={availableExamsRef}
      >
        <Container size="xl">
          <Stack align="center" mb="xl">
            <Badge
              size="lg"
              variant="light"
              color="green"
              className="badge-responsive"
            >
              Available Exams
            </Badge>
            <Title className="section-title" fw={800}>
              Wide Range of{" "}
              <Text
                span
                c="var(--color-primary)"
                inherit
                className="gradient-text"
              >
                Exam Categories
              </Text>
            </Title>
            <Text
              className="section-subtitle"
              c="var(--color-muted-foreground)"
            >
              From competitive exams to academic assessments, we support all
              major exam types with comprehensive question banks
            </Text>
          </Stack>

          {/* Competitive Exams */}
          <div
            style={{
              display: "flex",
              alignItems: "stretch",
              justifyContent: "center",
              gap: "1rem",
              width: "100%",
              maxWidth: "600px", // optional, to control total width
              margin: "0 auto",
            }}
          >
            <Card className="exam-card" p="md" ta="center" style={{ flex: 1 }}>
              <ThemeIcon
                size="lg"
                color="blue"
                variant="light"
                mx="auto"
                mb="sm"
              >
                <IconSchool size={24} />
              </ThemeIcon>
              <Text fw={600} size="sm">
                JEE
              </Text>
              <Text size="xs" c="dimmed">
                Engineering
              </Text>
            </Card>

            <Card className="exam-card" p="md" ta="center" style={{ flex: 1 }}>
              <ThemeIcon
                size="lg"
                color="red"
                variant="light"
                mx="auto"
                mb="sm"
              >
                <IconMedicalCross size={24} />
              </ThemeIcon>
              <Text fw={600} size="sm">
                NEET
              </Text>
              <Text size="xs" c="dimmed">
                Medical
              </Text>
            </Card>
          </div>

          {/* Academic Subjects */}
          {/* <Box mb="xl">
            <Title order={3} mb="lg" ta="center" c="var(--color-foreground)">
              📚 Academic Subjects
            </Title>
            <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing="lg">
              <Card className="exam-card" p="md" ta="center">
                <ThemeIcon
                  size="lg"
                  color="blue"
                  variant="light"
                  mx="auto"
                  mb="sm"
                >
                  <IconMath size={24} />
                </ThemeIcon>
                <Text fw={600} size="sm">
                  Mathematics
                </Text>
                <Text size="xs" c="dimmed">
                  All Levels
                </Text>
              </Card>

              <Card className="exam-card" p="md" ta="center">
                <ThemeIcon
                  size="lg"
                  color="green"
                  variant="light"
                  mx="auto"
                  mb="sm"
                >
                  <IconAtom size={24} />
                </ThemeIcon>
                <Text fw={600} size="sm">
                  Physics
                </Text>
                <Text size="xs" c="dimmed">
                  All Levels
                </Text>
              </Card>

              <Card className="exam-card" p="md" ta="center">
                <ThemeIcon
                  size="lg"
                  color="red"
                  variant="light"
                  mx="auto"
                  mb="sm"
                >
                  <IconAtom size={24} />
                </ThemeIcon>
                <Text fw={600} size="sm">
                  Chemistry
                </Text>
                <Text size="xs" c="dimmed">
                  All Levels
                </Text>
              </Card>

              <Card className="exam-card" p="md" ta="center">
                <ThemeIcon
                  size="lg"
                  color="orange"
                  variant="light"
                  mx="auto"
                  mb="sm"
                >
                  <IconLanguage size={24} />
                </ThemeIcon>
                <Text fw={600} size="sm">
                  English
                </Text>
                <Text size="xs" c="dimmed">
                  Language & Literature
                </Text>
              </Card>

              <Card className="exam-card" p="md" ta="center">
                <ThemeIcon
                  size="lg"
                  color="purple"
                  variant="light"
                  mx="auto"
                  mb="sm"
                >
                  <IconCode size={24} />
                </ThemeIcon>
                <Text fw={600} size="sm">
                  Computer Science
                </Text>
                <Text size="xs" c="dimmed">
                  Programming & Theory
                </Text>
              </Card>
            </SimpleGrid>
          </Box> */}

          {/* Exam Features */}
          <Box className="exam-features-grid">
            <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
              <Card className="feature-highlight-card" p="xl">
                <Group mb="md">
                  <ThemeIcon size="xl" color="blue" variant="light">
                    <IconClock size={32} />
                  </ThemeIcon>
                  <div>
                    <Text fw={700} size="lg">
                      50,000+
                    </Text>
                    <Text c="dimmed" size="sm">
                      Practice Questions
                    </Text>
                  </div>
                </Group>
                <Text c="var(--color-muted-foreground)" size="sm">
                  Extensive question bank covering all major exam patterns and
                  difficulty levels
                </Text>
              </Card>

              <Card className="feature-highlight-card" p="xl">
                <Group mb="md">
                  <ThemeIcon size="xl" color="green" variant="light">
                    <IconStar size={32} />
                  </ThemeIcon>
                  <div>
                    <Text fw={700} size="lg">
                      Real-time
                    </Text>
                    <Text c="dimmed" size="sm">
                      Performance Tracking
                    </Text>
                  </div>
                </Group>
                <Text c="var(--color-muted-foreground)" size="sm">
                  Track your progress across different subjects and identify
                  areas for improvement
                </Text>
              </Card>

              <Card className="feature-highlight-card" p="xl">
                <Group mb="md">
                  <ThemeIcon size="xl" color="orange" variant="light">
                    <IconTrophy size={32} />
                  </ThemeIcon>
                  <div>
                    <Text fw={700} size="lg">
                      Mock Tests
                    </Text>
                    <Text c="dimmed" size="sm">
                      Exam Simulation
                    </Text>
                  </div>
                </Group>
                <Text c="var(--color-muted-foreground)" size="sm">
                  Experience real exam conditions with timed tests and instant
                  detailed analysis
                </Text>
              </Card>
            </SimpleGrid>
          </Box>

          {/* CTA for Exams */}
          <Stack align="center" mt="xl" pt="xl">
            <Text
              size="lg"
              c="var(--color-muted-foreground)"
              ta="center"
              mb="md"
            >
              Don't see your exam? We're constantly adding new categories!
            </Text>
            <Group gap="md">
              <Button
                size="lg"
                onClick={() => navigate("/login")}
                leftSection={<IconRocket size={20} />}
              >
                Explore All Exams
              </Button>
              {/* <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/contact")}
              >
                Request New Exam
              </Button> */}
            </Group>
          </Stack>
        </Container>
      </section>

      {/* App Showcase Section */}
      <section className="showcase-section" id="app-showcase">
        <Container size="xl">
          <Stack align="center" mb="xl">
            <Badge
              size="lg"
              variant="light"
              color="blue"
              className="badge-responsive"
            >
              App Showcase
            </Badge>
            <Title className="section-title" fw={800}>
              Explore Every{" "}
              <Text
                span
                c="var(--color-primary)"
                inherit
                className="gradient-text"
              >
                Feature
              </Text>
            </Title>
            <Text
              className="section-subtitle"
              c="var(--color-muted-foreground)"
            >
              Take a tour through our comprehensive exam management platform
            </Text>
          </Stack>

          <Box className="slider-container">
            <Box
              className="slider-content"
              style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
              {appSections.map((section, index) => {
                const IconComponent = section.icon;
                return (
                  <Box key={index} className="slider-slide">
                    <Box style={{ flex: 1 }}>
                      <Group mb="lg">
                        <ThemeIcon size="xl" color="blue" variant="light">
                          <IconComponent size={32} />
                        </ThemeIcon>
                        <Title order={2} fw={700}>
                          {section.title}
                        </Title>
                      </Group>

                      <Text
                        size="lg"
                        c="var(--color-muted-foreground)"
                        mb="xl"
                        lh={1.6}
                      >
                        {section.description}
                      </Text>

                      <Stack gap="sm">
                        <Text fw={600} size="sm" c="var(--color-foreground)">
                          Key Features:
                        </Text>
                        {section.features.map((feature, featureIndex) => (
                          <Group key={featureIndex} gap="xs">
                            <ThemeIcon size="sm" color="green" variant="light">
                              <IconCheck size={14} />
                            </ThemeIcon>
                            <Text size="sm" c="var(--color-muted-foreground)">
                              {feature}
                            </Text>
                          </Group>
                        ))}
                      </Stack>
                    </Box>

                    <Box style={{ flex: 1 }} ta="center">
                      <Box className="feature-preview">
                        <Stack align="center" gap="md">
                          <img
                            src={section.image}
                            alt={section.title}
                            className="feature-image"
                          />
                          <Text c="#64748b" fw={500}>
                            {section.title} Preview
                          </Text>
                        </Stack>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>

          <Box className="slider-indicators">
            {appSections.map((_, index) => (
              <Box
                key={index}
                className={`slider-indicator ${
                  index === activeSlide ? "active" : ""
                }`}
                onClick={() => setActiveSlide(index)}
              />
            ))}
          </Box>
        </Container>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section" id="pricing">
        <Container size="xl">
          <Stack align="center" mb="xl">
            <Badge
              size="lg"
              variant="light"
              color="green"
              className="badge-responsive"
            >
              Pricing
            </Badge>
            <Title className="section-title" fw={800}>
              Choose Your{" "}
              <Text
                span
                c="var(--color-primary)"
                inherit
                className="gradient-text"
              >
                Perfect Plan
              </Text>
            </Title>
            <Text
              className="section-subtitle"
              c="var(--color-muted-foreground)"
            >
              Flexible pricing options designed to scale with your needs
            </Text>
          </Stack>

          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
            <Card className="pricing-card popular" p="xl" pt="3rem">
              <ThemeIcon
                size="xl"
                color="orange"
                variant="light"
                mx="auto"
                mb="md"
              >
                <IconBuildingSkyscraper size={32} />
              </ThemeIcon>
              <Title order={3} mb="xs" ta="center">
                Basic Plan
              </Title>
              <Text
                size="sm"
                c="var(--color-muted-foreground)"
                mb="md"
                ta="center"
              >
                Best for schools and institutions
              </Text>
              <Box ta="center" mb="md" className="pricing-price">
                ₹8000
                <Text size="lg" span c="var(--color-muted-foreground)" fw={400}>
                  /month
                </Text>
              </Box>
              <Stack gap="sm" mb="xl" className="feature-list">
                <Group gap="xs">
                  <IconCheck size={16} color="var(--color-accent)" />
                  <Text size="sm" c="var(--color-muted-foreground)">
                    Up to 50 students
                  </Text>
                </Group>
                <Group gap="xs">
                  <IconCheck size={16} color="var(--color-accent)" />
                  <Text size="sm" c="var(--color-muted-foreground)">
                    Unlimited exam & question papers
                  </Text>
                </Group>
                <Group gap="xs">
                  <IconCheck size={16} color="var(--color-accent)" />
                  <Text size="sm" c="var(--color-muted-foreground)">
                    Basic analytics
                  </Text>
                </Group>
                <Group gap="xs">
                  <IconCheck size={16} color="var(--color-accent)" />
                  <Text size="sm" c="var(--color-muted-foreground)">
                    Full support
                  </Text>
                </Group>
              </Stack>
              <Button color="blue" fullWidth size="md">
                Most Popular
              </Button>
            </Card>
            <Card className="pricing-card" p="xl" pt="3rem">
              <ThemeIcon
                size="xl"
                color="orange"
                variant="light"
                mx="auto"
                mb="md"
              >
                <IconUser size={32} />
              </ThemeIcon>
              <Title order={3} mb="xs" ta="center">
                Individual Plan
              </Title>
              <Text
                size="sm"
                c="var(--color-muted-foreground)"
                mb="md"
                ta="center"
              >
                Best for personal use
              </Text>
              <Box ta="center" mb="md" className="pricing-price">
                ₹5000
                <Text size="lg" span c="var(--color-muted-foreground)" fw={400}>
                  /month
                </Text>
              </Box>
              <Stack gap="sm" mb="xl" className="feature-list">
                <Group gap="xs">
                  <IconCheck size={16} color="var(--color-accent)" />
                  <Text size="sm" c="var(--color-muted-foreground)">
                    Limited exam & question papers
                  </Text>
                </Group>
                <Group gap="xs">
                  <IconCheck size={16} color="var(--color-accent)" />
                  <Text size="sm" c="var(--color-muted-foreground)">
                    Basic analytics
                  </Text>
                </Group>
                <Group gap="xs">
                  <IconCheck size={16} color="var(--color-accent)" />
                  <Text size="sm" c="var(--color-muted-foreground)">
                    Basic AI features
                  </Text>
                </Group>
              </Stack>
              <Box
                ta="center"
                mb="md"
                className="pricing-price"
                style={{ marginTop: "auto" }}
              >
                Coming Soon...
              </Box>
            </Card>

            {/* Enterprise Plan */}
            <Card className="pricing-card enterprise" p="xl">
              <ThemeIcon
                size="xl"
                variant="light"
                mx="auto"
                mb="md"
                style={{ background: "rgba(255,255,255,0.2)" }}
              >
                <IconSparkles size={32} color="white" />
              </ThemeIcon>
              <Title order={3} mb="xs" c="white" ta="center">
                AI Plan
              </Title>
              <Text
                size="sm"
                mb="md"
                ta="center"
                style={{ color: "rgba(255,255,255,0.8)" }}
              >
                Our flagship plan for advanced AI capabilities
              </Text>
              <Stack gap="sm" mb="xl" className="feature-list">
                <Group gap="xs">
                  <IconCheck size={16} color="white" />
                  <Text size="sm" style={{ color: "rgba(255,255,255,0.9)" }}>
                    Personalized AI assistant
                  </Text>
                </Group>
                <Group gap="xs">
                  <IconCheck size={16} color="white" />
                  <Text size="sm" style={{ color: "rgba(255,255,255,0.9)" }}>
                    Advanced AI based analytics & insights
                  </Text>
                </Group>
                <Group gap="xs">
                  <IconCheck size={16} color="white" />
                  <Text size="sm" style={{ color: "rgba(255,255,255,0.9)" }}>
                    AI Based question paper generation
                  </Text>
                </Group>
                <Group gap="xs">
                  <IconCheck size={16} color="white" />
                  <Text size="sm" style={{ color: "rgba(255,255,255,0.9)" }}>
                    AI based study Plan generation
                  </Text>
                </Group>
              </Stack>
              {/* <Button
                variant="white"
                fullWidth
                size="md"
                style={{ marginTop: "auto" }}
                c="var(--color-primary)"
              >
                Contact Sales
              </Button> */}
              <Box
                ta="center"
                mb="md"
                className="pricing-price"
                style={{ color: "white", marginTop: "auto" }}
              >
                Coming Soon...
              </Box>
            </Card>
            <Card></Card>
          </SimpleGrid>

          {/* <Stack align="center" mt="xl" pt="xl">
            <Group gap="xl">
              <Group gap="xs">
                <IconShield size={20} color="var(--color-accent)" />
                <Text size="sm" c="var(--color-muted-foreground)">
                   
                </Text>
              </Group>
              <Group gap="xs">
                <IconX size={20} color="var(--color-accent)" />
                <Text size="sm" c="var(--color-muted-foreground)">
                  No credit card required
                </Text>
              </Group>
              <Group gap="xs">
                <IconUsers size={20} color="var(--color-accent)" />
                <Text size="sm" c="var(--color-muted-foreground)">
                  Cancel anytime
                </Text>
              </Group>
            </Group>
          </Stack> */}
        </Container>
      </section>

      {/* Stats Section */}
      <section className="stats-section" id="stats">
        <Container size="xl">
          <SimpleGrid cols={{ base: 3, md: 3 }} spacing="xl">
            <Stack align="center" gap="xs" className="stats-grid">
              <Title className="stat-number">99.9%</Title>
              <Text c="var(--color-muted-foreground)" fw={600} size="lg">
                Uptime
              </Text>
            </Stack>
            <Stack align="center" gap="xs" className="stats-grid">
              <Title className="stat-number">24/7</Title>
              <Text c="var(--color-muted-foreground)" fw={600} size="lg">
                Support
              </Text>
            </Stack>
            <Stack align="center" gap="xs" className="stats-grid">
              <Title className="stat-number">50K+</Title>
              <Text c="var(--color-muted-foreground)" fw={600} size="lg">
                Questions
              </Text>
            </Stack>
            {/* <Stack align="center" gap="xs" className="stats-grid">
              <Title className="stat-number">500+</Title>
              <Text c="var(--color-muted-foreground)" fw={600} size="lg">
                Institutions
              </Text>
            </Stack> */}
          </SimpleGrid>
        </Container>
      </section>

      {/* CTA Section */}
      <section
        id="contact"
        style={{
          background: "#3b82f6",
          padding: "6rem 1rem",
        }}
      >
        <Container size="xl">
          <Stack align="center" gap="xl" ta="center">
            <Title
              c="white"
              fw={800}
              style={{ fontSize: "2.5rem", letterSpacing: "-0.5px" }}
            >
              Ready to Transform Your Exam Process?
            </Title>

            <Text
              size="xl"
              c="rgba(255,255,255,0.9)"
              maw={700}
              lh={1.6}
              ta="center"
            >
              Join thousands of educators and students who trust Prepalyze for
              their exam management needs.
            </Text>

            <SimpleGrid
              cols={{ base: 1, md: 2 }}
              spacing="xl"
              w="100%"
              maw={800}
            >
              {/* Email Card */}
              <Card
                p="xl"
                ta="center"
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "1rem",
                  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.25)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 28px rgba(0, 0, 0, 0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 20px rgba(0, 0, 0, 0.25)";
                }}
              >
                <ThemeIcon
                  size="xl"
                  color="white"
                  variant="light"
                  mx="auto"
                  mb="md"
                >
                  <IconMail size={32} />
                </ThemeIcon>
                <Title order={3} mb="sm" c="white">
                  Email Us
                </Title>
                <Text c="rgba(255,255,255,0.8)" mb="md">
                  Get in touch with our team
                </Text>
                <Button
                  component="a"
                  href="mailto:indalyxosolutions@gmail.com"
                  variant="white"
                  c="blue"
                  fullWidth
                  size="md"
                  style={{
                    fontWeight: 600,
                    borderRadius: "0.75rem",
                    transition: "background 0.2s ease, color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#2563eb";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "";
                    e.currentTarget.style.color = "blue";
                  }}
                >
                  indalyxosolutions@gmail.com
                </Button>
              </Card>

              {/* Phone Card */}
              <Card
                p="xl"
                ta="center"
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "1rem",
                  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.25)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 28px rgba(0, 0, 0, 0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 20px rgba(0, 0, 0, 0.25)";
                }}
              >
                <ThemeIcon
                  size="xl"
                  color="white"
                  variant="light"
                  mx="auto"
                  mb="md"
                >
                  <IconPhone size={32} />
                </ThemeIcon>
                <Title order={3} mb="sm" c="white">
                  Call Us
                </Title>
                <Text c="rgba(255,255,255,0.8)" mb="md">
                  Speak directly with our experts
                </Text>
                <Button
                  component="a"
                  href="tel:+919876543210"
                  variant="white"
                  c="blue"
                  fullWidth
                  size="md"
                  style={{
                    fontWeight: 600,
                    borderRadius: "0.75rem",
                    transition: "background 0.2s ease, color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#2563eb";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "";
                    e.currentTarget.style.color = "blue";
                  }}
                >
                  +91 96001 62710
                </Button>
              </Card>
            </SimpleGrid>
          </Stack>
        </Container>
      </section>

      {/* Footer */}
      {/* Footer */}
<footer className="footer">
  <Container size="xl">
    <Grid gutter="xl">
      {/* LEFT – BRAND */}
      <Grid.Col span={{ base: 12, md: 4 }}>
        <Stack gap="md">
          <Image
            src="/Prepalyze-logo.svg"
            alt="Prepalyze Logo"
            width={220}
          />
          <Text size="sm" c="var(--color-muted-foreground)">
            Prepalyze helps institutions create, conduct, and analyze exams
            using AI-powered tools.
          </Text>
        </Stack>
      </Grid.Col>

      {/* CENTER – LINKS */}
      <Grid.Col span={{ base: 12, md: 3 }}>
        <Stack gap="sm">
          <Text fw={600}>Quick Links</Text>
          <Text component="a" href="#features" size="sm">
            Features
          </Text>
          <Text component="a" href="#pricing" size="sm">
            Pricing
          </Text>
          <Text component="a" href="#contact" size="sm">
            Contact
          </Text>
        </Stack>
      </Grid.Col>

      {/* RIGHT – CONTACT FORM */}
      <Grid.Col span={{ base: 12, md: 5 }}>
        <Title order={4} mb="sm">
          Contact Us
        </Title>

        <form onSubmit={contactForm.onSubmit(handleContactSubmit)}>
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <TextInput
              label="Name"
              placeholder="Your name"
              {...contactForm.getInputProps("name")}
            />
            <TextInput
              label="Phone"
              placeholder="10-digit number"
              {...contactForm.getInputProps("phone")}
            />
          </SimpleGrid>

          <TextInput
            mt="sm"
            label="Email"
            placeholder="your@email.com"
            {...contactForm.getInputProps("email")}
          />

          <Textarea
            mt="sm"
            label="Description"
            placeholder="Tell us about your requirement..."
            minRows={3}
            {...contactForm.getInputProps("message")}
          />

          <Button
            type="submit"
            fullWidth
            mt="md"
            leftSection={<IconCheck size={16} />}
          >
            Submit
          </Button>
        </form>
      </Grid.Col>
    </Grid>

    <Divider my="xl" />

    <Group justify="space-between">
      <Text size="sm" c="var(--color-muted-foreground)">
        © 2025 Indalyxo Solutions. All rights reserved.
      </Text>
      <Group gap="md">
        <Text component="a" href="#privacy" size="sm">
          Privacy Policy
        </Text>
        <Text component="a" href="#terms" size="sm">
          Terms of Service
        </Text>
      </Group>
    </Group>
  </Container>
</footer>

    </Box>
  );
}

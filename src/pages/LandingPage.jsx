import React, { useEffect, useState, useRef } from "react";
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
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
  IconPhone,
  IconMail,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import "./landing-page.scss";
import { appSections } from "../constants";
import { SupportedExams } from "./SupportedExams";

export default function PrepalyzeLanding() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  // GSAP refs
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const showcaseRef = useRef(null);
  const pricingRef = useRef(null);
  const statsRef = useRef(null);
  const ctaRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // GSAP Animations
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Header animation
    gsap.fromTo(
      headerRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    );

    // Hero section animation
    const heroTl = gsap.timeline();
    heroTl
      .fromTo(
        ".hero-title",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
      )
      .fromTo(
        ".hero-subtitle",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.5"
      )
      .fromTo(
        ".hero-buttons",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.3"
      )
      .fromTo(
        ".hero-video",
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: "back.out(1.7)" },
        "-=0.5"
      );

    // Features section animation
    gsap.fromTo(
      ".feature-card-enhanced",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: featuresRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Showcase section animation
    gsap.fromTo(
      ".slider-container",
      { x: -100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: showcaseRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Pricing cards animation
    gsap.fromTo(
      ".pricing-card",
      { y: 50, opacity: 0, scale: 0.9 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: pricingRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Stats animation
    gsap.fromTo(
      ".stats-grid",
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // CTA section animation
    gsap.fromTo(
      ctaRef.current,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ctaRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Floating animation for feature icons
    gsap.to(".feature-icon", {
      y: -10,
      duration: 2,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1,
      stagger: 0.2,
    });

    // Pulse animation for CTA buttons
    gsap.to(".pulse-btn", {
      scale: 1.05,
      duration: 1.5,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1,
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  // Auto-rotate slides with GSAP
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => {
        const nextSlide = (prev + 1) % appSections.length;

        // Animate slide transition
        gsap.to(".slider-content", {
          x: `-${nextSlide * 100}%`,
          duration: 0.8,
          ease: "power2.inOut",
        });

        return nextSlide;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    closeDrawer();
  };

  return (
    <Box className="prepalyze-landing">
      {/* Header */}
      <header className="prepalyze-header" ref={headerRef}>
        <Container size="md">
          <Group justify="space-between" align="center">
            <Group align="center" gap="xs">
              <Image
                src="/Prepalyze-logo.svg"
                alt="Prepalyze Logo"
                width={100}
                height={100}
              />
            </Group>

            {/* Desktop Navigation */}
            <Group gap="xl" visibleFrom="md">
              <Text 
                component="a" 
                href="#home" 
                className="nav-link"
                style={{ 
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  fontWeight: 500,
                  color: 'white'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = 'var(--color-primary)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'white';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Home
              </Text>
              <Text 
                component="a" 
                href="#features" 
                className="nav-link"
                style={{ 
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  fontWeight: 500,
                  color: 'white'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = 'var(--color-primary)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'white';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Features
              </Text>
              <Text 
                component="a" 
                href="#app-showcase" 
                className="nav-link"
                style={{ 
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  fontWeight: 500,
                  color: 'white'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = 'var(--color-primary)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'white';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                App Showcase
              </Text>
              <Text 
                component="a" 
                href="#pricing" 
                className="nav-link"
                style={{ 
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  fontWeight: 500,
                  color: 'white'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = 'var(--color-primary)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'white';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
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
                src="/Prepalyze-logo.svg"
                alt="Prepalyze Logo"
                width={100}
                height={100}
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
      <section className="prepalyze-hero" id="home" ref={heroRef}>
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
      </section>

      {/* Features Section */}
      <section className="features-section" id="features" ref={featuresRef}>
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

      <SupportedExams />

      {/* App Showcase Section */}
      <section className="showcase-section" id="app-showcase" ref={showcaseRef}>
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
                onClick={() => {
                  setActiveSlide(index);
                  gsap.to(".slider-content", {
                    x: `-${index * 100}%`,
                    duration: 0.8,
                    ease: "power2.inOut",
                  });
                }}
              />
            ))}
          </Box>
        </Container>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section" id="pricing" ref={pricingRef}>
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
      <section className="stats-section" id="stats" ref={statsRef}>
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
      <section className="cta-section" id="contact" ref={ctaRef}>
        <Container size="xl">
          <Stack align="center" gap="xl" ta="center">
            <Title className="section-title" c="white" fw={800}>
              Ready to Transform Your Exam Process?
            </Title>
            <Text
              size="xl"
              c="rgba(255,255,255,0.9)"
              maw={700}
              lh={1.6}
              ta="center"
            >
              Join us in revolutionizing the future of exam management and
              assessment.
            </Text>
            <Group gap="md" className="mobile-stack">
              {/* Email Button */}
              <Button
                component="a"
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=indalyxosolutions@gmail.com&su=Sales Enquiry`} // <-- Replace with your company email
                size="xl"
                variant="white"
                c="blue"
                className="responsive-button"
                leftSection={<IconMail size={24} />}
              >
                Contact Sales
              </Button>

              {/* Phone Button */}
              <Button
                component="a"
                href="tel:+919387415757"
                size="xl"
                variant="outline"
                color="white"
                className="responsive-button"
                leftSection={<IconPhone size={24} />}
              >
                +91 9387415757
              </Button>
            </Group>
          </Stack>
        </Container>
      </section>

      {/* Footer */}
      <footer className="footer">
        <Container size="xl">
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="md">
                <Group>
                  <img
                    src="/Prepalyze-logo.svg"
                    alt="Prepalyze Logo"
                    width={200}
                    height={100}
                  />
                </Group>
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <SimpleGrid
                cols={{ base: 2, sm: 3 }}
                spacing="xl"
                className="footer-links"
              >
                <Stack gap="sm">
                  <Text fw={600} c="var(--color-foreground)">
                    Product
                  </Text>
                  <Text
                    component="a"
                    href="#features"
                    size="sm"
                    c="var(--color-muted-foreground)"
                    style={{ textDecoration: "none" }}
                  >
                    Features
                  </Text>
                  <Text
                    component="a"
                    href="#pricing"
                    size="sm"
                    c="var(--color-muted-foreground)"
                    style={{ textDecoration: "none" }}
                  >
                    Pricing
                  </Text>
                </Stack>

                <Stack gap="sm">
                  <Text fw={600} c="var(--color-foreground)">
                    Company
                  </Text>
                  <Text
                    component="a"
                    href="#about"
                    size="sm"
                    c="var(--color-muted-foreground)"
                    style={{ textDecoration: "none" }}
                  >
                    About
                  </Text>
                  <Text
                    component="a"
                    href="#careers"
                    size="sm"
                    c="var(--color-muted-foreground)"
                    style={{ textDecoration: "none" }}
                  >
                    Careers
                  </Text>
                  <Text
                    component="a"
                    href="#contact"
                    size="sm"
                    c="var(--color-muted-foreground)"
                    style={{ textDecoration: "none" }}
                  >
                    Contact
                  </Text>
                </Stack>

                <Stack gap="sm">
                  <Text fw={600} c="var(--color-foreground)">
                    Support
                  </Text>
                  <Text
                    component="a"
                    href="#help"
                    size="sm"
                    c="var(--color-muted-foreground)"
                    style={{ textDecoration: "none" }}
                  >
                    Help Center
                  </Text>
                  <Text
                    component="a"
                    href="#docs"
                    size="sm"
                    c="var(--color-muted-foreground)"
                    style={{ textDecoration: "none" }}
                  >
                    Documentation
                  </Text>
                  <Text
                    component="a"
                    href="#status"
                    size="sm"
                    c="var(--color-muted-foreground)"
                    style={{ textDecoration: "none" }}
                  >
                    Status
                  </Text>
                </Stack>
              </SimpleGrid>
            </Grid.Col>
          </Grid>

          <Divider my="xl" />

          <Group justify="space-between" align="center">
            <Text
              component="a"
              href="https://indalyxo.com/"
              target="_blank"
              rel="noopener noreferrer"
              size="sm"
              c="var(--color-muted-foreground)"
              style={{ textDecoration: "none", cursor: "pointer" }}
            >
              © 2025 Indalyxo Solutions. All rights reserved.
            </Text>
            <Group gap="md">
              <Text
                component="a"
                href="#privacy"
                size="sm"
                c="var(--color-muted-foreground)"
                style={{ textDecoration: "none" }}
              >
                Privacy Policy
              </Text>
              <Text
                component="a"
                href="#terms"
                size="sm"
                c="var(--color-muted-foreground)"
                style={{ textDecoration: "none" }}
              >
                Terms of Service
              </Text>
            </Group>
          </Group>
        </Container>
      </footer>
    </Box>
  );
}

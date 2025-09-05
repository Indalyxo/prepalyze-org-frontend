import { useEffect, useRef } from "react";
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
  Anchor,
  Divider,
  Image,
  Box,
  Burger,
  Drawer,
  ScrollArea,
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
  IconBellRinging,
  IconTarget,
  IconMenu2,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PrepalyzeLanding() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const navigate = useNavigate();
  // Simple fade-in animation hook
  const useFadeIn = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    }, []);

    return isVisible;
  };

  const isVisible = useFadeIn();

  const handleNavigation = (path) => {
    navigate(path);
    closeDrawer();
  };

  return (
    <Box>
      <style jsx>{`
        :root {
          --color-primary: #3b82f6;
          --color-accent: #10b981;
          --color-card: #ffffff;
          --color-border: #e5e7eb;
          --color-foreground: #1f2937;
          --color-muted-foreground: #6b7280;
          --color-muted: #f9fafb;
          --color-primary-foreground: #ffffff;
          --radius-lg: 12px;
          --radius-md: 8px;
        }

        .prepalyze-header {
          background: linear-gradient(
            135deg,
            #cdebe1ff 0%,
            var(--color-primary) 100%
          );
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          position: sticky;
          top: 0;
          z-index: 100;
          backdrop-filter: blur(10px);
        }

        .nav-link {
          position: relative;
          transition: all 0.3s ease;
          text-decoration: none;
          color: black;
          font-weight: 500;
          padding: 8px 16px;
          border-radius: 6px;
        }

        .nav-link:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .login-btn {
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
        }

        .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 255, 255, 0.3);
        }

        .prepalyze-hero {
          background: linear-gradient(
            135deg,
            #fff 0%,
            #f4f1f1 50%,
            #6dd4f9 100%
          );
          min-height: 90vh;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
          padding: 2rem 0;
        }

        @media (max-width: 768px) {
          .prepalyze-hero {
            min-height: auto;
            padding: 3rem 0;
          }
        }

        .prepalyze-hero::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(
              circle at 30% 20%,
              rgba(59, 130, 246, 0.1) 0%,
              transparent 50%
            ),
            radial-gradient(
              circle at 70% 80%,
              rgba(16, 185, 129, 0.1) 0%,
              transparent 50%
            );
          pointer-events: none;
        }

        .gradient-text {
          background: linear-gradient(
            135deg,
            var(--color-primary) 0%,
            var(--color-accent) 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .pulse-btn {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
        }

        .feature-card-enhanced {
          background: var(--color-card);
          border: 1px solid var(--color-border);
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
          height: 100%;
        }

        .feature-card-enhanced:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          border-color: var(--color-primary);
        }

        @media (max-width: 768px) {
          .feature-card-enhanced:hover {
            transform: translateY(-4px);
          }
        }

        .feature-icon {
          transition: all 0.3s ease;
        }

        .feature-card-enhanced:hover .feature-icon {
          transform: scale(1.1);
        }

        .hero-video {
          width: 100%;
          max-width: 700px;
          height: auto;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        @media (max-width: 768px) {
          .hero-video {
            max-width: 100%;
            margin-top: 2rem;
          }
        }

        .hero-title {
          font-size: clamp(2rem, 5vw, 4rem);
          line-height: 1.1;
          margin-bottom: 1rem;
          opacity: ${isVisible ? 1 : 0};
          transform: translateY(${isVisible ? 0 : 30}px);
          transition: all 0.8s ease;
        }

        .hero-subtitle {
          font-size: clamp(1rem, 2.5vw, 1.25rem);
          line-height: 1.6;
          margin-bottom: 2rem;
          opacity: ${isVisible ? 1 : 0};
          transform: translateY(${isVisible ? 0 : 20}px);
          transition: all 0.8s ease 0.2s;
        }

        .hero-buttons {
          opacity: ${isVisible ? 1 : 0};
          transform: translateY(${isVisible ? 0 : 20}px);
          transition: all 0.8s ease 0.4s;
        }

        .responsive-button {
          width: 100%;
        }

        @media (min-width: 768px) {
          .responsive-button {
            width: auto;
          }
        }

        .mobile-stack {
          flex-direction: column;
          align-items: stretch;
          gap: 1rem;
        }

        @media (min-width: 768px) {
          .mobile-stack {
            flex-direction: row;
            align-items: center;
            gap: 1rem;
          }
        }

        .stats-grid {
          text-align: center;
        }

        .stat-number {
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: 800;
          color: var(--color-primary);
        }

        .section-title {
          font-size: clamp(2rem, 4vw, 3rem);
          text-align: center;
          margin-bottom: 1rem;
        }

        .section-subtitle {
          font-size: clamp(1rem, 2vw, 1.25rem);
          text-align: center;
          max-width: 700px;
          margin: 0 auto 3rem auto;
          line-height: 1.6;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        @media (min-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 2fr;
          }
        }

        .footer-links {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        @media (min-width: 480px) {
          .footer-links {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .mobile-menu-item {
          padding: 1rem;
          border-bottom: 1px solid #e5e7eb;
          color: var(--color-foreground);
          text-decoration: none;
          color: #374151;
          display: block;
          font-weight: 500;
        }

        .mobile-menu-item:hover {
          background: #f9fafb;
          color: var(--color-primary);
        }

        .badge-responsive {
          font-size: 0.875rem;
          padding: 0.5rem 1rem;
        }

        @media (max-width: 480px) {
          .badge-responsive {
            font-size: 0.75rem;
            padding: 0.375rem 0.75rem;
          }
        }
      `}</style>

      {/* Header */}
      <header className="prepalyze-header">
        <Container size="xl" py="md">
          <Group justify="space-between" align="center">
            <Group align="center" gap="xs">
              <ThemeIcon size="lg" color="blue  " variant="transparent">
                <Image
                  src="/logo.svg"
                  alt="Prepalyze Logo"
                  width={40}
                  height={40}
                />
              </ThemeIcon>
              <Title order={2} c="#3885ef" fw={700} hiddenFrom="xs">
                Prepalyze
              </Title>
              <Title order={2} c="#3885ef" fw={700} visibleFrom="xs">
                Prepalyze
              </Title>
            </Group>

            {/* Desktop Navigation */}
            <Group gap="xl" visibleFrom="md">
              <a href="#home" className="nav-link">
                Home
              </a>
              <a href="#features" className="nav-link">
                Features
              </a>
              <a href="#pricing" className="nav-link">
                Pricing
              </a>
              <a href="#contact" className="nav-link">
                Contact
              </a>
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
            <Group>
              <Image src="/logo.svg" alt="Prepalyze Logo" width={30} />
              <Text fw={700}>Prepalyze</Text>
            </Group>
          }
          hiddenFrom="md"
        >
          <ScrollArea style={{ color: "black" }}>
            <Stack gap={0}>
              <a
                href="#home"
                className="mobile-menu-item"
                onClick={closeDrawer}
              >
                Home
              </a>
              <a
                href="#features"
                className="mobile-menu-item"
                onClick={closeDrawer}
              >
                Features
              </a>
              <a
                href="#pricing"
                className="mobile-menu-item"
                onClick={closeDrawer}
              >
                Pricing
              </a>
              <a
                href="#contact"
                className="mobile-menu-item"
                onClick={closeDrawer}
              >
                Contact
              </a>
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
      <section className="prepalyze-hero">
        <Container size="xl">
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="xl">
                <div>
                  <Title
                    className="hero-title"
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
                    className="hero-subtitle"
                    c="var(--color-muted-foreground)"
                  >
                    Seamless question paper generation, online testing, and
                    comprehensive analytics for students and organizations.
                    Transform how you create, conduct, and analyze exams with
                    AI-powered precision.
                  </Text>
                </div>

                <Group className="hero-buttons mobile-stack">
                  <Button
                    size="lg"
                    onClick={() => handleNavigation("/login")}
                    className="pulse-btn responsive-button"
                    leftSection={<IconRocket size={20} />}
                    style={{ background: "var(--color-primary)" }}
                  >
                    Get Started Free
                  </Button>
                  {/* <Button
                    size="lg"
                    variant="outline"
                    className="responsive-button"
                    leftSection={<IconBellRinging size={20} />}
                    style={{
                      borderColor: "var(--color-primary)",
                      color: "var(--color-primary)",
                    }}
                  >
                    Watch Demo
                  </Button> */}
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
                <video
                  className="hero-video"
                  loop
                  muted
                  autoPlay
                  playsInline
                  poster="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDgwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNGOUZBRkIiLz48Y2lyY2xlIGN4PSI0MDAiIGN5PSIyMDAiIHI9IjgwIiBmaWxsPSIjM0I4MkY2IiBmaWxsLW9wYWNpdHk9IjAuMiIvPjx0ZXh0IHg9IjQwMCIgeT0iMjEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkI3MjgwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiI+SW50ZXJhY3RpdmUgRGVtbzwvdGV4dD48L3N2Zz4="
                >
                  <source src="/prepowl%20animation.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </Box>
            </Grid.Col>
          </Grid>
        </Container>
      </section>

      {/* Features Section */}
      <section style={{ padding: "80px 0", background: "var(--color-muted)" }}>
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

          <Grid>
            <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
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
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
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
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
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
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
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
            </Grid.Col>
          </Grid>
        </Container>
      </section>

      {/* Stats Section */}
      <section style={{ padding: "80px 0" }}>
        <Container size="xl">
          <Grid justify="center" gutter="xl">
            <Grid.Col span={{ base: 6, sm: 4, md: 3 }}>
              <Stack align="center" gap="xs" className="stats-grid">
                <Title className="stat-number">99</Title>
                <Text c="var(--color-muted-foreground)" fw={600} size="lg">
                  % Uptime
                </Text>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 6, sm: 4, md: 3 }}>
              <Stack align="center" gap="xs" className="stats-grid">
                <Title className="stat-number">24/7</Title>
                <Text c="var(--color-muted-foreground)" fw={600} size="lg">
                  Support
                </Text>
              </Stack>
            </Grid.Col>
          </Grid>
        </Container>
      </section>

      {/* CTA Section */}
      <section
        style={{ padding: "80px 0", background: "var(--color-primary)" }}
      >
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
              Join thousands of educators and students who trust Prepalyze for
              their exam management needs.
            </Text>
            <Group gap="md" className="mobile-stack">
              {/* <Button
                size="xl"
                variant="white"
                color="blue"
                className="responsive-button"
                onClick={() => handleNavigation("/signup")}
              >
                Start Free Trial
              </Button> */}
              <Button
                size="xl"
                variant="outline"
                c="white"
                style={{ borderColor: "white" }}
                className="responsive-button"
                onClick={() => handleNavigation("/contact")}
              >
                Contact Sales
              </Button>
            </Group>
          </Stack>
        </Container>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: "60px 0 40px 0",
          background: "var(--color-muted)",
          borderTop: "1px solid var(--color-border)",
        }}
      >
        <Container size="xl">
          <div className="footer-grid">
            <Stack gap="md">
              <Group>
                <Title order={3} c="var(--color-primary)">
                  Prepalyze
                </Title>
              </Group>
              <Text size="sm" c="var(--color-muted-foreground)" maw={400}>
                Revolutionizing exam management with cutting-edge technology and
                user-centric design.
              </Text>
            </Stack>

            <div className="footer-links">
              <Stack gap="sm">
                <Text fw={600} c="var(--color-foreground)">
                  Product
                </Text>
                <a
                  href="#features"
                  style={{
                    color: "var(--color-muted-foreground)",
                    textDecoration: "none",
                    fontSize: "14px",
                  }}
                >
                  Features
                </a>
                <a
                  href="#pricing"
                  style={{
                    color: "var(--color-muted-foreground)",
                    textDecoration: "none",
                    fontSize: "14px",
                  }}
                >
                  Pricing
                </a>
                <a
                  href="#security"
                  style={{
                    color: "var(--color-muted-foreground)",
                    textDecoration: "none",
                    fontSize: "14px",
                  }}
                >
                  Security
                </a>
              </Stack>

              <Stack gap="sm">
                <Text fw={600} c="var(--color-foreground)">
                  Company
                </Text>
                <a
                  href="#about"
                  style={{
                    color: "var(--color-muted-foreground)",
                    textDecoration: "none",
                    fontSize: "14px",
                  }}
                >
                  About
                </a>
                <a
                  href="#careers"
                  style={{
                    color: "var(--color-muted-foreground)",
                    textDecoration: "none",
                    fontSize: "14px",
                  }}
                >
                  Careers
                </a>
                <a
                  href="#contact"
                  style={{
                    color: "var(--color-muted-foreground)",
                    textDecoration: "none",
                    fontSize: "14px",
                  }}
                >
                  Contact
                </a>
              </Stack>

              <Stack gap="sm">
                <Text fw={600} c="var(--color-foreground)">
                  Support
                </Text>
                <a
                  href="#help"
                  style={{
                    color: "var(--color-muted-foreground)",
                    textDecoration: "none",
                    fontSize: "14px",
                  }}
                >
                  Help Center
                </a>
                <a
                  href="#docs"
                  style={{
                    color: "var(--color-muted-foreground)",
                    textDecoration: "none",
                    fontSize: "14px",
                  }}
                >
                  Documentation
                </a>
                <a
                  href="#status"
                  style={{
                    color: "var(--color-muted-foreground)",
                    textDecoration: "none",
                    fontSize: "14px",
                  }}
                >
                  Status
                </a>
              </Stack>
            </div>
          </div>

          <Divider my="xl" />

          <Group
            justify="space-between"
            align="center"
            style={{ flexDirection: "row" }}
          >
            <Text size="sm" c="var(--color-muted-foreground)">
              © 2025 Indalyxo Solutions. All rights reserved.
            </Text>
            <Group
              gap="md"
              style={{ flexWrap: "wrap", justifyContent: "flex-end" }}
            >
              <a
                href="#privacy"
                style={{
                  color: "var(--color-muted-foreground)",
                  textDecoration: "none",
                  fontSize: "14px",
                }}
              >
                Privacy Policy
              </a>
              <a
                href="#terms"
                style={{
                  color: "var(--color-muted-foreground)",
                  textDecoration: "none",
                  fontSize: "14px",
                }}
              >
                Terms of Service
              </a>
            </Group>
          </Group>
        </Container>
      </footer>
    </Box>
  );
}

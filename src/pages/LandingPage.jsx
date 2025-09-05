import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
  IconBellZ,
  IconTarget,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function PrepalyzeLanding() {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  const ctaRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      ".hero-title",
      { opacity: 0, y: 80, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power4.out" }
    )
      .fromTo(
        ".hero-subtitle",
        { opacity: 0, y: 50, x: -30 },
        { opacity: 1, y: 0, x: 0, duration: 1, ease: "power3.out" },
        "-=0.8"
      )
      .fromTo(
        ".hero-buttons",
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.7)" },
        "-=0.6"
      )
      .fromTo(
        ".hero-badges",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" },
        "-=0.4"
      )
      .fromTo(
        ".hero-demo",
        { opacity: 0, scale: 0.8, rotateY: 15 },
        { opacity: 1, scale: 1, rotateY: 0, duration: 1, ease: "power3.out" },
        "-=0.8"
      );

    gsap.fromTo(
      ".feature-card",
      {
        opacity: 0,
        y: 80,
        scale: 0.8,
        rotateX: 15,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".features-section",
          start: "top 75%",
          end: "bottom 25%",
          toggleActions: "play none none reverse",
        },
      }
    );

    gsap.fromTo(
      ".stat-item",
      {
        opacity: 0,
        scale: 0.5,
        y: 50,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "elastic.out(1, 0.5)",
        scrollTrigger: {
          trigger: ".stats-section",
          start: "top 80%",
          onEnter: () => {
            gsap.fromTo(
              ".stat-number",
              { textContent: 0 },
              {
                textContent: (i, el) => el.getAttribute("data-value"),
                duration: 2,
                ease: "power2.out",
                snap: { textContent: 1 },
                stagger: 0.2,
              }
            );
          },
        },
      }
    );

    gsap.to(".hero-demo", {
      y: -10,
      duration: 2,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1,
    });

    gsap.utils.toArray(".parallax-bg").forEach((element) => {
      gsap.fromTo(
        element,
        { y: -50 },
        {
          y: 50,
          ease: "none",
          scrollTrigger: {
            trigger: element,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    });

    gsap.fromTo(
      ".cta-content",
      { opacity: 0, y: 50, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".cta-section",
          start: "top 80%",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div>
      {/* Header */}
      <header className="prepalyze-header">
        <Container size="xl" py="md">
          <Group justify="space-between" align="center">
            <Group>
              <ThemeIcon size="lg" color="white" variant="transparent">
                <Image src={"/logo.svg"} alt="prepalyze-logo" height={40} />
              </ThemeIcon>
              <Title order={2} c="white" fw={700}>
                Prepalyze
              </Title>
            </Group>

            <Group gap="xl" visibleFrom="sm">
              <Anchor href="#home" c="white" fw={500} className="nav-link">
                Home
              </Anchor>
              <Anchor href="#features" c="white" fw={500} className="nav-link">
                Features
              </Anchor>
              <Anchor href="#pricing" c="white" fw={500} className="nav-link">
                Pricing
              </Anchor>
              <Anchor href="#contact" c="white" fw={500} className="nav-link">
                Contact
              </Anchor>
            </Group>

            <Button
              onClick={() => navigate("/login")}
              variant="white"
              color="blue"
              size="sm"
              className="login-btn"
            >
              Login
            </Button>
          </Group>
        </Container>
      </header>

      {/* Hero Section */}
      <section className="prepalyze-hero parallax-bg" ref={heroRef}>
        <Container size="xl">
          <Grid>
            <Grid.Col span={{ base: 12, md: 5 }}>
              <Stack gap="xl">
                <div>
                  <Title
                    className="hero-title"
                    order={1}
                    size="4rem"
                    fw={800}
                    lh={1.1}
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
                    size="xl"
                    c="var(--color-muted-foreground)"
                    mt="md"
                    maw={600}
                    lh={1.6}
                  >
                    Seamless question paper generation, online testing, and
                    comprehensive analytics for students and organizations.
                    Transform how you create, conduct, and analyze exams with
                    AI-powered precision.
                  </Text>
                </div>

                <Group className="hero-buttons" gap="md">
                  <Button
                    size="xl"
                    onClick={() => navigate("/login")}
                    className="prepalyze-btn-primary pulse-btn"
                    leftSection={<IconRocket size={20} />}
                  >
                    Get Started Free
                  </Button>
                  <Button
                    size="xl"
                    variant="outline"
                    className="prepalyze-btn-secondary bg-transparent"
                    leftSection={<IconBellZ size={20} />}
                    disabled={true}
                  >
                    Watch Demo
                  </Button>
                </Group>

                <Group gap="xl" mt="xl" className="hero-badges">
                  <Group gap="xs" className="badge-item">
                    <ThemeIcon
                      size="sm"
                      color="green"
                      variant="light"
                      className="icon-glow"
                    >
                      <IconShield size={16} />
                    </ThemeIcon>
                    <Text size="sm" c="var(--color-muted-foreground)" fw={500}>
                      Secure & Reliable
                    </Text>
                  </Group>
                  {/* <Group gap="xs" className="badge-item">
                    <ThemeIcon size="sm" color="blue" variant="light" className="icon-glow">
                      <IconUsers size={16} />
                    </ThemeIcon>
                    <Text size="sm" c="var(--color-muted-foreground)" fw={500}>
                      10,000+ Users
                    </Text>
                  </Group> */}
                  <Group gap="xs" className="badge-item">
                    <ThemeIcon
                      size="sm"
                      color="orange"
                      variant="light"
                      className="icon-glow"
                    >
                      <IconBrain size={16} />
                    </ThemeIcon>
                    <Text size="sm" c="var(--color-muted-foreground)" fw={500}>
                      AI-Powered
                    </Text>
                  </Group>
                </Group>
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 7 }} className="hero-demo">
              <div className="hero-image">
                <video
                  src="/prepowl animation.mp4"
                  alt="Interactive Demo"
                  width={800}
                  height={400}
                  className="hero-demo-image"
                  loop
                  muted
                  autoPlay
                />
              </div>
            </Grid.Col>
          </Grid>
        </Container>
      </section>

      {/* Features Section */}
      <section
        className="features-section"
        style={{ padding: "100px 0", background: "var(--color-muted)" }}
      >
        <Container size="xl">
          <Stack gap="xl" align="center" mb="xl">
            <Badge
              size="xl"
              variant="light"
              color="blue"
              className="section-badge"
            >
              Features
            </Badge>
            <Title order={2} ta="center" size="3rem" fw={800}>
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
              size="xl"
              ta="center"
              c="var(--color-muted-foreground)"
              maw={700}
              lh={1.6}
            >
              Comprehensive tools designed to streamline exam creation,
              delivery, and analysis with cutting-edge technology
            </Text>
          </Stack>

          <Grid>
            <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
              <Card
                className="feature-card prepalyze-card feature-card-enhanced"
                p="xl"
                h="100%"
              >
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
              <Card
                className="feature-card prepalyze-card feature-card-enhanced"
                p="xl"
                h="100%"
              >
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
              <Card
                className="feature-card prepalyze-card feature-card-enhanced"
                p="xl"
                h="100%"
              >
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
              <Card
                className="feature-card prepalyze-card feature-card-enhanced"
                p="xl"
                h="100%"
              >
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
      <section className="stats-section" style={{ padding: "100px 0" }}>
        <Container size="xl">
          <Grid align="center" justify="center" gutter="xl">
            {/* <Grid.Col span={{ base: 6, sm: 3 }}>
              <Stack className="stat-item" align="center" gap="xs">
                <Title
                  order={1}
                  size="4rem"
                  c="var(--color-primary)"
                  fw={800}
                  className="stat-number"
                  data-value="10000"
                >
                  0
                </Title>
                <Text c="var(--color-muted-foreground)" fw={600} size="lg">
                  Active Users
                </Text>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 6, sm: 3 }}>
              <Stack className="stat-item" align="center" gap="xs">
                <Title
                  order={1}
                  size="4rem"
                  c="var(--color-primary)"
                  fw={800}
                  className="stat-number"
                  data-value="50000"
                >
                  0
                </Title>
                <Text c="var(--color-muted-foreground)" fw={600} size="lg">
                  Exams Created
                </Text>
              </Stack>
            </Grid.Col> */}
            <Grid.Col span={{ base: 6, sm: 3 }}>
              <Stack className="stat-item" align="center" gap="xs">
                <Title
                  order={1}
                  size="4rem"
                  c="var(--color-primary)"
                  fw={800}
                  className="stat-number"
                  data-value="99"
                >
                  0
                </Title>
                <Text c="var(--color-muted-foreground)" fw={600} size="lg">
                  % Uptime
                </Text>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 6, sm: 3 }}>
              <Stack className="stat-item" align="center" gap="xs">
                <Title order={1} size="4rem" c="var(--color-primary)" fw={800}>
                  24/7
                </Title>
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
        ref={ctaRef}
        className="cta-section"
        style={{ padding: "100px 0", background: "var(--color-primary)" }}
      >
        <Container size="xl">
          <Stack align="center" gap="xl" className="cta-content">
            <Title order={2} ta="center" c="white" size="3rem" fw={800}>
              Ready to Transform Your Exam Process?
            </Title>
            <Text
              size="xl"
              ta="center"
              c="rgba(255,255,255,0.9)"
              maw={700}
              lh={1.6}
            >
              Join thousands of educators and students who trust Prepalyze for
              their exam management needs.
            </Text>
            <Group gap="md">
              <Button
                size="xl"
                variant="white"
                color="blue"
                className="cta-btn-primary"
              >
                Start Free Trial
              </Button>
              <Button
                size="xl"
                variant="outline"
                c="white"
                style={{ borderColor: "white" }}
                className="cta-btn-secondary bg-transparent"
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
          padding: "40px 0",
          background: "var(--color-muted)",
          borderTop: "1px solid var(--color-border)",
        }}
      >
        <Container size="xl">
          <Grid>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Stack gap="md">
                <Title order={3} c="var(--color-primary)">
                  Prepalyze
                </Title>
                <Text size="sm" c="var(--color-muted-foreground)">
                  Revolutionizing exam management with cutting-edge technology
                  and user-centric design.
                </Text>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Grid>
                <Grid.Col span={4}>
                  <Stack gap="sm">
                    <Text fw={600} c="var(--color-foreground)">
                      Product
                    </Text>
                    <Anchor
                      href="#"
                      size="sm"
                      c="var(--color-muted-foreground)"
                    >
                      Features
                    </Anchor>
                    <Anchor
                      href="#"
                      size="sm"
                      c="var(--color-muted-foreground)"
                    >
                      Pricing
                    </Anchor>
                    <Anchor
                      href="#"
                      size="sm"
                      c="var(--color-muted-foreground)"
                    >
                      Security
                    </Anchor>
                  </Stack>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Stack gap="sm">
                    <Text fw={600} c="var(--color-foreground)">
                      Company
                    </Text>
                    <Anchor
                      href="#"
                      size="sm"
                      c="var(--color-muted-foreground)"
                    >
                      About
                    </Anchor>
                    <Anchor
                      href="#"
                      size="sm"
                      c="var(--color-muted-foreground)"
                    >
                      Careers
                    </Anchor>
                    <Anchor
                      href="#"
                      size="sm"
                      c="var(--color-muted-foreground)"
                    >
                      Contact
                    </Anchor>
                  </Stack>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Stack gap="sm">
                    <Text fw={600} c="var(--color-foreground)">
                      Support
                    </Text>
                    <Anchor
                      href="#"
                      size="sm"
                      c="var(--color-muted-foreground)"
                    >
                      Help Center
                    </Anchor>
                    <Anchor
                      href="#"
                      size="sm"
                      c="var(--color-muted-foreground)"
                    >
                      Documentation
                    </Anchor>
                    <Anchor
                      href="#"
                      size="sm"
                      c="var(--color-muted-foreground)"
                    >
                      Status
                    </Anchor>
                  </Stack>
                </Grid.Col>
              </Grid>
            </Grid.Col>
          </Grid>

          <Divider my="xl" />

          <Group justify="space-between" align="center">
            <Text size="sm" c="var(--color-muted-foreground)">
              © 2025 Prepalyze. All rights reserved.
            </Text>
            <Group gap="md">
              <Anchor href="#" size="sm" c="var(--color-muted-foreground)">
                Privacy Policy
              </Anchor>
              <Anchor href="#" size="sm" c="var(--color-muted-foreground)">
                Terms of Service
              </Anchor>
            </Group>
          </Group>
        </Container>
      </footer>
    </div>
  );
}

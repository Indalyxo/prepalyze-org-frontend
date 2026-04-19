import React from 'react';
import { 
  Container, 
  Card, 
  Avatar, 
  Text, 
  Title, 
  Group, 
  Stack, 
  Divider, 
  Button,
  Grid,
  Box,
  ThemeIcon,
  Tooltip
} from '@mantine/core';
import { 
  IconUser, 
  IconMail, 
  IconShieldCheck, 
  IconBuildings, 
  IconSettings,
  IconArrowLeft,
  IconExternalLink
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../context/auth-store';
import { motion } from 'framer-motion';
import './profile.scss';

const Profile = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const userName = user?.name || user?.email?.split('@')[0] || "User";
  const userRole = user?.role || "Member";
  const orgName = user?.organization?.name || "Independent";
  const orgLogo = user?.organization?.logo || user?.organization?.logoUrl;

  const initials = userName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="profile-page">
      <Container size="lg" className="profile-container">
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={containerVariants}
        >
          {/* Back Button */}
          <Button 
            variant="subtle" 
            leftSection={<IconArrowLeft size={16} />}
            onClick={() => navigate(-1)}
            mb="xl"
            c="dimmed"
            className="action-btn"
          >
            Back
          </Button>

          {/* Header Section */}
          <Card className="profile-header-card" variants={itemVariants} component={motion.div}>
            <Grid align="center" gutter="xl">
              <Grid.Col span={{ base: 12, md: 'auto' }}>
                <div className="avatar-section">
                  <div className="avatar-glow" />
                  <Avatar 
                    src={orgLogo} 
                    size={120} 
                    radius={120} 
                    className="main-avatar"
                  >
                    {initials}
                  </Avatar>
                </div>
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, md: 'auto' }} style={{ flex: 1 }}>
                <Stack gap={4}>
                  <Group gap="xs">
                    <Title order={1} fw={900} style={{ letterSpacing: '-0.5px' }}>
                      {userName}
                    </Title>
                    {user?.role === 'organizer' && (
                      <Tooltip label="Verified Organizer">
                        <ThemeIcon size="sm" radius="xl" color="blue" variant="light">
                          <IconShieldCheck size={14} />
                        </ThemeIcon>
                      </Tooltip>
                    )}
                  </Group>
                  <Text size="lg" c="dimmed" fw={500}>
                    {user?.email}
                  </Text>
                  
                  <div className="org-badge" style={{ marginTop: '12px' }}>
                    <IconBuildings size={16} color="var(--mantine-color-blue-4)" />
                    <Text size="sm" fw={700} c="blue.4">
                      {orgName}
                    </Text>
                  </div>
                </Stack>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 'auto' }}>
                <Button 
                  leftSection={<IconSettings size={18} />}
                  variant="gradient"
                  gradient={{ from: 'blue', to: 'cyan' }}
                  radius="md"
                  size="md"
                  className="action-btn"
                  onClick={() => navigate(user?.role === 'organizer' ? '/organization/settings' : '/settings')}
                >
                  Edit Profile
                </Button>
              </Grid.Col>
            </Grid>
          </Card>

          {/* Details Section */}
          <Grid gutter="xl">
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Card className="details-card" p="xl" variants={itemVariants} component={motion.div}>
                <Title order={4} mb="xl" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <IconUser size={20} color="var(--mantine-color-blue-5)" />
                  Account Details
                </Title>
                
                <Stack gap="xl">
                  <Grid>
                    <Grid.Col span={6}>
                      <div className="info-group">
                        <Text className="label">Full Name</Text>
                        <Text className="value">{userName}</Text>
                      </div>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <div className="info-group">
                        <Text className="label">Account Role</Text>
                        <Text className="value" style={{ textTransform: 'capitalize' }}>{userRole}</Text>
                      </div>
                    </Grid.Col>
                  </Grid>

                  <Divider variant="dashed" />

                  <Grid>
                    <Grid.Col span={6}>
                      <div className="info-group">
                        <Text className="label">Email Address</Text>
                        <Text className="value">{user?.email}</Text>
                      </div>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <div className="info-group">
                        <Text className="label">Organization ID</Text>
                        <Text className="value" size="xs" style={{ opacity: 0.7 }}>
                          {user?.organization?._id || 'N/A'}
                        </Text>
                      </div>
                    </Grid.Col>
                  </Grid>
                </Stack>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Stack gap="xl">
                <Card className="details-card" p="xl" variants={itemVariants} component={motion.div}>
                  <Title order={4} mb="md" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <IconShieldCheck size={20} color="var(--mantine-color-green-5)" />
                    Security
                  </Title>
                  <Text size="sm" c="dimmed" mb="lg">
                    Manage your security preferences and active sessions.
                  </Text>
                  <Button 
                    variant="light" 
                    fullWidth 
                    className="action-btn"
                    rightSection={<IconExternalLink size={14} />}
                    onClick={() => navigate('/settings')}
                  >
                    Privacy Settings
                  </Button>
                </Card>

                <Card className="details-card" p="xl" variants={itemVariants} component={motion.div} style={{ borderLeft: '4px solid var(--mantine-color-blue-6)' }}>
                  <Title order={4} mb="xs">Need Help?</Title>
                  <Text size="sm" c="dimmed" mb="md">
                    Having trouble with your profile? Our support team is here to help.
                  </Text>
                  <Button 
                    variant="subtle" 
                    fullWidth 
                    c="blue.4"
                    onClick={() => window.location.href = 'mailto:support@prepalyze.com'}
                  >
                    Contact Support
                  </Button>
                </Card>
              </Stack>
            </Grid.Col>
          </Grid>
        </motion.div>
      </Container>
    </div>
  );
};

export default Profile;

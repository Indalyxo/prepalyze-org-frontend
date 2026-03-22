import React, { useState } from 'react';
import { 
  Container, 
  Card, 
  TextInput, 
  Button, 
  Stack, 
  Title, 
  Text, 
  Group, 
  Avatar,
  Divider,
  ActionIcon
} from '@mantine/core';
import { IconArrowLeft, IconDeviceFloppy, IconUser, IconMail, IconPhone, IconLock } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../context/auth-store';
import { toast } from 'sonner';
import './profile.scss';

const ProfileEdit = () => {
  const { user, initializeAuth } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(user?.name || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');

  const handleSave = async () => {
    if (!name.trim()) return toast.error("Name is required");
    
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('prepalyze-accessToken')}`
        },
        body: JSON.stringify({ name, phoneNumber }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update profile");

      toast.success("Profile updated successfully");
      await initializeAuth(); // Refresh user data in store
      navigate('/profile');
    } catch (err) {
      toast.error(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <Container size="sm" className="profile-container">
        <Button 
          variant="subtle" 
          leftSection={<IconArrowLeft size={16} />}
          onClick={() => navigate(-1)}
          mb="xl"
          c="dimmed"
        >
          Back
        </Button>

        <Card withBorder radius="lg" p="xl" className="details-card">
          <Stack gap="xl">
            <Title order={2}>Edit Profile</Title>
            
            <Group gap="lg">
              <Avatar size={80} radius={80} src={user?.organization?.logoUrl}>
                {user?.name?.charAt(0)}
              </Avatar>
              <Stack gap={4}>
                <Text fw={700} size="lg">{user?.name}</Text>
                <Text size="sm" c="dimmed">{user?.email}</Text>
              </Stack>
            </Group>

            <Divider />

            <Stack gap="md">
              <TextInput
                label="Full Name"
                placeholder="Enter your name"
                leftSection={<IconUser size={18} />}
                value={name}
                onChange={(e) => setName(e.target.value)}
                size="md"
                radius="md"
              />

              <TextInput
                label="Phone Number"
                placeholder="Enter phone number"
                leftSection={<IconPhone size={18} />}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                size="md"
                radius="md"
              />

              <TextInput
                label="Email"
                value={user?.email}
                disabled
                leftSection={<IconMail size={18} />}
                size="md"
                radius="md"
                description="Email cannot be changed"
              />
            </Stack>

            <Button
              onClick={handleSave}
              loading={loading}
              leftSection={<IconDeviceFloppy size={18} />}
              size="md"
              radius="md"
              variant="gradient"
              gradient={{ from: 'blue', to: 'cyan' }}
            >
              Save Changes
            </Button>
          </Stack>
        </Card>
      </Container>
    </div>
  );
};

export default ProfileEdit;

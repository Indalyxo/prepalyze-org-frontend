import React from 'react';
import { Paper, Title, Text, Group, SimpleGrid, ThemeIcon } from '@mantine/core';
import { IconClipboardList, IconChecklist, IconCalendarEvent } from '@tabler/icons-react';
import './intellihub-header.scss';

const IntellihubHeader = () => {
  const stats = [
    {
      title: 'Total Tests',
      value: '6', // Based on current data, you can make this dynamic
      description: 'Assessments available',
      icon: <IconClipboardList size={24} />,
      color: 'blue',
    },
    {
      title: 'Tests Completed',
      value: '6', // Based on current data, you can make this dynamic
      description: 'All assigned tests',
      icon: <IconChecklist size={24} />,
      color: 'teal',
    },
    {
      title: 'Upcoming Tests',
      value: '2', // Example value, make dynamic as needed
      description: 'Scheduled for next week',
      icon: <IconCalendarEvent size={24} />,
      color: 'orange',
    },
  ];

  return (
    <div className="dashboard-header-section">
      <Text size="lg" color="dimmed" align="center" mb="xl">
        Track progress and key metrics across all academic assessments.
      </Text>

      <SimpleGrid cols={3} spacing="lg" breakpoints={[{ maxWidth: 'md', cols: 1 }]}>
        {stats.map((stat) => (
          <Paper key={stat.title} shadow="sm" p="md" className="stat-card">
            <Group position="apart" noWrap>
              <div>
                <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
                  {stat.title}
                </Text>
                <Text size="xl" weight={700} mt="xs">
                  {stat.value}
                </Text>
                <Text color="dimmed" size="sm" mt="xs">
                  {stat.description}
                </Text>
              </div>
              <ThemeIcon color={stat.color} variant="light" size="xl" radius="md">
                {stat.icon}
              </ThemeIcon>
            </Group>
          </Paper>
        ))}
      </SimpleGrid>
    </div>
  );
};

export default IntellihubHeader;
import { ActionIcon, useMantineColorScheme, useComputedColorScheme, Tooltip } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';
import classes from './ThemeToggle.module.scss';

export function ThemeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Tooltip label={`Toggle ${computedColorScheme === 'dark' ? 'Light' : 'Dark'} Mode`} withArrow>
      <ActionIcon
        onClick={toggleColorScheme}
        variant="default"
        size="lg"
        aria-label="Toggle color scheme"
      >
        <IconSun className={`${classes.icon} ${classes.light}`} stroke={1.5} />
        <IconMoon className={`${classes.icon} ${classes.dark}`} stroke={1.5} />
      </ActionIcon>
    </Tooltip>
  );
}

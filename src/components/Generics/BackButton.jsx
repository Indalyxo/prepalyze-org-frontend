import { ActionIcon, Text, Tooltip, UnstyledButton } from "@mantine/core";
import { IconArrowBigLeftFilled } from "@tabler/icons-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const BackButton = ({ path = -1 }) => {
  const navigate = useNavigate();
  let replace = false;
  if (path !== -1) replace = true;
  
  return (
    <UnstyledButton
      onClick={() => navigate(path, { replace: replace })}
      aria-label="Go back"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.4rem 0.6rem",
        borderRadius: "8px",
        transition: "background 0.2s ease",
      }}
      className="back-btn"
    >
      <Tooltip label="Go back" position="bottom" withArrow>
        <ActionIcon variant="light" color="blue" size="xl" radius="xl">
          <IconArrowBigLeftFilled size={26} />
        </ActionIcon>
      </Tooltip>
      <Text size="lg" c="dimmed" style={{ fontWeight: 500 }}>
        Back
      </Text>
    </UnstyledButton>
  );
};

export default BackButton;

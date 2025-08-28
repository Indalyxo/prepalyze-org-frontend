import React from "react";
import { TextInput, NumberInput, Textarea, Button, Paper, Title } from "@mantine/core";
import "./Settings.scss";

const Settings = () => {
  return (
    <div className="settings-container">
      <Paper shadow="sm" radius="md" p="xl" withBorder>
        <Title order={2} className="settings-title">
          Organization Settings
        </Title>

        <form className="settings-form">
         

          {/* Detention Max Tabs */}
          <NumberInput
            label="Max Tabs"
            placeholder="Enter max tabs"
            className="settings-field"
          />

          {/* Detention Duration */}
          <NumberInput
            label="Detention Duration (minutes)"
            placeholder="Enter duration"
            className="settings-field"
          />

          {/* Exam Instructions */}
          <Textarea
            label="Exam Instructions"
            placeholder="Enter exam instructions"
            minRows={3}
            className="settings-field"
          />

          <Button type="submit" size="lg" className="settings-button">
            Save Settings
          </Button>

        </form>
      </Paper>
    </div>
  );
};

export default Settings;

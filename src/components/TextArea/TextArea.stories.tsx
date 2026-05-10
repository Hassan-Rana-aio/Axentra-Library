import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { TextArea } from "./TextArea";

export default {
  title: "Axentra/TextArea",
  component: TextArea,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Multi-line text for descriptions, notes, and bios — same label / helper / error pattern as TextField, vertical resize, optional character count when `maxLength` + `showCount`.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    rows: { control: { type: "number", min: 2, max: 16 } },
  },
} satisfies Meta<typeof TextArea>;

type Story = StoryObj<typeof TextArea>;

export const Description: Story = {
  render: function DescriptionStory() {
    const [text, setText] = useState("");
    return (
      <div style={{ width: 400 }}>
        <TextArea
          label="Description"
          name="description"
          placeholder="Describe your project or profile…"
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          helperText="This text may appear publicly on your profile."
          fullWidth
        />
      </div>
    );
  },
};

export const WithCharacterLimit: Story = {
  render: function LimitStory() {
    const [text, setText] = useState("");
    const max = 280;
    return (
      <div style={{ width: 400 }}>
        <TextArea
          label="Bio"
          placeholder={`Up to ${max} characters`}
          rows={4}
          maxLength={max}
          showCount
          value={text}
          onChange={(e) => setText(e.target.value)}
          helperText="Short bio for your public page."
          fullWidth
        />
      </div>
    );
  },
};

export const WithError: Story = {
  args: {
    label: "Description",
    defaultValue: "",
    rows: 4,
    error: "Description must be at least 20 characters.",
    placeholder: "Tell us more…",
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, width: 400 }}>
      <TextArea size="sm" label="Small" rows={3} placeholder="sm" />
      <TextArea size="md" label="Medium (default)" rows={3} placeholder="md" />
      <TextArea size="lg" label="Large" rows={3} placeholder="lg" />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    label: "Notes",
    rows: 3,
    disabled: true,
    defaultValue: "Read-only content.",
    helperText: "Editing is disabled.",
  },
};

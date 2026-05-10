import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../Button/Button";
import { Spinner } from "./Spinner";

export default {
  title: "Axentra/Spinner",
  component: Spinner,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "SVG loading spinner using SMIL rotation (no global CSS). Pass `label` for an accessible busy indicator; omit for decorative inline spinners.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: { control: { type: "number", min: 12, max: 64, step: 2 } },
    duration: { control: "text" },
    color: { control: "color" },
    trackColor: { control: "color" },
  },
} satisfies Meta<typeof Spinner>;

type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  args: {
    size: 32,
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
      <Spinner size={16} />
      <Spinner size={24} />
      <Spinner size={32} />
      <Spinner size={48} />
    </div>
  ),
};

export const CustomColors: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
      <Spinner size={28} color="#2563eb" />
      <Spinner size={28} color="#059669" />
      <Spinner size={28} color="#dc2626" />
      <Spinner size={28} color="#111827" trackColor="#9ca3af" />
    </div>
  ),
};

export const NoTrack: Story = {
  args: {
    size: 36,
    trackColor: "transparent",
    label: "Loading",
  },
};

export const AccessibleBusy: Story = {
  render: () => (
    <div
      style={{
        padding: 24,
        borderRadius: 12,
        border: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        gap: 12,
        fontFamily: "system-ui, sans-serif",
        fontSize: 14,
        color: "#374151",
      }}
    >
      <Spinner size={22} label="Saving your changes" />
      <span>Saving…</span>
    </div>
  ),
};

export const InsideButton: Story = {
  render: function InsideButtonStory() {
    return (
      <Button
        variant="primary"
        disabled
        leftIcon={<Spinner size={16} color="#ffffff" />}
      >
        Loading
      </Button>
    );
  },
};

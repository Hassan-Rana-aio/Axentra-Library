import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../Button/Button";
import { HoverTooltip } from "./HoverTooltip";

export default {
  title: "Axentra/HoverTooltip",
  component: HoverTooltip,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
          padding: 72,
          background: "#f1f5f9",
        }}
      >
        <Story />
      </div>
    ),
  ],
  argTypes: {
    placement: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
    },
    backgroundColor: {
      control: "color",
      description: "Tooltip panel background (default `#1e293b`)",
    },
    color: {
      control: "color",
      description: "Tooltip text color (default `#f8fafc`)",
    },
  },
} satisfies Meta<typeof HoverTooltip>;

type Story = StoryObj<typeof HoverTooltip>;

const trigger = (
  <Button variant="secondary" type="button">
    Hover or focus me
  </Button>
);

export const Default: Story = {
  args: {
    content: "Short helper copy for this control.",
    openDelayMs: 200,
    closeDelayMs: 80,
    placement: "top",
    children: trigger,
  },
};

export const PlacementBottom: Story = {
  args: {
    content: "Opens below the trigger when there is space.",
    placement: "bottom",
    openDelayMs: 150,
    closeDelayMs: 80,
    children: trigger,
  },
};

export const PlacementLeft: Story = {
  args: {
    content: "Opens to the left of the trigger.",
    placement: "left",
    openDelayMs: 150,
    closeDelayMs: 80,
    children: trigger,
  },
};

export const PlacementRight: Story = {
  args: {
    content: "Opens to the right of the trigger.",
    placement: "right",
    openDelayMs: 150,
    closeDelayMs: 80,
    children: (
      <Button variant="ghost" type="button">
        Dense trigger
      </Button>
    ),
  },
};

export const LongText: Story = {
  args: {
    content:
      "Tooltips wrap within maxWidth. If the preferred side does not fit, the tooltip flips to the opposite edge.",
    maxWidth: 240,
    placement: "bottom",
    openDelayMs: 150,
    children: (
      <Button variant="outline" type="button">
        Long explanation
      </Button>
    ),
  },
};

/** Override panel colors via `backgroundColor` and `color` */
export const CustomColors: Story = {
  args: {
    content: "Light tooltip on amber — useful for themes.",
    placement: "top",
    openDelayMs: 100,
    backgroundColor: "#fef3c7",
    color: "#78350f",
    children: (
      <Button variant="secondary" type="button">
        Themed tooltip
      </Button>
    ),
  },
};

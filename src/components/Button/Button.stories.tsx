import type { Meta, StoryObj } from "@storybook/react";
import { ArrowIcon, PlusIcon } from "../../stories/internal/Icons";
import { Button } from "./Button";

// CSF indexer requires `export default { title: "literal", ... }` (not `const meta = …`).
export default {
  /** Stable Storybook URL ids (`{id}--docs`, `{id}--playground`, …). Keeps old `components-button-*` links working. */
  id: "components-button",
  title: "Axentra/Button",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Axentra `Button` — sizes (`sm`–`xl`, default `md`), variants, hover/active feedback, shapes, icons, aur custom colors.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline", "ghost", "danger"],
    },
    shape: {
      control: "select",
      options: ["square", "rounded", "pill", "circle"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
      description: "`md` = default / medium",
    },
    borderRadius: { control: "text" },
    iconOnly: { control: "boolean" },
    backgroundColor: { control: "color" },
    textColor: { control: "color" },
  },
} satisfies Meta<typeof Button>;

type Story = StoryObj<typeof Button>;

/** Interactive — Controls panel se sab props try karo */
export const Playground: Story = {
  args: {
    children: "Button",
    variant: "primary",
    shape: "rounded",
    size: "md",
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium (default)</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra large</Button>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
};

export const Shapes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
      <Button shape="square">Square</Button>
      <Button shape="rounded">Rounded</Button>
      <Button shape="pill">Pill shape</Button>
    </div>
  ),
};

export const CustomRadius: Story = {
  args: {
    children: "Custom radius",
    borderRadius: 16,
    variant: "outline",
  },
};

export const WithIcons: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <Button leftIcon={<PlusIcon />}>Left icon</Button>
      <Button rightIcon={<ArrowIcon />}>Right icon</Button>
      <Button leftIcon={<PlusIcon />} rightIcon={<ArrowIcon />}>
        Both
      </Button>
    </div>
  ),
};

export const IconOnly: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <Button
        aria-label="Add"
        iconOnly
        shape="circle"
        variant="primary"
        leftIcon={<PlusIcon />}
      />
      <Button
        aria-label="Next"
        iconOnly
        shape="rounded"
        variant="outline"
        leftIcon={<ArrowIcon />}
      />
    </div>
  ),
};

export const CustomColors: Story = {
  args: {
    children: "Custom colors",
    variant: "primary",
    backgroundColor: "#0d9488",
    textColor: "#ecfdf5",
    shape: "pill",
  },
};

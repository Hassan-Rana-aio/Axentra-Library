import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./Card";

export default {
  title: "Axentra/Card",
  component: Card,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["surface", "bordered", "elevated"],
    },
    padding: { control: "select", options: ["sm", "md", "lg"] },
    align: { control: "select", options: ["start", "center", "stretch"] },
    columnLayout: {
      control: "select",
      options: ["split", "leftFull", "rightFull"],
    },
  },
} satisfies Meta<typeof Card>;

type Story = StoryObj<typeof Card>;

function DocIcon({ label }: { label: string }) {
  return (
    <span
      style={{
        width: 40,
        height: 40,
        borderRadius: 10,
        background: "#eff6ff",
        color: "#2563eb",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 13,
        fontWeight: 700,
      }}
      aria-hidden
    >
      {label}
    </span>
  );
}

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 18l6-6-6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const LeftRightWithIcons: Story = {
  render: () => (
    <div style={{ width: 420, maxWidth: "100%" }}>
      <Card
        variant="elevated"
        leftIcon={<DocIcon label="UX" />}
        left={
          <div>
            <div style={{ fontWeight: 600, fontSize: 15 }}>Design review</div>
            <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
              Due tomorrow · Team Axentra
            </div>
          </div>
        }
        right={
          <span style={{ fontSize: 14, fontWeight: 600, color: "#059669" }}>
            On track
          </span>
        }
        rightIcon={<ArrowIcon />}
      />
    </div>
  ),
};

export const LeftIconOnly: Story = {
  render: () => (
    <div style={{ width: 400, maxWidth: "100%" }}>
      <Card
        leftIcon={<DocIcon label="★" />}
        left={
          <div>
            <div style={{ fontWeight: 600 }}>Favorite workspace</div>
            <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
              Single column — no right slot.
            </div>
          </div>
        }
      />
    </div>
  ),
};

export const RightMetaAndIcon: Story = {
  render: () => (
    <div style={{ width: 420, maxWidth: "100%" }}>
      <Card
        variant="bordered"
        left={<span style={{ fontWeight: 600 }}>Total</span>}
        right={<span style={{ fontWeight: 700, fontSize: 18 }}>$128.00</span>}
        rightIcon={<ArrowIcon />}
      />
    </div>
  ),
};

/** Full-width row: **left** + **leftIcon** only (ignores right slots). */
export const ColumnLeftFull: Story = {
  render: () => (
    <div style={{ width: 480, maxWidth: "100%" }}>
      <Card
        columnLayout="leftFull"
        variant="elevated"
        leftIcon={<DocIcon label="L" />}
        left={
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Quarterly roadmap</div>
            <div style={{ fontSize: 13, color: "#6b7280", marginTop: 6 }}>
              Planning · Design · Engineering — updated this week
            </div>
          </div>
        }
      />
    </div>
  ),
};

/** Full-width row: **right** + **rightIcon** only, aligned to the end (ignores left slots). */
export const ColumnRightFull: Story = {
  render: () => (
    <div style={{ width: 480, maxWidth: "100%" }}>
      <Card
        columnLayout="rightFull"
        variant="elevated"
        right={
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>$2,450.00</div>
            <div style={{ fontSize: 13, color: "#6b7280", marginTop: 6 }}>
              Invoice #4092 · Due Apr 12
            </div>
          </div>
        }
        rightIcon={<ArrowIcon />}
      />
    </div>
  ),
};

export const ChildrenOnly: Story = {
  args: {
    variant: "bordered",
    padding: "md",
    children: (
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: "#374151" }}>
        When you omit <code>left</code>/<code>right</code> slots, the card renders{" "}
        <code>children</code> only — useful for simple panels or forms.
      </p>
    ),
  },
};

export const Playground: Story = {
  args: {
    variant: "bordered",
    padding: "md",
    align: "center",
    columnLayout: "split",
    left: (
      <div>
        <div style={{ fontWeight: 600 }}>Title</div>
        <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>Subtitle</div>
      </div>
    ),
    right: <span style={{ fontSize: 14 }}>Meta</span>,
  },
};

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import type { SidebarNavItem } from "./Sidebar";
import { Sidebar } from "./Sidebar";

function IconHome() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconFolder() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 7a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconGear() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.61V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.61 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.61-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.61-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H9a1.7 1.7 0 0 0 1-1.61V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.61 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V9c0 .69.39 1.35 1.03 1.77l.09.05a1.7 1.7 0 0 1 0 2.96l-.09.05c-.64.42-1.03 1.08-1.03 1.77Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M10 17v2a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-6a2 2 0 0 0-2 2v2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M15 12H3m3.5-3.5L3 12l3.5 3.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const tree: SidebarNavItem[] = [
  {
    id: "home",
    label: "Home",
    icon: <IconHome />,
  },
  {
    id: "projects",
    label: "Projects",
    icon: <IconFolder />,
    items: [
      { id: "proj-alpha", label: "Alpha" },
      { id: "proj-beta", label: "Beta" },
      {
        id: "proj-archive",
        label: "Archive",
        items: [
          { id: "arc-2024", label: "2024" },
          { id: "arc-2023", label: "2023" },
        ],
      },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    icon: <IconGear />,
    items: [
      { id: "profile", label: "Profile" },
      { id: "billing", label: "Billing" },
    ],
  },
];

export default {
  title: "Axentra/Sidebar",
  component: Sidebar,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  argTypes: {
    sidebarBackgroundColor: { control: "color" },
    tabHoverBackgroundColor: { control: "color" },
    tabActiveBackgroundColor: { control: "color" },
    tabTextColor: { control: "color" },
    tabActiveTextColor: { control: "color" },
    logoutTextColor: { control: "color" },
    logoutHoverBackgroundColor: { control: "color" },
  },
} satisfies Meta<typeof Sidebar>;

type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
  render: function SidebarControlled() {
    const [active, setActive] = useState("proj-alpha");
    return (
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          minHeight: "100vh",
        }}
      >
        <Sidebar
          items={tree}
          activeId={active}
          onSelect={(id) => setActive(id)}
          width={280}
          fullHeight
          fullHeightMode="fill"
          logout={{
            label: "Log out",
            icon: <IconLogout />,
            onClick: () => undefined,
          }}
        />
        <main
          style={{
            flex: 1,
            padding: 24,
            background: "#ffffff",
            color: "#0f172a",
          }}
        >
          <p style={{ margin: 0, fontSize: 14 }}>
            Active route: <strong>{active}</strong>
          </p>
        </main>
      </div>
    );
  },
};

export const DarkRailWithLogout: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        minHeight: "100vh",
        background: "#020617",
      }}
    >
      <Sidebar
        items={tree}
        defaultActiveId="billing"
        fullHeight
        fullHeightMode="fill"
        width={260}
        collapsedWidth={72}
        sidebarBackgroundColor="#0f172a"
        tabBackgroundColor="transparent"
        tabHoverBackgroundColor="#1e293b"
        tabActiveBackgroundColor="#1d4ed8"
        tabTextColor="#e2e8f0"
        tabActiveTextColor="#ffffff"
        accentColor="#475569"
        logout={{
          label: "Log out",
          icon: <IconLogout />,
          onClick: () => undefined,
        }}
        logoutTextColor="#fca5a5"
        logoutHoverBackgroundColor="rgba(239, 68, 68, 0.22)"
        logoutBackgroundColor="transparent"
        collapseTogglePlacement="bottom"
        onSelect={() => undefined}
      />
      <main style={{ flex: 1, padding: 24, color: "#f8fafc" }}>
        Content area — sidebar stays full height beside this panel.
      </main>
    </div>
  ),
};

export const CollapsedRail: Story = {
  render: function CollapsedStory() {
    const [collapsed, setCollapsed] = useState(true);
    return (
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          minHeight: "100vh",
        }}
      >
        <Sidebar
          items={tree}
          defaultActiveId="home"
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          width={260}
          collapsedWidth={72}
          fullHeight
          fullHeightMode="fill"
          logout={{
            label: "Log out",
            icon: <IconLogout />,
            onClick: () => undefined,
          }}
        />
        <main style={{ flex: 1, padding: 24 }}>
          <p style={{ marginTop: 0 }}>Main content.</p>
        </main>
      </div>
    );
  },
};

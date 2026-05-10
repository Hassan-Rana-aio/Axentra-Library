import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { CalendarIcon, LockIcon, MailIcon } from "../icons";
import { TextField } from "./TextField";

export default {
  title: "Axentra/TextField",
  component: TextField,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Labeled text inputs for email, password, and other HTML input types — helper text, validation error, sizes, optional left icon (`startAdornment`; bundled primitives wrap Heroicons from react-icons hi2), and optional password visibility toggle.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    type: {
      control: "select",
      options: ["text", "email", "password", "tel", "url", "search", "number"],
    },
  },
} satisfies Meta<typeof TextField>;

type Story = StoryObj<typeof TextField>;

export const DateOfBirthWithIcon: Story = {
  render: function DobStory() {
    const [value, setValue] = useState("");
    return (
      <div style={{ width: 320 }}>
        <TextField
          label="Date of birth"
          type="date"
          name="dob"
          autoComplete="bday"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          startAdornment={<CalendarIcon />}
          helperText="Uses the native date picker; calendar icon is decorative."
        />
      </div>
    );
  },
};

export const Email: Story = {
  args: {
    label: "Email",
    type: "email",
    name: "email",
    autoComplete: "email",
    placeholder: "you@example.com",
    helperText: "We will never share your email.",
  },
};

export const EmailWithIcon: Story = {
  args: {
    label: "Email",
    type: "email",
    name: "email",
    autoComplete: "email",
    placeholder: "you@example.com",
    startAdornment: <MailIcon />,
    helperText:
      "Icons use `startAdornment` and stay decorative (`aria-hidden` on the SVG).",
  },
};

export const Password: Story = {
  args: {
    label: "Password",
    type: "password",
    name: "password",
    autoComplete: "current-password",
    placeholder: "••••••••",
    helperText: "At least 8 characters.",
  },
};

export const PasswordWithIcon: Story = {
  args: {
    label: "Password",
    type: "password",
    name: "password",
    autoComplete: "current-password",
    placeholder: "••••••••",
    startAdornment: <LockIcon />,
    helperText: "Lock icon on the left; same pattern as email.",
  },
};

export const PasswordWithToggle: Story = {
  render: function PasswordToggleStory() {
    const [value, setValue] = useState("");
    return (
      <div style={{ width: 320 }}>
        <TextField
          label="Password"
          type="password"
          name="password"
          autoComplete="new-password"
          showPasswordToggle
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter password"
          helperText="Toggle visibility with the button."
        />
      </div>
    );
  },
};

export const PasswordWithIconAndToggle: Story = {
  render: function PasswordIconToggleStory() {
    const [value, setValue] = useState("");
    return (
      <div style={{ width: 320 }}>
        <TextField
          label="Password"
          type="password"
          name="password"
          autoComplete="new-password"
          startAdornment={<LockIcon />}
          showPasswordToggle
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter password"
          helperText="Lock icon on the left, show/hide on the right."
        />
      </div>
    );
  },
};

export const WithError: Story = {
  args: {
    label: "Email",
    type: "email",
    defaultValue: "not-an-email",
    error: "Enter a valid email address.",
  },
};

export const Disabled: Story = {
  args: {
    label: "Username",
    disabled: true,
    defaultValue: "locked_user",
    helperText: "Contact support to change this.",
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, width: 320 }}>
      <TextField size="sm" label="Small" placeholder="sm" />
      <TextField size="md" label="Medium (default)" placeholder="md" />
      <TextField size="lg" label="Large" placeholder="lg" />
    </div>
  ),
};

export const PhoneAndUrl: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 320 }}>
      <TextField
        label="Phone"
        type="tel"
        name="phone"
        autoComplete="tel"
        placeholder="+1 …"
      />
      <TextField label="Website" type="url" name="url" placeholder="https://…" />
    </div>
  ),
};

export const LoginFormPreview: Story = {
  render: function LoginPreview() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    return (
      <form
        style={{ width: 320, display: "flex", flexDirection: "column", gap: 16 }}
        onSubmit={(e) => e.preventDefault()}
      >
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          startAdornment={<MailIcon />}
          fullWidth
        />
        <TextField
          label="Password"
          type="password"
          autoComplete="current-password"
          startAdornment={<LockIcon />}
          showPasswordToggle
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          fullWidth
        />
      </form>
    );
  },
};

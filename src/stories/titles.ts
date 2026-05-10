/**
 * Naming reference for the sidebar. Each `*.stories.tsx` must still use the same
 * string as a **literal** in `meta.title` (Storybook does not support dynamic titles).
 */
export const AXENTRA = "Axentra";

export const storyTitle = {
  button: "Axentra/Button",
  card: "Axentra/Card",
  dropdown: "Axentra/Dropdown",
  autoComplete: "Axentra/AutoComplete",
  textField: "Axentra/TextField",
  textArea: "Axentra/TextArea",
  spinner: "Axentra/Spinner",
  sidebar: "Axentra/Sidebar",
} as const;

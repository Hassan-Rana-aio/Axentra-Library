import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "../Button/Button";
import { Dropdown } from "./Dropdown";
import { ChevronIcon } from "../icons/ChevronIcon";

type Fruit = { id: string; label: string; grams: number };

const fruits: Fruit[] = [
  { id: "a", label: "Apple", grams: 100 },
  { id: "b", label: "Banana", grams: 120 },
  { id: "c", label: "Cherry", grams: 8 },
];

export default {
  title: "Axentra/Dropdown",
  component: Dropdown,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Dropdown>;

type Story = StoryObj<typeof Dropdown>;

export const BasicStrings: StoryObj<typeof Dropdown<string>> = {
  render: function BasicStringsStory() {
    const items = ["Option A", "Option B", "Option C"];
    const [index, setIndex] = useState<number | null>(null);
    return (
      <Dropdown<string>
        items={items}
        placeholder="Choose…"
        selectedIndex={index}
        onSelectionChange={(i) => setIndex(i)}
      />
    );
  },
};

export const ObjectsWithLabels: Story = {
  render: function ObjectsStory() {
    const [index, setIndex] = useState<number | null>(null);
    return (
      <Dropdown<Fruit>
        items={fruits}
        getLabel={(f) => f.label}
        getKey={(f) => f.id}
        placeholder="Pick a fruit"
        selectedIndex={index}
        onSelectionChange={(i) => setIndex(i)}
      />
    );
  },
};

export const CustomRows: Story = {
  render: function CustomRowsStory() {
    const [index, setIndex] = useState<number | null>(null);
    return (
      <Dropdown<Fruit>
        items={fruits}
        getKey={(f) => f.id}
        placeholder="Pick a fruit"
        selectedIndex={index}
        onSelectionChange={(i) => setIndex(i)}
        renderItem={(item, _i, { selected }) => (
          <span style={{ fontWeight: selected ? 600 : 400 }}>
            {item.label} <span style={{ opacity: 0.65 }}>({item.grams}g)</span>
          </span>
        )}
      />
    );
  },
};

export const CustomTriggerWithChevron: Story = {
  render: function CustomTriggerStory() {
    const [index, setIndex] = useState<number | null>(null);
    return (
      <Dropdown<Fruit>
        items={fruits}
        getLabel={(f) => f.label}
        getKey={(f) => f.id}
        placeholder="Pick a fruit"
        selectedIndex={index}
        onSelectionChange={(i) => setIndex(i)}
        matchTriggerWidth={false}
        renderTrigger={({
          open,
          toggle,
          selectedItem,
          placeholder,
          disabled,
          triggerId,
          listId,
        }) => (
          <Button
            id={triggerId}
            type="button"
            variant="outline"
            disabled={disabled}
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-controls={listId}
            rightIcon={<ChevronIcon direction={open ? "up" : "down"} />}
            onClick={toggle}
          >
            {selectedItem ? selectedItem.label : placeholder}
          </Button>
        )}
      />
    );
  },
};

export const Theming: Story = {
  render: function ThemingStory() {
    const [index, setIndex] = useState<number | null>(null);
    return (
      <Dropdown<Fruit>
        items={fruits}
        getKey={(f) => f.id}
        getLabel={(f) => f.label}
        placeholder="Dark theme"
        selectedIndex={index}
        onSelectionChange={(i) => setIndex(i)}
        triggerBackgroundColor="#0f172a"
        triggerHoverBackgroundColor="#1e293b"
        triggerTextColor="#f8fafc"
        triggerBorderColor="#334155"
        menuBackgroundColor="#1e293b"
        menuBorderColor="#334155"
        itemTextColor="#f1f5f9"
        itemHoverBackgroundColor="#334155"
        itemSelectedBackgroundColor="#2563eb"
      />
    );
  },
};

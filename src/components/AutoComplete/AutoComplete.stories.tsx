import type { Meta, StoryObj } from "@storybook/react";
import { useMemo, useState } from "react";
import { AutoComplete } from "./AutoComplete";

type Fruit = { id: string; label: string; grams: number };

const fruits: Fruit[] = [
  { id: "a", label: "Apple", grams: 100 },
  { id: "b", label: "Banana", grams: 120 },
  { id: "c", label: "Cherry", grams: 8 },
  { id: "d", label: "Grape", grams: 5 },
  { id: "e", label: "Mango", grams: 200 },
  { id: "f", label: "Orange", grams: 130 },
];

export default {
  title: "Axentra/AutoComplete",
  component: AutoComplete,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof AutoComplete>;

export const StaticFilter: StoryObj<typeof AutoComplete<Fruit>> = {
  render: function StaticFilterStory() {
    const [picked, setPicked] = useState<Fruit | null>(null);
    return (
      <div style={{ width: 360 }}>
        <AutoComplete<Fruit>
          items={fruits}
          minChars={0}
          placeholder="Search fruits…"
          getKey={(f) => f.id}
          getLabel={(f) => f.label}
          helperText={
            picked ? `Selected: ${picked.label}` : "Type to filter, Enter to select"
          }
          onSelect={(item) => setPicked(item)}
          renderItem={(item, _, { active }) => (
            <span style={{ fontWeight: active ? 600 : 400 }}>
              {item.label} <span style={{ opacity: 0.65 }}>({item.grams}g)</span>
            </span>
          )}
        />
      </div>
    );
  },
};

export const AsyncSearch: StoryObj<typeof AutoComplete<Fruit>> = {
  render: function AsyncSearchStory() {
    const [picked, setPicked] = useState<Fruit | null>(null);
    const [calls, setCalls] = useState(0);

    const search = async (q: string) => {
      setCalls((c) => c + 1);
      await new Promise((r) => setTimeout(r, 450));
      const qq = q.trim().toLowerCase();
      return fruits.filter((f) => f.label.toLowerCase().includes(qq));
    };

    const helper = useMemo(() => {
      const sel = picked ? `Selected: ${picked.label}. ` : "";
      return `${sel}Async search with debounce. Calls: ${calls}`;
    }, [calls, picked]);

    return (
      <div style={{ width: 360 }}>
        <AutoComplete<Fruit>
          onSearch={search}
          debounceMs={250}
          minChars={1}
          placeholder="Search (async)…"
          getKey={(f) => f.id}
          getLabel={(f) => f.label}
          helperText={helper}
          onSelect={(item) => setPicked(item)}
        />
      </div>
    );
  },
};

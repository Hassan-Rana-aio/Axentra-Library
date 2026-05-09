# Axentra Library

A React component library for building product UIs: buttons, cards, dropdowns, sidebars, tooltips, and shared icons. Built with **Vite** (ESM + CJS), **TypeScript**, and **Storybook** for live documentation.

## Requirements

- **Node.js** 18+ (recommended)
- **React** and **React DOM** as peer dependencies:

```json
"react": "^18.0.0 || ^19.0.0",
"react-dom": "^18.0.0 || ^19.0.0"
```

## Installation

From npm (after you publish) or from a local path / tarball:

```bash
npm install axentra-library
```

In the consuming app, install peers if they are not already present:

```bash
npm install react react-dom
```

## Usage

The package entry is `axentra-library`. Import components and types from the root:

```tsx
import {
  Button,
  Card,
  Dropdown,
  HoverTooltip,
  Sidebar,
  ChevronIcon,
  AXENTRA_KIT_VERSION,
  type ButtonProps,
  type DropdownProps,
} from "axentra-library";
```

```tsx
import { useState } from "react";
import { Button, HoverTooltip } from "axentra-library";

export function Example() {
  const [open, setOpen] = useState(false);
  return (
    <HoverTooltip content="Saves your work to the server." placement="top">
      <Button type="button" variant="primary" onClick={() => setOpen((o) => !o)}>
        Save
      </Button>
    </HoverTooltip>
  );
}
```

### Runtime version string

`AXENTRA_KIT_VERSION` is exported for logging or about screens. It is defined in `src/index.ts` and should be bumped with package releases.

## Components (overview)

| Export         | Description                                                               |
| -------------- | ------------------------------------------------------------------------- |
| `Button`       | Variants, sizes, shapes, icons; wraps native `<button>` behavior.         |
| `Card`         | Layout presets (`split`, full columns), optional header/footer icons.     |
| `Dropdown`     | Generic list selector with controlled/uncontrolled selection and theming. |
| `HoverTooltip` | Hover/focus tooltip with placement, delays, and portal rendering.         |
| `Sidebar`      | Nested navigation, collapse rail, optional logout row, theming.           |
| `ChevronIcon`  | Small directional chevron for dropdowns and similar UI.                   |

See **Storybook** for interactive props tables and examples (`Axentra/*` stories).

## Development

Clone the repo and install dependencies:

```bash
git clone <your-repo-url>
cd axentra-library
npm install
```

### Scripts

| Script                    | Purpose                                                                              |
| ------------------------- | ------------------------------------------------------------------------------------ |
| `npm run build`           | Production library build → `dist/` (runs before `npm publish` via `prepublishOnly`). |
| `npm run storybook`       | Dev server at [http://localhost:6006](http://localhost:6006).                        |
| `npm run build-storybook` | Static Storybook output → `storybook-static/` (host on any static file server).      |
| `npm run lint`            | ESLint.                                                                              |
| `npm run check`           | Lint + Prettier check.                                                               |

### Project layout

- `src/index.ts` — public API and version export.
- `src/components/` — one folder per component (implementation + stories).
- `dist/` — build output (gitignored); consumers resolve via `package.json` `exports`.

## Publishing for other projects

1. Bump `"version"` in `package.json` (semver).
2. Run `npm run build` (or rely on `prepublishOnly` during publish).
3. Publish to your registry, for example:

```bash
npm publish --access public
```

Use a **scoped name** (e.g. `@your-org/axentra-library`) if the unscoped name is taken on npm.

Other apps install the package by name and import from `axentra-library` as shown above. For local iteration without publishing, use `npm link`, a `file:` dependency, or a monorepo workspace.

## License

Add a `LICENSE` file in this repository when you decide how you want to distribute the library (MIT is common for internal and open-source packages).

# PrintEasy — Print Configuration Interface

> **Frontend Engineering Assessment** — Next.js Logic & State Management

[![Next.js](https://img.shields.io/badge/Next.js-15.3-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![State](https://img.shields.io/badge/State-useReducer%20%2B%20useContext-blue)](https://react.dev/reference/react/useReducer)
[![No Redux](https://img.shields.io/badge/Redux-Banned%20%E2%9C%93-red)](https://redux.js.org)

---

## 🖨 Overview

A single-page **Next.js** print configuration interface where users can apply print settings — **Copies** and **Sides** — either globally to all documents or individually as per-file overrides.

The core engineering challenge is maintaining **property-level override tracking**: global changes must not overwrite local customizations, and the system must validate duplex printing constraints in real time.

---

## ✅ Assignment Compliance

| Requirement | Status | Notes |
|---|---|---|
| Next.js framework | ✅ | v15.3, App Router |
| `useState` only for local UI state | ✅ | modal open/close |
| `useReducer` for app state | ✅ | `printReducer.js` |
| `useContext` for state sharing | ✅ | `PrintContext.jsx` |
| No Redux / Zustand / Recoil | ✅ | Zero external state libs |
| No external validation libraries | ✅ | Pure JS validation |
| `[All]` tab — global config | ✅ | Propagates to non-overridden files |
| `[Files]` tab — per-file override | ✅ | Marks overrides per property |
| **Rule 1** — Property-level overrides | ✅ | `Set` tracking per file |
| **Rule 2** — Duplex validation | ✅ | `(pages × copies) >= 2` |
| Exact error message | ✅ | From spec, in `printUtils.js` |
| Static initial data (File A, B, C) | ✅ | `constants/initialData.js` |
| Mobile responsive | ✅ | Phone-card layout |

---

## 🏗 Architecture

### State Design

```
State {
  globalSettings: { copies: number, sides: "single" | "double" }
  files: File[]
  activeTab: "all" | "files"
  selectedFileId: string
}

File {
  id, name, originalPages   // immutable seed data
  copies, sides             // effective values
  overrides: Set<string>    // tracks which properties have local overrides
  duplexError: boolean      // computed validation flag
}
```

### Rule 1 — Property-Level Overrides

Each file tracks a `Set` of property keys it has locally overridden (e.g., `{ "copies" }`).

When a global change dispatches `SET_GLOBAL_COPIES`, the reducer checks every file:
- `overrides.has("copies")` → **skip** this file (preserve local value)
- Otherwise → apply the new global value

This means you can override only **one** property per file while the other still follows global.

```
File A: overrides = { "copies" }

Global "Sides" → Double  →  File A's sides UPDATES ✓
Global "Copies" → 3      →  File A's copies UNCHANGED ✓
```

### Rule 2 — Duplex Validation

```js
// utils/printUtils.js
export const isDuplexValid = (originalPages, copies) =>
  originalPages * copies >= 2;
```

- Re-evaluated on every relevant state change
- Stores result as `duplexError: boolean` on each file
- Error message is the exact string from the spec
- Error auto-clears when the user resolves the conflict
- The Review button is disabled while any file has a duplex error

---

## 📁 Project Structure

```
PrintEasy/
├── app/
│   ├── layout.js              # Root layout, Inter font, SEO metadata
│   ├── page.js                # Main page: assembles all components
│   └── globals.css            # Full design system (tokens, layout, components)
│
├── components/
│   ├── DocumentPreview.jsx    # [All tab] Stacked papers + document count
│   ├── TabBar.jsx             # All | Files | Pages tab switcher
│   ├── FileList.jsx           # [Files tab] Selectable file cards
│   ├── ConfigPanel.jsx        # Print Type + Copies row | Mode + Sides row
│   ├── ValidationWarning.jsx  # Duplex error banner (exact spec message)
│   ├── BottomBar.jsx          # Options button + Review pill
│   └── ReviewModal.jsx        # Order summary bottom sheet (bonus UX)
│
├── context/
│   └── PrintContext.jsx       # useReducer + useContext state provider
│
├── reducers/
│   └── printReducer.js        # Pure reducer — all state transitions
│
├── hooks/
│   └── usePrintConfig.js      # Ergonomic hook with typed dispatchers
│
├── utils/
│   └── printUtils.js          # isDuplexValid(), DUPLEX_ERROR_MESSAGE
│
└── constants/
    └── initialData.js         # Static file seed data (File A, B, C)
```

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Open in browser
# http://localhost:3000
```

```bash
# Production build
npm run build
npm run start
```

---

## 🧪 Test Scenarios

| # | Action | Expected Result |
|---|---|---|
| 1 | In [All] tab: increase global Copies to 3 | All files show 3 copies |
| 2 | In [Files] tab: set File A copies to 5 | File A shows 5, others unchanged |
| 3 | In [All] tab: change global Copies to 2 | File A stays at 5 (override preserved) |
| 4 | In [All] tab: set Sides to Double | File B (3 pages) updates fine; File A & C (1 page, 1 copy) show error |
| 5 | Set File A copies to 2 | File A's error clears automatically |
| 6 | In [Files] tab: set File A Sides to Single | File A shows Custom badge on Sides |
| 7 | In [All] tab: set Sides to Double again | File A's sides stay Single (override preserved) |
| 8 | With active errors: click Review | Review button is disabled |
| 9 | Resolve all errors: click Review | Review modal opens with order summary |

---

## 🛠 Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 15 (App Router) | Assignment requirement |
| State | `useReducer` + `useContext` | Assignment requirement — no external libs |
| Styling | Vanilla CSS | Maximum control, no framework |
| Font | Inter (Google Fonts) | Clean, modern typography |
| Deployment | Vercel | One-click Next.js deployment |

---

## 💡 Design Decisions

**Why `Set` for overrides?**
A `Set<string>` per file allows O(1) lookup and is semantically correct — it's an unordered collection of overridden property names. Using a boolean per property (e.g., `copiesOverridden: bool`) would work but doesn't scale and is less expressive.

**Why store effective values on each file?**
Storing `copies` and `sides` directly on each file (rather than computing them from global + overrides on every render) makes the reducer logic simpler and components dumb — they just read `file.copies` and `file.sides`.

**Why is `duplexError` stored in state rather than computed?**
Validation runs in the reducer on every relevant dispatch, so the error state is always in sync. Computing it during render would require prop drilling the global settings to every component.

---

*Built with ❤️ for the PrintEasy*

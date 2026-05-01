# AGENTS.md

This file provides guidance to AI coding assistants working on the Living Dex project.

## Project Overview

Living Dex is a web application that serves as a checklist for building a living Pokédex, including HOME-storable alternate forms and variations. It's a React-based single-page application built with TypeScript and Vite.

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Package Manager**: pnpm (required)
- **Linting**: ESLint with TypeScript and React plugins
- **Styling**: CSS files co-located with components

## Development Setup

After cloning the repository:

1. `nvm install` (uses Node version specified in `.nvmrc`)
2. `npm install -g pnpm`
3. `pnpm install`
4. `pnpm dev` to start development server

## Common Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Vite development server |
| `pnpm build` | Build for production (runs `tsc -b && vite build`) |
| `pnpm lint` | Run ESLint on the codebase |
| `pnpm preview` | Preview production build locally |

## Project Structure

```
public/
├── atlas_*.png               # Sprite atlas sheets (10 sheets, 10x15 grid each)
└── data/                     # Pokemon data (YAML files)
    ├── index.yaml            # Search index (all pokemons with section/sub_section info)
    ├── pokemons/             # Individual pokemon detail files (named by uuid)
    │   ├── 1.yaml
    │   ├── 2.yaml
    │   └── ...
    └── sections/             # Section definitions with sub_sections and pokemon lists
        ├── generation-1.yaml
        ├── generation-2.yaml
        ├── ...
        ├── generation-9.yaml
        └── extra-credits.yaml

scripts/
└── migrate_data.py           # Converts old JSON data into YAML data files

src/
├── assets/                   # Static assets
│   └── atlas_sprite_map.json # Sprite atlas coordinate mapping
├── components/               # React components
│   ├── Pokemon.tsx/.css
│   ├── Search.tsx/.css
│   ├── Box.tsx/.css
│   ├── SectionRenderer.tsx   # Renders sections/sub_sections from YAML data
│   ├── InfoModal.tsx/.css
│   ├── Modal.tsx/.css
│   ├── Section.tsx/.css
│   ├── Badge.tsx/.css
│   ├── Save.tsx/.css
│   ├── EmptyCell.tsx
│   └── Instructions.tsx
├── lib/                      # Utility libraries
│   ├── DataLoader.ts         # Types + YAML fetch/cache functions
│   ├── PokemonData.ts        # Game definitions (GAMES map)
│   ├── pokemonSearch.ts      # Fuzzy search over search index
│   ├── typeEffectiveness.ts  # Type chart calculations
│   ├── storage.ts            # Local storage utilities
│   └── useHotkey.ts          # Keyboard shortcut hook
├── App.tsx / App.css         # Main application component
├── main.tsx                  # Entry point
└── index.css                 # Global styles
```

## Code Conventions

- **Component Style**: Each React component has a co-located `.tsx` file and `.css` file with the same name
- **TypeScript**: Strict typing is used; always define proper types/interfaces
- **Imports**: Use absolute imports from `src/` when possible
- **State Management**: Uses React hooks (useState, useEffect, useCallback, etc.) - no external state library
- **No Comments**: Avoid adding code comments unless explicitly requested

## Linting and Type Checking

Always run linting after making changes:

```bash
pnpm lint
```

The project uses ESLint with:
- React Hooks rules
- React Refresh for Vite
- TypeScript strict rules

## Data Files

All Pokemon data is stored in `public/data/` as YAML files, organized into:

- **`public/data/pokemons/`** - Individual pokemon detail files (1,451+ files, named by uuid)
  - Each file contains: `uuid`, `national_id`, `name`, `types`, `image` (atlas coords), `evolutions`
- **`public/data/sections/`** - Section definitions (10 files: gen 1-9 + extra-credits)
  - Each section has: `title`, `tags`, `sub_sections` (each with `title` and `pokemons` list)
- **`public/data/index.yaml`** - Search index with all pokemons for fuzzy search

To regenerate the YAML data from the original JSON source:
```bash
python3 scripts/migrate_data.py
```

This reads `src/assets/atlas_sprite_map.json` and the (now-deleted) `pokemons_data.json`.

## Deployment

The app deploys automatically when pushing to the `main` branch (no additional build step required).

## Notes for AI Assistants

- Never commit changes unless explicitly asked
- Run `pnpm lint` after code changes to verify correctness
- The project uses pnpm, not npm or yarn - always use `pnpm` for package operations
- When adding dependencies, use `pnpm add <package>`
- Keep components functional and use React hooks
- CSS files use standard CSS (no CSS modules or Tailwind)

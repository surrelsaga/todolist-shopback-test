# Stuff To Do (allegedly)

A playful to-do app with categories, due dates and a restorable bin.

**Live demo:** https://surrelsaga.github.io/todolist-shopback-test/

## Project structure

```
├── src/            Source code (React components, logic modules, tests, styles)
├── screenshots/    Screenshots of the app
├── planning.txt    Initial plan: features, data model, build order
├── prompt.md       The initial prompt used to start building the app
└── reflection.md   My reflection on the building process
```

## Running it

Requires Node 18+.

```bash
npm install
npm run dev      # dev server, prints a localhost URL
```

Other scripts:

```bash
npm test         # unit tests (node:test, no framework)
npm run build    # production build into dist/
npm run preview  # serve the production build locally
```

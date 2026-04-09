# INIT - Project Context

## Project Overview
- **Name**: create-webview-cli
- **Type**: CLI (Command Line Interface)
- **Purpose**: Generate Expo WebView projects from a template

## Technology Stack
- Node.js + TypeScript
- commander → CLI structure
- @clack/prompts → Modern prompts
- kleur → Colors
- ora → Spinners/loaders
- figlet → ASCII banners

## Project Structure
```
webview-cli/
├── src/
│   ├── index.ts      → Entrypoint (shebang)
│   ├── cli.ts        → Main CLI logic
│   ├── prompts.ts    → User prompts
│   ├── generator.ts  → Project generation
│   └── utils.ts      → Helpers (banner, logs)
├── templates/
│   └── expo/         → Existing Expo template (DO NOT MODIFY)
├── dist/             → Compiled JS
├── package.json
├── tsconfig.json
└── README.md
```

## CLI Behavior
1. Show ASCII banner: `WebView-CLI` + `jmarquez.dev`
2. Prompt for:
   - App name (default: "My WebView App")
   - Project folder name (auto-generated from app name)
   - Package name (default: "com.company.app")
   - WebView URL (default: "https://example.com")
   - Custom icons? (yes/no)
   - Install dependencies? (yes/no)
   - Package manager (pnpm/npm/yarn)
3. Copy template to new folder
4. Replace placeholders: `__APP_NAME__`, `__PACKAGE_NAME__`, `__WEBVIEW_URL__`
5. Update app.json and package.json
6. Install dependencies with `pnpm install` + `pnpm expo install`

## NPM Publishing Checklist
- [ ] Update package.json name (e.g., "create-webview-cli")
- [ ] Check npm login status: `npm whoami`
- [ ] Verify package: `npm view <package-name>`
- [ ] Build: `pnpm build`
- [ ] Publish: `npm publish --access public` (for scoped packages)
- [ ] Tag version if needed

## Usage After Publish
```bash
pnpm create webview-cli@latest
```

## Local Development
```bash
pnpm build
npm link  # or pnpm link -g
create-webview-cli
```

## Dependencies
Both commands are required:
- `pnpm install` - installs base dependencies
- `pnpm expo install` - installs Expo-specific native dependencies

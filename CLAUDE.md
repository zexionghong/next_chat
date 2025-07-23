# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NextChat is a cross-platform ChatGPT/Claude UI application built with Next.js 14. It supports multiple AI providers (OpenAI, Claude, DeepSeek, Gemini, etc.) and can be deployed as a web app, PWA, or desktop application using Tauri.

## Development Commands

### Essential Commands
- `yarn install` - Install dependencies
- `yarn dev` - Start development server with mask watching
- `yarn build` - Build for production (standalone mode)
- `yarn start` - Start production server on port 13000
- `yarn lint` - Run ESLint
- `yarn test` - Run tests in watch mode
- `yarn test:ci` - Run tests in CI mode

### Mask System
- `yarn mask` - Build prompt masks from `/app/masks/` directory
- `yarn mask:watch` - Watch and rebuild masks automatically

### Export and Desktop App
- `yarn export` - Build static export version
- `yarn export:dev` - Development server for export mode
- `yarn app:build` - Build Tauri desktop application
- `yarn app:dev` - Development server for desktop app

## Architecture

### Core Structure
- **Next.js 14 App Router**: Uses `/app` directory structure
- **State Management**: Zustand stores in `/app/store/`
- **Multi-provider API**: Unified client API in `/app/client/`
- **Component-based UI**: React components in `/app/components/`
- **Mask System**: Dynamic prompt templates in `/app/masks/`

### Key Directories
- `/app/api/` - Next.js API routes for different providers
- `/app/components/` - React UI components with CSS modules
- `/app/store/` - Zustand state management (chat, config, access, etc.)
- `/app/client/platforms/` - API client implementations for different providers
- `/app/config/` - Client and server configuration
- `/app/locales/` - i18n translations
- `/app/utils/` - Utility functions and helpers
- `/app/mcp/` - Model Context Protocol implementation

### State Management
The application uses Zustand with these main stores:
- `useChatStore` - Chat history, messages, sessions
- `useAppConfig` - Application settings and configuration
- `useAccessStore` - Authentication and API key management
- `usePromptStore` - Custom prompts and templates
- `useMaskStore` - Prompt masks (templates)

### API Architecture
- Unified client API abstraction in `/app/client/api.ts`
- Platform-specific implementations in `/app/client/platforms/`
- Next.js API routes handle server-side proxy requests
- Support for streaming responses and real-time features

## Environment Variables

### Required for Development
```bash
# .env.local
OPENAI_API_KEY=your-key-here
# Optional proxy if needed
BASE_URL=https://api.openai.com
```

### MCP (Model Context Protocol)
Set `ENABLE_MCP=true` to enable MCP features during build.

## Testing

- Jest with React Testing Library
- Tests located in `/test/` directory
- Configuration in `jest.config.ts` and `jest.setup.ts`

## Build Configuration

- **Standalone**: Default production build mode
- **Export**: Static site generation for CDN deployment
- **Desktop**: Tauri-based desktop application

## Key Features to Consider

- **Multi-provider Support**: When adding features, consider compatibility across OpenAI, Claude, Google, etc.
- **Internationalization**: All user-facing strings should support i18n
- **Responsive Design**: Components use CSS modules with mobile-first approach
- **Mask System**: Prompt templates are built from TypeScript files and JSON
- **PWA Support**: Service worker and manifest configuration
- **Real-time Features**: WebSocket support for streaming responses
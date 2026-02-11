This document provides context for AI agents working on the AirHive website project.

## Project Overview
This is a standard React application built with Vite, designed to display information about AirHive (presumably a drone or tech company based on the name and folder structure). It is configured for deployment on **Vercel**.

## Tech Stack
- **Framework:** React 19
- **Build Tool:** Vite
- **Styling:** Tailwind CSS 4, DaisyUI, PostCSS
- **Routing:** React Router DOM 6
- **Internationalization:** i18next, react-i18next (English & Spanish)
- **Maps:** Leaflet, React-Leaflet
- **Animations:** Framer Motion
- **Icons:** React Icons, Lucide React
- **Carousel:** Slick Carousel
- **Linting:** ESLint
- **Deployment:** Vercel

## Project Structure
The source code is located in `airhive-website/src`.

```
src/
├── Components/    # Reusable UI components
├── MainLayout/    # Layout components (MainLayout.jsx)
├── Pages/         # Page components (Home, About, etc.)
├── assets/        # Static assets (images, fonts)
├── locales/       # Translation files (en, es)
├── main.jsx       # Entry point
└── i18n.js        # Internationalization configuration
```

Configuration files:
- `vercel.json`: Handles SPA routing for Vercel.


## Key Components
- **MainLayout:** Wraps the application content. Handles the Router, Navbar, Footer, and global providers/styles.
- **Navbar/Footer:** Persistent navigation and footer elements.
- **ScrollToTop:** Utility to scroll to the top on route change.

## Routing
Defined in `src/MainLayout/MainLayout.jsx`.

| Path        | Component | Description        |
|:------------|:----------|:-------------------|
| `/`         | Home      | Landing page       |
| `/about`    | About     | Company info       |
| `/products` | Products  | Product catalog    |
| `/services` | Services  | Services offered   |
| `/contact`  | Contact   | Contact form/info  |
| `*`         | Error     | 404 Not Found      |

## Internationalization (i18n)
- Configured in `src/i18n.js`.
- Supported languages: English (`en`), Spanish (`es`).
- Fallback language: Spanish (`es`).
- Translations are stored in `src/locales/{lang}/translation.json`.

## Development Commands
- `npm run dev`: Start development server (using Vite).
- `npm run build`: Build for production.
- `npm run preview`: Preview production build.
- `npm run lint`: Run ESLint.

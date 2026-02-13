# AirHive Website - Project Context for Agents

## Project Overview
This project is the official website for **AirHive**, a drone services and products company. It showcases their catalog (drones, batteries, kits), services (consulting, training, events), and company information.

## Technology Stack
- **Framework**: React 19 + Vite
- **Styling**: TailwindCSS v4 + DaisyUI
- **Animations**: Framer Motion
- **Maps**: Leaflet / React-Leaflet
- **Icons**: Lucide React, React Icons
- **Internationalization**: i18next (English/Spanish support implied by structure)
- **Routing**: React Router DOM v6
- **Deployment**: Vercel (inferred from `vercel.json`)

## Project Structure
- `src/Components`: Reusable UI components (Navbar, Footer, VideoSlider, ScrollToTop, etc.).
- `src/MainLayout`: Contains `MainLayout.jsx` which defines the app shell and routing configuration.
- `src/Pages`: Page-level components matching the routes.
  - `Home`: Landing page with Hero, features, and video slider.
  - `About`: Company information.
  - `Products`: Catalog of drones and accessories.
  - `Services`: Details on consulting and other services.
  - `Contact`: Contact form and info.
  - `Error`: 404/Error handling page.
- `public`: Static assets (images, logos).

## Routing
Defined in `src/MainLayout/MainLayout.jsx`:
- `/` -> `Home`
- `/about` -> `About`
- `/products` -> `Products`
- `/services` -> `Services`
- `/contact` -> `Contact`
- `*` -> `Error` (404)

## Key Features detected
- **Responsive Design**: Uses Tailwind's responsive classes.
- **Scroll to Top**: Dedicated component to handle scroll behavior on navigation.
- **Video Integration**: `VideoSlider` component for media showcases.

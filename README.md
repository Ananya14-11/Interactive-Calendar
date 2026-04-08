# Interactive Calendar 🗓️

A visually immersive, physical-notebook style calendar built with **Next.js 14**, **Tailwind CSS**, and **TypeScript**. This project blends a tactile "skeuomorphic" design with modern functional features like range selection and persistent journaling.

## 🌟 Key Features

* **Tactile Notebook Design:** A custom-engineered spiral coil header using advanced CSS (`clipPath`, `linear-gradient`) and stacked paper layers to mimic a real desk calendar.
* **Dynamic Monthly Themes:** 12 unique seasonal themes (e.g., "Winter Solstice" to "Deep Winter") that update the UI color palette and hero imagery automatically.
* **Indian Public Holidays:** Built-in holiday tracker for 2025 and 2026, featuring specific markers for cultural observances like Diwali, Holi, and Republic Day.
* **Smart Notes System:** A side-integrated `NotesPanel` that allows users to save thoughts for specific dates, persisted locally via `localStorage`.
* **Range Selection:** Intuitive date-clicking logic that allows users to define a start and end range for planning.
* **Responsive Layout:** A fluid design that shifts from a side-by-side view on desktops to a stacked "flip-calendar" view on mobile devices.

## 🛠️ Tech Stack

* **Framework:** Next.js 14 (App Router)
* **Styling:** Tailwind CSS
* **State Management:** React Hooks (`useState`, `useEffect`)
* **Persistence:** Browser LocalStorage API
* **Type Safety:** TypeScript

## 🚀 Getting Started

### Prerequisites
* Node.js 18.x or later
* npm / yarn / pnpm

### Installation & Run
1. **Clone the repo:**
   ```bash
   git clone https://github.com/Ananya14-11/Interactive-Calendar.git

2. **Install dependencies:**
    ```bash
    npm install

3. **Launch development server:**
    ```bash
    npm run dev

4. **View the app:**           
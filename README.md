![image](https://github.com/user-attachments/assets/a664f263-fc95-4fbe-b7dc-850c3fd5a801)

A geography quiz application that uses a 3D globe to challenge users with geography-based questions about countries and locations around the world.

## Overview

Where On Earth is an interactive web application built with React, TypeScript, and Three.js that combines geography education with an engaging 3D visualization. The app features a responsive interface with:

- An interactive 3D globe rendered using React Three Fiber
- Geography quiz questions about countries and locations
- GeoJSON layer for displaying geographic data
- Responsive layout with question panel and globe view

## Technologies Used

- React 19 - UI framework
- TypeScript - Type safety
- Vite - Fast build tool and development server
- Three.js - 3D rendering engine
- React Three Fiber - React renderer for Three.js
- React Three Drei - Useful helpers for React Three Fiber

## Project Structure

- public - Static assets including Earth textures and geographic data
- src - Source code
  - `/components` - React components including Earth, Globe, GeoJsonLayer, and Questions
  - `/utils` - Utility functions for handling geographic data

## Setup and Running

1. Clone the repository
2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm run dev
```

4. Build for production

```bash
npm run build
```

## Features

- **Interactive 3D Globe**: Rotate, zoom, and explore the Earth in your browser
- **Geography Quizzes**: Test your knowledge of world geography
- **Responsive Design**: Works on both desktop and mobile devices
- **Educational Content**: Learn about countries and locations around the world

## Future Development

- Add more question types and difficulty levels
- Implement scoring system and achievements
- Add animations for correct/incorrect answers
- Support for different map projections

## License

This project is licensed under the MIT License

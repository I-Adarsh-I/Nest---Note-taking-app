# Nest - Note-Taking App

Nest is a powerful and intuitive note-taking application built using **Next.js**, **Convex**, **Clerk** and **Edge Store** for seamless file storage. The app allows users to create, manage, and store their notes efficiently with a modern and user-friendly interface.

## Features

- **Fast & Responsive UI**: Built with Next.js for a smooth experience.
- **Realtime Sync**: Data is managed and updated in real-time using Convex.
- **Secure File Storage**: Edge Store ensures safe and efficient file management.
- **Organized Note Management**: Create, edit, delete, and organize notes effortlessly.
- **Authentication & Login**: Secure authentication using Clerk.
- **Ask AI**: An AI-powered interface to help users resolve their queries.

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/)
- **Backend/Database**: [Convex](https://convex.dev/)
- **File Storage**: [Edge Store](https://edgestore.dev/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Styling**: Tailwind CSS

## Folder Structure - 
```
📦 nest-note-app
├── 📂 convex                 # Convex backend logic
│   ├── 📂 _generated        # Auto-generated Convex files
│   ├── 📄 auth.config.ts    # Authentication configuration
│   ├── 📄 documents.ts      # Document-related Convex functions
│   ├── 📄 messages.ts       # Message handling in Convex
│   ├── 📄 schema.ts         # Database schema definition
├── 📂 public                 # Public assets (images, icons, etc.)
├── 📂 src                    # Source code directory
│   ├── 📂 app               # Main application pages
│   │   ├── 📂 landing      # Landing page
│   │   ├── 📂 chat         # Chat interface
│   │   ├── 📂 main         # Main application logic
│   │   ├── 📂 public       # Public-facing routes
│   ├── 📂 api               # API routes
│   ├── 📄 favicon.ico       # Favicon for the app
│   ├── 📄 globals.css       # Global styles
│   ├── 📄 layout.tsx        # Root layout component
│   ├── 📂 components        # Reusable UI components
│   ├── 📂 hooks             # Custom React hooks
│   ├── 📂 lib               # Utility functions and libraries
│   ├── 📂 utils             # Additional utilities
│   │   ├── 📂 y-sweet      # YJS-related utilities for real-time collaboration
├── 📄 .gitignore            # Git ignore file
├── 📄 README.md             # Project documentation
├── 📄 components.json       # Component configuration file
├── 📄 eslint.config.mjs     # ESLint configuration
├── 📄 liveblocks.config.ts  # Liveblocks configuration for real-time collaboration
├── 📄 next.config.mjs       # Next.js configuration (MJS format)
├── 📄 next.config.ts        # Next.js configuration (TS format)
├── 📄 package-lock.json     # npm package lock file
├── 📄 package.json          # Project dependencies and scripts
├── 📄 postcss.config.mjs    # PostCSS configuration
├── 📄 tailwind.config.ts    # Tailwind CSS configuration
├── 📄 tsconfig.json         # TypeScript configuration
```


## Installation

Follow these steps to set up the project locally:

```sh
# Clone the repository
git clone [https://github.com/yourusername/nest-note-app.git](https://github.com/I-Adarsh-I/Nest---Note-taking-app.git)

# Navigate to the project directory
cd nest-note-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env  # Update the .env file with your credentials

# Run the development server
npm run dev
```

The app will be available at `http://localhost:3000`.

## Configuration

Make sure to set up your environment variables in the `.env` file correctly. Example:

```sh
NEXT_PUBLIC_CONVEX_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
EDGE_STORE_ACCESS_KEY=
EDGE_STORE_SECRET_KEY=

# Google Generative AI API key
GOOGLE_GENERATIVE_AI_API_KEY=
GOOGLE_CALENDAR_API_KEY=
GOOGLE_OAUTH_CLIENT_SECERET=

#Web-push
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
NODE_ENV=
```

***EdgeStore configuration***
- To configure EdgeStore in NextJs, please refer to their docs  - [EdgeStore](https://edgestore.dev/docs/quick-start)

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## Contact

For any questions or feedback, reach out to me at [adarshsi.inofo@gmail.com](mailto:adarshsi.inofo@gmail.com) or open an issue on [GitHub](https://github.com/I-Adarsh-I/Nest---Note-taking-app).

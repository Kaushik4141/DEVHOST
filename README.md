# 📚 Lern-Flow

This project is a web application built with Next.js that provides a customizable course library. It allows users to browse, search, and interact with a wide range of courses. The platform features user authentication, a community forum, and visually appealing UI components. It aims to provide a seamless and engaging learning experience.

🚀 **Key Features**

*   **User Authentication:** Secure user sign-in and sign-up powered by Clerk.
*   **Community Forum:** A platform for users to create posts, interact with each other, and discuss course-related topics.
*   **Trending Topics:** Displays trending hashtags within the community to highlight popular discussions.
*   **Search Functionality:** Allows users to search for courses and posts within the community.
*   **Smooth Scrolling:** Integrated with Lenis for a smooth and engaging scrolling experience.
*   **Animated UI:** Uses GSAP for visually appealing animations throughout the application.
*   **Responsive Design:** Built with Tailwind CSS for a responsive and consistent user experience across devices.
*   **Toast Notifications:** Displays helpful notifications to the user using a custom toast system.
*   **Profile Cards:** Displays user profile information in a card format.

🛠️ **Tech Stack**

*   **Frontend:**
    *   Next.js
    *   React
    *   TypeScript
    *   Tailwind CSS
    *   GSAP (GreenSock Animation Platform)
    *   @studio-freight/react-lenis
    *   lucide-react
    *   @clerk/nextjs
*   **Authentication:**
    *   Clerk
*   **UI Components:**
    *   Custom UI components built with React and Tailwind CSS
*   **Other:**
    *   Node.js
    *   npm or yarn

📦 **Getting Started**

### Prerequisites

*   Node.js (version 18 or higher recommended)
*   npm or yarn
*   Clerk account and API keys

### Installation

1.  Clone the repository:

    ```bash
    git clone <repository_url>
    cd <repository_directory>
    ```

2.  Install dependencies:

    ```bash
    npm install # or yarn install
    ```

3.  Configure environment variables:

    *   Create a `.env.local` file in the root directory.
    *   Add your Clerk API keys and any other necessary environment variables.  Refer to the Clerk documentation for required variables.

    ```
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your_clerk_publishable_key>
    CLERK_SECRET_KEY=<your_clerk_secret_key>
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
    ```

### Running Locally

1.  Start the development server:

    ```bash
    npm run dev # or yarn dev
    ```

2.  Open your browser and navigate to `http://localhost:3000`.

📂 **Project Structure**

```
frontend/
├── .next/                # Next.js build output directory
├── node_modules/         # Node.js dependencies
├── public/               # Static assets
├── src/                  # Source code
│   ├── components/       # React components
│   │   ├── UI/           # Reusable UI components
│   │   │   ├── avatar/   # Avatar components
│   │   │   ├── button/   # Button component
│   │   │   ├── textarea/ # Textarea component
│   │   │   └── ...       # Other UI components
│   │   ├── community/    # Community-related components
│   │   │   ├── CreatePostForm.tsx
│   │   │   ├── Feed.tsx
│   │   │   ├── PostCard.tsx
│   │   │   ├── TrendingTopics.tsx
│   │   │   ├── UserProfileCard.tsx
│   │   │   └── index.ts
│   │   ├── convert/      # Convert related components
│   │   │   ├── HeroSection.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   └── ...
│   │   ├── hooks/        # Custom React hooks
│   │   │   ├── use-toast.ts # Toast hook
│   │   │   └── ...
│   │   ├── LibraryCard.tsx
│   │   ├── LibrariesGrid.tsx
│   │   ├── SignInCTA.tsx
│   │   ├── index.ts        # Component exports
│   │   └── ...
│   ├── constants/        # Constants
│   │   ├── community.ts  # Community constants
│   ├── pages/            # Next.js pages
│   │   ├── _app.tsx       # Custom App component
│   │   ├── index.tsx      # Home page
│   │   ├── sign-in/index.tsx # Sign in page
│   │   ├── sign-up/index.tsx # Sign up page
│   │   └── ...
│   ├── styles/           # Styles
│   ├── types/            # TypeScript type definitions
│   │   ├── Community.ts  # Community types
│   │   ├── Library.ts    # Library types
│   │   └── ...
│   └── utils/            # Utility functions
├── next.config.js        # Next.js configuration
├── middleware.ts         # Middleware configuration
├── package.json          # Project dependencies and scripts
├── README.md             # This file
└── tsconfig.json         # TypeScript configuration
```

💻 **Usage**

1.  **Authentication:** Use the Sign In and Sign Up pages to create an account or log in.
2.  **Community:** Navigate to the community section to view and create posts, interact with other users, and explore trending topics.
3.  **Searching:** Use the search bar to find specific courses or posts.
4.  **Profile:** Click on a user's avatar to view their profile information.

Thank You
📝 **License**

[MIT](LICENSE)

This is written by [readme.ai](https://readme-generator-phi.vercel.app/)

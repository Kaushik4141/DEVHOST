# Community Frontend Documentation

This document describes the community feature frontend implementation for the Lernflow Next.js application.

## Overview

The community feature provides a Twitter-like social experience where users can:
- Create and share posts (280 character limit)
- Like and interact with posts
- View trending hashtags
- Browse an infinite scroll feed
- Navigate with a responsive three-column layout

## Architecture

### Technology Stack
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Clerk** for authentication
- **SWR** for data fetching and caching
- **Radix UI** for accessible components
- **Lucide React** for icons

### Project Structure
```
src/
├── app/
│   └── community/
│       └── page.tsx                 # Main community page
├── components/
│   ├── community/
│   │   ├── CreatePostForm.tsx       # Post creation form
│   │   ├── PostCard.tsx             # Individual post display
│   │   ├── Feed.tsx                 # Infinite scroll feed
│   │   ├── TrendingTopics.tsx       # Trending hashtags sidebar
│   │   └── index.ts                 # Component exports
│   └── UI/
│       ├── avatar.tsx               # Avatar component
│       ├── button.tsx               # Button component
│       ├── textarea.tsx             # Textarea component
│       └── ...
├── hooks/
│   └── useCommunity.ts              # Custom SWR hooks
├── libs/
│   └── api.ts                       # API functions
└── types/
    └── Community.ts                 # TypeScript definitions
```

## Components

### 1. Community Page (`/app/community/page.tsx`)

The main community page with a responsive three-column layout:

- **Left Column**: Navigation sidebar with user authentication
- **Middle Column**: Main content feed with post creation
- **Right Column**: Trending topics and community guidelines

**Features:**
- Responsive design (mobile-friendly)
- Sticky sidebar navigation
- User authentication integration
- Community guidelines display

### 2. CreatePostForm Component

A form for authenticated users to create new posts.

**Features:**
- Only visible to signed-in users (`<SignedIn>` wrapper)
- Character counter (280 limit)
- User avatar display
- Keyboard shortcuts (Cmd/Ctrl + Enter to submit)
- Loading states and error handling
- Automatic hashtag extraction

**Usage:**
```tsx
import CreatePostForm from '@/components/community/CreatePostForm';

<CreatePostForm />
```

### 3. PostCard Component

Displays individual posts with interaction capabilities.

**Features:**
- Author information with avatar
- Relative timestamps ("5m ago", "2h ago")
- Clickable hashtags
- Like/unlike functionality with optimistic updates
- Responsive design
- Loading states

**Props:**
```tsx
interface PostCardProps {
  post: Post;
}
```

### 4. Feed Component

Manages the infinite scroll post feed.

**Features:**
- Infinite scrolling with intersection observer
- Pagination support
- Loading states and error handling
- Refresh functionality
- Empty state handling
- Optimistic updates for likes

**Hooks Used:**
- `usePosts()` for data fetching
- `useToggleLike()` for like interactions

### 5. TrendingTopics Component

Displays trending hashtags in the sidebar.

**Features:**
- Real-time trending data (refreshes every 5 minutes)
- Clickable hashtag navigation
- Loading and error states
- Manual refresh capability
- Time range information

## Data Fetching

### SWR Integration

The application uses SWR for efficient data fetching with the following benefits:
- Automatic caching and revalidation
- Optimistic updates
- Error handling
- Loading states
- Background updates

### Custom Hooks

#### `usePosts(page, limit)`
Fetches paginated posts with infinite scroll support.

```tsx
const { posts, pagination, isLoading, error, mutate } = usePosts(1, 10);
```

#### `useTrendingHashtags()`
Fetches trending hashtags with automatic refresh.

```tsx
const { trendingHashtags, timeRange, generatedAt, isLoading, error, mutate } = useTrendingHashtags();
```

#### `useCreatePost()`
Handles post creation with cache invalidation.

```tsx
const { createPost } = useCreatePost();
await createPost("Hello world! #coding");
```

#### `useToggleLike()`
Handles like/unlike with optimistic updates.

```tsx
const { toggleLike } = useToggleLike();
await toggleLike(postId);
```

## Authentication Integration

### Clerk Integration

The application seamlessly integrates with Clerk for authentication:

- **User State**: `useUser()` hook provides current user data
- **Authentication**: `useAuth()` hook provides token management
- **Components**: `<SignedIn>` and `<SignedOut>` for conditional rendering
- **User Button**: `<UserButton />` for user management

### API Authentication

All authenticated API calls include the Clerk JWT token:

```tsx
const { getToken } = useAuth();
const token = await getToken();
// Token automatically included in API calls
```

## Styling

### Tailwind CSS

The application uses Tailwind CSS for styling with:
- Responsive design utilities
- Dark mode support
- Consistent spacing and typography
- Custom color schemes
- Component-specific styling

### Design System

- **Colors**: Blue primary, gray neutrals, semantic colors
- **Typography**: Consistent font sizes and weights
- **Spacing**: 4px base unit with consistent spacing scale
- **Components**: Reusable UI components with variants

## API Integration

### Backend Communication

The frontend communicates with the backend through:

- **Base URL**: Configurable via `NEXT_PUBLIC_BACKEND_URL`
- **Authentication**: Bearer token in Authorization header
- **Error Handling**: Consistent error responses
- **Type Safety**: Full TypeScript integration

### API Endpoints Used

- `GET /api/posts` - Fetch paginated posts
- `POST /api/posts` - Create new post
- `POST /api/posts/:id/like` - Toggle like on post
- `GET /api/trending` - Fetch trending hashtags

## Performance Optimizations

### Infinite Scrolling
- Intersection Observer API for efficient scroll detection
- Pagination with configurable page sizes
- Optimistic updates for better UX

### Caching Strategy
- SWR automatic caching and revalidation
- Background updates for trending data
- Optimistic updates for user interactions

### Bundle Optimization
- Dynamic imports for heavy components
- Tree shaking for unused code
- Optimized images and assets

## Error Handling

### User Experience
- Loading states for all async operations
- Error boundaries for component failures
- Retry mechanisms for failed requests
- User-friendly error messages

### Development
- TypeScript for compile-time error detection
- ESLint for code quality
- Comprehensive error logging

## Accessibility

### WCAG Compliance
- Semantic HTML structure
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance
- Focus management

### Radix UI Components
- Accessible component primitives
- ARIA attributes
- Keyboard interactions
- Focus trapping

## Mobile Responsiveness

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Responsive Features
- Collapsible sidebar on mobile
- Touch-friendly interactions
- Optimized layouts for small screens
- Swipe gestures support

## Installation & Setup

### Dependencies
```bash
npm install swr @radix-ui/react-avatar clsx
```

### Environment Variables
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
```

### Usage
1. Navigate to `/community` to access the community feature
2. Sign in with Clerk to create posts and interact
3. Use the responsive navigation for different sections
4. Scroll infinitely through the post feed
5. Check trending topics in the sidebar

## Future Enhancements

### Planned Features
- Real-time notifications
- Post comments and replies
- User profiles and following
- Advanced search and filtering
- Media upload support
- Push notifications

### Technical Improvements
- Server-side rendering optimization
- Advanced caching strategies
- Performance monitoring
- A/B testing framework
- Analytics integration

## Troubleshooting

### Common Issues

1. **Posts not loading**: Check backend connection and authentication
2. **Infinite scroll not working**: Verify intersection observer support
3. **Styling issues**: Ensure Tailwind CSS is properly configured
4. **Authentication errors**: Verify Clerk configuration and tokens

### Debug Tools
- Browser DevTools for network inspection
- React DevTools for component debugging
- SWR DevTools for cache inspection
- Clerk Dashboard for authentication debugging

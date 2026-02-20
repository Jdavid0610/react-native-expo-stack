# Expo Stack

Production-ready React Native starter built with Expo, following domain-driven modular architecture with strict separation of concerns.

## Tech Stack

| Category     | Technology                                           |
| ------------ | ---------------------------------------------------- |
| Framework    | Expo SDK 54, React Native 0.81, React 19             |
| Language     | TypeScript 5.9 (strict mode)                         |
| Routing      | Expo Router v6 (file-based)                          |
| Server State | @tanstack/react-query v5                             |
| Client State | Zustand v5                                           |
| Forms        | react-hook-form v7 + zod v4 + @hookform/resolvers v5 |
| HTTP         | Axios with interceptors                              |
| Storage      | react-native-mmkv v4                                 |
| Styling      | NativeWind v4 (Tailwind CSS)                         |
| Animations   | react-native-reanimated v4                           |
| Env Config   | react-native-config                                  |

## Architecture

```
expo-stack/
├── app/                          # Expo Router - navigation only, no business logic
│   ├── _layout.tsx               # Root layout: providers, auth guard
│   ├── (auth)/                   # Auth route group
│   │   ├── _layout.tsx
│   │   ├── login.tsx             # Thin route -> LoginScreen
│   │   └── register.tsx          # Thin route -> RegisterScreen
│   └── (tabs)/                   # Tab route group
│       ├── _layout.tsx
│       ├── home.tsx              # Thin route -> HomeScreen
│       └── profile.tsx           # Thin route -> ProfileScreen
│
├── modules/                      # Domain modules - feature logic
│   ├── auth/
│   │   ├── hooks/                # useLogin, useRegister, useLogout
│   │   ├── schemas/              # login.schema.ts, register.schema.ts
│   │   ├── screens/              # LoginScreen, RegisterScreen
│   │   ├── components/
│   │   └── services.ts           # API calls (login, register, logout, getMe)
│   │
│   ├── profile/
│   │   ├── hooks/                # useProfile, useUpdateProfile
│   │   ├── schemas/              # profile.schema.ts
│   │   ├── screens/              # HomeScreen, ProfileScreen
│   │   ├── components/
│   │   └── services.ts           # API calls (getProfile, updateProfile)
│   │
│   ├── trips/                    # Empty module (ready for implementation)
│   └── settings/                 # Empty module (ready for implementation)
│
└── shared/                       # Cross-cutting concerns
    ├── api/
    │   └── client.ts             # Axios instance, interceptors, response types
    ├── config/
    │   └── env.ts                # Centralized environment config
    ├── hooks/
    │   ├── useAuth.ts            # Auth logic (signIn, signOut, updateUser)
    │   └── useAppState.ts        # AppState listener
    ├── query/
    │   └── query-provider.tsx    # React Query provider + defaults
    ├── storage/
    │   └── mmkv.ts               # MMKV instance + Zustand storage adapter
    ├── storages/
    │   └── auth.store.ts         # Auth Zustand store (state + persistence)
    ├── ui/
    │   ├── button.tsx            # Button (primary, secondary, outline)
    │   ├── input.tsx             # Input with label + error
    │   └── screen.tsx            # Screen wrapper with SafeAreaView
    ├── utils/
    │   ├── constants.ts          # Shared constants (AUTH_INITIAL_STATE)
    │   └── index.ts              # Utilities (sleep, getErrorMessage)
    └── global.css                # Tailwind directives
```

## Architecture Rules

1. **`app/` is navigation only** - Route files are thin wrappers that import screens from modules. No business logic lives here.

2. **Modules are isolated** - Each module owns its screens, hooks, schemas, services, and components. Modules must not import from other modules directly.

3. **Shared is cross-cutting** - API client, storage, hooks, UI primitives, and utilities used across modules live in `shared/`.

4. **Store vs Hook separation (SRP)** - Zustand stores (`shared/storages/`) handle state shape and persistence. Hooks (`shared/hooks/`) handle business logic that mutates stores.

5. **No barrel files** - Import directly from files, not through `index.ts` re-exports in module subfolders.

## Key Patterns

### Auth Flow

The auth system is split into three layers:

```
shared/storages/auth.store.ts    -> State: token, refreshToken, user, isAuthenticated, isHydrated
                                    Persistence: Zustand persist + MMKV
                                    No business logic

shared/hooks/useAuth.ts          -> Logic: signIn(), signOut(), updateUser()
                                    Returns reactive state + actions
                                    Used by React components

shared/api/client.ts             -> Interceptors: reads token via authStore.getState()
                                    Resets state on 401 via AUTH_INITIAL_STATE
                                    Works outside React context
```

Auth guard lives in `app/_layout.tsx` via conditional `Stack.Screen` rendering based on `isAuthenticated`.

### Forms

Forms use react-hook-form + zod with the Controller pattern:

```
schemas/login.schema.ts     -> Zod schema + inferred TypeScript type
hooks/useLogin.ts           -> React Query mutation wrapping service call
screens/LoginScreen.tsx     -> useForm + zodResolver + Controller components
```

### Server State

React Query hooks wrap service calls. Mutations handle side effects in `onSuccess`/`onSettled` callbacks:

```typescript
// Query with key factory
const profileKeys = {
  all: ["profile"],
  detail: () => [...profileKeys.all, "detail"],
};

// Mutation with cache invalidation
const updateProfile = useUpdateProfile(); // invalidates profileKeys.all on success
```

### API Client

Axios instance with two interceptors:

- **Request**: Attaches `Authorization: Bearer <token>` from auth store
- **Response**: Resets auth state on 401 responses

### API Calls Structure (Recommended)

As the project scales, API calls should follow a resource-based, method-grouped structure for maximum discoverability and isolation:

```
shared/api/
  ├── client.ts                          # Axios instance + interceptors
  └── {resource}/                        # Resource domain (e.g., user, cart, books)
      ├── get/
      │   └── {endpoint_name}/
      │       ├── {endpoint_name}.interface.ts   # Request/response types
      │       ├── {endpoint_name}.ts             # API call logic
      │       └── index.ts                       # Public export
      ├── post/
      │   └── {endpoint_name}/
      │       ├── {endpoint_name}.interface.ts
      │       ├── {endpoint_name}.ts
      │       └── index.ts
      ├── put/
      │   └── {endpoint_name}/
      │       ├── {endpoint_name}.interface.ts
      │       ├── {endpoint_name}.ts
      │       └── index.ts
      ├── patch/
      │   └── {endpoint_name}/
      │       ├── {endpoint_name}.interface.ts
      │       ├── {endpoint_name}.ts
      │       └── index.ts
      └── delete/
          └── {endpoint_name}/
              ├── {endpoint_name}.interface.ts
              ├── {endpoint_name}.ts
              └── index.ts
```

**Example** for an auth resource:

```
shared/api/
  └── auth/
      ├── post/
      │   ├── login/
      │   │   ├── login.interface.ts       # LoginRequest, LoginResponse
      │   │   ├── login.ts                 # apiClient.post('/auth/login', data)
      │   │   └── index.ts
      │   ├── register/
      │   │   ├── register.interface.ts
      │   │   ├── register.ts
      │   │   └── index.ts
      │   └── logout/
      │       ├── logout.interface.ts
      │       ├── logout.ts
      │       └── index.ts
      └── get/
          └── me/
              ├── me.interface.ts
              ├── me.ts
              └── index.ts
```

**Benefits**:

- Each endpoint is self-contained with its own types and logic
- Easy to locate any API call by resource + method + name
- Interfaces stay co-located with their endpoint, avoiding a centralized types file
- Adding or removing endpoints doesn't affect other files
- Module services (`modules/auth/services.ts`) can import from these endpoints or be replaced by them entirely as the API layer grows

### Storage

MMKV v4 provides fast key-value storage. Zustand's persist middleware uses a custom storage adapter:

```typescript
const storage = createMMKV({ id: "expo-stack-storage" });

// Zustand adapter
const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    storage.set(name, value);
  },
  getItem: (name) => {
    return storage.getString(name) ?? null;
  },
  removeItem: (name) => {
    storage.remove(name);
  },
};
```

## Path Aliases

| Alias        | Path          |
| ------------ | ------------- |
| `@/*`        | `./*`         |
| `@shared/*`  | `./shared/*`  |
| `@modules/*` | `./modules/*` |

Configured in both `tsconfig.json` (for TypeScript) and `babel.config.js` (for Metro bundler).

## Naming Conventions

| Type     | Convention   | Example           |
| -------- | ------------ | ----------------- |
| Screens  | PascalCase   | `LoginScreen.tsx` |
| Hooks    | camelCase    | `useLogin.ts`     |
| Schemas  | dot notation | `login.schema.ts` |
| Services | flat file    | `services.ts`     |
| Stores   | dot notation | `auth.store.ts`   |

## Environment Setup

Environment variables are managed via `react-native-config` with typed access:

```
.env                -> Development (default)
.env.staging        -> Staging
.env.production     -> Production
```

Variables are accessed through `shared/config/env.ts`:

```typescript
import { env, isDev, isProd } from "@shared/config/env";

env.EXPO_PUBLIC_API_URL; // string
env.EXPO_PUBLIC_API_TIMEOUT; // number
env.EXPO_PUBLIC_APP_ENV; // 'development' | 'staging' | 'production'
```

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm prebuild

# Run on iOS
npx expo run:ios

# Run on Android
npx expo run:android

# Type check
npm run lint

# Clean reset
npm run reset-project
```

After modifying `babel.config.js`, always clear the Metro cache:

```bash
npx expo start --clear
```

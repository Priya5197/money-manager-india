# Money Manager India - Component Library Summary

## Overview
Complete production-ready UI component library for Money Manager India app built with Next.js 14, TypeScript, Tailwind CSS, and Radix UI.

### Design Palette
- **Saffron Accent**: #F97316
- **Navy Primary**: #1E3A5F
- **Emerald (Positive)**: #10B981
- **Rose (Negative)**: #F43F5E
- **Slate Backgrounds**: Various shades with dark mode support

---

## UI Components (`src/components/ui/`)

### Basic Components

#### 1. **Button** (`button.tsx`)
- Variants: primary, secondary, outline, ghost, danger
- Sizes: sm, md, lg
- Features: loading state, left/right icons, full width, accessibility
- All variants include focus rings and hover states
- Dark mode support

#### 2. **Input** (`input.tsx`)
- Label, error message, helper text support
- Left/right icon slots
- Required field indicator
- Full width option
- Forward ref support
- Error state styling

#### 3. **Card** (`card.tsx`)
- Main Card component with hover effects
- CardHeader: with title, description, action slot
- CardContent: with optional padding
- CardFooter: with optional divider
- Two variants: default, glass (frosted effect)

#### 4. **Badge** (`badge.tsx`)
- Variants: default, success, warning, danger, info, secondary
- Sizes: sm, md
- Removable option with callback
- Icon support
- Transition effects

#### 5. **Empty State** (`empty-state.tsx`)
- Icon, title, description
- Optional action button
- Sizes: sm, md, lg
- Centered layout with flex utilities

#### 6. **Loading** (`loading.tsx`)
- LoadingSpinner: customizable size and color
- Skeleton: animated placeholder loading
- SkeletonCard: pre-built card skeleton
- LoadingPage: full-screen loading state

#### 7. **Stat Card** (`stat-card.tsx`)
- Label and INR-formatted value display
- Trend indicator (up/down/neutral) with percentage
- Icon with colored background
- Variants: default, success, danger, warning
- Clickable with hover effect

#### 8. **Progress Bar** (`progress-bar.tsx`)
- Basic progress with percentage display
- SegmentedProgressBar: multi-segment for budget tracking
- Animated and striped variants
- Variants: default, success, warning, danger
- Custom labels and sizing

---

## Form Components

#### 9. **Select** (`select.tsx`)
- Built with Radix UI Select
- Label, error, helper text
- Full width, required field support
- Keyboard accessible
- Animated dropdown

#### 10. **Checkbox** (`checkbox.tsx`)
- Radix UI Checkbox
- Label and helper text
- Disabled state
- Accessibility (ARIA labels)
- Dark mode themed

#### 11. **Switch** (`switch.tsx`)
- Radix UI Switch/Toggle
- Label and helper text
- Animated thumb transition
- Accessibility support
- Dark mode support

#### 12. **Date Picker** (`date-picker.tsx`)
- Native HTML date input with custom styling
- DatePicker: single date
- DateRangePicker: start and end dates
- Label, error, helper text
- Calendar icon
- Left icon slot

---

## Advanced Components

#### 13. **Modal** (`modal.tsx`)
- Radix Dialog-based
- Title, description, close button
- Sizes: sm, md, lg
- Animated entrance (slide-in + fade)
- ModalBody and ModalFooter sub-components
- Portal rendering for z-index management

#### 14. **Toast** (`toast.tsx`)
- Toast notification system with Radix Toast
- useToast hook for easy usage
- Types: default, success, error, warning, info
- Auto-dismiss with configurable duration
- Animated slide-in from bottom
- Provider wrapper for app-wide use

#### 15. **Tooltip** (`tooltip.tsx`)
- Radix UI Tooltip
- Configurable position (top, right, bottom, left)
- Delay duration option
- Portal rendering
- Dark mode compatible

#### 16. **Tabs** (`tabs.tsx`)
- Radix UI Tabs
- TabsList: tab buttons container
- TabsTrigger: individual tab button
- TabsContent: tab content area
- Active state highlighting with saffron color
- Animated content transitions

#### 17. **Dropdown Menu** (`dropdown-menu.tsx`)
- Radix UI Dropdown Menu
- DropdownMenuContent with animation
- DropdownMenuItem: regular items
- DropdownMenuCheckboxItem: checkable items
- DropdownMenuSeparator and DropdownMenuLabel
- Portal rendering with sideOffset

#### 18. **Data Table** (`data-table.tsx`)
- Built with TanStack React Table
- Features: sorting, filtering, pagination
- Export functionality
- Striped rows option
- Hover effect on rows
- Empty state support
- Responsive design

---

## Chart Components (`src/components/charts/`)

#### 19. **Bar Chart** (`bar-chart.tsx`)
- Recharts-based bar chart
- Horizontal and vertical layouts
- Multiple data series support
- Custom tooltip with formatted values
- Legend and grid options
- Animated bars with radius

#### 20. **Line Chart** (`line-chart.tsx`)
- Smooth or linear interpolation
- Multiple data series
- Custom tooltip
- Configurable stroke width
- Active dot enhancement
- Animated rendering

#### 21. **Pie Chart** (`pie-chart.tsx`)
- Pie and donut variants
- Custom colors array
- Padding angles
- Legend with formatted values
- Tooltip shows values and percentages
- Animated rendering

#### 22. **Area Chart** (`area-chart.tsx`)
- Smooth or linear curves
- Stacked area support
- Semi-transparent fill
- Multiple series
- Custom tooltip
- Legend support

---

## Layout Components (`src/components/layout/`)

#### 23. **Sidebar** (`sidebar.tsx`)
- Fixed/sticky sidebar (64rem width)
- Logo area with branding
- Navigation items with icons
- Submenu support with dropdown indicator
- User profile section at bottom
- Logout button
- Mobile-responsive (toggleable)
- Active state highlighting
- Border styling with dark mode

#### 24. **Header** (`header.tsx`)
- Page title and subtitle
- Search input (hidden on mobile)
- User dropdown menu with:
  - Profile
  - Settings
  - Logout
- Avatar with fallback initial
- Sticky positioning
- Responsive layout

#### 25. **App Layout** (`app-layout.tsx`)
- Main layout wrapper combining Sidebar + Header
- Flexible content area
- Responsive design
- Props for customizing all sections
- Scrollable main content
- Dark mode support

#### 26. **Auth Layout** (`auth-layout.tsx`)
- Centered card design for auth pages
- Left side: branding and features (desktop)
- Right side: form content
- Background pattern with gradient blobs
- Mobile-responsive
- Optional footer
- Feature list with checkmarks

---

## Utility File

#### 27. **cn.ts** (`src/lib/cn.ts`)
- Combines `clsx` and `tailwind-merge`
- Handles Tailwind class conflicts
- Enables conditional styling safely
- Used throughout all components

---

## Global Styles (`src/styles/globals.css`)

### Features
- Tailwind directives (base, components, utilities)
- CSS variables for colors and transitions
- Dark mode variables
- Custom animations:
  - spin, pulse, bounce, fade-in
  - slide-in-from-top, slide-in-from-bottom
- Custom scrollbar styling
- Typography utilities
- Elevation shadow classes
- Utility classes (flex-center, flex-between, gradients)

---

## Component Usage Examples

### Button
```tsx
<Button variant="primary" size="md" isLoading={false}>
  Click me
</Button>
<Button variant="danger" leftIcon={<TrashIcon />}>
  Delete
</Button>
```

### Input
```tsx
<Input 
  label="Email" 
  type="email" 
  error="Invalid email"
  helperText="We'll never share your email"
  leftIcon={<MailIcon />}
/>
```

### Card
```tsx
<Card>
  <CardHeader title="Title" description="Description" />
  <CardContent>Content here</CardContent>
  <CardFooter>
    <Button>Submit</Button>
  </CardFooter>
</Card>
```

### Toast
```tsx
const { addToast } = useToast();

addToast({
  type: 'success',
  title: 'Success!',
  description: 'Your changes have been saved.',
})
```

### Data Table
```tsx
<DataTable 
  columns={columns}
  data={data}
  sortable
  paginated
  onExport={handleExport}
/>
```

### Charts
```tsx
<LineChart
  data={data}
  dataKey="value"
  title="Monthly Spending"
  height={300}
/>
```

---

## TypeScript Support
- Full TypeScript support with proper types
- React.ForwardRef for DOM refs where needed
- ComponentPropsWithoutRef for Radix UI components
- Custom interfaces for all component props

---

## Accessibility Features
- ARIA labels and roles
- Focus management
- Keyboard navigation
- Semantic HTML
- Proper heading hierarchy
- Color contrast compliance
- Error announcements with role="alert"

---

## Dark Mode Support
- CSS custom properties for theme switching
- Class-based dark mode (add `dark` class to root)
- All components include dark mode variants
- Automatic color inversion in dark mode

---

## File Structure
```
src/
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── modal.tsx
│   │   ├── select.tsx
│   │   ├── badge.tsx
│   │   ├── tabs.tsx
│   │   ├── toast.tsx
│   │   ├── data-table.tsx
│   │   ├── empty-state.tsx
│   │   ├── loading.tsx
│   │   ├── stat-card.tsx
│   │   ├── progress-bar.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── checkbox.tsx
│   │   ├── switch.tsx
│   │   ├── date-picker.tsx
│   │   └── tooltip.tsx
│   ├── layout/
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   ├── app-layout.tsx
│   │   └── auth-layout.tsx
│   └── charts/
│       ├── bar-chart.tsx
│       ├── line-chart.tsx
│       ├── pie-chart.tsx
│       └── area-chart.tsx
├── lib/
│   └── cn.ts
└── styles/
    └── globals.css
```

---

## Dependencies Required
- `@radix-ui/react-dialog`
- `@radix-ui/react-dropdown-menu`
- `@radix-ui/react-select`
- `@radix-ui/react-checkbox`
- `@radix-ui/react-switch`
- `@radix-ui/react-tabs`
- `@radix-ui/react-toast`
- `@radix-ui/react-tooltip`
- `@tanstack/react-table`
- `recharts`
- `clsx`
- `tailwind-merge`

---

## Production Ready
- All components are production-quality
- Comprehensive error handling
- Loading states everywhere
- Accessibility compliance
- Performance optimized
- Memory leak prevention
- Proper cleanup functions
- Type safety throughout


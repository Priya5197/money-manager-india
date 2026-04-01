# Contributing to Money Manager India

Thank you for considering a contribution to Money Manager India! We're excited to have you involved in improving our personal finance application for Indian users.

## Code of Conduct

Be respectful and constructive in all interactions. We're committed to providing a welcoming and inclusive environment for all contributors.

## Getting Started

1. Fork the repository on GitHub
2. Clone your forked repository locally:
   ```bash
   git clone https://github.com/your-username/money-manager-india.git
   ```
3. Add the original repository as upstream:
   ```bash
   git remote add upstream https://github.com/original-owner/money-manager-india.git
   ```
4. Create a new branch for your feature/fix:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-fix-name
   ```

## Development Workflow

### Before You Start

1. Ensure you have Node.js 18+ installed
2. Install dependencies: `npm install`
3. Setup environment variables: `cp .env.example .env.local`
4. Start the development server: `npm run dev`

### Making Changes

1. Make your changes following the code style and conventions
2. Keep commits atomic and with clear messages
3. Run tests: `npm run test`
4. Run linter: `npm run lint`
5. Type-check: `npm run type-check`
6. Format code: `npm run format`

### Commit Message Guidelines

Use clear, descriptive commit messages:

```
feat: add EMI calculator for vehicle loans
fix: resolve budget category display issue
docs: update setup instructions
test: add tests for tax calculator
refactor: simplify expense filtering logic
chore: update dependencies
```

Format: `type: subject`

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `test`: Test addition or update
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `chore`: Build/dependency updates
- `ci`: CI/CD configuration
- `style`: Code style changes (formatting, missing semicolons, etc.)

## Pull Request Process

1. Update your branch with latest upstream changes:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

3. Open a Pull Request on GitHub with:
   - Clear title and description
   - Reference to any related issues
   - Screenshots for UI changes
   - Description of changes and motivation

4. Ensure all CI checks pass:
   - Linting passes
   - Tests pass
   - Type checking passes
   - Build succeeds

5. Address review comments and make requested changes

6. Once approved, your PR will be merged

## Coding Standards

### TypeScript

- Use strict mode (enabled in tsconfig.json)
- Type all function parameters and return types
- Avoid `any` type; use `unknown` if needed
- Use proper error handling

### React Components

- Prefer functional components with hooks
- Use proper TypeScript types for props
- Keep components focused and single-responsibility
- Add JSDoc comments for complex components

Example:
```typescript
interface ButtonProps {
  onClick: () => void
  children: React.ReactNode
  disabled?: boolean
}

/**
 * Primary action button component
 */
export function Button({ onClick, children, disabled = false }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
    >
      {children}
    </button>
  )
}
```

### Styling

- Use Tailwind CSS for styling
- Follow the custom color palette in tailwind.config.ts
- Use clsx for conditional classes
- Keep utility classes organized and consistent

### Code Organization

```typescript
// Imports first
import { useState } from 'react'
import { Button } from '@/components/Button'

// Types/Interfaces
interface MyComponentProps {
  title: string
}

// Component
export function MyComponent({ title }: MyComponentProps) {
  // State
  const [count, setCount] = useState(0)

  // Effects
  useEffect(() => {
    // ...
  }, [])

  // Handlers
  const handleClick = () => {
    setCount(count + 1)
  }

  // Render
  return (
    <div>
      <h1>{title}</h1>
      <Button onClick={handleClick}>Click me</Button>
    </div>
  )
}
```

## Testing

- Write tests for new features and bug fixes
- Aim for at least 80% code coverage
- Test component behavior, not implementation
- Use descriptive test names

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('calls onClick handler when clicked', async () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click</Button>)

    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('disables button when disabled prop is true', () => {
    render(<Button onClick={() => {}} disabled>
      Click
    </Button>)

    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

## Documentation

- Update README.md if you add new features
- Add JSDoc comments to exported functions
- Update API.md if you modify API endpoints
- Update ARCHITECTURE.md for significant structural changes

## Reporting Issues

When reporting bugs, include:

1. Description of the issue
2. Steps to reproduce
3. Expected behavior
4. Actual behavior
5. Environment (OS, Node version, browser, etc.)
6. Screenshots or error logs if applicable

## Feature Requests

When suggesting features:

1. Describe the feature and its use case
2. Explain how it benefits Indian users specifically
3. Provide examples if applicable
4. Consider implementation complexity

## Areas to Contribute

### High Priority

- Improving tax calculator accuracy
- Bank integration features
- Mobile responsiveness improvements
- Documentation enhancements
- Bug fixes and stability improvements

### Medium Priority

- New calculators and tools
- Advanced chart visualizations
- Additional export formats
- Performance optimizations
- Test coverage improvements

### Good First Issues

Look for issues labeled `good-first-issue` to get started with contributions.

## Questions?

If you have questions:

1. Check existing issues and discussions
2. Open a discussion on GitHub
3. Reach out to maintainers

## Recognition

Contributors will be recognized in:

- README.md contributors section
- Release notes
- GitHub contributor graph

Thank you for contributing to Money Manager India!

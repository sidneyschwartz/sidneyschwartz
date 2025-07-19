# Component Documentation

This document provides comprehensive documentation for all UI components.

## Component Categories

- [Layout Components](#layout-components) - Grid, Container, Flex layouts
- [Form Components](#form-components) - Input, Button, Form validation
- [Data Display](#data-display) - Table, List, Card components
- [Navigation](#navigation) - Menu, Breadcrumb, Pagination
- [Feedback](#feedback) - Alert, Modal, Toast notifications
- [Utility Components](#utility-components) - Loading, Error boundaries

---

## Layout Components

### Container

A responsive container component that centers content and provides consistent spacing.

**Props**:
```typescript
interface ContainerProps {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: boolean;
  className?: string;
  children: React.ReactNode;
}
```

**Usage**:
```jsx
import { Container } from './components/Container';

function App() {
  return (
    <Container maxWidth="lg" padding>
      <h1>Welcome to my app</h1>
      <p>This content is centered and responsive.</p>
    </Container>
  );
}
```

**Props Description**:
- `maxWidth` (optional): Maximum width of the container. Default: `'lg'`
- `padding` (optional): Whether to add horizontal padding. Default: `true`
- `className` (optional): Additional CSS classes
- `children` (required): Content to be wrapped

**Example with different sizes**:
```jsx
// Small container
<Container maxWidth="sm">
  <p>Narrow content</p>
</Container>

// Full width container
<Container maxWidth="full" padding={false}>
  <p>Full width content without padding</p>
</Container>
```

### Grid

A flexible grid system for creating responsive layouts.

**Props**:
```typescript
interface GridProps {
  container?: boolean;
  item?: boolean;
  xs?: number | 'auto';
  sm?: number | 'auto';
  md?: number | 'auto';
  lg?: number | 'auto';
  xl?: number | 'auto';
  spacing?: number;
  direction?: 'row' | 'column';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  className?: string;
  children: React.ReactNode;
}
```

**Usage**:
```jsx
import { Grid } from './components/Grid';

function Dashboard() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>Chart 1</Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>Chart 2</Card>
      </Grid>
      <Grid item xs={12}>
        <Card>Full width content</Card>
      </Grid>
    </Grid>
  );
}
```

---

## Form Components

### Button

A versatile button component with multiple variants and states.

**Props**:
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  children: React.ReactNode;
}
```

**Usage**:
```jsx
import { Button } from './components/Button';
import { SaveIcon, LoadingIcon } from './icons';

function FormActions() {
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await saveData();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button 
        variant="primary" 
        onClick={handleSave}
        loading={loading}
        startIcon={<SaveIcon />}
      >
        Save Changes
      </Button>
      
      <Button variant="outline" size="sm">
        Cancel
      </Button>
    </div>
  );
}
```

**Variants**:
```jsx
// Different button variants
<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="outline">Outline Button</Button>
<Button variant="ghost">Ghost Button</Button>
<Button variant="danger">Delete Item</Button>
```

### Input

A flexible input component with validation and different types.

**Props**:
```typescript
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  label?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
```

**Usage**:
```jsx
import { Input } from './components/Input';
import { EmailIcon, EyeIcon } from './icons';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  return (
    <form>
      <Input
        type="email"
        label="Email Address"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        startIcon={<EmailIcon />}
        error={!!errors.email}
        helperText={errors.email}
        required
        fullWidth
      />
      
      <Input
        type="password"
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        endIcon={<EyeIcon />}
        error={!!errors.password}
        helperText={errors.password}
        required
        fullWidth
      />
    </form>
  );
}
```

### FormField

A wrapper component that provides consistent styling for form fields.

**Props**:
```typescript
interface FormFieldProps {
  label?: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  className?: string;
  children: React.ReactNode;
}
```

**Usage**:
```jsx
import { FormField, Input, Select } from './components';

function UserForm() {
  return (
    <form>
      <FormField 
        label="Full Name" 
        required 
        helperText="Enter your first and last name"
      >
        <Input placeholder="John Doe" />
      </FormField>
      
      <FormField 
        label="Country" 
        error={!!errors.country}
        helperText={errors.country}
      >
        <Select options={countryOptions} />
      </FormField>
    </form>
  );
}
```

---

## Data Display

### Table

A feature-rich table component with sorting, pagination, and selection.

**Props**:
```typescript
interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  sortable?: boolean;
  selectable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  onSelectionChange?: (selectedRows: T[]) => void;
  className?: string;
}

interface Column<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  width?: string;
}
```

**Usage**:
```jsx
import { Table } from './components/Table';

function UserList() {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' }
  ];

  const columns = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email' },
    { 
      key: 'status', 
      header: 'Status',
      render: (status) => (
        <Badge variant={status === 'active' ? 'success' : 'warning'}>
          {status}
        </Badge>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, user) => (
        <Button size="sm" onClick={() => editUser(user.id)}>
          Edit
        </Button>
      )
    }
  ];

  return (
    <Table
      data={users}
      columns={columns}
      sortable
      selectable
      pagination
      pageSize={10}
      onRowClick={(user) => viewUser(user.id)}
      onSelectionChange={(selected) => setSelectedUsers(selected)}
    />
  );
}
```

### Card

A flexible card component for displaying content in a contained format.

**Props**:
```typescript
interface CardProps {
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}
```

**Usage**:
```jsx
import { Card } from './components/Card';

function ProductCard({ product }) {
  return (
    <Card 
      variant="elevated" 
      hoverable 
      clickable
      onClick={() => viewProduct(product.id)}
      header={
        <div>
          <h3>{product.name}</h3>
          <Badge variant="info">{product.category}</Badge>
        </div>
      }
      footer={
        <div>
          <span className="price">${product.price}</span>
          <Button size="sm">Add to Cart</Button>
        </div>
      }
    >
      <img src={product.image} alt={product.name} />
      <p>{product.description}</p>
    </Card>
  );
}
```

---

## Navigation

### Menu

A flexible menu component for navigation and actions.

**Props**:
```typescript
interface MenuProps {
  items: MenuItem[];
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'pills' | 'underline';
  activeKey?: string;
  onSelect?: (key: string) => void;
  className?: string;
}

interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  href?: string;
  children?: MenuItem[];
}
```

**Usage**:
```jsx
import { Menu } from './components/Menu';
import { HomeIcon, UserIcon, SettingsIcon } from './icons';

function Navigation() {
  const menuItems = [
    { key: 'home', label: 'Home', icon: <HomeIcon />, href: '/' },
    { key: 'profile', label: 'Profile', icon: <UserIcon />, href: '/profile' },
    { 
      key: 'settings', 
      label: 'Settings', 
      icon: <SettingsIcon />,
      children: [
        { key: 'account', label: 'Account', href: '/settings/account' },
        { key: 'privacy', label: 'Privacy', href: '/settings/privacy' }
      ]
    }
  ];

  return (
    <Menu
      items={menuItems}
      orientation="vertical"
      variant="pills"
      activeKey="home"
      onSelect={(key) => navigate(key)}
    />
  );
}
```

### Breadcrumb

A breadcrumb component for showing navigation hierarchy.

**Props**:
```typescript
interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  maxItems?: number;
  className?: string;
}

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
}
```

**Usage**:
```jsx
import { Breadcrumb } from './components/Breadcrumb';

function PageHeader() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Electronics', href: '/products/electronics' },
    { label: 'Smartphones', active: true }
  ];

  return (
    <Breadcrumb items={breadcrumbItems} maxItems={4} />
  );
}
```

---

## Feedback

### Alert

An alert component for displaying important messages.

**Props**:
```typescript
interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}
```

**Usage**:
```jsx
import { Alert, Button } from './components';
import { InfoIcon, CheckIcon } from './icons';

function NotificationArea() {
  const [showAlert, setShowAlert] = useState(true);

  if (!showAlert) return null;

  return (
    <div>
      <Alert 
        variant="success" 
        title="Success!"
        dismissible
        onDismiss={() => setShowAlert(false)}
        icon={<CheckIcon />}
      >
        Your changes have been saved successfully.
      </Alert>
      
      <Alert 
        variant="warning"
        actions={
          <Button size="sm" variant="outline">
            Learn More
          </Button>
        }
      >
        Your subscription will expire in 3 days.
      </Alert>
    </div>
  );
}
```

### Modal

A modal dialog component for displaying content in an overlay.

**Props**:
```typescript
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
  maskClosable?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}
```

**Usage**:
```jsx
import { Modal, Button } from './components';

function DeleteConfirmation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="danger" onClick={() => setIsOpen(true)}>
        Delete Item
      </Button>
      
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirm Deletion"
        size="sm"
        footer={
          <div>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        }
      >
        <p>Are you sure you want to delete this item? This action cannot be undone.</p>
      </Modal>
    </>
  );
}
```

---

## Utility Components

### Loading

A loading component with different variants and sizes.

**Props**:
```typescript
interface LoadingProps {
  variant?: 'spinner' | 'dots' | 'bars' | 'skeleton';
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  overlay?: boolean;
  text?: string;
  className?: string;
}
```

**Usage**:
```jsx
import { Loading } from './components/Loading';

function DataLoader() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  if (loading) {
    return <Loading variant="spinner" size="lg" text="Loading data..." />;
  }

  return (
    <div>
      {/* Render data */}
      {data && <DataDisplay data={data} />}
      
      {/* Overlay loading */}
      {updating && (
        <Loading variant="spinner" overlay text="Updating..." />
      )}
    </div>
  );
}
```

### ErrorBoundary

An error boundary component for graceful error handling.

**Props**:
```typescript
interface ErrorBoundaryProps {
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  children: React.ReactNode;
}
```

**Usage**:
```jsx
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary
      fallback={({ error, retry }) => (
        <div>
          <h2>Something went wrong</h2>
          <p>{error.message}</p>
          <Button onClick={retry}>Try Again</Button>
        </div>
      )}
      onError={(error, errorInfo) => {
        console.error('Error caught by boundary:', error, errorInfo);
        // Send to error reporting service
      }}
    >
      <MainApplication />
    </ErrorBoundary>
  );
}
```

## Best Practices

### Component Design

1. **Single Responsibility**: Each component should have a single, well-defined purpose
2. **Composition over Inheritance**: Use composition to build complex components
3. **Prop Validation**: Always define prop types and default values
4. **Accessibility**: Include proper ARIA attributes and keyboard navigation

### Performance

1. **Memoization**: Use `React.memo` for expensive components
2. **Lazy Loading**: Implement code splitting for large components
3. **Prop Drilling**: Use context or state management for deeply nested props

### Testing

1. **Unit Tests**: Test individual component behavior
2. **Integration Tests**: Test component interactions
3. **Accessibility Tests**: Ensure components meet WCAG guidelines

### Example Test

```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

## Styling Guidelines

### CSS Variables

Components use CSS custom properties for theming:

```css
:root {
  --color-primary: #0066cc;
  --color-secondary: #6c757d;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --border-radius: 0.25rem;
  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.125rem;
}
```

### Responsive Design

All components are responsive and use a mobile-first approach:

```css
.component {
  /* Mobile styles */
  padding: var(--spacing-sm);
}

@media (min-width: 768px) {
  .component {
    /* Tablet styles */
    padding: var(--spacing-md);
  }
}

@media (min-width: 1024px) {
  .component {
    /* Desktop styles */
    padding: var(--spacing-lg);
  }
}
```
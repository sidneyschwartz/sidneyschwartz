# Examples

This document provides practical examples and common use cases for all APIs, functions, and components.

## Table of Contents

- [API Integration Examples](#api-integration-examples)
- [Component Usage Examples](#component-usage-examples)
- [Utility Function Examples](#utility-function-examples)
- [Complete Application Examples](#complete-application-examples)
- [Testing Examples](#testing-examples)

---

## API Integration Examples

### Basic CRUD Operations

```javascript
import { createApiClient } from '../utils/api';

const api = createApiClient('https://api.example.com/v1', {
  headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
});

// Create a new user
async function createUser(userData) {
  try {
    const newUser = await api.post('/users', {
      name: userData.name,
      email: userData.email,
      role: userData.role || 'user'
    });
    
    console.log('User created:', newUser);
    return newUser;
  } catch (error) {
    console.error('Failed to create user:', error);
    throw error;
  }
}

// Get paginated user list
async function getUsers(page = 1, limit = 20) {
  try {
    const response = await api.get(`/users?page=${page}&limit=${limit}`);
    return response;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw error;
  }
}

// Update user profile
async function updateUser(userId, updates) {
  try {
    const updatedUser = await api.put(`/users/${userId}`, updates);
    console.log('User updated:', updatedUser);
    return updatedUser;
  } catch (error) {
    console.error('Failed to update user:', error);
    throw error;
  }
}

// Delete user
async function deleteUser(userId) {
  try {
    await api.delete(`/users/${userId}`);
    console.log('User deleted successfully');
  } catch (error) {
    console.error('Failed to delete user:', error);
    throw error;
  }
}
```

### Error Handling and Retry Logic

```javascript
import { fetchWithRetry } from '../utils/api';

async function robustApiCall() {
  try {
    // Automatic retry with custom configuration
    const response = await fetchWithRetry('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'value' }),
      retries: 5,
      retryDelay: 2000,
      timeout: 10000
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Handle different error types
    if (error.name === 'TypeError') {
      console.error('Network error:', error.message);
    } else if (error.message.includes('HTTP 4')) {
      console.error('Client error:', error.message);
    } else if (error.message.includes('HTTP 5')) {
      console.error('Server error:', error.message);
    } else {
      console.error('Unknown error:', error.message);
    }
    
    throw error;
  }
}
```

---

## Component Usage Examples

### Form with Validation

```jsx
import React, { useState } from 'react';
import { Input, Button, FormField, Alert } from '../components';
import { validatePassword, isEmail } from '../utils/validation';

function RegistrationForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!isEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors[0];
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await createUser(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    } catch (error) {
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (success) {
    return (
      <Alert variant="success" title="Registration Successful!">
        Your account has been created successfully. Please check your email for verification.
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {errors.submit && (
        <Alert variant="error" dismissible onDismiss={() => setErrors(prev => ({ ...prev, submit: '' }))}>
          {errors.submit}
        </Alert>
      )}

      <FormField label="Full Name" required error={!!errors.name} helperText={errors.name}>
        <Input
          type="text"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleInputChange('name')}
          error={!!errors.name}
          fullWidth
        />
      </FormField>

      <FormField label="Email Address" required error={!!errors.email} helperText={errors.email}>
        <Input
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleInputChange('email')}
          error={!!errors.email}
          fullWidth
        />
      </FormField>

      <FormField label="Password" required error={!!errors.password} helperText={errors.password}>
        <Input
          type="password"
          placeholder="Create a password"
          value={formData.password}
          onChange={handleInputChange('password')}
          error={!!errors.password}
          fullWidth
        />
      </FormField>

      <FormField label="Confirm Password" required error={!!errors.confirmPassword} helperText={errors.confirmPassword}>
        <Input
          type="password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleInputChange('confirmPassword')}
          error={!!errors.confirmPassword}
          fullWidth
        />
      </FormField>

      <Button
        type="submit"
        variant="primary"
        loading={loading}
        fullWidth
        disabled={loading}
      >
        {loading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  );
}

export default RegistrationForm;
```

### Data Table with Actions

```jsx
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Alert } from '../components';
import { formatDate } from '../utils/date';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ open: false, user: null });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (user) => {
    try {
      await deleteUser(user.id);
      setUsers(prev => prev.filter(u => u.id !== user.id));
      setDeleteModal({ open: false, user: null });
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedUsers.map(user => deleteUser(user.id)));
      setUsers(prev => prev.filter(user => !selectedUsers.find(selected => selected.id === user.id)));
      setSelectedUsers([]);
    } catch (error) {
      console.error('Failed to delete users:', error);
    }
  };

  const columns = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    {
      key: 'created_at',
      header: 'Created',
      sortable: true,
      render: (date) => formatDate(new Date(date), 'MM/DD/YYYY')
    },
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
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => editUser(user)}>
            Edit
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => setDeleteModal({ open: true, user })}
          >
            Delete
          </Button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1>User Management</h1>
        <div className="flex gap-2">
          {selectedUsers.length > 0 && (
            <Button variant="danger" onClick={handleBulkDelete}>
              Delete Selected ({selectedUsers.length})
            </Button>
          )}
          <Button variant="primary" onClick={() => setCreateModal(true)}>
            Add User
          </Button>
        </div>
      </div>

      <Table
        data={users}
        columns={columns}
        loading={loading}
        sortable
        selectable
        pagination
        pageSize={20}
        onSelectionChange={setSelectedUsers}
        emptyMessage="No users found"
      />

      <Modal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, user: null })}
        title="Confirm Deletion"
        size="sm"
        footer={
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ open: false, user: null })}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => handleDeleteUser(deleteModal.user)}
            >
              Delete
            </Button>
          </div>
        }
      >
        <p>
          Are you sure you want to delete <strong>{deleteModal.user?.name}</strong>?
          This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}

export default UserManagement;
```

---

## Utility Function Examples

### Data Processing Pipeline

```javascript
import { 
  unique, 
  groupBy, 
  chunk,
  formatDate,
  capitalize,
  slugify 
} from '../utils';

// Process raw user data
function processUserData(rawUsers) {
  // Remove duplicates by email
  const uniqueUsers = unique(rawUsers, user => user.email);

  // Group users by role
  const usersByRole = groupBy(uniqueUsers, user => user.role);

  // Format user data
  const formattedUsers = uniqueUsers.map(user => ({
    ...user,
    name: capitalize(user.name),
    slug: slugify(user.name),
    joinDate: formatDate(new Date(user.created_at), 'MMM DD, YYYY'),
    isActive: user.last_login && diffDays(new Date(), new Date(user.last_login)) <= 30
  }));

  // Chunk users for batch processing
  const userBatches = chunk(formattedUsers, 50);

  return {
    users: formattedUsers,
    usersByRole,
    userBatches,
    stats: {
      total: formattedUsers.length,
      active: formattedUsers.filter(u => u.isActive).length,
      roleDistribution: Object.keys(usersByRole).map(role => ({
        role,
        count: usersByRole[role].length
      }))
    }
  };
}

// Example usage
const rawData = [
  { id: 1, name: 'john doe', email: 'john@example.com', role: 'admin', created_at: '2023-01-15', last_login: '2023-12-01' },
  { id: 2, name: 'jane smith', email: 'jane@example.com', role: 'user', created_at: '2023-02-20', last_login: '2023-11-15' },
  // ... more users
];

const processed = processUserData(rawData);
console.log(processed);
```

### Form Validation Utilities

```javascript
import { 
  isEmail, 
  isURL, 
  validatePassword, 
  sanitizeInput 
} from '../utils/validation';

// Comprehensive form validator
class FormValidator {
  constructor() {
    this.rules = {};
    this.errors = {};
  }

  // Add validation rules
  addRule(field, validators) {
    this.rules[field] = Array.isArray(validators) ? validators : [validators];
    return this;
  }

  // Built-in validators
  static validators = {
    required: (value) => ({
      isValid: value !== null && value !== undefined && value.toString().trim() !== '',
      message: 'This field is required'
    }),

    email: (value) => ({
      isValid: !value || isEmail(value),
      message: 'Please enter a valid email address'
    }),

    url: (value) => ({
      isValid: !value || isURL(value),
      message: 'Please enter a valid URL'
    }),

    minLength: (min) => (value) => ({
      isValid: !value || value.length >= min,
      message: `Must be at least ${min} characters long`
    }),

    maxLength: (max) => (value) => ({
      isValid: !value || value.length <= max,
      message: `Must be no more than ${max} characters long`
    }),

    password: (value) => {
      const result = validatePassword(value);
      return {
        isValid: result.isValid,
        message: result.errors[0] || ''
      };
    },

    match: (otherField) => (value, data) => ({
      isValid: value === data[otherField],
      message: `Must match ${otherField}`
    }),

    custom: (validatorFn, message) => (value, data) => ({
      isValid: validatorFn(value, data),
      message
    })
  };

  // Validate form data
  validate(data) {
    this.errors = {};
    let isValid = true;

    Object.keys(this.rules).forEach(field => {
      const fieldRules = this.rules[field];
      const value = data[field];

      for (const rule of fieldRules) {
        const result = rule(value, data);
        if (!result.isValid) {
          this.errors[field] = result.message;
          isValid = false;
          break; // Stop at first error for this field
        }
      }
    });

    return { isValid, errors: this.errors };
  }

  // Get errors for a specific field
  getFieldError(field) {
    return this.errors[field] || '';
  }

  // Check if field has error
  hasError(field) {
    return !!this.errors[field];
  }
}

// Example usage
const validator = new FormValidator()
  .addRule('name', [
    FormValidator.validators.required,
    FormValidator.validators.minLength(2)
  ])
  .addRule('email', [
    FormValidator.validators.required,
    FormValidator.validators.email
  ])
  .addRule('password', [
    FormValidator.validators.required,
    FormValidator.validators.password
  ])
  .addRule('confirmPassword', [
    FormValidator.validators.required,
    FormValidator.validators.match('password')
  ])
  .addRule('website', [
    FormValidator.validators.url
  ])
  .addRule('age', [
    FormValidator.validators.custom(
      (value) => value >= 18,
      'Must be at least 18 years old'
    )
  ]);

const formData = {
  name: 'John Doe',
  email: 'john@example.com',
  password: 'StrongP@ss123',
  confirmPassword: 'StrongP@ss123',
  website: 'https://johndoe.com',
  age: 25
};

const validation = validator.validate(formData);
console.log(validation); // { isValid: true, errors: {} }
```

---

## Complete Application Examples

### Todo App with Local Storage

```jsx
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Input, 
  Button, 
  Card, 
  Checkbox,
  Alert 
} from '../components';
import { createStore } from '../utils/storage';
import { formatDate, addDays } from '../utils/date';
import { slugify, capitalize } from '../utils/string';

// Create persistent store
const todoStore = createStore('todos', []);

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, completed
  const [error, setError] = useState('');

  useEffect(() => {
    // Load todos from storage
    const storedTodos = todoStore.get();
    setTodos(storedTodos);

    // Subscribe to storage changes
    const unsubscribe = todoStore.subscribe(setTodos);
    return unsubscribe;
  }, []);

  const addTodo = (e) => {
    e.preventDefault();
    
    if (!newTodo.trim()) {
      setError('Please enter a todo item');
      return;
    }

    const todo = {
      id: Date.now().toString(),
      text: capitalize(newTodo.trim()),
      slug: slugify(newTodo.trim()),
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate: addDays(new Date(), 7).toISOString()
    };

    const updatedTodos = [...todos, todo];
    setTodos(updatedTodos);
    todoStore.set(updatedTodos);
    setNewTodo('');
    setError('');
  };

  const toggleTodo = (id) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id
        ? { ...todo, completed: !todo.completed, completedAt: !todo.completed ? new Date().toISOString() : null }
        : todo
    );
    setTodos(updatedTodos);
    todoStore.set(updatedTodos);
  };

  const deleteTodo = (id) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
    todoStore.set(updatedTodos);
  };

  const clearCompleted = () => {
    const updatedTodos = todos.filter(todo => !todo.completed);
    setTodos(updatedTodos);
    todoStore.set(updatedTodos);
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active': return !todo.completed;
      case 'completed': return todo.completed;
      default: return true;
    }
  });

  const stats = {
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length
  };

  return (
    <Container maxWidth="md">
      <div className="py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Todo App</h1>

        {/* Add Todo Form */}
        <Card className="mb-6">
          <form onSubmit={addTodo} className="flex gap-2">
            <Input
              type="text"
              placeholder="Add a new todo..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              error={!!error}
              className="flex-1"
            />
            <Button type="submit" variant="primary">
              Add Todo
            </Button>
          </form>
          {error && (
            <Alert variant="error" className="mt-2" dismissible onDismiss={() => setError('')}>
              {error}
            </Alert>
          )}
        </Card>

        {/* Stats */}
        <Card className="mb-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {stats.total} total, {stats.active} active, {stats.completed} completed
            </div>
            {stats.completed > 0 && (
              <Button size="sm" variant="outline" onClick={clearCompleted}>
                Clear Completed
              </Button>
            )}
          </div>
        </Card>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6">
          {['all', 'active', 'completed'].map(filterType => (
            <Button
              key={filterType}
              size="sm"
              variant={filter === filterType ? 'primary' : 'outline'}
              onClick={() => setFilter(filterType)}
            >
              {capitalize(filterType)}
            </Button>
          ))}
        </div>

        {/* Todo List */}
        <div className="space-y-2">
          {filteredTodos.length === 0 ? (
            <Card>
              <p className="text-center text-gray-500 py-8">
                {filter === 'all' ? 'No todos yet' : `No ${filter} todos`}
              </p>
            </Card>
          ) : (
            filteredTodos.map(todo => (
              <Card key={todo.id} className="flex items-center gap-3 p-4">
                <Checkbox
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                />
                <div className="flex-1">
                  <p className={`${todo.completed ? 'line-through text-gray-500' : ''}`}>
                    {todo.text}
                  </p>
                  <p className="text-xs text-gray-400">
                    Created: {formatDate(new Date(todo.createdAt), 'MMM DD, YYYY')}
                    {todo.completedAt && (
                      <span> • Completed: {formatDate(new Date(todo.completedAt), 'MMM DD, YYYY')}</span>
                    )}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => deleteTodo(todo.id)}
                >
                  Delete
                </Button>
              </Card>
            ))
          )}
        </div>
      </div>
    </Container>
  );
}

export default TodoApp;
```

---

## Testing Examples

### Component Testing

```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button, Input, Modal } from '../components';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('handles click events', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('applies correct variant styles', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-primary');

    rerender(<Button variant="danger">Danger</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-danger');
  });
});

describe('Input Component', () => {
  it('handles value changes', async () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'Hello');
    
    expect(handleChange).toHaveBeenCalledTimes(5); // One call per character
    expect(input).toHaveValue('Hello');
  });

  it('shows error state', () => {
    render(<Input error helperText="This field is required" />);
    
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('supports different input types', () => {
    const { rerender } = render(<Input type="email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');

    rerender(<Input type="password" />);
    expect(screen.getByLabelText(/password/i)).toHaveAttribute('type', 'password');
  });
});

describe('Modal Component', () => {
  it('renders when open', () => {
    render(
      <Modal open title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <Modal open={false} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const handleClose = jest.fn();
    render(
      <Modal open onClose={handleClose} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    
    await userEvent.click(screen.getByLabelText(/close/i));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('supports keyboard navigation', async () => {
    const handleClose = jest.fn();
    render(
      <Modal open onClose={handleClose} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    
    // Press Escape key
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
```

### Utility Function Testing

```javascript
import { 
  capitalize, 
  slugify, 
  formatDate, 
  validatePassword,
  unique,
  groupBy 
} from '../utils';

describe('String Utilities', () => {
  describe('capitalize', () => {
    it('capitalizes first letter', () => {
      expect(capitalize('hello world')).toBe('Hello world');
      expect(capitalize('HELLO WORLD')).toBe('HELLO WORLD');
      expect(capitalize('hello')).toBe('Hello');
    });

    it('handles edge cases', () => {
      expect(capitalize('')).toBe('');
      expect(capitalize('a')).toBe('A');
      expect(capitalize('123')).toBe('123');
    });
  });

  describe('slugify', () => {
    it('creates URL-friendly slugs', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('Special @#$ Characters')).toBe('special-characters');
      expect(slugify('Multiple   Spaces')).toBe('multiple-spaces');
    });

    it('supports custom options', () => {
      expect(slugify('Hello World', { separator: '_' })).toBe('hello_world');
      expect(slugify('Hello World', { lowercase: false })).toBe('Hello-World');
    });
  });
});

describe('Date Utilities', () => {
  describe('formatDate', () => {
    const testDate = new Date('2023-12-25T14:30:00');

    it('formats dates correctly', () => {
      expect(formatDate(testDate, 'YYYY-MM-DD')).toBe('2023-12-25');
      expect(formatDate(testDate, 'MM/DD/YYYY')).toBe('12/25/2023');
      expect(formatDate(testDate, 'DD MMM YYYY')).toBe('25 Dec 2023');
    });

    it('includes time when requested', () => {
      expect(formatDate(testDate, 'YYYY-MM-DD HH:mm')).toBe('2023-12-25 14:30');
    });
  });
});

describe('Validation Functions', () => {
  describe('validatePassword', () => {
    it('validates strong passwords', () => {
      const result = validatePassword('StrongP@ss123');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.score).toBeGreaterThan(80);
    });

    it('rejects weak passwords', () => {
      const result = validatePassword('weak');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.score).toBeLessThan(50);
    });

    it('respects custom options', () => {
      const result = validatePassword('simplepass', {
        minLength: 6,
        requireSpecialChars: false,
        requireNumbers: false,
        requireUppercase: false
      });
      expect(result.isValid).toBe(true);
    });
  });
});

describe('Array Utilities', () => {
  describe('unique', () => {
    it('removes duplicate primitives', () => {
      expect(unique([1, 2, 2, 3, 3, 4])).toEqual([1, 2, 3, 4]);
      expect(unique(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c']);
    });

    it('removes duplicate objects by reference', () => {
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };
      expect(unique([obj1, obj2, obj1])).toEqual([obj1, obj2]);
    });
  });

  describe('groupBy', () => {
    const data = [
      { name: 'John', role: 'admin' },
      { name: 'Jane', role: 'user' },
      { name: 'Bob', role: 'admin' }
    ];

    it('groups items by key function', () => {
      const result = groupBy(data, item => item.role);
      
      expect(result).toHaveProperty('admin');
      expect(result).toHaveProperty('user');
      expect(result.admin).toHaveLength(2);
      expect(result.user).toHaveLength(1);
    });
  });
});
```

### Integration Testing

```javascript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import TodoApp from '../examples/TodoApp';

// Mock API server
const server = setupServer(
  rest.get('/api/todos', (req, res, ctx) => {
    return res(ctx.json([
      { id: '1', text: 'Test todo', completed: false, createdAt: '2023-01-01' }
    ]));
  }),
  
  rest.post('/api/todos', (req, res, ctx) => {
    return res(ctx.json({
      id: '2',
      text: req.body.text,
      completed: false,
      createdAt: new Date().toISOString()
    }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('TodoApp Integration', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('loads and displays todos', async () => {
    render(<TodoApp />);
    
    expect(screen.getByText('Todo App')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Add a new todo...')).toBeInTheDocument();
  });

  it('adds new todos', async () => {
    render(<TodoApp />);
    
    const input = screen.getByPlaceholderText('Add a new todo...');
    const addButton = screen.getByText('Add Todo');
    
    await userEvent.type(input, 'New test todo');
    await userEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByText('New test todo')).toBeInTheDocument();
    });
    
    expect(input).toHaveValue('');
  });

  it('toggles todo completion', async () => {
    render(<TodoApp />);
    
    // Add a todo first
    const input = screen.getByPlaceholderText('Add a new todo...');
    await userEvent.type(input, 'Toggle test');
    await userEvent.click(screen.getByText('Add Todo'));
    
    await waitFor(() => {
      expect(screen.getByText('Toggle test')).toBeInTheDocument();
    });
    
    // Toggle completion
    const checkbox = screen.getByRole('checkbox');
    await userEvent.click(checkbox);
    
    expect(checkbox).toBeChecked();
    expect(screen.getByText('Toggle test')).toHaveClass('line-through');
  });

  it('filters todos correctly', async () => {
    render(<TodoApp />);
    
    // Add completed and active todos
    const input = screen.getByPlaceholderText('Add a new todo...');
    
    await userEvent.type(input, 'Active todo');
    await userEvent.click(screen.getByText('Add Todo'));
    
    await userEvent.type(input, 'Completed todo');
    await userEvent.click(screen.getByText('Add Todo'));
    
    await waitFor(() => {
      expect(screen.getByText('Completed todo')).toBeInTheDocument();
    });
    
    // Mark second todo as completed
    const checkboxes = screen.getAllByRole('checkbox');
    await userEvent.click(checkboxes[1]);
    
    // Filter by active
    await userEvent.click(screen.getByText('Active'));
    expect(screen.getByText('Active todo')).toBeInTheDocument();
    expect(screen.queryByText('Completed todo')).not.toBeInTheDocument();
    
    // Filter by completed
    await userEvent.click(screen.getByText('Completed'));
    expect(screen.queryByText('Active todo')).not.toBeInTheDocument();
    expect(screen.getByText('Completed todo')).toBeInTheDocument();
  });

  it('persists todos in localStorage', async () => {
    const { unmount } = render(<TodoApp />);
    
    // Add a todo
    const input = screen.getByPlaceholderText('Add a new todo...');
    await userEvent.type(input, 'Persistent todo');
    await userEvent.click(screen.getByText('Add Todo'));
    
    await waitFor(() => {
      expect(screen.getByText('Persistent todo')).toBeInTheDocument();
    });
    
    // Unmount and remount component
    unmount();
    render(<TodoApp />);
    
    // Todo should still be there
    await waitFor(() => {
      expect(screen.getByText('Persistent todo')).toBeInTheDocument();
    });
  });
});
```

This comprehensive examples documentation provides practical, working code samples that developers can use as references for implementing similar functionality in their own projects. Each example includes proper error handling, best practices, and realistic use cases.
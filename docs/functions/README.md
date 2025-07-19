# Function Documentation

This document provides comprehensive documentation for all utility functions and their usage.

## Categories

- [String Utilities](#string-utilities) - Text manipulation and formatting
- [Array Utilities](#array-utilities) - Array operations and transformations
- [Object Utilities](#object-utilities) - Object manipulation and validation
- [Date Utilities](#date-utilities) - Date formatting and calculations
- [Validation Functions](#validation-functions) - Input validation and sanitization
- [API Utilities](#api-utilities) - HTTP requests and data fetching
- [Storage Utilities](#storage-utilities) - Local storage and session management
- [Math Utilities](#math-utilities) - Mathematical operations and calculations

---

## String Utilities

### `capitalize(str: string): string`

Capitalizes the first letter of a string.

**Parameters**:
- `str` (string): The string to capitalize

**Returns**: 
- `string`: The capitalized string

**Example**:
```javascript
import { capitalize } from './utils/string';

console.log(capitalize('hello world')); // "Hello world"
console.log(capitalize('HELLO WORLD')); // "HELLO WORLD"
console.log(capitalize('')); // ""
```

### `slugify(str: string, options?: SlugifyOptions): string`

Converts a string to a URL-friendly slug.

**Parameters**:
- `str` (string): The string to slugify
- `options` (SlugifyOptions, optional): Configuration options

**Options**:
```typescript
interface SlugifyOptions {
  separator?: string; // Default: '-'
  lowercase?: boolean; // Default: true
  strict?: boolean; // Default: false
}
```

**Returns**: 
- `string`: The slugified string

**Example**:
```javascript
import { slugify } from './utils/string';

console.log(slugify('Hello World!')); // "hello-world"
console.log(slugify('Hello World!', { separator: '_' })); // "hello_world"
console.log(slugify('Hello World!', { lowercase: false })); // "Hello-World"
console.log(slugify('Special @#$ Characters', { strict: true })); // "special-characters"
```

### `truncate(str: string, length: number, suffix?: string): string`

Truncates a string to a specified length.

**Parameters**:
- `str` (string): The string to truncate
- `length` (number): Maximum length of the result
- `suffix` (string, optional): Suffix to append. Default: '...'

**Returns**: 
- `string`: The truncated string

**Example**:
```javascript
import { truncate } from './utils/string';

console.log(truncate('This is a long sentence', 10)); // "This is a..."
console.log(truncate('Short', 10)); // "Short"
console.log(truncate('This is a long sentence', 10, ' [more]')); // "This is a [more]"
```

### `formatTemplate(template: string, variables: Record<string, any>): string`

Replaces template variables in a string with provided values.

**Parameters**:
- `template` (string): Template string with `{{variable}}` placeholders
- `variables` (Record<string, any>): Object with variable values

**Returns**: 
- `string`: The formatted string

**Example**:
```javascript
import { formatTemplate } from './utils/string';

const template = 'Hello {{name}}, you have {{count}} new messages';
const variables = { name: 'John', count: 5 };

console.log(formatTemplate(template, variables)); 
// "Hello John, you have 5 new messages"

// With missing variables
const incomplete = { name: 'John' };
console.log(formatTemplate(template, incomplete)); 
// "Hello John, you have {{count}} new messages"
```

---

## Array Utilities

### `unique<T>(array: T[]): T[]`

Returns an array with unique values.

**Parameters**:
- `array` (T[]): The input array

**Returns**: 
- `T[]`: Array with unique values

**Example**:
```javascript
import { unique } from './utils/array';

console.log(unique([1, 2, 2, 3, 3, 4])); // [1, 2, 3, 4]
console.log(unique(['a', 'b', 'a', 'c'])); // ['a', 'b', 'c']

// With objects (by reference)
const obj1 = { id: 1 };
const obj2 = { id: 2 };
console.log(unique([obj1, obj2, obj1])); // [obj1, obj2]
```

### `uniqueBy<T>(array: T[], keyFn: (item: T) => any): T[]`

Returns an array with unique values based on a key function.

**Parameters**:
- `array` (T[]): The input array
- `keyFn` (function): Function to extract the comparison key

**Returns**: 
- `T[]`: Array with unique values

**Example**:
```javascript
import { uniqueBy } from './utils/array';

const users = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' },
  { id: 1, name: 'John Doe' }
];

console.log(uniqueBy(users, user => user.id));
// [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]

console.log(uniqueBy(users, user => user.name.split(' ')[0]));
// [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]
```

### `groupBy<T>(array: T[], keyFn: (item: T) => string | number): Record<string, T[]>`

Groups array elements by a key function.

**Parameters**:
- `array` (T[]): The input array
- `keyFn` (function): Function to extract the grouping key

**Returns**: 
- `Record<string, T[]>`: Object with grouped arrays

**Example**:
```javascript
import { groupBy } from './utils/array';

const products = [
  { name: 'iPhone', category: 'electronics' },
  { name: 'Shirt', category: 'clothing' },
  { name: 'iPad', category: 'electronics' },
  { name: 'Pants', category: 'clothing' }
];

console.log(groupBy(products, product => product.category));
// {
//   electronics: [
//     { name: 'iPhone', category: 'electronics' },
//     { name: 'iPad', category: 'electronics' }
//   ],
//   clothing: [
//     { name: 'Shirt', category: 'clothing' },
//     { name: 'Pants', category: 'clothing' }
//   ]
// }
```

### `chunk<T>(array: T[], size: number): T[][]`

Splits an array into chunks of specified size.

**Parameters**:
- `array` (T[]): The input array
- `size` (number): Size of each chunk

**Returns**: 
- `T[][]`: Array of chunks

**Example**:
```javascript
import { chunk } from './utils/array';

console.log(chunk([1, 2, 3, 4, 5, 6, 7], 3)); 
// [[1, 2, 3], [4, 5, 6], [7]]

console.log(chunk(['a', 'b', 'c', 'd'], 2)); 
// [['a', 'b'], ['c', 'd']]

console.log(chunk([1, 2, 3], 5)); 
// [[1, 2, 3]]
```

---

## Object Utilities

### `deepClone<T>(obj: T): T`

Creates a deep copy of an object.

**Parameters**:
- `obj` (T): The object to clone

**Returns**: 
- `T`: Deep copy of the object

**Example**:
```javascript
import { deepClone } from './utils/object';

const original = {
  name: 'John',
  address: {
    street: '123 Main St',
    city: 'Boston'
  },
  hobbies: ['reading', 'swimming']
};

const copy = deepClone(original);
copy.address.city = 'New York';
copy.hobbies.push('running');

console.log(original.address.city); // "Boston" (unchanged)
console.log(original.hobbies); // ['reading', 'swimming'] (unchanged)
```

### `merge<T>(...objects: Partial<T>[]): T`

Merges multiple objects deeply.

**Parameters**:
- `objects` (...Partial<T>[]): Objects to merge

**Returns**: 
- `T`: Merged object

**Example**:
```javascript
import { merge } from './utils/object';

const defaults = {
  theme: 'light',
  settings: {
    notifications: true,
    language: 'en'
  }
};

const userPrefs = {
  theme: 'dark',
  settings: {
    notifications: false
  }
};

const config = merge(defaults, userPrefs);
console.log(config);
// {
//   theme: 'dark',
//   settings: {
//     notifications: false,
//     language: 'en'
//   }
// }
```

### `pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>`

Creates an object with only the specified keys.

**Parameters**:
- `obj` (T): The source object
- `keys` (K[]): Array of keys to pick

**Returns**: 
- `Pick<T, K>`: Object with only the specified keys

**Example**:
```javascript
import { pick } from './utils/object';

const user = {
  id: 1,
  name: 'John',
  email: 'john@example.com',
  password: 'secret',
  role: 'admin'
};

const publicUser = pick(user, ['id', 'name', 'email']);
console.log(publicUser);
// { id: 1, name: 'John', email: 'john@example.com' }
```

### `omit<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>`

Creates an object without the specified keys.

**Parameters**:
- `obj` (T): The source object
- `keys` (K[]): Array of keys to omit

**Returns**: 
- `Omit<T, K>`: Object without the specified keys

**Example**:
```javascript
import { omit } from './utils/object';

const user = {
  id: 1,
  name: 'John',
  email: 'john@example.com',
  password: 'secret',
  role: 'admin'
};

const safeUser = omit(user, ['password']);
console.log(safeUser);
// { id: 1, name: 'John', email: 'john@example.com', role: 'admin' }
```

---

## Date Utilities

### `formatDate(date: Date, format: string): string`

Formats a date according to the specified format.

**Parameters**:
- `date` (Date): The date to format
- `format` (string): Format string (YYYY, MM, DD, HH, mm, ss)

**Returns**: 
- `string`: Formatted date string

**Example**:
```javascript
import { formatDate } from './utils/date';

const date = new Date('2023-12-25T14:30:00');

console.log(formatDate(date, 'YYYY-MM-DD')); // "2023-12-25"
console.log(formatDate(date, 'MM/DD/YYYY')); // "12/25/2023"
console.log(formatDate(date, 'YYYY-MM-DD HH:mm:ss')); // "2023-12-25 14:30:00"
console.log(formatDate(date, 'DD MMM YYYY')); // "25 Dec 2023"
```

### `addDays(date: Date, days: number): Date`

Adds or subtracts days from a date.

**Parameters**:
- `date` (Date): The base date
- `days` (number): Number of days to add (negative to subtract)

**Returns**: 
- `Date`: New date with days added

**Example**:
```javascript
import { addDays } from './utils/date';

const today = new Date('2023-12-25');

console.log(addDays(today, 7)); // 2024-01-01
console.log(addDays(today, -7)); // 2023-12-18
console.log(addDays(today, 0)); // 2023-12-25
```

### `diffDays(date1: Date, date2: Date): number`

Calculates the difference in days between two dates.

**Parameters**:
- `date1` (Date): First date
- `date2` (Date): Second date

**Returns**: 
- `number`: Number of days between dates (positive if date1 > date2)

**Example**:
```javascript
import { diffDays } from './utils/date';

const date1 = new Date('2023-12-25');
const date2 = new Date('2023-12-20');

console.log(diffDays(date1, date2)); // 5
console.log(diffDays(date2, date1)); // -5
console.log(diffDays(date1, date1)); // 0
```

### `isWeekend(date: Date): boolean`

Checks if a date falls on a weekend.

**Parameters**:
- `date` (Date): The date to check

**Returns**: 
- `boolean`: True if the date is Saturday or Sunday

**Example**:
```javascript
import { isWeekend } from './utils/date';

console.log(isWeekend(new Date('2023-12-23'))); // true (Saturday)
console.log(isWeekend(new Date('2023-12-24'))); // true (Sunday)
console.log(isWeekend(new Date('2023-12-25'))); // false (Monday)
```

---

## Validation Functions

### `isEmail(email: string): boolean`

Validates an email address format.

**Parameters**:
- `email` (string): Email address to validate

**Returns**: 
- `boolean`: True if email format is valid

**Example**:
```javascript
import { isEmail } from './utils/validation';

console.log(isEmail('user@example.com')); // true
console.log(isEmail('user.name+tag@example.co.uk')); // true
console.log(isEmail('invalid.email')); // false
console.log(isEmail('user@')); // false
```

### `isURL(url: string): boolean`

Validates a URL format.

**Parameters**:
- `url` (string): URL to validate

**Returns**: 
- `boolean`: True if URL format is valid

**Example**:
```javascript
import { isURL } from './utils/validation';

console.log(isURL('https://example.com')); // true
console.log(isURL('http://localhost:3000')); // true
console.log(isURL('ftp://files.example.com')); // true
console.log(isURL('invalid-url')); // false
```

### `validatePassword(password: string, options?: PasswordOptions): ValidationResult`

Validates password strength based on configurable criteria.

**Parameters**:
- `password` (string): Password to validate
- `options` (PasswordOptions, optional): Validation criteria

**Options**:
```typescript
interface PasswordOptions {
  minLength?: number; // Default: 8
  requireUppercase?: boolean; // Default: true
  requireLowercase?: boolean; // Default: true
  requireNumbers?: boolean; // Default: true
  requireSpecialChars?: boolean; // Default: true
  specialChars?: string; // Default: '!@#$%^&*'
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  score: number; // 0-100
}
```

**Returns**: 
- `ValidationResult`: Validation result with errors and strength score

**Example**:
```javascript
import { validatePassword } from './utils/validation';

console.log(validatePassword('weak'));
// {
//   isValid: false,
//   errors: [
//     'Password must be at least 8 characters long',
//     'Password must contain uppercase letters',
//     'Password must contain numbers',
//     'Password must contain special characters'
//   ],
//   score: 25
// }

console.log(validatePassword('StrongP@ss123'));
// {
//   isValid: true,
//   errors: [],
//   score: 95
// }

// Custom options
console.log(validatePassword('simplepass', { 
  minLength: 6, 
  requireSpecialChars: false 
}));
// {
//   isValid: false,
//   errors: ['Password must contain uppercase letters', 'Password must contain numbers'],
//   score: 40
// }
```

### `sanitizeInput(input: string, options?: SanitizeOptions): string`

Sanitizes user input to prevent XSS attacks.

**Parameters**:
- `input` (string): Input string to sanitize
- `options` (SanitizeOptions, optional): Sanitization options

**Options**:
```typescript
interface SanitizeOptions {
  allowedTags?: string[]; // Default: []
  stripTags?: boolean; // Default: true
  escapeHtml?: boolean; // Default: true
}
```

**Returns**: 
- `string`: Sanitized input string

**Example**:
```javascript
import { sanitizeInput } from './utils/validation';

console.log(sanitizeInput('<script>alert("xss")</script>Hello')); 
// "Hello"

console.log(sanitizeInput('<b>Bold</b> and <i>italic</i> text', {
  allowedTags: ['b', 'i']
})); 
// "<b>Bold</b> and <i>italic</i> text"

console.log(sanitizeInput('<div>Content</div>', {
  stripTags: false,
  escapeHtml: true
})); 
// "&lt;div&gt;Content&lt;/div&gt;"
```

---

## API Utilities

### `fetchWithRetry(url: string, options?: FetchOptions): Promise<Response>`

Fetches data with automatic retry logic.

**Parameters**:
- `url` (string): URL to fetch
- `options` (FetchOptions, optional): Fetch options with retry configuration

**Options**:
```typescript
interface FetchOptions extends RequestInit {
  retries?: number; // Default: 3
  retryDelay?: number; // Default: 1000ms
  timeout?: number; // Default: 5000ms
}
```

**Returns**: 
- `Promise<Response>`: Fetch response

**Example**:
```javascript
import { fetchWithRetry } from './utils/api';

// Basic usage
try {
  const response = await fetchWithRetry('/api/users');
  const users = await response.json();
  console.log(users);
} catch (error) {
  console.error('Failed after retries:', error);
}

// With custom options
try {
  const response = await fetchWithRetry('/api/data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: 'value' }),
    retries: 5,
    retryDelay: 2000,
    timeout: 10000
  });
} catch (error) {
  console.error('Request failed:', error);
}
```

### `createApiClient(baseURL: string, defaultOptions?: RequestInit): ApiClient`

Creates a configured API client with common functionality.

**Parameters**:
- `baseURL` (string): Base URL for all requests
- `defaultOptions` (RequestInit, optional): Default options for all requests

**Returns**: 
- `ApiClient`: Configured API client

**Example**:
```javascript
import { createApiClient } from './utils/api';

const api = createApiClient('https://api.example.com', {
  headers: {
    'Authorization': 'Bearer token',
    'Content-Type': 'application/json'
  }
});

// GET request
const users = await api.get('/users');

// POST request
const newUser = await api.post('/users', {
  name: 'John Doe',
  email: 'john@example.com'
});

// PUT request
const updatedUser = await api.put('/users/123', {
  name: 'Jane Doe'
});

// DELETE request
await api.delete('/users/123');

// Custom request
const response = await api.request('/custom', {
  method: 'PATCH',
  body: JSON.stringify({ status: 'active' })
});
```

---

## Storage Utilities

### `localStorage` utilities

Safe localStorage operations with JSON serialization.

```javascript
import { storage } from './utils/storage';

// Set item
storage.set('user', { id: 1, name: 'John' });

// Get item
const user = storage.get('user'); // { id: 1, name: 'John' }

// Get with default value
const theme = storage.get('theme', 'light'); // 'light' if not found

// Remove item
storage.remove('user');

// Clear all
storage.clear();

// Check if item exists
const hasUser = storage.has('user'); // boolean
```

### `createStore<T>(key: string, initialValue: T): Store<T>`

Creates a reactive store with localStorage persistence.

**Parameters**:
- `key` (string): Storage key
- `initialValue` (T): Initial value if not found in storage

**Returns**: 
- `Store<T>`: Reactive store object

**Example**:
```javascript
import { createStore } from './utils/storage';

// Create store
const userStore = createStore('user', null);

// Subscribe to changes
const unsubscribe = userStore.subscribe((user) => {
  console.log('User changed:', user);
});

// Set value (triggers subscribers and saves to localStorage)
userStore.set({ id: 1, name: 'John' });

// Get current value
console.log(userStore.get()); // { id: 1, name: 'John' }

// Update value
userStore.update(user => ({ ...user, name: 'Jane' }));

// Clean up
unsubscribe();
```

---

## Math Utilities

### `clamp(value: number, min: number, max: number): number`

Clamps a number between min and max values.

**Parameters**:
- `value` (number): Value to clamp
- `min` (number): Minimum value
- `max` (number): Maximum value

**Returns**: 
- `number`: Clamped value

**Example**:
```javascript
import { clamp } from './utils/math';

console.log(clamp(5, 0, 10)); // 5
console.log(clamp(-5, 0, 10)); // 0
console.log(clamp(15, 0, 10)); // 10
```

### `randomBetween(min: number, max: number): number`

Generates a random number between min and max.

**Parameters**:
- `min` (number): Minimum value (inclusive)
- `max` (number): Maximum value (exclusive)

**Returns**: 
- `number`: Random number

**Example**:
```javascript
import { randomBetween } from './utils/math';

console.log(randomBetween(1, 10)); // Random number between 1 and 9.999...
console.log(randomBetween(0, 1)); // Random number between 0 and 0.999...
```

### `roundTo(value: number, decimals: number): number`

Rounds a number to specified decimal places.

**Parameters**:
- `value` (number): Number to round
- `decimals` (number): Number of decimal places

**Returns**: 
- `number`: Rounded number

**Example**:
```javascript
import { roundTo } from './utils/math';

console.log(roundTo(3.14159, 2)); // 3.14
console.log(roundTo(3.14159, 0)); // 3
console.log(roundTo(123.456, 1)); // 123.5
```

### `percentage(value: number, total: number): number`

Calculates percentage of value relative to total.

**Parameters**:
- `value` (number): Partial value
- `total` (number): Total value

**Returns**: 
- `number`: Percentage (0-100)

**Example**:
```javascript
import { percentage } from './utils/math';

console.log(percentage(25, 100)); // 25
console.log(percentage(1, 3)); // 33.33333333333333
console.log(percentage(0, 100)); // 0
```

## Error Handling

All utility functions include proper error handling:

```javascript
import { isEmail, fetchWithRetry } from './utils';

// Validation functions return false for invalid input
console.log(isEmail(null)); // false
console.log(isEmail(undefined)); // false

// API functions throw descriptive errors
try {
  await fetchWithRetry('/invalid-url');
} catch (error) {
  console.error(error.message); // "Failed to fetch after 3 retries"
}

// Storage functions handle localStorage unavailability
import { storage } from './utils/storage';
storage.set('key', 'value'); // Silently fails if localStorage unavailable
```

## Performance Considerations

### Memoization

Expensive operations are memoized when appropriate:

```javascript
import { memoize } from './utils/performance';

// Memoize expensive calculations
const expensiveCalculation = memoize((input) => {
  // Complex calculation
  return result;
});

// First call calculates and caches
const result1 = expensiveCalculation(input); 

// Second call returns cached result
const result2 = expensiveCalculation(input); // Same input, cached result
```

### Debouncing and Throttling

```javascript
import { debounce, throttle } from './utils/performance';

// Debounce user input
const debouncedSearch = debounce((query) => {
  searchAPI(query);
}, 300);

// Throttle scroll events
const throttledScroll = throttle(() => {
  updateScrollPosition();
}, 16); // ~60fps

window.addEventListener('scroll', throttledScroll);
```

## Testing Utilities

Functions are designed to be easily testable:

```javascript
// utils/string.test.js
import { capitalize, slugify } from './string';

describe('String utilities', () => {
  describe('capitalize', () => {
    it('capitalizes first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    it('handles empty strings', () => {
      expect(capitalize('')).toBe('');
    });

    it('handles single characters', () => {
      expect(capitalize('a')).toBe('A');
    });
  });

  describe('slugify', () => {
    it('converts to lowercase slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
    });

    it('removes special characters', () => {
      expect(slugify('Hello @#$ World!')).toBe('hello-world');
    });

    it('uses custom separator', () => {
      expect(slugify('Hello World', { separator: '_' })).toBe('hello_world');
    });
  });
});
```
# Testing Guide

## 📋 Overview

This project uses Jest for unit and integration testing.

## 🚀 Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm test -- --watch
```

### Run tests with coverage
```bash
npm test -- --coverage
```

### Run specific test file
```bash
npm test tests/unit/services.test.js
```

### Run tests matching pattern
```bash
npm test -- --testNamePattern="Videy Service"
```

## 📁 Test Structure

```
tests/
├── unit/               # Unit tests for individual modules
│   └── services.test.js
├── integration/        # Integration tests for API endpoints
│   └── api.test.js
├── setup.js           # Jest setup configuration
└── README.md
```

## 🧪 Test Categories

### Unit Tests
- Test individual functions and services in isolation
- Mock external dependencies
- Fast execution
- Located in `tests/unit/`

### Integration Tests
- Test complete API endpoints
- Test middleware and routing
- Use supertest for HTTP assertions
- Located in `tests/integration/`

## 📊 Coverage Thresholds

Current coverage requirements:
- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

## 🔧 Writing Tests

### Unit Test Example
```javascript
describe('Service Name', () => {
  describe('functionName', () => {
    test('should do something', () => {
      const result = service.function(input);
      expect(result).toBe(expected);
    });
  });
});
```

### Integration Test Example
```javascript
describe('API Endpoint', () => {
  test('GET /api/endpoint should return 200', async () => {
    const response = await request(app)
      .get('/api/endpoint')
      .expect(200);
    
    expect(response.body).toHaveProperty('success', true);
  });
});
```

## 🎯 Best Practices

1. **Test Naming**: Use descriptive test names that explain what is being tested
2. **Arrange-Act-Assert**: Structure tests in AAA pattern
3. **One Assertion**: Each test should verify one thing
4. **Mocking**: Mock external services and APIs
5. **Cleanup**: Clean up after tests (clear mocks, close connections)

## 🐛 Debugging Tests

### Run tests in debug mode
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

Then open `chrome://inspect` in Chrome and click "inspect".

### Verbose output
```bash
npm test -- --verbose
```

### Show console logs
```bash
npm test -- --silent=false
```

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Testing Best Practices](https://testingjavascript.com/)

## 🔄 CI/CD Integration

Tests should run automatically on:
- Pre-commit (using husky)
- Pull requests
- Before deployment

Example GitHub Actions workflow:
```yaml
- name: Run tests
  run: npm test -- --coverage
```
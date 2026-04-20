# Sprint 2 - Testing

## Overview
Comprehensive test suite for OrdersAdminPage.jsx fixes implemented in this sprint.

## What was tested
Tests verify 3 key fixes to OrdersAdminPage:

### 1. Total Display Fix
**Requirement**: Show `final_total` instead of `costo_envio`
- **Test**: `debería mostrar final_total en la columna TOTAL`
  - Verifies that order totals display as $56.000, $26.000, $16.000 (final_total)
  - NOT just $6.000 (shipping cost)
- **Test**: `debería calcular correctamente final_total = subtotal + shipping`
  - Confirms Colombian number formatting (es-CO locale)

### 2. Reject Button Functionality
**Requirement**: Reject button opens modal with rejection form
- **Test**: `debería abrir el modal cuando se hace click en el botón rechazar`
  - Verifies modal opens and displays rejection textarea
- **Test**: `debería mostrar el textarea de motivo solo para órdenes PAGO_SUBIDO`
  - Confirms form only appears for refundable orders
- **Test**: `debería permitir rechazar una orden con motivo` (Happy Path)
  - End-to-end: add motivo → click Rechazar → API call with correct data

### 3. Filter & State Management
**Requirement**: Filters and action buttons work correctly
- **Test**: `debería filtrar órdenes por estado`
  - Click PAGO_SUBIDO filter → only shows PAGO_SUBIDO orders
- **Test**: `debería mostrar botones aprobar/rechazar solo para estado PAGO_SUBIDO`
  - Action buttons appear only for rejectable orders

## Running Tests

```bash
# Run all tests
npm test

# Watch mode (rerun on file changes)
npm test -- --watch

# UI mode (visual test runner)
npm run test:ui
```

## Test Statistics
- **Total Tests**: 12
- **Status**: ✅ All Passing
- **Coverage**: OrdersAdminPage component rendering, data display, user interactions

## Mocks & Setup
- `axios` - Mocked for API calls, resolves with mockOrders data
- `framer-motion` - Mocked to simplify JSX output (motion.div → div)
- `react-router-dom` - Wrapped in BrowserRouter for Link components

## Test Data
Mock orders include:
1. PAGO_SUBIDO order (final_total: $56.000) - with TRANSFERENCIA payment
2. PAGO_VERIFICADO order (final_total: $26.000) - already approved
3. PENDIENTE_PAGO order (final_total: $16.000) - with EFECTIVO payment

## Key Testing Patterns

### Data Assertions
```javascript
expect(screen.getByText('$56.000')).toBeInTheDocument();
```

### User Interactions
```javascript
fireEvent.click(rejectButton);
fireEvent.change(textarea, { target: { value: 'Motivo...' } });
```

### Async Data Loading
```javascript
await screen.findByText('Cliente Prueba 1');
```

### API Verification
```javascript
expect(axios.post).toHaveBeenCalledWith(
  expect.stringContaining('gestionar-pago'),
  expect.objectContaining({...})
);
```

## Next Steps
- Add integration tests for Checkout flow
- Add tests for CartPage item management
- Increase coverage to 80%+ across all components

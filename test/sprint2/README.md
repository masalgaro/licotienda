# Sprint 2 - Pruebas

## Resumen
Suite completa de pruebas para las correcciones de OrdersAdminPage.jsx implementadas en este sprint.

## Qué se probó
Las pruebas verifican 3 correcciones clave en OrdersAdminPage:

### 1. Corrección de visualización del total
**Requisito**: Mostrar `final_total` en lugar de `costo_envio`
- **Prueba**: `debería mostrar final_total en la columna TOTAL`
  - Verifica que los totales de pedidos se muestren como $56.000, $26.000, $16.000 (final_total)
  - NO solo $6.000 (costo de envío)
- **Prueba**: `debería calcular correctamente final_total = subtotal + shipping`
  - Confirma el formato numérico colombiano (locale es-CO)

### 2. Funcionalidad del botón rechazar
**Requisito**: El botón rechazar abre un modal con formulario de rechazo
- **Prueba**: `debería abrir el modal cuando se hace click en el botón rechazar`
  - Verifica que el modal se abra y muestre el textarea de rechazo
- **Prueba**: `debería mostrar el textarea de motivo solo para órdenes PAGO_SUBIDO`
  - Confirma que el formulario solo aparece para pedidos reembolsables
- **Prueba**: `debería permitir rechazar una orden con motivo` (Happy Path)
  - Flujo completo: agregar motivo → clic en Rechazar → llamada a API con datos correctos

### 3. Filtros y gestión de estado
**Requisito**: Los filtros y botones de acción funcionan correctamente
- **Prueba**: `debería filtrar órdenes por estado`
  - Clic en filtro PAGO_SUBIDO → solo muestra pedidos PAGO_SUBIDO
- **Prueba**: `debería mostrar botones aprobar/rechazar solo para estado PAGO_SUBIDO`
  - Los botones de acción aparecen únicamente para pedidos rechazables

## Cómo correr las pruebas

```bash
# Correr todas las pruebas
npm test

# Modo watch (vuelve a correr al cambiar archivos)
npm test -- --watch

# Modo UI (corredor visual de pruebas)
npm run test:ui
```

## Estadísticas de pruebas
- **Total de pruebas**: 12
- **Estado**: Todas pasando
- **Cobertura**: Renderizado del componente OrdersAdminPage, visualización de datos, interacciones del usuario

## Mocks y configuración
- `axios` — Mockeado para llamadas a la API, resuelve con datos de mockOrders
- `framer-motion` — Mockeado para simplificar la salida JSX (motion.div → div)
- `react-router-dom` — Envuelto en BrowserRouter para componentes Link

## Datos de prueba
Los pedidos mock incluyen:
1. Pedido PAGO_SUBIDO (final_total: $56.000) — con pago TRANSFERENCIA
2. Pedido PAGO_VERIFICADO (final_total: $26.000) — ya aprobado
3. Pedido PENDIENTE_PAGO (final_total: $16.000) — con pago EFECTIVO

## Patrones de prueba clave

### Verificación de datos
```javascript
expect(screen.getByText('$56.000')).toBeInTheDocument();
```

### Interacciones del usuario
```javascript
fireEvent.click(rejectButton);
fireEvent.change(textarea, { target: { value: 'Motivo...' } });
```

### Carga de datos asíncrona
```javascript
await screen.findByText('Cliente Prueba 1');
```

### Verificación de llamadas a la API
```javascript
expect(axios.post).toHaveBeenCalledWith(
  expect.stringContaining('gestionar-pago'),
  expect.objectContaining({...})
);
```

## Próximos pasos
- Agregar pruebas de integración para el flujo de Checkout
- Agregar pruebas para la gestión de ítems en CartPage
- Aumentar la cobertura al 80%+ en todos los componentes

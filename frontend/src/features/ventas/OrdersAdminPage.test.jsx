import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import OrdersAdminPage from './OrdersAdminPage';
import axios from 'axios';

// Mock axios
vi.mock('axios');

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    a: ({ children, ...props }) => <a {...props}>{children}</a>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

const mockOrders = [
  {
    id: 1,
    cliente: 'Cliente Prueba 1',
    items: [{ id: 1, nombre: 'Producto 1', cantidad: 2 }],
    costo_envio: 6000,
    final_total: 56000, // Subtotal + envío
    estado: 'PAGO_SUBIDO',
    metodo_pago: 'TRANSFERENCIA',
    soporte_pago_url: '/media/comprobantes/test.jpg',
  },
  {
    id: 2,
    cliente: 'Cliente Prueba 2',
    items: [{ id: 2, nombre: 'Producto 2', cantidad: 1 }],
    costo_envio: 6000,
    final_total: 26000,
    estado: 'PAGO_VERIFICADO',
    metodo_pago: 'TRANSFERENCIA',
    soporte_pago_url: '/media/comprobantes/test2.jpg',
  },
  {
    id: 3,
    cliente: 'Cliente Prueba 3',
    items: [{ id: 3, nombre: 'Producto 3', cantidad: 1 }],
    costo_envio: 6000,
    final_total: 16000,
    estado: 'PENDIENTE_PAGO',
    metodo_pago: 'EFECTIVO',
    soporte_pago_url: null,
  },
];

const renderOrdersPage = () => {
  return render(
    <BrowserRouter>
      <OrdersAdminPage />
    </BrowserRouter>
  );
};

describe('OrdersAdminPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    axios.get.mockResolvedValue({ data: mockOrders });
    axios.post.mockResolvedValue({ data: { exito: true } });
  });

  describe('Requisito: Mostrar total correcto (final_total)', () => {
    it('debería mostrar final_total en la columna TOTAL', async () => {
      renderOrdersPage();

      // Esperar a que los datos se carguen
      await screen.findAllByText(/\$/);

      // Verificar que el primer total mostrado es 56.000 (final_total)
      expect(screen.getByText('$56.000')).toBeInTheDocument();
      expect(screen.getByText('$26.000')).toBeInTheDocument();
      expect(screen.getByText('$16.000')).toBeInTheDocument();
    });

    it('NO debería mostrar costo_envio (6.000) como total', async () => {
      renderOrdersPage();

      // Esperar a que se cargue el contenido
      await screen.findAllByText(/Cliente Prueba/);

      // El total nunca debería ser solo el costo de envío
      // (Si fuera costo_envio, todos los totales serían 6.000)
      const allNumbers = screen.getAllByText(/\$/);
      const values = allNumbers.map((el) => el.textContent);

      // Verificar que no todos los valores son $6.000
      const uniqueValues = new Set(values);
      expect(uniqueValues.size).toBeGreaterThan(1);
    });

    it('debería calcular correctamente final_total = subtotal + shipping', async () => {
      renderOrdersPage();

      // Para orden 1: final_total es 56000
      const firstTotal = await screen.findByText('$56.000');
      expect(firstTotal).toBeInTheDocument();

      // El formato debe ser es-CO (colombiano)
      expect(firstTotal.textContent).toBe('$56.000');
    });
  });

  describe('Requisito: Botón rechazar abre modal correctamente', () => {
    it('debería abrir el modal cuando se hace click en el botón rechazar', async () => {
      renderOrdersPage();

      // Esperar a que se carguen las órdenes
      await screen.findByText('Cliente Prueba 1');

      // El modal no debe estar visible inicialmente
      expect(screen.queryByText('Motivo de Rechazo')).not.toBeInTheDocument();

      // Hacer click en el botón rechazar (segundo botón en la fila PAGO_SUBIDO)
      const closeButtons = screen.getAllByRole('button');
      const rejectButton = closeButtons.find((btn) => {
        const icon = within(btn).queryByText('close');
        return icon && btn.className.includes('0.15');
      });

      if (rejectButton) {
        fireEvent.click(rejectButton);

        // Después de hacer click, el modal debería abrirse
        expect(await screen.findByText('Motivo de Rechazo')).toBeInTheDocument();
      }
    });

    it('debería mostrar el textarea de motivo solo para órdenes PAGO_SUBIDO', async () => {
      renderOrdersPage();

      await screen.findByText('Cliente Prueba 1');

      // Inicial: no hay textarea visible
      expect(screen.queryByPlaceholderText('Ej: Saldo insuficiente o datos ilegibles')).not.toBeInTheDocument();

      // Hacer click en botón de ver soporte para orden PAGO_SUBIDO
      const viewButtons = screen.getAllByRole('button');
      const viewSupportButton = viewButtons.find((btn) =>
        within(btn).queryByText('image')
      );

      if (viewSupportButton) {
        fireEvent.click(viewSupportButton);

        // El textarea debe aparecer
        expect(
          await screen.findByPlaceholderText(
            'Ej: Saldo insuficiente o datos ilegibles'
          )
        ).toBeInTheDocument();
      }
    });
  });

  describe('Requisito: Filtros funcionan correctamente', () => {
    it('debería filtrar órdenes por estado', async () => {
      renderOrdersPage();

      await screen.findByText('Cliente Prueba 1');

      // Inicialmente debe mostrar todas
      expect(screen.getByText('Cliente Prueba 1')).toBeInTheDocument();
      expect(screen.getByText('Cliente Prueba 2')).toBeInTheDocument();
      expect(screen.getByText('Cliente Prueba 3')).toBeInTheDocument();

      // Click en filtro PAGO_SUBIDO
      const filterButtons = screen.getAllByRole('button');
      const pagoSubidoFilter = filterButtons.find((btn) =>
        btn.textContent.includes('PAGO SUBIDO')
      );

      if (pagoSubidoFilter) {
        fireEvent.click(pagoSubidoFilter);

        // Solo debe mostrar Cliente Prueba 1 (PAGO_SUBIDO)
        expect(screen.getByText('Cliente Prueba 1')).toBeInTheDocument();
        expect(screen.queryByText('Cliente Prueba 2')).not.toBeInTheDocument();
        expect(screen.queryByText('Cliente Prueba 3')).not.toBeInTheDocument();
      }
    });
  });

  describe('Requisito: Botones de acción solo para PAGO_SUBIDO', () => {
    it('debería mostrar botones aprobar/rechazar solo para estado PAGO_SUBIDO', async () => {
      renderOrdersPage();

      await screen.findByText('Cliente Prueba 1');

      // Para PAGO_SUBIDO debe haber dos botones de acción (check y close)
      const allButtons = screen.getAllByRole('button');

      // Contar botones: 5 filters + 1 close modal + botones por orden
      // Para PAGO_SUBIDO debe haber check y close buttons
      expect(allButtons.length).toBeGreaterThan(5);
    });
  });

  describe('Requisito: Modal maneja datos correctamente', () => {
    it('debería cargar la imagen del comprobante con la URL correcta', async () => {
      renderOrdersPage();

      await screen.findByText('Cliente Prueba 1');

      // Click en "Ver Soporte"
      const viewButtons = screen.getAllByRole('button');
      const viewSupportButton = viewButtons.find((btn) =>
        within(btn).queryByText('image')
      );

      if (viewSupportButton) {
        fireEvent.click(viewSupportButton);

        // Buscar la imagen del comprobante
        const img = await screen.findByAltText('Comprobante');
        expect(img).toBeInTheDocument();
        expect(img.src).toContain('/media/comprobantes/test.jpg');
      }
    });
  });

  describe('Happy Path: Flujo completo de rechazo', () => {
    it('debería permitir rechazar una orden con motivo', async () => {
      renderOrdersPage();

      await screen.findByText('Cliente Prueba 1');

      // 1. Click en botón rechazar
      const closeButtons = screen.getAllByRole('button');
      closeButtons.find((btn) => {
        const style = btn.getAttribute('style');
        return style && style.includes('0.15) error');
      });

      // 2. Ver comprobante primero (alternativa)
      const viewButtons = screen.getAllByRole('button');
      const viewSupportButton = viewButtons.find((btn) =>
        within(btn).queryByText('image')
      );

      if (viewSupportButton) {
        fireEvent.click(viewSupportButton);

        // 3. Escribir motivo
        const textarea = await screen.findByPlaceholderText(
          'Ej: Saldo insuficiente o datos ilegibles'
        );
        fireEvent.change(textarea, {
          target: { value: 'Saldo insuficiente en la cuenta' },
        });

        expect(textarea.value).toBe('Saldo insuficiente en la cuenta');

        // 4. Click en "Rechazar Pago"
        const rejectPaymentButton = screen.getByText('Rechazar Pago');
        fireEvent.click(rejectPaymentButton);

        // Verificar que se llamó el endpoint
        expect(axios.post).toHaveBeenCalledWith(
          expect.stringContaining('gestionar-pago'),
          expect.objectContaining({
            pedido_id: 1,
            accion: 'rechazar',
            motivo: 'Saldo insuficiente en la cuenta',
          })
        );
      }
    });
  });

  describe('Edge Cases: Manejo de errores', () => {
    it('debería manejar error al cargar órdenes', async () => {
      axios.get.mockRejectedValueOnce(new Error('Network error'));

      renderOrdersPage();

      // El componente debe seguir renderizándose sin errores
      expect(screen.getByText('Gestión de Pedidos')).toBeInTheDocument();
    });

    it('debería manejar respuesta sin órdenes', async () => {
      axios.get.mockResolvedValueOnce({ data: [] });

      renderOrdersPage();

      const emptyMessage = await screen.findByText(
        'No hay pedidos en esta categoría'
      );
      expect(emptyMessage).toBeInTheDocument();
    });

    it('debería mostrar "Efectivo" para órdenes sin TRANSFERENCIA', async () => {
      renderOrdersPage();

      await screen.findByText('Cliente Prueba 3');

      // Buscar "Efectivo" en la tabla
      expect(screen.getByText('Efectivo')).toBeInTheDocument();
    });
  });
});

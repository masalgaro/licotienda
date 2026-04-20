import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createElement } from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

import InventoryAdminPage from './InventoryAdminPage';

vi.mock('axios');

vi.mock('framer-motion', () => {
  return {
    motion: new Proxy(
      {},
      {
        get: (_, tag) => ({ children, ...props }) => createElement(tag, props, children),
      }
    ),
    AnimatePresence: ({ children }) => <>{children}</>,
  };
});

const categorias = [{ id: 1, nombre: 'Rones' }];

const productosBase = [
  {
    id: 1,
    nombre: 'Ron Dorado',
    precio: 30000,
    existencias: 8,
    categoria: 1,
    esta_activo: true,
    en_oferta: true,
    descuento_porcentaje: 20,
    imagen: '/media/productos/ron-dorado.png',
  },
  {
    id: 2,
    nombre: 'Whisky Reserva',
    precio: 40000,
    existencias: 4,
    categoria: 1,
    esta_activo: true,
    en_oferta: false,
    descuento_porcentaje: 0,
    imagen: '/media/productos/whisky-reserva.png',
  },
];

const renderInventoryPage = () =>
  render(
    <BrowserRouter>
      <InventoryAdminPage />
    </BrowserRouter>
  );

describe('InventoryAdminPage ofertas', () => {
  let productosOfertados;

  beforeEach(() => {
    vi.clearAllMocks();
    productosOfertados = [productosBase[0]];
    window.alert = vi.fn();
    window.confirm = vi.fn(() => true);
    window.prompt = vi.fn();

    axios.get.mockImplementation((url) => {
      if (url.includes('/inventario/categorias/')) {
        return Promise.resolve({ data: categorias });
      }

      if (url.includes('en_oferta=true')) {
        return Promise.resolve({ data: productosOfertados });
      }

      return Promise.resolve({ data: productosBase });
    });

    axios.put.mockResolvedValue({ data: { exito: true } });
    axios.post.mockResolvedValue({ data: { exito: true } });
    axios.delete.mockResolvedValue({ data: {} });
  });

  it('muestra la vista Solo ofertas y solo renderiza productos con oferta', async () => {
    renderInventoryPage();

    await screen.findByText('Ron Dorado');
    expect(screen.getByText('Whisky Reserva')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Solo ofertas'));

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/inventario/productos/?en_oferta=true')
      );
    });

    expect(await screen.findByText('Ron Dorado')).toBeInTheDocument();
    expect(screen.queryByText('Whisky Reserva')).not.toBeInTheDocument();
  });

  it('abre el mini modal de oferta, recalcula el precio final y guarda la edición rápida', async () => {
    renderInventoryPage();

    const row = (await screen.findByText('Whisky Reserva')).closest('tr');
    fireEvent.click(within(row).getByText('Oferta'));

    expect(await screen.findByText('Editar Oferta')).toBeInTheDocument();
    expect(screen.getByText('Precio base: $40.000')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '25' } });

    expect(screen.getByText('$30.000')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Guardar'));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/inventario/productos/2/'),
        {
          en_oferta: true,
          descuento_porcentaje: 25,
        }
      );
    });
  });

  it('quita una oferta y refresca la vista Solo ofertas', async () => {
    axios.put.mockImplementation(async () => {
      productosOfertados = [];
      return { data: { exito: true } };
    });

    renderInventoryPage();

    fireEvent.click(await screen.findByText('Solo ofertas'));
    await screen.findByText('Ron Dorado');

    const row = screen.getByText('Ron Dorado').closest('tr');
    fireEvent.click(within(row).getByText('Oferta'));
    fireEvent.click(await screen.findByText('Quitar oferta'));

    await waitFor(() => {
      expect(screen.getByText('No hay productos con oferta activa en este momento.')).toBeInTheDocument();
    });
  });
});

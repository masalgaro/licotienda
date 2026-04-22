import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createElement } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

import StorePage from './StorePage';

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

vi.mock('../../shared/cartHooks', () => ({
  useCart: () => ({
    itemCount: 0,
    addToCart: vi.fn(),
    total: 0,
  }),
}));

const categorias = [{ id: 1, nombre: 'Rones' }];
const catalogoGeneral = [
  {
    id: 1,
    nombre: 'Ron Dorado',
    precio: 30000,
    existencias: 6,
    categoria: 1,
    categoria_nombre: 'Rones',
    en_oferta: true,
    descuento_porcentaje: 10,
    imagen: '/media/productos/ron-dorado.png',
  },
  {
    id: 2,
    nombre: 'Whisky Reserva',
    precio: 45000,
    existencias: 4,
    categoria: 1,
    categoria_nombre: 'Rones',
    en_oferta: false,
    descuento_porcentaje: 0,
    imagen: '/media/productos/whisky-reserva.png',
  },
];

const renderStorePage = () =>
  render(
    <BrowserRouter>
      <StorePage />
    </BrowserRouter>
  );

describe('StorePage filtro de ofertas', () => {
  let resultadosOferta;

  beforeEach(() => {
    vi.clearAllMocks();
    resultadosOferta = [catalogoGeneral[0]];

    axios.get.mockImplementation((url) => {
      if (url.includes('/catalogo/categorias/')) {
        return Promise.resolve({ data: categorias });
      }

      if (url.includes('en_oferta=true') && url.includes('categoria=1')) {
        return Promise.resolve({ data: resultadosOferta });
      }

      if (url.includes('en_oferta=true')) {
        return Promise.resolve({ data: resultadosOferta });
      }

      return Promise.resolve({ data: catalogoGeneral });
    });
  });

  it('agrega en_oferta=true cuando se activa el filtro de ofertas', async () => {
    renderStorePage();

    await screen.findByText('Ron Dorado');
    fireEvent.click(screen.getByText('Ofertas'));

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/catalogo/productos/?en_oferta=true')
      );
    });
  });

  it('combina ofertas con la categoría seleccionada', async () => {
    renderStorePage();

    await screen.findByText('Ron Dorado');
    fireEvent.click(screen.getAllByText('Rones')[0]);
    fireEvent.click(screen.getByText('Ofertas'));

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('categoria=1')
      );
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('en_oferta=true')
      );
    });
  });

  it('muestra un mensaje específico cuando no hay ofertas para esos filtros', async () => {
    resultadosOferta = [];

    renderStorePage();

    await screen.findByText('Ron Dorado');
    fireEvent.click(screen.getByText('Ofertas'));

    expect(await screen.findByText('No encontramos ofertas con esos filtros.')).toBeInTheDocument();
  });
});

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Checkout from '../usuarios/Checkout';
import OrdersAdminPage from '../ventas/OrdersAdminPage';
import { MemoryRouter } from 'react-router-dom';

import axios from 'axios';

// Mock the cart hook with the real backend cart item structure
vi.mock('../../shared/cartHooks', () => ({
    useCart: () => ({
        cart: [
            {
                tipo: 'granizado',
                id: 'granizado-1',
                granizado: 1,
                nombre: 'Granizado con alcohol',
                precio: '16000.00',
                quantity: 1,
                tiene_alcohol: true,
                ingredientes: [
                    { id: 1, nombre: 'Mora Azul', categoria: 'fruta', precio_adicional: '0.00', disponible: true },
                    { id: 2, nombre: 'Cereza', categoria: 'complemento', precio_adicional: '4000.00', disponible: true },
                ],
            },
        ],
        total: 16000,
        itemCount: 1,
        clearCart: vi.fn(),
        addToCart: vi.fn(),
    }),
}));

vi.mock('axios');

describe('HU-24: Frontend Armar Granizado', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Mock the admin orders API — structure matches backend ItemPedidoSerializer
        axios.get.mockResolvedValue({
            data: [
                {
                    id: 101,
                    fecha: '2023-10-10',
                    estado: 'PENDIENTE_PAGO',
                    cliente: 1,
                    direccion: 'Calle 123',
                    total: 16000,
                    items: [
                        {
                            producto: null,
                            producto_nombre: null,
                            granizado: 1,
                            granizado_nombre: 'Granizado con alcohol',
                            granizado_ingredientes: [
                                { id: 1, nombre: 'Mora Azul', categoria: 'fruta', precio_adicional: '0.00' },
                                { id: 2, nombre: 'Cereza', categoria: 'complemento', precio_adicional: '4000.00' },
                            ],
                            tipo: 'granizado',
                            cantidad: 1,
                            precio: '16000.00',
                        },
                    ],
                },
            ],
        });
        axios.post.mockResolvedValue({ data: { exito: true } });
    });

    it('Granizado en el carrito muestre la lista de ingredientes', () => {
        render(
            <MemoryRouter>
                <Checkout />
            </MemoryRouter>
        );

        // The cart item nombre is shown
        expect(screen.getByText(/Granizado con alcohol/i)).toBeInTheDocument();

        // Ingredients rendered via ing.nombre
        expect(screen.getByText('• Mora Azul')).toBeInTheDocument();
        expect(screen.getByText('• Cereza')).toBeInTheDocument();
    });

    it('Pedidos con granizado tengan indicador visual en el panel admin', async () => {
        render(
            <MemoryRouter>
                <OrdersAdminPage />
            </MemoryRouter>
        );

        // Wait for fetched data to appear
        const item = await screen.findByText(/Granizado con alcohol/i);
        expect(item).toBeInTheDocument();

        // Open the detail modal
        const detailButtons = await screen.findAllByText('visibility');
        detailButtons[0].click();

        // Icon and ingredients should appear in modal
        const drinkIcon = await screen.findByText('local_drink');
        expect(drinkIcon).toBeInTheDocument();
        expect(screen.getByText('• Mora Azul')).toBeInTheDocument();
        expect(screen.getByText('• Cereza')).toBeInTheDocument();
    });
});

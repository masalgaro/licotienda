import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Checkout from '../usuarios/Checkout';
import OrdersAdminPage from '../ventas/OrdersAdminPage';
import { MemoryRouter } from 'react-router-dom';

import axios from 'axios';

// Mock the cart hook
vi.mock('../../shared/cartHooks', () => ({
    useCart: () => ({
        cart: [
            {
                id: 'g1',
                is_granizado: true,
                nombre: 'Granizado con Licor (Grande)',
                precio: 16000,
                quantity: 1,
                ingredientes: [
                    { category: 'Base', name: 'Mora Azul' },
                    { category: 'Bolas Explosivas', name: 'Cereza' }
                ]
            }
        ],
        total: 16000,
        itemCount: 1,
        clearCart: vi.fn(),
        addToCart: vi.fn()
    })
}));

vi.mock('axios');

describe('HU-24: Frontend Armar Granizado', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        axios.get.mockResolvedValue({
            data: [
                {
                    id: 101,
                    fecha: '2023-10-10',
                    estado: 'pendiente',
                    cliente: 'Juan Perez',
                    telefono: '3000000000',
                    direccion: 'Calle 123',
                    total: 16000,
                    items: [
                        {
                            id: 1,
                            producto_nombre: 'Granizado con Licor (Grande)',
                            cantidad: 1,
                            precio: 16000,
                            is_granizado: true,
                            ingredientes: [
                                { category: 'Base', name: 'Mora Azul' },
                                { category: 'Bolas Explosivas', name: 'Cereza' }
                            ]
                        }
                    ]
                }
            ]
        });
        axios.post.mockResolvedValue({ data: { exito: true } });
    });

    it('Granizado en el carrito muestre la lista de ingredientes', () => {
        render(
            <MemoryRouter>
                <Checkout />
            </MemoryRouter>
        );

        // Verify the main item is rendered
        expect(screen.getByText(/Granizado con Licor \(Grande\)/i)).toBeInTheDocument();
        
        // Verify ingredients are rendered
        expect(screen.getByText('• Mora Azul')).toBeInTheDocument();
        expect(screen.getByText('• Cereza')).toBeInTheDocument();
    });

    it('Pedidos con granizado tengan indicador visual en el panel admin', async () => {
        render(
            <MemoryRouter>
                <OrdersAdminPage />
            </MemoryRouter>
        );

        // Since it fetches data on mount, wait for the item to appear
        const item = await screen.findByText(/Granizado con Licor \(Grande\)/i);
        expect(item).toBeInTheDocument();

        // Check for the visual indicator (the drink icon)
        // Since we open a modal to see products, wait! 
        // Ah, OrdersAdminPage has the items hidden behind a "Ver Detalles" button in the table.
        // Let's trigger the click to open the modal.
        const detailButtons = await screen.findAllByText('visibility');
        detailButtons[0].click(); // open the modal

        // Now check for the icon and ingredients inside the modal
        const drinkIcon = await screen.findByText('local_drink');
        expect(drinkIcon).toBeInTheDocument();
        expect(screen.getByText('• Mora Azul')).toBeInTheDocument();
        expect(screen.getByText('• Cereza')).toBeInTheDocument();
    });
});

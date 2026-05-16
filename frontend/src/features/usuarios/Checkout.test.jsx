import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Checkout from './Checkout';
import axios from 'axios';

vi.mock('axios');

vi.mock('../../shared/cartHooks', () => ({
    useCart: () => ({
        cart: [
            {
                id: 1,
                nombre: 'Ron Medellín',
                precio: 38000,
                quantity: 1,
                tipo: 'producto',
                ingredientes: [],
            },
        ],
        total: 38000,
        itemCount: 1,
        clearCart: vi.fn(),
    }),
}));

const renderCheckout = () =>
    render(
        <MemoryRouter>
            <Checkout />
        </MemoryRouter>
    );

describe('Checkout — toggle domicilio / en tienda', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        axios.get.mockResolvedValue({ data: { encontrado: false } });
        axios.post.mockResolvedValue({ data: { exito: true, pedido_id: 99 } });
    });

    it('muestra el campo de dirección por defecto (domicilio seleccionado)', () => {
        renderCheckout();

        // El toggle "Domicilio" debe estar visible en el paso 1
        expect(screen.getByText('Domicilio')).toBeInTheDocument();
        expect(screen.getByText('Recoger en Tienda')).toBeInTheDocument();

        // El campo de teléfono es visible porque el modo default es domicilio
        expect(screen.getByPlaceholderText('300 000 0000')).toBeInTheDocument();
    });

    it('oculta el campo de teléfono al seleccionar "Recoger en Tienda"', () => {
        renderCheckout();

        // Teléfono visible inicialmente
        expect(screen.getByPlaceholderText('300 000 0000')).toBeInTheDocument();

        // Click en el toggle de "Recoger en Tienda"
        fireEvent.click(screen.getByText('Recoger en Tienda'));

        // El campo de teléfono ya no debe estar en el DOM
        expect(screen.queryByPlaceholderText('300 000 0000')).not.toBeInTheDocument();
    });

    it('vuelve a mostrar el teléfono al regresar a "Domicilio"', () => {
        renderCheckout();

        // Cambiar a en tienda
        fireEvent.click(screen.getByText('Recoger en Tienda'));
        expect(screen.queryByPlaceholderText('300 000 0000')).not.toBeInTheDocument();

        // Volver a domicilio
        fireEvent.click(screen.getByText('Domicilio'));
        expect(screen.getByPlaceholderText('300 000 0000')).toBeInTheDocument();
    });

    it('el botón Siguiente está habilitado en modo tienda sin necesitar teléfono', () => {
        renderCheckout();

        fireEvent.click(screen.getByText('Recoger en Tienda'));

        // El botón no debe estar deshabilitado (en tienda no requiere teléfono)
        const siguiente = screen.getByRole('button', { name: /Siguiente/i });
        expect(siguiente).not.toBeDisabled();
    });

    it('avanza al paso 2 en modo tienda sin llamar al endpoint de búsqueda', async () => {
        renderCheckout();

        fireEvent.click(screen.getByText('Recoger en Tienda'));
        fireEvent.click(screen.getByRole('button', { name: /Siguiente/i }));

        // No debe haberse llamado al endpoint de búsqueda de teléfono
        expect(axios.get).not.toHaveBeenCalled();

        // Debe aparecer el paso 2 (campo de nombres)
        expect(await screen.findByPlaceholderText('Ej: Juan')).toBeInTheDocument();
    });

    it('en paso 2 con domicilio muestra el campo de dirección', async () => {
        renderCheckout();

        // Avanzar: ingresar teléfono y pasar al paso 2
        fireEvent.change(screen.getByPlaceholderText('300 000 0000'), {
            target: { value: '3001234567' },
        });
        fireEvent.click(screen.getByRole('button', { name: /Siguiente/i }));

        expect(await screen.findByPlaceholderText('Calle, Carrera, Barrio...')).toBeInTheDocument();
    });

    it('en paso 2 con modo tienda NO muestra el campo de dirección', async () => {
        renderCheckout();

        fireEvent.click(screen.getByText('Recoger en Tienda'));
        fireEvent.click(screen.getByRole('button', { name: /Siguiente/i }));

        // Esperar a que cargue el paso 2
        await screen.findByPlaceholderText('Ej: Juan');

        // El campo de dirección no debe estar
        expect(screen.queryByPlaceholderText('Calle, Carrera, Barrio...')).not.toBeInTheDocument();
    });
});

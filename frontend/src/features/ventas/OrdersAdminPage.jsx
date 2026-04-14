import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const OrdersAdminPage = () => {
    const [pedidos, setPedidos] = useState([]);
    const [filtro, setFiltro] = useState('TODOS');
    const [selectedOrder, setSelectedOrder] = useState(null); // For modal/preview proof
    const [motivoRechazo, setMotivoRechazo] = useState('');

    const fetchOrders = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/api/v1/ventas/todos/');
            setPedidos(res.data);
        } catch (_err) {
            console.error("Error fetching orders:", _err);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchOrders();
    }, []);

    const handleAction = async (pedidoId, accion) => {
        if (accion === 'rechazar' && !motivoRechazo) {
            alert("Por favor ingresa un motivo de rechazo");
            return;
        }

        try {
            const res = await axios.post('http://127.0.0.1:8000/api/v1/ventas/gestionar-pago/', {
                pedido_id: pedidoId,
                accion,
                motivo: motivoRechazo
            });
            if (res.data.exito) {
                fetchOrders();
                setSelectedOrder(null);
                setMotivoRechazo('');
            }
        } catch {
            alert("Error al procesar la acción");
        }
    };

    const filteredPedidos = pedidos.filter(p => {
        if (filtro === 'TODOS') return true;
        return p.estado === filtro;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'PAGO_VERIFICADO': return 'var(--primary-green)';
            case 'PAGO_SUBIDO': return '#fdbd2d';
            case 'PAGO_RECHAZADO': return 'var(--error)';
            case 'PENDIENTE_PAGO': return 'var(--text-secondary)';
            default: return 'var(--text-primary)';
        }
    };

    return (
        <div className="app-container animate-fade">
            <header style={{ marginBottom: '40px' }}>
                <p className="label-caps" style={{ color: 'var(--primary-green)', marginBottom: '8px' }}>Control de Ventas</p>
                <h1 className="display-lg" style={{ margin: 0 }}>Gestión de Pedidos</h1>
            </header>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', overflowX: 'auto', paddingBottom: '8px' }} className="hide-scrollbar">
                {['TODOS', 'PAGO_SUBIDO', 'PAGO_VERIFICADO', 'PAGO_RECHAZADO', 'DESPACHADO'].map(f => (
                    <button 
                        key={f}
                        onClick={() => setFiltro(f)}
                        style={{
                            padding: '10px 20px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700,
                            background: filtro === f ? 'var(--primary-green)' : 'var(--surface-high)',
                            color: filtro === f ? 'black' : 'var(--text-secondary)',
                            border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', transition: '0.2s'
                        }}
                    >
                        {f.replace('_', ' ')}
                    </button>
                ))}
            </div>

            {/* Orders Table/List */}
            <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: 'var(--surface-low)', height: '50px' }}>
                        <tr>
                            <th style={{ padding: '0 24px', fontSize: '0.65rem', color: 'var(--text-secondary)' }}>ID / CLIENTE</th>
                            <th style={{ padding: '0 24px', fontSize: '0.65rem', color: 'var(--text-secondary)' }}>PRODUCTOS</th>
                            <th style={{ padding: '0 24px', fontSize: '0.65rem', color: 'var(--text-secondary)' }}>TOTAL</th>
                            <th style={{ padding: '0 24px', fontSize: '0.65rem', color: 'var(--text-secondary)' }}>ESTADO</th>
                            <th style={{ padding: '0 24px', fontSize: '0.65rem', color: 'var(--text-secondary)' }}>PAGO</th>
                            <th style={{ padding: '0 24px', textAlign: 'right', fontSize: '0.65rem', color: 'var(--text-secondary)' }}>ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPedidos.map((pedido) => (
                            <tr key={pedido.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', height: '80px' }}>
                                <td style={{ padding: '0 24px' }}>
                                    <p style={{ fontWeight: 800, fontSize: '0.9rem', margin: 0 }}>#{pedido.id}</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>{pedido.cliente || 'Invitado'}</p>
                                </td>
                                <td style={{ padding: '0 24px', fontSize: '0.8rem' }}>
                                    {pedido.items?.length || 0} items
                                </td>
                                <td style={{ padding: '0 24px', fontWeight: 700, color: 'var(--primary-green)' }}>
                                    ${new Intl.NumberFormat('es-CO').format(pedido.final_total)}
                                </td>
                                <td style={{ padding: '0 24px' }}>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: getStatusColor(pedido.estado), background: `${getStatusColor(pedido.estado)}20`, padding: '4px 10px', borderRadius: '6px' }}>
                                        {pedido.estado}
                                    </span>
                                </td>
                                <td style={{ padding: '0 24px' }}>
                                    {pedido.metodo_pago === 'TRANSFERENCIA' ? (
                                        <button 
                                            onClick={() => setSelectedOrder(pedido)}
                                            style={{ background: 'var(--surface-high)', border: 'none', color: 'var(--text-highlight)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                                        >
                                            <span className="material-icons-round" style={{ fontSize: '16px' }}>image</span> Ver Soporte
                                        </button>
                                    ) : (
                                        <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>Efectivo</span>
                                    )}
                                </td>
                                <td style={{ padding: '0 24px', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                        {pedido.estado === 'PAGO_SUBIDO' && (
                                            <>
                                                <button 
                                                    onClick={() => handleAction(pedido.id, 'aprobar')}
                                                    style={{ background: 'rgba(57, 181, 74, 0.15)', color: 'var(--primary-green)', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                                                >
                                                    <span className="material-icons-round">check</span>
                                                </button>
                                                <button
                                                    onClick={() => setSelectedOrder(pedido)}
                                                    style={{ background: 'rgba(213, 61, 24, 0.15)', color: 'var(--error)', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                                                >
                                                    <span className="material-icons-round">close</span>
                                                </button>
                                            </>
                                        )}
                                        <button style={{ background: 'var(--surface-high)', color: 'var(--text-secondary)', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}>
                                            <span className="material-icons-round">more_vert</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredPedidos.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '60px', opacity: 0.5 }}>No hay pedidos en esta categoría</div>
                )}
            </div>

            {/* Modal para ver comprobante y gestionar */}
            <AnimatePresence>
                {selectedOrder && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="glass-card" 
                            style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflow: 'hidden', position: 'relative', background: 'var(--surface-dim)', display: 'flex', flexDirection: 'column' }}
                        >
                            <header style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <h2 className="headline-md">Soporte Pedido #{selectedOrder.id}</h2>
                                <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                                    <span className="material-icons-round">close</span>
                                </button>
                            </header>

                            <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
                                <p className="label-caps" style={{ fontSize: '0.65rem', marginBottom: '12px' }}>Imagen del Comprobante</p>
                                <div style={{ background: 'black', borderRadius: '12px', overflow: 'hidden', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <img 
                                        src={`http://127.0.0.1:8000${selectedOrder.soporte_pago_url}`} // Backend needs to provide this field
                                        style={{ maxWidth: '100%', maxHeight: '500px' }} 
                                        alt="Comprobante" 
                                        onError={(e) => e.target.src = 'https://placehold.co/400x600?text=Error+al+cargar+imagen'}
                                    />
                                </div>

                                {selectedOrder.estado === 'PAGO_SUBIDO' && (
                                    <div style={{ marginTop: '32px' }}>
                                        <label className="label-caps" style={{ fontSize: '0.65rem' }}>Motivo de Rechazo (si aplica)</label>
                                        <textarea 
                                            className="premium-input" 
                                            style={{ height: '80px', marginTop: '8px' }}
                                            value={motivoRechazo}
                                            onChange={(e) => setMotivoRechazo(e.target.value)}
                                            placeholder="Ej: Saldo insuficiente o datos ilegibles"
                                        />
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '24px' }}>
                                            <button className="btn-secondary" style={{ color: 'var(--error)' }} onClick={() => handleAction(selectedOrder.id, 'rechazar')}>Rechazar Pago</button>
                                            <button className="btn-primary" onClick={() => handleAction(selectedOrder.id, 'aprobar')}>Aprobar Pago</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Navigation */}
            <nav className="bottom-nav">
                <Link to="/" className="nav-item">
                    <span className="material-icons-round">home</span>
                    <span>Inicio</span>
                </Link>
                <Link to="/admin/pedidos" className="nav-item active">
                    <span className="material-icons-round">shopping_bag</span>
                    <span>Ventas</span>
                </Link>
                <Link to="/admin/inventario" className="nav-item">
                    <span className="material-icons-round">inventory_2</span>
                    <span>Inventario</span>
                </Link>
            </nav>
        </div>
    );
};

export default OrdersAdminPage;

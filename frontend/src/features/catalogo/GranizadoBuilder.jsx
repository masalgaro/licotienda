import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../shared/cartHooks';

const MOCK_DATA = {
  sizes: [
    { id: 'sz-1', name: 'Pequeño (12oz)', priceBase: 8000, priceAlcohol: 10000, maxFlavors: 1 },
    { id: 'sz-2', name: 'Mediano (16oz)', priceBase: 10000, priceAlcohol: 12000, maxFlavors: 2 },
    { id: 'sz-3', name: 'Grande (24oz)', priceBase: 14000, priceAlcohol: 16000, maxFlavors: 3 },
  ],
  flavorsNoAlcohol: [
    { id: 'fl-1', name: 'Chicle', outOfStock: true },
    { id: 'fl-2', name: 'Mango Biche' },
    { id: 'fl-3', name: 'Bom Bom Bum' },
  ],
  flavorsAlcohol: [
    { id: 'fl-4', name: 'Mora Azul' },
    { id: 'fl-5', name: 'Maracumango' },
    { id: 'fl-6', name: 'Jamaica Tropical' },
    { id: 'fl-7', name: 'Tequila Sunrise' },
    { id: 'fl-8', name: 'Red Bull Jagger', outOfStock: true },
    { id: 'fl-9', name: 'Smirnoff' },
    { id: 'fl-10', name: 'Mojito' },
    { id: 'fl-11', name: 'Bom Bom Bum (Con Licor)' },
    { id: 'fl-12', name: 'Four Loko' },
  ],
  flavorsCremosos: [
    { id: 'fl-13', name: 'Baileys' },
    { id: 'fl-14', name: 'Piña Colada' },
    { id: 'fl-15', name: 'Crema de Maracuyá' },
  ],
  additions: [
    { id: 'ad-1', category: 'Bolas Explosivas', name: 'Cereza', price: 4000 },
    { id: 'ad-2', category: 'Bolas Explosivas', name: 'Manzana Verde', price: 4000 },
    { id: 'ad-3', category: 'Bolas Explosivas', name: 'Lychee', price: 4000 },
    { id: 'ad-4', category: 'Bolas Explosivas', name: 'Mora Azul', price: 4000 },
    { id: 'ad-5', category: 'Bolas Explosivas', name: 'Maracuyá', price: 4000 },
    { id: 'ad-6', category: 'Toppings', name: 'Chantilly + Bolas de Chocolate', price: 5000 },
    { id: 'ad-7', category: 'Jeringas con Licor', name: 'Tequila', price: 3000 },
    { id: 'ad-8', category: 'Jeringas con Licor', name: 'Vodka', price: 3000 },
    { id: 'ad-9', category: 'Jeringas con Licor', name: 'Whiskey', price: 3000 },
  ]
};

const GranizadoBuilder = () => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [step, setStep] = useState(1);
    
    // State
    const [hasAlcohol, setHasAlcohol] = useState(null);
    const [selectedSize, setSelectedSize] = useState(MOCK_DATA.sizes[1]); // Default medium
    const [selectedFlavors, setSelectedFlavors] = useState([]);
    const [selectedAdditions, setSelectedAdditions] = useState([]);
    // Derived Price
    let totalPrice = 0;
    if (selectedSize) {
        let base = hasAlcohol ? selectedSize.priceAlcohol : selectedSize.priceBase;
        let adds = selectedAdditions.reduce((acc, curr) => acc + curr.price, 0);
        totalPrice = base + adds;
    }

    const handleSelectSize = (size) => {
        setSelectedSize(size);
        if (selectedFlavors.length > size.maxFlavors) {
            setSelectedFlavors(selectedFlavors.slice(0, size.maxFlavors));
        }
    };

    const handleToggleFlavor = (flavor) => {
        if (flavor.outOfStock) return;
        
        setSelectedFlavors(prev => {
            const isSelected = prev.some(f => f.id === flavor.id);
            if (isSelected) {
                return prev.filter(f => f.id !== flavor.id);
            } else {
                if (prev.length < selectedSize.maxFlavors) {
                    return [...prev, flavor];
                }
                return prev; 
            }
        });
    };

    const handleToggleAddition = (addition) => {
        setSelectedAdditions(prev => 
            prev.some(a => a.id === addition.id)
                ? prev.filter(a => a.id !== addition.id)
                : [...prev, addition]
        );
    };

    const handleAddToCart = () => {
        if (selectedFlavors.length === 0 || !selectedSize) return;

        const cartItem = {
            // eslint-disable-next-line react-hooks/purity
            id: `granizado_${Date.now()}`,
            is_granizado: true,
            nombre: `Granizado ${hasAlcohol ? 'con' : 'sin'} Licor (${selectedSize.name.split(' ')[0]})`,
            precio: totalPrice,
            imagen: '/productos/granizado_placeholder.png', // Fallback or transparent icon could be used
            ingredientes: [
                ...selectedFlavors.map(f => ({ category: 'Sabor Base', name: f.name })),
                ...selectedAdditions.map(a => ({ category: a.category, name: a.name }))
            ]
        };

        addToCart(cartItem);
        navigate('/'); // O al carrito
    };

    const renderStep1 = () => (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="step-container"
            style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', marginTop: '40px' }}
        >
            <h2 className="display-lg" style={{ textAlign: 'center', marginBottom: '20px' }}>¿Cómo prefieres tu granizado?</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', width: '100%', maxWidth: '800px' }}>
                <motion.div 
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => { setHasAlcohol(false); setStep(2); setSelectedFlavors([]); setSelectedAdditions([]); }}
                    style={{
                        background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.5) 100%)',
                        border: '1px solid var(--glass-border)', borderRadius: '24px', padding: '40px',
                        cursor: 'pointer', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px'
                    }}
                >
                    <span className="material-icons-round" style={{ fontSize: '64px', color: '#64B5F6' }}>water_drop</span>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Sin Licor</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Refrescante y para todo el mundo.</p>
                </motion.div>

                <motion.div 
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => { setHasAlcohol(true); setStep(2); setSelectedFlavors([]); setSelectedAdditions([]); }}
                    style={{
                        background: 'linear-gradient(145deg, rgba(57, 181, 74, 0.1) 0%, rgba(0,0,0,0.5) 100%)',
                        border: '1px solid rgba(57, 181, 74, 0.3)', borderRadius: '24px', padding: '40px',
                        cursor: 'pointer', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px'
                    }}
                >
                    <span className="material-icons-round" style={{ fontSize: '64px', color: 'var(--primary-green)' }}>local_bar</span>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Con Licor</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Para prender la fiesta.</p>
                </motion.div>
            </div>
        </motion.div>
    );

    const renderChips = (items, selectedCondition, onSelect, isPriceAdd = false) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '12px' }}>
            {items.map(item => {
                const isSelected = selectedCondition(item);
                const isDisabled = item.outOfStock;
                return (
                    <button
                        key={item.id}
                        onClick={() => !isDisabled && onSelect(item)}
                        disabled={isDisabled}
                        style={{
                            padding: '12px 20px', borderRadius: '30px', border: `1px solid ${isSelected ? 'var(--primary-green)' : 'rgba(255,255,255,0.1)'}`,
                            background: isSelected ? 'rgba(57, 181, 74, 0.15)' : (isDisabled ? 'transparent' : 'var(--surface-low)'),
                            color: isSelected ? 'var(--primary-green)' : (isDisabled ? 'rgba(255,255,255,0.2)' : 'var(--text-primary)'),
                            fontWeight: isSelected ? 800 : 500, fontSize: '0.9rem', cursor: isDisabled ? 'not-allowed' : 'pointer', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            display: 'flex', alignItems: 'center', gap: '8px',
                            opacity: isDisabled ? 0.5 : 1
                        }}
                    >
                        {item.name}
                        {isPriceAdd && item.price > 0 && <span style={{ opacity: 0.7, fontSize: '0.8rem' }}>+${item.price/1000}k</span>}
                        {isDisabled && <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', background: 'rgba(255,0,0,0.2)', padding: '2px 6px', borderRadius: '4px', color: '#ff4444', marginLeft: '4px' }}>Agotado</span>}
                    </button>
                );
            })}
        </div>
    );

    const renderStep2 = () => (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '120px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                <button onClick={() => setStep(1)} style={{ background: 'var(--surface-high)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-icons-round">arrow_back</span>
                </button>
                <h2 className="display-lg" style={{ margin: 0 }}>Personaliza tu Granizado</h2>
            </div>

            <section style={{ marginBottom: '40px' }}>
                <h3 className="label-caps" style={{ color: 'var(--text-secondary)' }}>1. Tamaño</h3>
                {renderChips(MOCK_DATA.sizes, (s) => selectedSize?.id === s.id, handleSelectSize)}
            </section>

            <section style={{ marginBottom: '40px' }}>
                <h3 className="label-caps" style={{ color: 'var(--text-secondary)' }}>
                    2. Sabores Base <span style={{ color: '#ff4444' }}>*</span> <span style={{ textTransform: 'none', fontSize: '0.75rem', opacity: 0.7 }}>(Elige hasta {selectedSize?.maxFlavors})</span>
                </h3>
                {!hasAlcohol ? (
                    renderChips(MOCK_DATA.flavorsNoAlcohol, (f) => selectedFlavors.some(sf => sf.id === f.id), handleToggleFlavor)
                ) : (
                    <>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '12px', marginBottom: '8px' }}>Clásicos</p>
                        {renderChips(MOCK_DATA.flavorsAlcohol, (f) => selectedFlavors.some(sf => sf.id === f.id), handleToggleFlavor)}
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '24px', marginBottom: '8px' }}>Cremosos</p>
                        {renderChips(MOCK_DATA.flavorsCremosos, (f) => selectedFlavors.some(sf => sf.id === f.id), handleToggleFlavor)}
                    </>
                )}
            </section>

            <section style={{ marginBottom: '40px' }}>
                <h3 className="label-caps" style={{ color: 'var(--text-secondary)' }}>3. Adiciones (Opcional)</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '12px', marginBottom: '8px' }}>Bolas Explosivas</p>
                {renderChips(MOCK_DATA.additions.filter(a => a.category === 'Bolas Explosivas'), (a) => selectedAdditions.some(sa => sa.id === a.id), handleToggleAddition, true)}
                
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '24px', marginBottom: '8px' }}>Toppings & Extras</p>
                {renderChips(MOCK_DATA.additions.filter(a => a.category !== 'Bolas Explosivas'), (a) => selectedAdditions.some(sa => sa.id === a.id), handleToggleAddition, true)}
            </section>

            {/* Floating Price Footer */}
            <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '24px', background: 'rgba(10, 10, 10, 0.85)', backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', zIndex: 100 }}>
                <div style={{ width: '100%', maxWidth: '800px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Total Estimado</p>
                        <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary-green)' }}>${new Intl.NumberFormat('es-CO').format(totalPrice)}</p>
                    </div>
                    <button onClick={() => setStep(3)} disabled={selectedFlavors.length === 0} className="btn-primary" style={{ padding: '0 32px', height: '48px', opacity: selectedFlavors.length > 0 ? 1 : 0.5 }}>
                        Ver Resumen
                    </button>
                </div>
            </div>
        </motion.div>
    );

    const renderStep3 = () => (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ maxWidth: '600px', margin: '0 auto', paddingTop: '20px' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                <button onClick={() => setStep(2)} style={{ background: 'var(--surface-high)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-icons-round">arrow_back</span>
                </button>
                <h2 className="display-lg" style={{ margin: 0 }}>Tu Creación</h2>
            </div>

            <div className="glass-card" style={{ padding: '40px', borderTop: '4px solid var(--primary-green)' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <span className="material-icons-round" style={{ fontSize: '48px', color: 'var(--primary-green)', marginBottom: '16px' }}>local_drink</span>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Granizado {hasAlcohol ? 'con Licor' : 'Sin Licor'}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>{selectedSize?.name}</p>
                </div>

                <div style={{ background: 'var(--surface-low)', borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Sabores ({selectedFlavors.length})</span>
                        <div style={{ textAlign: 'right' }}>
                            {selectedFlavors.map(f => <div key={f.id} style={{ fontWeight: 800 }}>{f.name}</div>)}
                        </div>
                    </div>
                    
                    {selectedAdditions.length > 0 && (
                        <div>
                            <span style={{ fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '12px' }}>Adiciones</span>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {selectedAdditions.map(a => (
                                    <li key={a.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                                        <span>• {a.name}</span>
                                        <span style={{ opacity: 0.7 }}>+${new Intl.NumberFormat('es-CO').format(a.price)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>Total Final</span>
                    <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary-green)' }}>${new Intl.NumberFormat('es-CO').format(totalPrice)}</span>
                </div>

                <button onClick={handleAddToCart} className="btn-primary" style={{ width: '100%', height: '56px', fontSize: '1.1rem' }}>
                    <span className="material-icons-round" style={{ marginRight: '8px' }}>shopping_cart</span>
                    Agregar al Carrito
                </button>
            </div>
        </motion.div>
    );

    return (
        <div className="app-container" style={{ minHeight: '100vh', paddingBottom: step === 2 ? '0' : '40px' }}>
            <AnimatePresence mode="wait">
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
            </AnimatePresence>
        </div>
    );
};

export default GranizadoBuilder;

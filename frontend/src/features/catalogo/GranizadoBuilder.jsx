import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../shared/cartHooks';

const API_BASE_URL = 'http://127.0.0.1:8000';
const PRECIO_BASE = 12000;

const SIZES = [
    { id: 'sz-1', name: 'Pequeño (12oz)', maxFlavors: 1 },
    { id: 'sz-2', name: 'Mediano (16oz)', maxFlavors: 2 },
    { id: 'sz-3', name: 'Grande (24oz)', maxFlavors: 3 },
];

const GranizadoBuilder = () => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [step, setStep] = useState(1);

    const [hasAlcohol, setHasAlcohol] = useState(null);
    const [selectedSize, setSelectedSize] = useState(SIZES[1]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [ingredientes, setIngredientes] = useState({ fruta: [], licor: [], complemento: [] });
    const [loadingIngredientes, setLoadingIngredientes] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        setLoadingIngredientes(true);
        axios
            .get(`${API_BASE_URL}/api/v1/granizados/ingredientes/`)
            .then(res => setIngredientes(res.data))
            .catch(console.error)
            .finally(() => setLoadingIngredientes(false));
    }, []);

    const flavorIngredients = selectedIngredients.filter(i => i.categoria !== 'complemento');
    const additionIngredients = selectedIngredients.filter(i => i.categoria === 'complemento');

    const totalPrice =
        PRECIO_BASE +
        selectedIngredients.reduce((acc, ing) => acc + parseFloat(ing.precio_adicional || 0), 0);

    const availableFlavors = hasAlcohol
        ? [...(ingredientes.fruta || []), ...(ingredientes.licor || [])]
        : ingredientes.fruta || [];

    const availableAdditions = ingredientes.complemento || [];

    const handleSelectSize = size => {
        setSelectedSize(size);
        if (flavorIngredients.length > size.maxFlavors) {
            const trimmed = flavorIngredients.slice(0, size.maxFlavors);
            setSelectedIngredients([...trimmed, ...additionIngredients]);
        }
    };

    const handleToggleFlavor = flavor => {
        if (!flavor.disponible) return;
        setSelectedIngredients(prev => {
            const isSelected = prev.some(i => i.id === flavor.id);
            if (isSelected) return prev.filter(i => i.id !== flavor.id);
            const currentFlavors = prev.filter(i => i.categoria !== 'complemento');
            if (currentFlavors.length >= selectedSize.maxFlavors) return prev;
            return [...prev, flavor];
        });
    };

    const handleToggleAddition = addition => {
        setSelectedIngredients(prev =>
            prev.some(i => i.id === addition.id)
                ? prev.filter(i => i.id !== addition.id)
                : [...prev, addition]
        );
    };

    const handleAddToCart = async () => {
        if (flavorIngredients.length === 0) return;
        setSubmitting(true);
        try {
            const { data: granizado } = await axios.post(`${API_BASE_URL}/api/v1/granizados/`, {
                tiene_alcohol: hasAlcohol,
                ingredientes: selectedIngredients.map(i => i.id),
            });
            const { data: cartItem } = await axios.post(
                `${API_BASE_URL}/api/v1/granizados/carrito/`,
                { granizado_id: granizado.id }
            );
            addToCart(cartItem);
            navigate('/');
        } catch (error) {
            console.error('Error creando granizado:', error);
            alert('No se pudo agregar el granizado al carrito. Intenta de nuevo.');
        } finally {
            setSubmitting(false);
        }
    };

    const renderChips = (items, selectedCondition, onSelect, showPrice = false) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '12px' }}>
            {items.map(item => {
                const isSelected = selectedCondition(item);
                const isDisabled = item.disponible === false || item.outOfStock;
                const price = parseFloat(item.precio_adicional || item.price || 0);
                return (
                    <button
                        key={item.id}
                        onClick={() => !isDisabled && onSelect(item)}
                        disabled={isDisabled}
                        style={{
                            padding: '12px 20px',
                            borderRadius: '30px',
                            border: `1px solid ${isSelected ? 'var(--primary-green)' : 'rgba(255,255,255,0.1)'}`,
                            background: isSelected
                                ? 'rgba(57, 181, 74, 0.15)'
                                : isDisabled
                                  ? 'transparent'
                                  : 'var(--surface-low)',
                            color: isSelected
                                ? 'var(--primary-green)'
                                : isDisabled
                                  ? 'rgba(255,255,255,0.2)'
                                  : 'var(--text-primary)',
                            fontWeight: isSelected ? 800 : 500,
                            fontSize: '0.9rem',
                            cursor: isDisabled ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            opacity: isDisabled ? 0.5 : 1,
                        }}
                    >
                        {item.nombre || item.name}
                        {showPrice && price > 0 && (
                            <span style={{ opacity: 0.7, fontSize: '0.8rem' }}>
                                +${price / 1000}k
                            </span>
                        )}
                        {isDisabled && (
                            <span
                                style={{
                                    fontSize: '0.7rem',
                                    textTransform: 'uppercase',
                                    background: 'rgba(255,0,0,0.2)',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    color: '#ff4444',
                                    marginLeft: '4px',
                                }}
                            >
                                Agotado
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );

    const renderStep1 = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="step-container"
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                alignItems: 'center',
                marginTop: '40px',
            }}
        >
            <h2 className="display-lg" style={{ textAlign: 'center', marginBottom: '20px' }}>
                ¿Cómo prefieres tu granizado?
            </h2>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '24px',
                    width: '100%',
                    maxWidth: '800px',
                }}
            >
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                        setHasAlcohol(false);
                        setStep(2);
                        setSelectedIngredients([]);
                    }}
                    style={{
                        background:
                            'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.5) 100%)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '24px',
                        padding: '40px',
                        cursor: 'pointer',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '16px',
                    }}
                >
                    <span
                        className="material-icons-round"
                        style={{ fontSize: '64px', color: '#64B5F6' }}
                    >
                        water_drop
                    </span>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Sin Licor</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Refrescante y para todo el mundo.</p>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                        setHasAlcohol(true);
                        setStep(2);
                        setSelectedIngredients([]);
                    }}
                    style={{
                        background:
                            'linear-gradient(145deg, rgba(57, 181, 74, 0.1) 0%, rgba(0,0,0,0.5) 100%)',
                        border: '1px solid rgba(57, 181, 74, 0.3)',
                        borderRadius: '24px',
                        padding: '40px',
                        cursor: 'pointer',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '16px',
                    }}
                >
                    <span
                        className="material-icons-round"
                        style={{ fontSize: '64px', color: 'var(--primary-green)' }}
                    >
                        local_bar
                    </span>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Con Licor</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Para prender la fiesta.</p>
                </motion.div>
            </div>
        </motion.div>
    );

    const renderStep2 = () => (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '120px' }}
        >
            <div
                style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}
            >
                <button
                    onClick={() => setStep(1)}
                    style={{
                        background: 'var(--surface-high)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <span className="material-icons-round">arrow_back</span>
                </button>
                <h2 className="display-lg" style={{ margin: 0 }}>
                    Personaliza tu Granizado
                </h2>
            </div>

            <section style={{ marginBottom: '40px' }}>
                <h3 className="label-caps" style={{ color: 'var(--text-secondary)' }}>
                    1. Tamaño
                </h3>
                {renderChips(SIZES, s => selectedSize?.id === s.id, handleSelectSize)}
            </section>

            <section style={{ marginBottom: '40px' }}>
                <h3 className="label-caps" style={{ color: 'var(--text-secondary)' }}>
                    2. Sabores Base <span style={{ color: '#ff4444' }}>*</span>
                    <span style={{ textTransform: 'none', fontSize: '0.75rem', opacity: 0.7 }}>
                        {' '}
                        (Elige hasta {selectedSize?.maxFlavors})
                    </span>
                </h3>
                {loadingIngredientes ? (
                    <p style={{ color: 'var(--text-secondary)', marginTop: '12px' }}>
                        Cargando ingredientes...
                    </p>
                ) : (
                    <>
                        {hasAlcohol && ingredientes.licor?.length > 0 && (
                            <p
                                style={{
                                    fontSize: '0.85rem',
                                    color: 'var(--text-secondary)',
                                    marginTop: '12px',
                                    marginBottom: '4px',
                                }}
                            >
                                Con Licor
                            </p>
                        )}
                        {renderChips(
                            availableFlavors,
                            f => selectedIngredients.some(i => i.id === f.id),
                            handleToggleFlavor
                        )}
                    </>
                )}
            </section>

            <section style={{ marginBottom: '40px' }}>
                <h3 className="label-caps" style={{ color: 'var(--text-secondary)' }}>
                    3. Adiciones (Opcional)
                </h3>
                {loadingIngredientes ? (
                    <p style={{ color: 'var(--text-secondary)', marginTop: '12px' }}>
                        Cargando...
                    </p>
                ) : (
                    renderChips(
                        availableAdditions,
                        a => selectedIngredients.some(i => i.id === a.id),
                        handleToggleAddition,
                        true
                    )
                )}
            </section>

            {/* Floating Price Footer */}
            <div
                style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '24px',
                    background: 'rgba(10, 10, 10, 0.85)',
                    backdropFilter: 'blur(16px)',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex',
                    justifyContent: 'center',
                    zIndex: 100,
                }}
            >
                <div
                    style={{
                        width: '100%',
                        maxWidth: '800px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <div>
                        <p
                            style={{
                                margin: 0,
                                color: 'var(--text-secondary)',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                            }}
                        >
                            Total Estimado
                        </p>
                        <p
                            style={{
                                margin: 0,
                                fontSize: '1.5rem',
                                fontWeight: 900,
                                color: 'var(--primary-green)',
                            }}
                        >
                            ${new Intl.NumberFormat('es-CO').format(totalPrice)}
                        </p>
                    </div>
                    <button
                        onClick={() => setStep(3)}
                        disabled={flavorIngredients.length === 0}
                        className="btn-primary"
                        style={{
                            padding: '0 32px',
                            height: '48px',
                            opacity: flavorIngredients.length > 0 ? 1 : 0.5,
                        }}
                    >
                        Ver Resumen
                    </button>
                </div>
            </div>
        </motion.div>
    );

    const renderStep3 = () => (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ maxWidth: '600px', margin: '0 auto', paddingTop: '20px' }}
        >
            <div
                style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}
            >
                <button
                    onClick={() => setStep(2)}
                    style={{
                        background: 'var(--surface-high)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <span className="material-icons-round">arrow_back</span>
                </button>
                <h2 className="display-lg" style={{ margin: 0 }}>
                    Tu Creación
                </h2>
            </div>

            <div className="glass-card" style={{ padding: '40px', borderTop: '4px solid var(--primary-green)' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <span
                        className="material-icons-round"
                        style={{
                            fontSize: '48px',
                            color: 'var(--primary-green)',
                            marginBottom: '16px',
                        }}
                    >
                        local_drink
                    </span>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                        Granizado {hasAlcohol ? 'con Licor' : 'Sin Licor'}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                        {selectedSize?.name}
                    </p>
                </div>

                <div
                    style={{
                        background: 'var(--surface-low)',
                        borderRadius: '16px',
                        padding: '24px',
                        marginBottom: '32px',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '16px',
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                            paddingBottom: '16px',
                        }}
                    >
                        <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                            Sabores ({flavorIngredients.length})
                        </span>
                        <div style={{ textAlign: 'right' }}>
                            {flavorIngredients.map(f => (
                                <div key={f.id} style={{ fontWeight: 800 }}>
                                    {f.nombre}
                                </div>
                            ))}
                        </div>
                    </div>

                    {additionIngredients.length > 0 && (
                        <div>
                            <span
                                style={{
                                    fontWeight: 600,
                                    color: 'var(--text-secondary)',
                                    display: 'block',
                                    marginBottom: '12px',
                                }}
                            >
                                Adiciones
                            </span>
                            <ul
                                style={{
                                    listStyle: 'none',
                                    padding: 0,
                                    margin: 0,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '8px',
                                }}
                            >
                                {additionIngredients.map(a => (
                                    <li
                                        key={a.id}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            fontSize: '0.95rem',
                                        }}
                                    >
                                        <span>• {a.nombre}</span>
                                        {parseFloat(a.precio_adicional) > 0 && (
                                            <span style={{ opacity: 0.7 }}>
                                                +$
                                                {new Intl.NumberFormat('es-CO').format(
                                                    parseFloat(a.precio_adicional)
                                                )}
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '32px',
                    }}
                >
                    <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>Total Estimado</span>
                    <span
                        style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary-green)' }}
                    >
                        ${new Intl.NumberFormat('es-CO').format(totalPrice)}
                    </span>
                </div>

                <button
                    onClick={handleAddToCart}
                    disabled={submitting}
                    className="btn-primary"
                    style={{ width: '100%', height: '56px', fontSize: '1.1rem', opacity: submitting ? 0.6 : 1 }}
                >
                    <span className="material-icons-round" style={{ marginRight: '8px' }}>
                        shopping_cart
                    </span>
                    {submitting ? 'Agregando...' : 'Agregar al Carrito'}
                </button>
            </div>
        </motion.div>
    );

    return (
        <div
            className="app-container"
            style={{ minHeight: '100vh', paddingBottom: step === 2 ? '0' : '40px' }}
        >
            <AnimatePresence mode="wait">
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
            </AnimatePresence>
        </div>
    );
};

export default GranizadoBuilder;

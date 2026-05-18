import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const AgeVerificationModal = () => {
    const { pathname } = useLocation();
    const isAdminRoute = pathname.startsWith('/admin');
    const [isVisible, setIsVisible] = useState(!isAdminRoute);
    const [isBlocked, setIsBlocked] = useState(false);

    useEffect(() => {
        if (isVisible) {
            document.body.style.overflow = 'hidden'; // Evitar scroll
        }
    }, [isVisible]);

    const handleYes = () => {
        setIsVisible(false);
        document.body.style.overflow = 'auto'; // Restaurar scroll
    };

    const handleNo = () => {
        setIsBlocked(true);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.9)',
                        backdropFilter: 'blur(15px)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px'
                    }}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="glass-card"
                        style={{
                            padding: '40px',
                            textAlign: 'center',
                            maxWidth: '450px',
                            width: '100%',
                            background: 'var(--surface-high)',
                            border: '1px solid var(--glass-border)'
                        }}
                    >
                        {!isBlocked ? (
                            <>
                                <div style={{ 
                                    width: '80px', 
                                    height: '80px', 
                                    background: 'var(--primary-green)', 
                                    borderRadius: '50%', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    margin: '0 auto 24px',
                                    boxShadow: '0 0 30px rgba(57, 181, 74, 0.4)'
                                }}>
                                    <span className="material-icons-round" style={{ fontSize: '40px', color: 'black' }}>
                                        verified_user
                                    </span>
                                </div>
                                <h2 className="display-md" style={{ marginBottom: '16px' }}>
                                    ¿Eres mayor de 18 años?
                                </h2>
                                <p className="text-secondary" style={{ marginBottom: '32px' }}>
                                    Debes tener al menos 18 años de edad para ingresar a nuestra tienda de licores.
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <button 
                                        onClick={handleYes} 
                                        className="btn-primary" 
                                        style={{ width: '100%', padding: '16px' }}
                                    >
                                        Sí, lo soy
                                    </button>
                                    <button 
                                        onClick={handleNo} 
                                        className="btn-secondary" 
                                        style={{ width: '100%', padding: '16px' }}
                                    >
                                        No
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div style={{ 
                                    width: '80px', 
                                    height: '80px', 
                                    background: 'var(--error, #ff4d4d)', 
                                    borderRadius: '50%', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    margin: '0 auto 24px',
                                    boxShadow: '0 0 30px rgba(255, 77, 77, 0.4)'
                                }}>
                                    <span className="material-icons-round" style={{ fontSize: '40px', color: 'white' }}>
                                        block
                                    </span>
                                </div>
                                <h2 className="display-md" style={{ marginBottom: '16px', color: 'white' }}>
                                    Acceso Denegado
                                </h2>
                                <p className="text-secondary" style={{ marginBottom: '0' }}>
                                    Lo sentimos, esta tienda es exclusiva para personas mayores de edad.
                                </p>
                            </>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AgeVerificationModal;

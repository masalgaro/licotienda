import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://127.0.0.1:8000';

const AdminLoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE_URL}/api/v1/usuarios/admin/login/`, {
                username,
                password,
            });
            localStorage.setItem('admin_token', res.data.access);
            navigate('/admin/pedidos', { replace: true });
        } catch (err) {
            if (err.response?.status === 403) {
                setError('No tiene permisos de administrador.');
            } else if (err.response?.status === 401) {
                setError('Usuario o contraseña incorrectos.');
            } else {
                setError('Error al iniciar sesión. Intente de nuevo.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-container animate-fade" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
                <div style={{ marginBottom: '32px' }}>
                    <span className="label-caps" style={{ color: 'var(--primary-green)' }}>Módulo Administrativo</span>
                    <h1 style={{ margin: '8px 0 0 0' }}>Iniciar Sesión</h1>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label className="label-caps" style={{ fontSize: '0.7rem' }}>Usuario</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoComplete="username"
                            style={{
                                background: 'var(--surface-high)',
                                border: '1px solid var(--border)',
                                borderRadius: '12px',
                                padding: '14px 16px',
                                color: 'var(--text-primary)',
                                fontSize: '1rem',
                                outline: 'none',
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label className="label-caps" style={{ fontSize: '0.7rem' }}>Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                            style={{
                                background: 'var(--surface-high)',
                                border: '1px solid var(--border)',
                                borderRadius: '12px',
                                padding: '14px 16px',
                                color: 'var(--text-primary)',
                                fontSize: '1rem',
                                outline: 'none',
                            }}
                        />
                    </div>

                    {error && (
                        <p style={{ color: 'var(--error, #ff4d4d)', margin: 0, fontSize: '0.875rem' }}>
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                        style={{ marginTop: '8px' }}
                    >
                        {loading ? 'Ingresando...' : 'Ingresar'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginPage;

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '../../../Components/UI/Input';
import { Button } from '../../../Components/UI/Button';
import { Alert } from '../../../Components/UI/Alert';

export default function Inicio_de_sesion() {
    const navigate = useNavigate();
    const [status, setStatus] = useState<'initial' | 'validating' | 'error' | 'locked' | 'expired'>('initial');
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('validating');

        // Mock login logic
        setTimeout(() => {
            if (identifier === 'bloqueado@test.com') {
                setStatus('locked');
            } else if (identifier === 'expirado@test.com') {
                setStatus('expired');
            } else if (identifier === 'admin@test.com' && password === 'admin123') {
                // Success
                navigate('/dashboard');
            } else {
                setStatus('error');
            }
        }, 1500);
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Iniciar Sesión</h1>
                    <p className="text-sm text-gray-500 mt-2">Ingresa tus credenciales para acceder al sistema</p>
                </div>

                {status === 'error' && (
                    <Alert type="error" message="Credenciales incorrectas. Verifica tu usuario y contraseña." className="mb-6" />
                )}
                {status === 'locked' && (
                    <Alert type="error" message="Cuenta bloqueada por múltiples intentos fallidos. Solicita recuperación." className="mb-6" />
                )}
                {status === 'expired' && (
                    <Alert type="warning" message="Tu sesión ha expirado por inactividad. Inicia sesión nuevamente." className="mb-6" />
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Correo electrónico o Usuario"
                        type="text"
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="ejemplo@empresa.com"
                        disabled={status === 'validating'}
                    />

                    <Input
                        label="Contraseña"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        disabled={status === 'validating'}
                    />

                    <div className="flex items-center justify-end">
                        <Link to="/recuperacion" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>

                    <Button type="submit" isLoading={status === 'validating'} disabled={status === 'locked'}>
                        Ingresar
                    </Button>
                </form>

                <div className="mt-8 text-center text-xs text-gray-400">
                    <p>Usuarios de prueba:</p>
                    <p>Exito: admin@test.com / admin123</p>
                    <p>Bloqueado: bloqueado@test.com</p>
                    <p>Expirado: expirado@test.com</p>
                </div>
            </div>
        </main>
    );
}
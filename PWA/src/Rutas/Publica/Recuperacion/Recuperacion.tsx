import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '../../../Components/UI/Input';
import { Button } from '../../../Components/UI/Button';
import { Alert } from '../../../Components/UI/Alert';

export default function Recuperacion() {
    const navigate = useNavigate();
    const [status, setStatus] = useState<'initial' | 'validating' | 'success'>('initial');
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('validating');

        // Mock recovery logic
        setTimeout(() => {
            setStatus('success');
            // We simulate that the user will be redirected to OTP screen after a few seconds or they can click a button.
            // For now, let's keep the success message and show a button to navigate to OTP screen for testing purposes.
        }, 1500);
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Recuperar Contraseña</h1>
                    <p className="text-sm text-gray-500 mt-2">Ingresa tu correo y te enviaremos un código de seguridad OTP para restablecer tu contraseña.</p>
                </div>

                {status === 'success' ? (
                    <div className="space-y-6">
                        <Alert 
                            type="info" 
                            message="Si el correo existe en nuestro sistema, te enviaremos un código de seguridad en los próximos minutos." 
                        />
                        <p className="text-sm text-gray-600 text-center">
                            Revisa tu bandeja de entrada y la carpeta de spam.
                        </p>
                        <Button onClick={() => navigate('/otp')} variant="primary">
                            Ir a ingresar código OTP (Simulación)
                        </Button>
                        <div className="text-center">
                            <Link to="/" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                                Volver a iniciar sesión
                            </Link>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Correo electrónico"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="ejemplo@empresa.com"
                            disabled={status === 'validating'}
                        />

                        <Button type="submit" isLoading={status === 'validating'}>
                            Enviar código de recuperación
                        </Button>

                        <div className="text-center">
                            <Link to="/" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                                Volver a iniciar sesión
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </main>
    );
}
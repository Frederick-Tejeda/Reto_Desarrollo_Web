import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../../Components/UI/Input';
import { Button } from '../../../Components/UI/Button';
import { Alert } from '../../../Components/UI/Alert';

export default function Nueva_Contraseña() {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState<'initial' | 'validating' | 'success'>('initial');
    
    // Validation states
    const [validations, setValidations] = useState({
        length: false,
        uppercase: false,
        number: false,
        special: false,
        match: false
    });

    useEffect(() => {
        setValidations({
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[^A-Za-z0-9]/.test(password),
            match: password !== '' && password === confirmPassword
        });
    }, [password, confirmPassword]);

    const isFormValid = Object.values(validations).every(Boolean);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;

        setStatus('validating');

        // Mock change password
        setTimeout(() => {
            setStatus('success');
            // Redirigir después de 2 segundos
            setTimeout(() => {
                navigate('/');
            }, 2000);
        }, 1500);
    };

    const ValidationItem = ({ met, text }: { met: boolean; text: string }) => (
        <div className={`flex items-center text-sm ${met ? 'text-green-600' : 'text-gray-500'}`}>
            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {met ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                ) : (
                    <circle cx="12" cy="12" r="9" strokeWidth={2} />
                )}
            </svg>
            <span>{text}</span>
        </div>
    );

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Crear Nueva Contraseña</h1>
                    <p className="text-sm text-gray-500 mt-2">Tu nueva contraseña debe ser diferente a las anteriores y cumplir con las políticas de seguridad.</p>
                </div>

                {status === 'success' ? (
                    <div className="space-y-6 text-center">
                        <Alert 
                            type="success" 
                            message="¡Contraseña actualizada exitosamente! Las sesiones anteriores han sido cerradas." 
                        />
                        <p className="text-sm text-gray-600">Redirigiendo al inicio de sesión...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Nueva contraseña"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            disabled={status === 'validating'}
                        />

                        <Input
                            label="Confirmar nueva contraseña"
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            disabled={status === 'validating'}
                            error={confirmPassword && !validations.match ? "Las contraseñas no coinciden" : undefined}
                        />

                        <div className="bg-gray-50 p-4 rounded-md space-y-2">
                            <p className="text-sm font-medium text-gray-700 mb-2">La contraseña debe tener:</p>
                            <ValidationItem met={validations.length} text="Mínimo 8 caracteres" />
                            <ValidationItem met={validations.uppercase} text="Al menos una letra mayúscula" />
                            <ValidationItem met={validations.number} text="Al menos un número" />
                            <ValidationItem met={validations.special} text="Al menos un carácter especial" />
                            <ValidationItem met={validations.match} text="Las contraseñas coinciden" />
                        </div>

                        <Button type="submit" isLoading={status === 'validating'} disabled={!isFormValid}>
                            Actualizar contraseña
                        </Button>
                    </form>
                )}
            </div>
        </main>
    );
}
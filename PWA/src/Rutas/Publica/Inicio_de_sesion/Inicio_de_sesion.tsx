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

    const generateMockJWT = (name: string, role: string) => {
        const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
        const payload = btoa(JSON.stringify({ name, role, exp: Date.now() + 86400000 }));
        const signature = btoa("mock_signature_123");
        return `${header}.${payload}.${signature}`;
    };

    const handleLoginAs = (role: string) => {
        let name = "Juan Pérez";
        if (role === 'ADMIN') name = "Ing. Admin Principal";
        if (role === 'COORDINADOR') name = "Dra. Coordinadora";
        if (role === 'INSPECTOR') name = "Lic. Inspector Campo";
        
        const token = generateMockJWT(name, role);
        sessionStorage.setItem('jwt_mock', token);
        navigate(role === 'INSPECTOR' ? '/agenda' : '/dashboard');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('validating');

        // Simulate network
        setTimeout(() => {
            if (identifier === 'admin' || identifier.includes('admin')) {
                handleLoginAs('ADMIN');
            } else if (identifier === 'coord' || identifier.includes('coord')) {
                handleLoginAs('COORDINADOR');
            } else if (identifier === 'inspector' || identifier.includes('inspector')) {
                handleLoginAs('INSPECTOR');
            } else {
                setStatus('error');
            }
        }, 1000);
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Iniciar Sesión</h1>
                    <p className="text-sm text-gray-500 mt-2">Ingresa tus credenciales para acceder al sistema EBR</p>
                </div>

                {status === 'error' && (
                    <Alert type="error" message="Credenciales incorrectas. Verifica tu usuario y contraseña." className="mb-6" />
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Correo electrónico o Usuario"
                        type="text"
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="Ej. admin, coord, inspector"
                        disabled={status === 'validating'}
                    />

                    <Input
                        label="Contraseña"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="•••••••• (Cualquier clave sirve)"
                        disabled={status === 'validating'}
                    />

                    <Button type="submit" isLoading={status === 'validating'}>
                        Ingresar
                    </Button>
                </form>

                <div className="mt-8 border-t pt-6">
                    <p className="text-xs text-gray-500 text-center mb-4">Ingreso Rápido de Pruebas (Mock JWT):</p>
                    <div className="flex flex-col gap-2">
                        <button onClick={() => handleLoginAs('ADMIN')} className="text-sm font-bold text-blue-600 border border-blue-200 bg-blue-50 py-2 rounded hover:bg-blue-100">
                            Login como ADMIN
                        </button>
                        <button onClick={() => handleLoginAs('COORDINADOR')} className="text-sm font-bold text-purple-600 border border-purple-200 bg-purple-50 py-2 rounded hover:bg-purple-100">
                            Login como COORDINADOR
                        </button>
                        <button onClick={() => handleLoginAs('INSPECTOR')} className="text-sm font-bold text-green-600 border border-green-200 bg-green-50 py-2 rounded hover:bg-green-100">
                            Login como INSPECTOR
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../Components/UI/Button';
import { Alert } from '../../../Components/UI/Alert';

export default function OTP() {
    const navigate = useNavigate();
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
    const [status, setStatus] = useState<'initial' | 'validating' | 'error' | 'locked'>('initial');
    const [attempts, setAttempts] = useState(0);
    const [countdown, setCountdown] = useState(60); // 1 minute for test, real could be 15m
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (countdown > 0) {
            const timerId = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timerId);
        }
    }, [countdown]);

    const handleChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Move to next input
        if (element.nextSibling && element.value !== '') {
            (element.nextSibling as HTMLInputElement).focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace') {
            if (otp[index] === '' && index > 0) {
                // Focus previous input if current is empty and backspace is pressed
                const prevInput = inputRefs.current[index - 1];
                if (prevInput) {
                    prevInput.focus();
                }
            } else {
                // Clear current input
                const newOtp = [...otp];
                newOtp[index] = '';
                setOtp(newOtp);
            }
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
        if (pastedData.some(char => isNaN(Number(char)))) return;

        const newOtp = [...otp];
        pastedData.forEach((char, index) => {
            if (index < 6) newOtp[index] = char;
        });
        setOtp(newOtp);

        // Focus the last filled input or the 6th input
        const nextIndex = Math.min(pastedData.length, 5);
        inputRefs.current[nextIndex]?.focus();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const code = otp.join('');
        if (code.length < 6) return;

        setStatus('validating');

        // Mock verification
        setTimeout(() => {
            if (code === '123456') {
                navigate('/nueva_contraseña');
            } else {
                const newAttempts = attempts + 1;
                setAttempts(newAttempts);
                if (newAttempts >= 5) {
                    setStatus('locked');
                } else {
                    setStatus('error');
                    setOtp(new Array(6).fill(''));
                    inputRefs.current[0]?.focus();
                }
            }
        }, 1500);
    };

    const handleResend = () => {
        setCountdown(60);
        setStatus('initial');
        setAttempts(0);
        setOtp(new Array(6).fill(''));
        inputRefs.current[0]?.focus();
    };

    const formatTime = (time: number) => {
        const m = Math.floor(time / 60);
        const s = time % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Verificación OTP</h1>
                    <p className="text-sm text-gray-500 mt-2">
                        Ingresa el código de 6 dígitos enviado a <strong>a***@empresa.com</strong>
                    </p>
                </div>

                {status === 'error' && (
                    <Alert type="error" message={`Código incorrecto. Intento ${attempts} de 5.`} className="mb-6" />
                )}
                {status === 'locked' && (
                    <Alert type="error" message="Demasiados intentos fallidos. Debes solicitar un nuevo código." className="mb-6" />
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="flex justify-between gap-2" dir="ltr">
                        {otp.map((data, index) => (
                            <input
                                className={`w-12 h-14 text-center text-xl font-semibold border rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors
                                    ${status === 'error' ? 'border-red-500 bg-red-50 text-red-900' : 'border-gray-300'}
                                    ${status === 'locked' ? 'bg-gray-100 cursor-not-allowed text-gray-400' : 'bg-white text-gray-900'}
                                `}
                                type="text"
                                name="otp"
                                maxLength={1}
                                key={index}
                                value={data}
                                onChange={e => handleChange(e.target, index)}
                                onFocus={e => e.target.select()}
                                onKeyDown={e => handleKeyDown(e, index)}
                                onPaste={handlePaste}
                                ref={(el) => (inputRefs.current[index] = el)}
                                disabled={status === 'validating' || status === 'locked'}
                                aria-label={`Dígito ${index + 1}`}
                            />
                        ))}
                    </div>

                    <Button type="submit" isLoading={status === 'validating'} disabled={status === 'locked' || otp.some(v => v === '')}>
                        Verificar Código
                    </Button>

                    <div className="text-center text-sm">
                        {countdown > 0 ? (
                            <p className="text-gray-500">
                                Puedes solicitar un nuevo código en <span className="font-semibold text-gray-700">{formatTime(countdown)}</span>
                            </p>
                        ) : (
                            <button
                                type="button"
                                onClick={handleResend}
                                className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
                            >
                                Reenviar código
                            </button>
                        )}
                    </div>
                </form>

                <div className="mt-8 text-center text-xs text-gray-400">
                    <p>Simulación: Ingresa <strong>123456</strong> para éxito.</p>
                </div>
            </div>
        </main>
    );
}
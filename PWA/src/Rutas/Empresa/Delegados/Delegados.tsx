import { useState } from 'react';
import { Badge } from '../../../Components/UI/Badge';
import type { UserStatus } from '../../../Components/UI/Badge';
import { Modal } from '../../../Components/UI/Modal';
import { Button } from '../../../Components/UI/Button';
import { Input } from '../../../Components/UI/Input';
import { FileUpload } from '../../../Components/UI/FileUpload';

interface Delegate {
    id: string;
    fullName: string;
    idType: string;
    idNumber: string;
    email: string;
    phone: string;
    status: UserStatus;
    hasAuthorizationLetter: boolean;
}

const initialDelegates: Delegate[] = [
    { id: '1', fullName: 'Laura Martínez', idType: 'CC', idNumber: '55667788', email: 'laura@sucursal.com', phone: '3112223344', status: 'ACTIVO', hasAuthorizationLetter: true },
    { id: '2', fullName: 'Pedro Sánchez', idType: 'CC', idNumber: '44332211', email: 'pedro@sucursal.com', phone: '3123334455', status: 'PENDIENTE_VALIDACION', hasAuthorizationLetter: false },
];

export default function Delegados() {
    const [delegates, setDelegates] = useState<Delegate[]>(initialDelegates);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Create form state
    const [fileUploaded, setFileUploaded] = useState(false);

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock creation
        setIsCreateModalOpen(false);
        setFileUploaded(false); // reset
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            <div className="sm:flex sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestión de Delegados</h1>
                    <p className="mt-2 text-sm text-gray-700">Administra los delegados autorizados para tu empresa.</p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <Button onClick={() => setIsCreateModalOpen(true)} className="w-full sm:w-auto">
                        + Registrar Delegado
                    </Button>
                </div>
            </div>

            {/* Hybrid view: Cards for mobile, Table for desktop */}
            <div className="hidden sm:block bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delegado</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Autorización</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {delegates.map(delegate => (
                            <tr key={delegate.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{delegate.fullName}</div>
                                    <div className="text-sm text-gray-500">{delegate.idType} {delegate.idNumber}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{delegate.email}</div>
                                    <div className="text-sm text-gray-500">{delegate.phone}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {delegate.hasAuthorizationLetter ? (
                                        <span className="text-green-600 flex items-center text-sm">
                                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                            Adjunta
                                        </span>
                                    ) : (
                                        <span className="text-gray-400 text-sm">Sin adjuntar</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Badge status={delegate.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-blue-600 hover:text-blue-900">Ver Detalles</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="sm:hidden space-y-4">
                {delegates.map(delegate => (
                    <div key={delegate.id} className="bg-white shadow rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="text-sm font-medium text-gray-900">{delegate.fullName}</h3>
                                <p className="text-xs text-gray-500">{delegate.email}</p>
                            </div>
                            <Badge status={delegate.status} />
                        </div>
                        <div className="mt-2 text-sm text-gray-700">
                            <p><span className="font-medium">ID:</span> {delegate.idType} {delegate.idNumber}</p>
                            <p className="mt-1 flex items-center">
                                <span className="font-medium mr-1">Autorización:</span>
                                {delegate.hasAuthorizationLetter ? <span className="text-green-600 text-xs">OK</span> : <span className="text-gray-400 text-xs">Falta</span>}
                            </p>
                        </div>
                        <div className="mt-4 flex space-x-2">
                            <Button variant="secondary" className="flex-1 py-1 text-xs min-h-[32px]">Ver Detalles</Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal: Crear Delegado */}
            <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Registrar Delegado">
                <form onSubmit={handleCreateSubmit} className="space-y-4">
                    <p className="text-sm text-gray-500">Este usuario será asignado automáticamente al rol "Delegado" para tu empresa.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input label="Nombre completo" type="text" required placeholder="Ej. Ana Torres" />
                        <Input label="Correo electrónico" type="email" required placeholder="ana@empresa.com" />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo ID</label>
                            <select className="mt-1 block w-full pl-3 pr-10 py-2 border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md min-h-[44px] border">
                                <option>CC</option><option>CE</option><option>Pasaporte</option>
                            </select>
                        </div>
                        <Input label="Número ID" type="text" required />
                    </div>

                    <div className="pt-4 border-t border-gray-200 mt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Evidencia Documental</h4>
                        <p className="text-xs text-gray-500 mb-4">Adjunte la carta de autorización firmada por el representante legal.</p>
                        <FileUpload
                            onUpload={(file) => setFileUploaded(true)}
                            accept=".pdf,image/*"
                            maxSizeMB={5}
                        />
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <Button type="button" variant="secondary" onClick={() => setIsCreateModalOpen(false)}>Cancelar</Button>
                        <Button type="submit" disabled={!fileUploaded}>
                            Registrar Delegado
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
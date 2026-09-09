import { useState } from 'react';
import { Badge } from '../../../Components/UI/Badge';
import type { UserStatus } from '../../../Components/UI/Badge';
import { Modal } from '../../../Components/UI/Modal';
import { Button } from '../../../Components/UI/Button';
import { Input } from '../../../Components/UI/Input';

interface User {
    id: string;
    fullName: string;
    idType: string;
    idNumber: string;
    email: string;
    phone: string;
    role: string;
    scope: string;
    status: UserStatus;
}

const initialUsers: User[] = [
    { id: '1', fullName: 'Juan Pérez', idType: 'CC', idNumber: '12345678', email: 'juan@admin.com', phone: '3001234567', role: 'Administrador', scope: 'Nacional', status: 'ACTIVO' },
    { id: '2', fullName: 'María Gómez', idType: 'CC', idNumber: '87654321', email: 'maria@empresa.com', phone: '3109876543', role: 'Administrador de Empresa', scope: 'Regional', status: 'PENDIENTE_VALIDACION' },
    { id: '3', fullName: 'Carlos López', idType: 'CE', idNumber: '99887766', email: 'carlos@empresa.com', phone: '3201112233', role: 'Coordinador', scope: 'Local', status: 'SUSPENDIDO' },
];

export default function Usuarios() {
    const [users, setUsers] = useState<User[]>(initialUsers);

    // Modals state
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [newStatus, setNewStatus] = useState<UserStatus>('ACTIVO');
    const [statusReason, setStatusReason] = useState('');
    const [notifyUser, setNotifyUser] = useState(true);

    const handleOpenStatusModal = (user: User) => {
        setSelectedUser(user);
        setNewStatus(user.status);
        setStatusReason('');
        setIsStatusModalOpen(true);
    };

    const handleStatusSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedUser && statusReason.trim()) {
            // Mock audit and change
            setUsers(users.map(u => u.id === selectedUser.id ? { ...u, status: newStatus } : u));
            setIsStatusModalOpen(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            <div className="sm:flex sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
                    <p className="mt-2 text-sm text-gray-700">Consulta, crea y administra los usuarios internos del sistema.</p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <Button onClick={() => setIsCreateModalOpen(true)} className="w-full sm:w-auto">
                        + Nuevo Usuario
                    </Button>
                </div>
            </div>

            {/* Hybrid view: Cards for mobile, Table for desktop */}
            <div className="hidden sm:block bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol / Ámbito</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map(user => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                                    <div className="text-sm text-gray-500">{user.idType} {user.idNumber}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{user.email}</div>
                                    <div className="text-sm text-gray-500">{user.phone}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{user.role}</div>
                                    <div className="text-sm text-gray-500">{user.scope}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Badge status={user.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-blue-600 hover:text-blue-900 mr-4">Editar</button>
                                    <button onClick={() => handleOpenStatusModal(user)} className="text-gray-600 hover:text-gray-900">Estado</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="sm:hidden space-y-4">
                {users.map(user => (
                    <div key={user.id} className="bg-white shadow rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="text-sm font-medium text-gray-900">{user.fullName}</h3>
                                <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                            <Badge status={user.status} />
                        </div>
                        <div className="mt-2 text-sm text-gray-700">
                            <p><span className="font-medium">Rol:</span> {user.role}</p>
                            <p><span className="font-medium">ID:</span> {user.idType} {user.idNumber}</p>
                        </div>
                        <div className="mt-4 flex space-x-2">
                            <Button variant="secondary" className="flex-1 py-1 text-xs min-h-[32px]">Editar</Button>
                            <Button variant="secondary" className="flex-1 py-1 text-xs min-h-[32px]" onClick={() => handleOpenStatusModal(user)}>Estado</Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal: Cambiar Estado */}
            <Modal isOpen={isStatusModalOpen} onClose={() => setIsStatusModalOpen(false)} title="Cambiar Estado de Usuario">
                <form onSubmit={handleStatusSubmit} className="space-y-4">
                    {selectedUser && (
                        <p className="text-sm text-gray-600 mb-4">
                            Actualizando a: <span className="font-semibold">{selectedUser.fullName}</span>
                        </p>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nuevo Estado</label>
                        <select
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md min-h-[44px] border"
                            value={newStatus}
                            onChange={e => setNewStatus(e.target.value as UserStatus)}
                        >
                            <option value="ACTIVO">ACTIVO</option>
                            <option value="PENDIENTE_VALIDACION">PENDIENTE VALIDACION</option>
                            <option value="RECHAZADO">RECHAZADO</option>
                            <option value="SUSPENDIDO">SUSPENDIDO</option>
                            <option value="DESACTIVADO">DESACTIVADO</option>
                            <option value="BLOQUEADO">BLOQUEADO</option>
                        </select>
                    </div>

                    <Input
                        label="Motivo (Requerido para auditoría)"
                        type="text"
                        required
                        value={statusReason}
                        onChange={e => setStatusReason(e.target.value)}
                        placeholder="Ej: Documentación incompleta"
                    />

                    <div className="flex items-center mt-4">
                        <input
                            id="notify"
                            name="notify"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded min-w-[24px] min-h-[24px]"
                            checked={notifyUser}
                            onChange={e => setNotifyUser(e.target.checked)}
                        />
                        <label htmlFor="notify" className="ml-2 block text-sm text-gray-900">
                            Notificar al usuario por correo electrónico
                        </label>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <Button type="button" variant="secondary" onClick={() => setIsStatusModalOpen(false)}>Cancelar</Button>
                        <Button type="submit" disabled={!statusReason.trim()}>Guardar Cambios</Button>
                    </div>
                </form>
            </Modal>

            {/* Modal: Crear Usuario */}
            <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Nuevo Usuario Interno">
                <div className="space-y-4">
                    <p className="text-sm text-gray-500">Formulario simulado para demostración.</p>
                    <Input label="Nombre completo" type="text" placeholder="Ej. Ana Torres" />
                    <Input label="Correo electrónico" type="email" placeholder="ana@empresa.com" />
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo ID</label>
                            <select className="mt-1 block w-full pl-3 pr-10 py-2 border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md min-h-[44px] border">
                                <option>CC</option><option>CE</option><option>NIT</option>
                            </select>
                        </div>
                        <Input label="Número ID" type="text" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                        <select className="mt-1 block w-full pl-3 pr-10 py-2 border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md min-h-[44px] border">
                            <option>Administrador</option><option>Coordinador</option><option>Técnico Evaluador</option>
                        </select>
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                        <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>Cancelar</Button>
                        <Button onClick={() => setIsCreateModalOpen(false)}>Crear</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
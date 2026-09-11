import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

interface UserPayload {
  name: string;
  role: 'ADMIN' | 'COORDINADOR' | 'INSPECTOR';
}

interface SidebarProps {
  isExpanded: boolean;
  setIsExpanded: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isExpanded, setIsExpanded }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<UserPayload | null>(null);

  useEffect(() => {
    // Escuchar cambios de ruta para re-evaluar si hay sesión (o si el usuario hizo logout)
    const token = sessionStorage.getItem('jwt_mock');
    if (token) {
      try {
        const payloadStr = atob(token.split('.')[1]);
        const payload = JSON.parse(payloadStr) as UserPayload;
        setUser(payload);
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    sessionStorage.removeItem('jwt_mock');
    setUser(null);
    navigate('/');
  };

  // Si estamos en rutas públicas (no hay user), no dibujamos el Sidebar
  if (!user) return null;

  // Definición de enlaces condicionales por rol
  const getLinksForRole = () => {
    const role = user.role;
    let links = [];

    // Enlaces de Dashboard General (Para todos)
    links.push({ path: '/dashboard', label: 'Dashboard', icon: '🏠' });

    if (role === 'ADMIN') {
      links.push(
        { path: '/fichas', label: 'Gestión de Fichas', icon: '📝' },
        { path: '/catalogos', label: 'Catálogos', icon: '🗂️' },
        { path: '/usuarios', label: 'Usuarios', icon: '👥' },
        { path: '/auditoria', label: 'Auditoría', icon: '🔍' },
      );
    }

    if (role === 'COORDINADOR' || role === 'ADMIN') {
      links.push(
        { path: '/bandeja_de_casos', label: 'Bandeja de Casos', icon: '📂' },
        { path: '/programacion', label: 'Programación', icon: '📅' },
        { path: '/denuncias', label: 'Denuncias', icon: '🚨' }
      );
    }

    if (role === 'INSPECTOR' || role === 'COORDINADOR') {
      links.push(
        { path: '/agenda', label: 'Mi Agenda', icon: '📆' }
      );
    }

    // Histórico de consulta para todos los autenticados
    links.push({ path: '/consulta_historica', label: 'Histórico', icon: '🕰️' });

    return links;
  };

  const navLinks = getLinksForRole();

  return (
    <div className={`${isExpanded ? 'w-64' : 'w-20'} bg-gray-900 text-white flex flex-col h-screen fixed left-0 top-0 shadow-xl z-50 transition-all duration-300`}>
      
      {/* BRANDING */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 min-w-[2rem] bg-blue-600 rounded flex items-center justify-center font-bold text-lg">E</div>
          {isExpanded && (
            <div className="whitespace-nowrap animate-fade-in">
              <h2 className="font-bold text-lg leading-tight">EBR System</h2>
              <p className="text-xs text-blue-400">Inspecciones</p>
            </div>
          )}
        </div>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-white transition-colors p-1"
          title={isExpanded ? "Colapsar menú" : "Expandir menú"}
        >
          {isExpanded ? '◀' : '▶'}
        </button>
      </div>

      {/* USER PROFILE SNIPPET */}
      <div className={`p-4 border-b border-gray-800 bg-gray-800/50 flex flex-col ${isExpanded ? 'items-start' : 'items-center'}`}>
        <div className="flex items-center gap-3 w-full">
          <div className="w-10 h-10 min-w-[2.5rem] rounded-full bg-gray-700 flex items-center justify-center text-xl font-bold border-2 border-gray-600">
            {user.name.charAt(0)}
          </div>
          {isExpanded && (
            <div className="flex-1 overflow-hidden whitespace-nowrap animate-fade-in">
              <p className="text-sm font-bold truncate">{user.name}</p>
              <p className="text-xs text-gray-400 truncate font-mono">{user.role}</p>
            </div>
          )}
        </div>
        
        {isExpanded && (
          <div className="mt-3 flex gap-2 w-full animate-fade-in">
            <button 
              onClick={() => navigate('/perfil')}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-xs py-1.5 rounded transition-colors"
            >
              Perfil
            </button>
            <button 
              onClick={() => navigate('/notificaciones')}
              className="flex-1 bg-blue-900/50 hover:bg-blue-800/50 text-blue-300 text-xs py-1.5 rounded transition-colors flex items-center justify-center gap-1"
            >
              <span>🔔</span> Notifs
            </button>
          </div>
        )}
      </div>

      {/* NAVIGATION LINKS */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-2 overflow-x-hidden">
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            title={link.label}
            className={({ isActive }) => 
              `flex items-center gap-4 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              } ${isExpanded ? '' : 'justify-center'}`
            }
          >
            <span className="text-xl min-w-[1.5rem] flex justify-center">{link.icon}</span>
            {isExpanded && <span className="whitespace-nowrap animate-fade-in">{link.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* FOOTER (CERRAR SESION) */}
      <div className="p-4 border-t border-gray-800">
        <button 
          onClick={handleLogout}
          title="Cerrar Sesión"
          className={`flex items-center justify-center gap-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 py-2.5 rounded-lg transition-colors text-sm font-bold border border-red-900/50 w-full`}
        >
          <span className="text-lg">🚪</span> 
          {isExpanded && <span className="whitespace-nowrap animate-fade-in">Cerrar Sesión</span>}
        </button>
      </div>

    </div>
  );
};

import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  activeTabId: string;
  onTabChange: (id: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTabId, onTabChange }) => {
  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">Selecciona una pestaña</label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          value={activeTabId}
          onChange={(e) => onTabChange(e.target.value)}
        >
          {tabs.map((tab) => (
            <option key={tab.id} value={tab.id}>{tab.label}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center
                  ${isActive 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
                aria-current={isActive ? 'page' : undefined}
              >
                {tab.icon && (
                  <span className={`mr-2 ${isActive ? 'text-blue-500' : 'text-gray-400'}`}>
                    {tab.icon}
                  </span>
                )}
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
      
      <div className="mt-6">
        {tabs.find(t => t.id === activeTabId)?.content}
      </div>
    </div>
  );
};

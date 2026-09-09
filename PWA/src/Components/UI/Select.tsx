import React, { forwardRef } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
  error?: string;
  helpText?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, helpText, className = '', required, ...props }, ref) => {
    const id = props.id || props.name;

    return (
      <div className={`mb-4 ${className}`}>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
        </label>
        
        <select
          ref={ref}
          id={id}
          required={required}
          className={`block w-full rounded-md shadow-sm sm:text-sm min-h-[44px] px-3 bg-white
            ${error 
              ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }
            disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${id}-error` : helpText ? `${id}-help` : undefined
          }
          {...props}
        >
          <option value="" disabled>Seleccione una opción</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        
        {error && (
          <p className="mt-1 text-sm text-red-600" id={`${id}-error`} role="alert">
            {error}
          </p>
        )}
        
        {helpText && !error && (
          <p className="mt-1 text-sm text-gray-500" id={`${id}-help`}>
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

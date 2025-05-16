'use client';

import React from 'react';

export default function FormField({
                                      label,
                                      name,
                                      value,
                                      onChange,
                                      type = 'text',
                                      disabled = false,
                                      ...props
                                  }) {
    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium mb-1">
                {label}
            </label>
            <input
                id={name}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`w-full border rounded px-3 py-2 ${
                    disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
                }`}
                {...props}
            />
        </div>
    );
}

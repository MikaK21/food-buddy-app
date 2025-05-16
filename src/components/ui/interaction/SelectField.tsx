'use client';

import React from 'react';

type Option = {
    label: string;
    value: string;
};

type SelectFieldProps = {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: Option[];
    disabled?: boolean;
};

export default function SelectField({
                                        label,
                                        name,
                                        value,
                                        onChange,
                                        options,
                                        disabled = false,
                                    }: SelectFieldProps) {
    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium mb-1">
                {label}
            </label>
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`w-full px-4 py-2 border rounded shadow-sm appearance-none ${
                    disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
                }`}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

'use client'
import React from 'react';

interface InputFieldProps {
    type: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
}

export default function InputField({
                                       type,
                                       name,
                                       value,
                                       onChange,
                                       placeholder,
                                   }: InputFieldProps) {
    return (
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
        />
    );
}

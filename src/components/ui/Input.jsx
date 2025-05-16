'use client';

export function Input({ label, value, onChange, ...props }) {
    return (
        <div className="flex flex-col w-full">
            {label && <label className="text-sm mb-1">{label}</label>}
            <input
                type="text"
                value={value}
                onChange={onChange}
                className="px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                {...props}
            />
        </div>
    );
}

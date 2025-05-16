'use client';

export function Select({ label, value, onChange, options, ...props }) {
    return (
        <div className="flex flex-col w-full">
            {label && <label className="text-sm mb-1">{label}</label>}
            <select
                value={value}
                onChange={onChange}
                className="px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                {...props}
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

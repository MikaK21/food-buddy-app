'use client';

export function Button({ children, onClick, ...props }) {
    return (
        <button
            onClick={onClick}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            {...props}
        >
            {children}
        </button>
    );
}

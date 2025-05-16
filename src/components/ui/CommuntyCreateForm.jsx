'use client';

export default function GenericCreateForm({
                                              label = 'Name',
                                              value,
                                              onChange,
                                              onSubmit,
                                              inputPlaceholder,
                                              inputWidth = 'w-[80%]',
                                              buttonWidth = 'w-[20%]'
                                          }) {
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onSubmit();
        }
    };

    return (
        <div className="flex items-center space-x-2 pb-6">
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={inputPlaceholder || `Neuer ${label}`}
                className={`${inputWidth} px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300`}
            />
            <button
                onClick={onSubmit}
                className={`${buttonWidth} min-w-[120px] px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600`}
            >
                ➕ Hinzufügen
            </button>
        </div>
    );
}

'use client';

export default function ConfirmDialog({ title, message, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-md w-full max-w-md">
                <h2 className="text-lg font-semibold mb-4">{title}</h2>
                <p className="mb-6">{message}</p>
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Abbrechen
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Löschen
                    </button>
                </div>
            </div>
        </div>
    );
}

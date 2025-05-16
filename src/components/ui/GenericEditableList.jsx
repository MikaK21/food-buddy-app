'use client';

import { useEffect, useRef } from 'react';

export default function GenericEditableList({
                                                entries = [],
                                                editId,
                                                editValue,
                                                onEditClick,
                                                onEditChange,
                                                onSave,
                                                onDelete,
                                                labelKey = 'name',
                                                idKey = 'id',
                                                showManageMembers = false,
                                                onManageMembersClick = () => {},
                                                currentUserId,
                                            }) {
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [editId]);

    const handleKeyDown = (e, id) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onSave(id);
        }
    };

    if (entries.length === 0) {
        return <p className="text-gray-500">Keine Einträge gefunden.</p>;
    }

    return (
        <ul className="space-y-2">
            {entries.map(entry => {
                const id = entry[idKey];
                const label = entry[labelKey];
                const isLeader = entry.leader?.id === currentUserId;

                return (
                    <li key={id} className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded">
                        {editId === id ? (
                            <input
                                ref={inputRef}
                                type="text"
                                value={editValue}
                                onChange={(e) => onEditChange(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, id)}
                                className="w-[40%] px-2 py-1 border border-gray-300 rounded shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                            />
                        ) : (
                            <span className="font-medium">{label}</span>
                        )}

                        <div className="space-x-2">
                            {editId === id && isLeader ? (
                                <button
                                    onClick={() => onSave(id)}
                                    className="px-2 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                                >
                                    💾 Speichern
                                </button>
                            ) : isLeader ? (
                                <button
                                    onClick={() => onEditClick(id, label)}
                                    className="px-2 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                                >
                                    ✏️ Umbenennen
                                </button>
                            ) : null}

                            {showManageMembers && isLeader && (
                                <button
                                    onClick={() => onManageMembersClick(id)}
                                    className="px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                >
                                    👥 Mitglieder verwalten
                                </button>
                            )}

                            {isLeader && (
                                <button
                                    onClick={() => onDelete(id)}
                                    className="px-2 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                                >
                                    🗑️ Löschen
                                </button>
                            )}
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}

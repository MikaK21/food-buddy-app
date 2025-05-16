'use client';

import { useEffect, useRef, useState } from 'react';

export default function ShoppingListItemList({ items = [], shops = [], onUpdate, onDelete }) {
    const [editId, setEditId] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [localItemState, setLocalItemState] = useState({});
    const inputRef = useRef(null);

    // Init lokale Kopien bei Items-Änderung
    useEffect(() => {
        const initialState = {};
        items.forEach(item => {
            initialState[item.id] = {
                name: item.name,
                amount: item.amount,
                shopId: item.shopId || ''
            };
        });
        setLocalItemState(initialState);
    }, [items]);

    useEffect(() => {
        if (editId !== null && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editId]);

    const handleEditClick = (id) => {
        setEditId(id);
        setEditValue(localItemState[id]?.name || '');
    };

    const handleSave = (id) => {
        const fallbackItem = items.find(i => i.id === id) || {};
        const payload = {
            name: editValue.trim(),
            amount: localItemState[id]?.amount ?? fallbackItem.amount ?? 1,
            shopId: localItemState[id]?.shopId ?? fallbackItem.shopId ?? null
        };

        console.log('[SAVE]', id, payload);
        onUpdate(id, payload);

        setEditId(null);
        setEditValue('');
    };

    const handleKeyDown = (e, id) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSave(id);
        }
    };

    const handleFieldChange = (id, field, value) => {
        const fallbackItem = items.find(i => i.id === id) || {};
        const updatedItem = {
            ...localItemState[id],
            [field]: value
        };

        setLocalItemState(prev => ({ ...prev, [id]: updatedItem }));

        const payload = {
            name: editId === id
                ? editValue.trim()
                : updatedItem.name ?? fallbackItem.name ?? '',
            amount: updatedItem.amount ?? fallbackItem.amount ?? 1,
            shopId: updatedItem.shopId ?? fallbackItem.shopId ?? null
        };

        console.log('[FIELD CHANGE]', id, field, value, payload);
        onUpdate(id, payload);
    };

    return (
        <ul className="space-y-2 mt-4">
            {items.map(item => {
                const local = localItemState[item.id] || {};

                return (
                    <li key={item.id} className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded">
                        {/* Name / Edit */}
                        <div className="w-[40%]">
                            {editId === item.id ? (
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(e, item.id)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                                />
                            ) : (
                                <span className="font-medium">{local.name || item.name}</span>
                            )}
                        </div>

                        {/* Dropdowns */}
                        <div className="flex gap-2 items-center justify-center">
                            <select
                                value={local.amount ?? item.amount}
                                onChange={e => handleFieldChange(item.id, 'amount', Number(e.target.value))}
                                className="px-2 py-1 border border-gray-300 rounded text-sm bg-white"
                            >
                                {Array.from({ length: 20 }, (_, i) => (
                                    <option key={i} value={i + 1}>{i + 1}</option>
                                ))}
                            </select>

                            <select
                                value={local.shopId ?? item.shopId ?? ''}
                                onChange={e => handleFieldChange(item.id, 'shopId', e.target.value)}
                                className="px-2 py-1 border border-gray-300 rounded text-sm bg-white"
                            >
                                <option value="">-- Kein Shop --</option>
                                {shops.map(shop => (
                                    <option key={shop.id} value={shop.id}>{shop.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-2">
                            {editId === item.id ? (
                                <button
                                    onClick={() => handleSave(item.id)}
                                    className="px-2 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                                >
                                    💾 Speichern
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleEditClick(item.id)}
                                    className="px-2 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                                >
                                    ✏️ Umbenennen
                                </button>
                            )}
                            <button
                                onClick={() => onDelete(item.id)}
                                className="px-2 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                            >
                                🗑️ Löschen
                            </button>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}

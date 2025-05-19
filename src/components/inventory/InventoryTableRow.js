'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { authFetch } from '@/utils/authFetch';

export default function InventoryTableRow({
                                              item,
                                              index,
                                              getStoragesOfItemCommunity,
                                              onChangeStorage,
                                              onRemoveItem,
                                          }) {
    const router = useRouter();
    const [expanded, setExpanded] = useState(false);
    const [expirationsState, setExpirationsState] = useState(item.expirations ?? []);
    const [wasRemoved, setWasRemoved] = useState(false);

    // 👉 Nur nach Rendern den Parent über Entfernen informieren
    useEffect(() => {
        if (wasRemoved && onRemoveItem) {
            onRemoveItem(item.id);
        }
    }, [wasRemoved, onRemoveItem, item.id]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'EXPIRED': return 'bg-red-500';
            case 'WARNING': return 'bg-yellow-400';
            case 'OK': return 'bg-green-500';
            default: return 'bg-gray-300';
        }
    };

    const formatDateGerman = (isoDateString) => {
        if (!isoDateString) return '';
        const date = new Date(isoDateString);
        return new Intl.DateTimeFormat('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(date);
    };

    const handleItemAction = async (itemId, actionType, expiration) => {
        const date = expiration?.expirationDate;
        if (!itemId || !date) return;

        try {
            const res = await authFetch(`/api/item/${itemId}/${actionType}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date }),
            });

            if (!res.ok) throw new Error(`Fehler bei Aktion: ${actionType}`);

            setExpirationsState(prev => {
                const updated = prev.map(exp =>
                    exp.expirationDate === expiration.expirationDate
                        ? { ...exp, amount: Math.max(0, (exp.amount || 0) - 1) }
                        : exp
                ).filter(exp => exp.amount > 0);

                if (updated.length === 0) {
                    setWasRemoved(true); // 💡 Nur Flag setzen, useEffect kümmert sich um Callback
                }

                return updated;
            });
        } catch (err) {
            console.error(err);
        }
    };

    const expirations = expirationsState;
    const primary = expirations[0] || null;
    const totalAmount = expirations.reduce((sum, exp) => sum + (exp.amount || 0), 0);
    const multipleExpirations = expirations.length > 1;

    const toggleExpanded = (e) => {
        e.stopPropagation();
        setExpanded(!expanded);
    };

    return (
        <>
            <tr className={`border-t ${index % 2 === 1 ? 'bg-gray-50' : ''} hover:bg-green-100`}>
                <td
                    className="w-[20%] px-4 py-2 text-black font-medium text-left cursor-pointer"
                    onClick={() => router.push(`/user/inventory/item?id=${item.id}`)}
                >
                    {item.name}
                </td>
                <td className="w-[15%] px-4 py-2 text-center">
                    {formatDateGerman(primary?.expirationDate)}
                </td>
                <td className="w-[10%] px-4 py-2 text-center">
                    <span className={`inline-block w-4 h-4 rounded-full ${getStatusColor(primary?.status)}`}></span>
                </td>
                <td className="w-[20%] px-4 py-2 text-center cursor-default" onClick={(e) => e.stopPropagation()}>
                    <select
                        value={item.storage?.id || ''}
                        onChange={e => onChangeStorage(item.id, e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                    >
                        {getStoragesOfItemCommunity(item).map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                </td>
                <td className="w-[10%] px-4 py-2 text-center">{totalAmount}</td>
                <td className="w-[25%] px-4 py-2 text-center">
                    {multipleExpirations ? (
                        <div className="flex justify-center items-center">
                            <button
                                className="flex items-center gap-1 text-gray-600 hover:text-gray-800 cursor-pointer"
                                onClick={toggleExpanded}
                            >
                                {expanded ? (
                                    <>
                                        <ChevronUp className="w-4 h-4" />
                                        <span>Einklappen</span>
                                    </>
                                ) : (
                                    <>
                                        <ChevronDown className="w-4 h-4" />
                                        <span>Aufklappen</span>
                                    </>
                                )}
                            </button>
                        </div>
                    ) : (
                        <div className="flex justify-center gap-2">
                            <button
                                onClick={() => handleItemAction(item.id, 'consume', primary)}
                                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-sm"
                            >
                                🍽️ Gegessen
                            </button>
                            <button
                                onClick={() => handleItemAction(item.id, 'discard', primary)}
                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 text-sm"
                            >
                                🗑️ Weggeworfen
                            </button>
                        </div>
                    )}
                </td>
            </tr>

            {expanded && multipleExpirations && expirations.map((exp, i) => (
                <tr key={i} className="text-sm border-t border-gray-200 bg-white">
                    <td className="w-[20%] px-4 py-2 text-left text-gray-400 pl-6">•</td>
                    <td className="w-[15%] px-4 py-2 text-center text-gray-700">
                        {formatDateGerman(exp.expirationDate)}
                    </td>
                    <td className="w-[10%] px-4 py-2 text-center">
                        <span className={`inline-block w-3 h-3 rounded-full ${getStatusColor(exp.status)}`}></span>
                    </td>
                    <td className="w-[20%] px-4 py-2"></td>
                    <td className="w-[10%] px-4 py-2 text-center">{exp.amount}</td>
                    <td className="w-[25%] px-4 py-2 text-center">
                        <div className="flex justify-center gap-2">
                            <button
                                onClick={() => handleItemAction(item.id, 'consume', exp)}
                                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-sm"
                            >
                                🍽️ Gegessen
                            </button>
                            <button
                                onClick={() => handleItemAction(item.id, 'discard', exp)}
                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 text-sm"
                            >
                                🗑️ Weggeworfen
                            </button>
                        </div>
                    </td>
                </tr>
            ))}
        </>
    );
}

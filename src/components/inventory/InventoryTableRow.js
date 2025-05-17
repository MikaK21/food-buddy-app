'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function InventoryTableRow({
                                              item,
                                              index,
                                              getStoragesOfItemCommunity,
                                              onChangeStorage,
                                              onAction
                                          }) {
    const router = useRouter();
    const [expanded, setExpanded] = useState(false);

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
        return date.toLocaleDateString('de-DE');
    };

    const expirations = item.expirations ?? [];
    const totalAmount = expirations.reduce((sum, exp) => sum + (exp.amount || 0), 0);
    const multipleExpirations = expirations.length > 1;

    const toggleExpanded = (e) => {
        e.stopPropagation();
        setExpanded(!expanded);
    };

    return (
        <>
            {/* Hauptzeile */}
            <tr className={`border-t ${index % 2 === 1 ? 'bg-gray-50' : ''} hover:bg-green-100`}>
                <td
                    className="w-[20%] px-4 py-2 text-black font-medium text-left cursor-pointer"
                    onClick={() => router.push(`/user/inventory/item?id=${item.id}`)}
                >
                    {item.name}
                </td>
                <td className="w-[15%] px-4 py-2 text-center">
                    {formatDateGerman(expirations[0]?.expirationDate)}
                </td>
                <td className="w-[10%] px-4 py-2 text-center">
                    <span className={`inline-block w-4 h-4 rounded-full ${getStatusColor(item.expirationStatus)}`}></span>
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
                        <button
                            className="text-sm text-blue-600 hover:underline"
                            onClick={toggleExpanded}
                        >
                            {expanded ? '▼' : '⬇️ Aufklappen'}
                        </button>
                    ) : (
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => onAction(item.id, 'consume', expirations[0])}
                                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-sm"
                            >
                                🍽️ Gegessen
                            </button>
                            <button
                                onClick={() => onAction(item.id, 'discard', expirations[0])}
                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 text-sm"
                            >
                                🗑️ Weggeworfen
                            </button>
                        </div>
                    )}
                </td>
            </tr>

            {/* Unterzeilen bei mehreren Ablaufdaten */}
            {expanded && multipleExpirations && expirations.map((exp, i) => (
                <tr
                    key={i}
                    className={`text-sm border-t ${index % 2 === 1 ? 'bg-gray-50' : ''}`}
                >
                    <td className="w-[20%] px-4 py-2"></td>
                    <td className="w-[15%] px-4 py-2 text-center text-gray-700">
                        {formatDateGerman(exp.expirationDate)}
                    </td>
                    <td className="w-[10%] px-4 py-2"></td>
                    <td className="w-[20%] px-4 py-2"></td>
                    <td className="w-[10%] px-4 py-2 text-center">{exp.amount}</td>
                    <td className="w-[25%] px-4 py-2 text-center">
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => onAction(item.id, 'consume', exp)}
                                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-sm"
                            >
                                🍽️ Gegessen
                            </button>
                            <button
                                onClick={() => onAction(item.id, 'discard', exp)}
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

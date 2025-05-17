'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

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

    const primary = item.primaryExpiration;
    const expirations = item.expirations ?? [];
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
                                onClick={() => onAction(item.id, 'consume', primary)}
                                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-sm"
                            >
                                🍽️ Gegessen
                            </button>
                            <button
                                onClick={() => onAction(item.id, 'discard', primary)}
                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 text-sm"
                            >
                                🗑️ Weggeworfen
                            </button>
                        </div>
                    )}
                </td>
            </tr>

            {expanded && multipleExpirations && expirations.map((exp, i) => (
                <tr
                    key={i}
                    className="text-sm border-t border-gray-200 bg-white"
                >
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

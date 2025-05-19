'use client';

import { useState, useEffect } from 'react';
import InventoryTableRow from './InventoryTableRow';

export default function InventoryTable({
                                           items,
                                           onSelectItem,
                                           getStoragesOfItemCommunity,
                                           onChangeStorage,
                                       }) {
    const [itemList, setItemList] = useState(items);

    // 🔁 Synchronisiere itemList mit externen items (Props)
    useEffect(() => {
        setItemList(items);
    }, [items]);

    const handleRemoveItem = (itemId) => {
        setItemList(prev => prev.filter(item => item.id !== itemId));
    };

    return (
        <div className="flex-1 overflow-auto bg-white rounded shadow mx-4">
            {itemList.length > 0 ? (
                <table className="min-w-full text-sm text-left border border-gray-300">
                    <thead className="bg-gray-100 sticky top-0 z-10">
                    <tr>
                        <th className="w-[15%] px-4 py-2 text-center">Artikel</th>
                        <th className="w-[15%] px-4 py-2 text-center">MHD</th>
                        <th className="w-[10%] px-4 py-2 text-center">Status</th>
                        <th className="w-[20%] px-4 py-2 text-center">Lager</th>
                        <th className="w-[10%] px-4 py-2 text-center">Anzahl</th>
                        <th className="w-[30%] px-4 py-2 text-center">Aktionen</th>
                    </tr>
                    </thead>
                    <tbody>
                    {itemList.map((item, index) => (
                        <InventoryTableRow
                            key={item.id}
                            item={item}
                            index={index}
                            onSelectItem={onSelectItem}
                            getStoragesOfItemCommunity={getStoragesOfItemCommunity}
                            onChangeStorage={onChangeStorage}
                            onRemoveItem={handleRemoveItem}
                        />
                    ))}
                    </tbody>
                </table>
            ) : (
                <div className="p-6 text-gray-500">Keine Artikel gefunden.</div>
            )}
        </div>
    );
}

'use client';

import { useEffect, useState } from 'react';
import PageTitle from '@/components/ui/PageTitle';
import { authFetch } from '@/utils/authFetch';
import { Select } from '@/components/ui/Select';
import ShoppingListItemList from '@/components/ui/ShoppingListItemList';

export default function ShoppingListView() {
    const [lists, setLists] = useState([]);
    const [selectedListId, setSelectedListId] = useState(null);
    const [shops, setShops] = useState([]);
    const [newItemName, setNewItemName] = useState('');
    const [newItemAmount, setNewItemAmount] = useState(1);
    const [newItemShopId, setNewItemShopId] = useState('');

    // Initiale Daten laden
    useEffect(() => {
        const fetchData = async () => {
            const listsRes = await authFetch('/api/shopping-list/my').then(res => res.json());
            setLists(listsRes);
            if (listsRes.length > 0) {
                setSelectedListId(listsRes[0].id);
            }

            const shopsRes = await authFetch('/api/shop/my').then(res => res.json());
            setShops(shopsRes);
        };
        fetchData();
    }, []);

    const selectedList = lists.find(l => l.id === selectedListId);

    const refreshLists = async () => {
        const refreshed = await authFetch('/api/shopping-list/my').then(res => res.json());
        setLists(refreshed);
    };

    const handleAddItem = async () => {
        if (!newItemName.trim() || !newItemAmount) return;

        await authFetch(`/api/shopping-list/${selectedListId}/item`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: newItemName,
                amount: newItemAmount,
                shopId: newItemShopId || null
            })
        });

        await refreshLists();

        setNewItemName('');
        setNewItemAmount(1);
        setNewItemShopId('');
    };

    const handleUpdateItem = async (itemId, updates) => {
        await authFetch(`/api/shopping-list/item/${itemId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });

        await refreshLists();
    };

    const handleDeleteItem = async (itemId) => {
        await authFetch(`/api/shopping-list/item/${itemId}`, {
            method: 'DELETE'
        });

        await refreshLists();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddItem();
        }
    };

    return (
        <div>
            <PageTitle icon="🛒">Einkaufsliste</PageTitle>

            {/* Liste auswählen */}
            <Select
                value={selectedListId || ''}
                onChange={e => setSelectedListId(Number(e.target.value))}
                options={lists.map(list => ({ value: list.id, label: list.name }))}
            />

            {/* Neues Item hinzufügen */}
            <div className="flex gap-2 mt-4">
                <input
                    type="text"
                    placeholder="Neuer Artikelname"
                    value={newItemName}
                    onChange={e => setNewItemName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                />
                <select
                    value={newItemAmount}
                    onChange={e => setNewItemAmount(Number(e.target.value))}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-300"
                >
                    {Array.from({ length: 20 }, (_, i) => (
                        <option key={i} value={i + 1}>{i + 1}</option>
                    ))}
                </select>
                <select
                    value={newItemShopId || ''}
                    onChange={e => setNewItemShopId(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-300"
                >
                    <option value="">-- Kein Shop --</option>
                    {shops.map(shop => (
                        <option key={shop.id} value={shop.id}>{shop.name}</option>
                    ))}
                </select>
                <button
                    onClick={handleAddItem}
                    className="flex-1 min-w-[120px] px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                    ➕ Hinzufügen
                </button>
            </div>

            {/* Items anzeigen */}
            <ShoppingListItemList
                items={selectedList?.items || []}
                shops={shops}
                onUpdate={handleUpdateItem}
                onDelete={handleDeleteItem}
            />
        </div>
    );
}

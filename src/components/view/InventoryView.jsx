// InventoryView.tsx
'use client';

import { useEffect, useState } from 'react';
import { authFetch } from '@/utils/authFetch';
import ItemDetailView from '@/components/view/ItemDetailView';
import PageTitle from '@/components/ui/PageTitle';
import InventoryFilterBar from '@/components/inventory/InventoryFilterBar';
import InventoryStats from '@/components/inventory/InventoryStats';
import InventoryToggles from '@/components/inventory/InventoryToggles';
import InventoryTable from '@/components/inventory/InventoryTable';

export default function InventoryView() {
    const [communities, setCommunities] = useState([]);
    const [items, setItems] = useState([]);
    const [selectedCommunityId, setSelectedCommunityId] = useState('ALL');
    const [selectedStorageId, setSelectedStorageId] = useState('ALL');
    const [activeItem, setActiveItem] = useState(null);
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [showOnlyExpired, setShowOnlyExpired] = useState(false);
    const [showOnlyExpiringSoon, setShowOnlyExpiringSoon] = useState(false);

    useEffect(() => {
        authFetch('/api/community/my')
            .then(res => res.json())
            .then(setCommunities);

        authFetch('/api/item')
            .then(res => res.json())
            .then(data => setItems(enhanceItems(data)));
    }, []);

    const enhanceItems = (items) => {
        return items.map(item => {
            const expirations = [...(item.expirations || [])].sort((a, b) => new Date(a.expirationDate) - new Date(b.expirationDate));
            return {
                ...item,
                expirations,
                primaryExpiration: expirations[0] || null,
            };
        });
    };

    const getStoragesForSelectedCommunity = () => {
        if (selectedCommunityId === 'ALL') return [];
        const community = communities.find(c => c.id === parseInt(selectedCommunityId));
        return community?.storages || [];
    };

    const getStoragesOfItemCommunity = (item) => {
        const community = communities.find(c =>
            c.storages.some(s => s.id === item.storage?.id)
        );
        return community?.storages || [];
    };

    const filteredItems = items.filter(item => {
        const status = item.primaryExpiration?.status;
        const storageMatch = selectedStorageId === 'ALL' || item.storage?.id === parseInt(selectedStorageId);
        const communityMatch = selectedCommunityId === 'ALL' || getStoragesForSelectedCommunity().some(s => s.id === item.storage?.id);
        const expiredMatch = !showOnlyExpired || status === 'EXPIRED';
        const soonMatch = !showOnlyExpiringSoon || status === 'WARNING';

        return storageMatch && communityMatch && expiredMatch && soonMatch;
    });

    const sortedItems = [...filteredItems].sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];
        if (sortBy === 'expirationDate') {
            valA = new Date(a.primaryExpiration?.expirationDate || 0);
            valB = new Date(b.primaryExpiration?.expirationDate || 0);
        }
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const stats = {
        total: filteredItems.length,
        expired: filteredItems.filter(i => i.primaryExpiration?.status === 'EXPIRED').length,
        soon: filteredItems.filter(i => i.primaryExpiration?.status === 'WARNING').length,
    };

    const handleChangeStorage = async (item, newStorageId) => {
        const updatedItem = {
            ...item,
            storageId: newStorageId
        };

        try {
            await authFetch(`/api/item/${item.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedItem)
            });
            authFetch('/api/item')
                .then(res => res.json())
                .then(data => setItems(enhanceItems(data)));
        } catch (err) {
            console.error('Fehler beim Aktualisieren des Items:', err);
        }
    };

    const handleAction = async (itemId, action, expiration) => {
        try {
            const res = await authFetch(`/api/item/${itemId}/${action}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date: expiration?.expirationDate }),
            });

            if (!res.ok) throw new Error('Fehler bei der Aktion');

            await reloadItems(); // ✅ Items neu laden nach Aktion
        } catch (err) {
            console.error(`Fehler bei Aktion ${action}:`, err);
        }
    };


    if (activeItem) {
        return <ItemDetailView item={activeItem} onBack={() => setActiveItem(null)} reload={() => {}} />;
    }

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] space-y-6">
            <PageTitle icon="📦">Lagerbestand anzeigen</PageTitle>

            <InventoryFilterBar
                communities={communities}
                selectedCommunityId={selectedCommunityId}
                setSelectedCommunityId={setSelectedCommunityId}
                selectedStorageId={selectedStorageId}
                setSelectedStorageId={setSelectedStorageId}
                sortBy={sortBy}
                setSortBy={setSortBy}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                getStoragesForSelectedCommunity={getStoragesForSelectedCommunity}
            />

            <InventoryStats stats={stats} />

            <InventoryToggles
                showOnlyExpired={showOnlyExpired}
                setShowOnlyExpired={setShowOnlyExpired}
                showOnlyExpiringSoon={showOnlyExpiringSoon}
                setShowOnlyExpiringSoon={setShowOnlyExpiringSoon}
            />

            <div className="flex-1 min-h-0 overflow-auto">
                <InventoryTable
                    items={sortedItems}
                    onSelectItem={setActiveItem}
                    getStoragesOfItemCommunity={getStoragesOfItemCommunity}
                    onChangeStorage={(itemId, newStorageId) => {
                        const item = items.find(i => i.id === parseInt(itemId));
                        if (item) {
                            handleChangeStorage(item, newStorageId);
                        }
                    }}
                    onAction={handleAction}
                />
            </div>
        </div>
    );
}

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
        reloadItems();
    }, []);

    const reloadItems = () => {
        authFetch('/api/item')
            .then(res => res.json())
            .then(setItems);
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
        const expirationDate = item.expirations?.[0]?.expirationDate;
        const date = expirationDate ? new Date(expirationDate) : null;
        const now = new Date();
        const soon = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        const storageMatch =
            selectedStorageId === 'ALL' ||
            item.storage?.id === parseInt(selectedStorageId);
        const communityMatch =
            selectedCommunityId === 'ALL' ||
            getStoragesForSelectedCommunity().some(s => s.id === item.storage?.id);

        const expiredMatch = !showOnlyExpired || (date && date < now);
        const soonMatch = !showOnlyExpiringSoon || (date && date > now && date <= soon);

        return storageMatch && communityMatch && expiredMatch && soonMatch;
    });

    const sortedItems = [...filteredItems].sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];
        if (sortBy === 'expirationDate') {
            valA = new Date(a.expirations?.[0]?.expirationDate || 0);
            valB = new Date(b.expirations?.[0]?.expirationDate || 0);
        }
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const stats = {
        total: filteredItems.length,
        expired: filteredItems.filter(i => i.expirations?.[0] && new Date(i.expirations[0].expirationDate) < new Date()).length,
        soon: filteredItems.filter(i => {
            const d = i.expirations?.[0]?.expirationDate;
            if (!d) return false;
            const date = new Date(d);
            const now = new Date();
            const in7 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            return date > now && date < in7;
        }).length,
    };

    const handleChangeStorage = async (itemId, newStorageId) => {
        try {
            await authFetch(`/api/items/${itemId}/storage`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ storageId: newStorageId })
            });
            reloadItems();
        } catch (err) {
            console.error('Fehler beim Aktualisieren des Lagers:', err);
        }
    };

    const handleAction = async (itemId, action) => {
        try {
            console.log(`${action}: Item ${itemId}`);
            // await authFetch(`/api/item/${itemId}/${action}`, { method: 'POST' });
            // reloadItems();
        } catch (err) {
            console.error(`Fehler bei Aktion ${action}:`, err);
        }
    };

    if (activeItem) {
        return <ItemDetailView item={activeItem} onBack={() => setActiveItem(null)} reload={reloadItems} />;
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
                    onChangeStorage={handleChangeStorage}
                    onAction={handleAction}
                />
            </div>
        </div>
    );
}

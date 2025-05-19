'use client';

import { useEffect, useState } from 'react';
import { authFetch } from '@/utils/authFetch';
import PageTitle from '@/components/ui/PageTitle';
import GenericEditableList from '@/components/ui/GenericEditableList';
import GenericCreateForm from '@/components/ui/GenericCreateForm';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

export default function ShopsManageView() {
    const [shops, setShops] = useState([]);
    const [newShopName, setNewShopName] = useState('');
    const [deleteShopId, setDeleteShopId] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);

    const loadShops = () => {
        authFetch('/api/shop/my')
            .then(res => res.json())
            .then(data => setShops(data))
            .catch(err => console.error('Fehler beim Laden der Shops:', err));
    };

    useEffect(() => {
        loadShops();
    }, []);

    const handleCreateShop = async () => {
        if (!newShopName.trim()) return;

        try {
            const res = await authFetch('/api/shop', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newShopName }),
            });

            if (res.ok) {
                setNewShopName('');
                loadShops();
            }
        } catch (err) {
            console.error('Fehler beim Erstellen des Shops:', err);
        }
    };

    const confirmDelete = (id) => {
        setDeleteShopId(id);
        setShowConfirm(true);
    };

    const handleDeleteConfirmed = async () => {
        try {
            const res = await authFetch(`/api/shop/${deleteShopId}`, { method: 'DELETE' });
            if (res.ok) loadShops();
        } catch (err) {
            console.error('Fehler beim Löschen:', err);
        } finally {
            setShowConfirm(false);
            setDeleteShopId(null);
        }
    };

    return (
        <>
            <PageTitle icon="🏪">Shops verwalten</PageTitle>

            <GenericCreateForm
                label="Shop"
                value={newShopName}
                onChange={setNewShopName}
                onSubmit={handleCreateShop} // ✅ nicht mehr handleSave(null)
            />

            <GenericEditableList
                entries={shops}
                onDelete={confirmDelete}
                allowEdit={false}
            />

            {showConfirm && (
                <ConfirmDialog
                    title="Shop löschen"
                    message="Möchtest du diesen Shop wirklich löschen?"
                    onConfirm={handleDeleteConfirmed}
                    onCancel={() => setShowConfirm(false)}
                />
            )}
        </>
    );
}
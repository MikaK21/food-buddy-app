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
    const [editShopId, setEditShopId] = useState(null);
    const [editShopName, setEditShopName] = useState('');
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

    const handleSave = async (id) => {
        const name = id ? editShopName : newShopName;
        if (!name.trim()) return;

        const url = id
            ? `/api/shop/${id}`
            : '/api/shop';

        const method = id ? 'PUT' : 'POST';

        try {
            const res = await authFetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });

            if (res.ok) {
                setEditShopId(null);
                setEditShopName('');
                setNewShopName('');
                loadShops();
            }
        } catch (err) {
            console.error('Fehler beim Speichern:', err);
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
                onSubmit={() => handleSave(null)}
            />

            <GenericEditableList
                entries={shops}
                editId={editShopId}
                editValue={editShopName}
                onEditClick={(id, name) => {
                    setEditShopId(id);
                    setEditShopName(name);
                }}
                onEditChange={setEditShopName}
                onSave={handleSave}
                onDelete={confirmDelete}
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
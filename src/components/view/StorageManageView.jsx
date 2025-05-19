'use client';

import { useEffect, useState } from 'react';
import { authFetch } from '@/utils/authFetch';
import PageTitle from '@/components/ui/PageTitle';
import GenericEditableList from '@/components/ui/GenericEditableList';
import GenericCreateForm from '@/components/ui/GenericCreateForm';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

export default function StoragesManageView() {
    const [communities, setCommunities] = useState([]);
    const [selectedCommunityId, setSelectedCommunityId] = useState(null);
    const [storages, setStorages] = useState([]);
    const [newStorageName, setNewStorageName] = useState('');
    const [editStorageId, setEditStorageId] = useState(null);
    const [editStorageName, setEditStorageName] = useState('');
    const [deleteStorageId, setDeleteStorageId] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        authFetch('/api/community/my')
            .then(res => res.json())
            .then(data => {
                setCommunities(data);
                if (data.length > 0) {
                    setSelectedCommunityId(data[0].id);
                    setStorages(data[0].storages || []);
                }
            })
            .catch(err => console.error('Fehler beim Laden der Communities:', err));
    }, []);

    useEffect(() => {
        if (selectedCommunityId) {
            const selected = communities.find(c => c.id === selectedCommunityId);
            setStorages(selected?.storages || []);
        }
    }, [selectedCommunityId, communities]);

    const handleSave = async (id) => {
        const name = id ? editStorageName : newStorageName;
        if (!name.trim() || !selectedCommunityId) return;

        const url = id ? `/api/storage/${id}/rename` : '/api/storage';
        const method = id ? 'PUT' : 'POST';

        const payload = id ? { name } : { name, communityId: selectedCommunityId };

        try {
            const res = await authFetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                setEditStorageId(null);
                setEditStorageName('');
                setNewStorageName('');
                reloadCommunityData();
            }
        } catch (err) {
            console.error('Fehler beim Speichern:', err);
        }
    };

    const reloadCommunityData = () => {
        authFetch('/api/community/my')
            .then(res => res.json())
            .then(data => {
                setCommunities(data);
                const selected = data.find(c => c.id === selectedCommunityId);
                setStorages(selected?.storages || []);
            })
            .catch(err => console.error('Fehler beim Neuladen:', err));
    };

    const confirmDelete = (id) => {
        setDeleteStorageId(id);
        setShowConfirm(true);
    };

    const handleDeleteConfirmed = async () => {
        try {
            const res = await authFetch(`/api/storage/${deleteStorageId}`, { method: 'DELETE' });
            if (res.ok) reloadCommunityData();
        } catch (err) {
            console.error('Fehler beim Löschen:', err);
        } finally {
            setShowConfirm(false);
            setDeleteStorageId(null);
        }
    };

    return (
        <>
            <PageTitle icon="🛠️">Lager verwalten</PageTitle>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Community auswählen:</label>
                <select
                    value={selectedCommunityId || ''}
                    onChange={e => setSelectedCommunityId(Number(e.target.value))}
                    className="w-full p-2 border rounded"
                >
                    {communities.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>

            <GenericCreateForm
                label="Lager"
                value={newStorageName}
                onChange={setNewStorageName}
                onSubmit={() => handleSave(null)}
            />

            <GenericEditableList
                entries={storages}
                editId={editStorageId}
                editValue={editStorageName}
                onEditClick={(id, name) => {
                    setEditStorageId(id);
                    setEditStorageName(name);
                }}
                onEditChange={setEditStorageName}
                onSave={handleSave}
                onDelete={confirmDelete}
            />

            {showConfirm && (
                <ConfirmDialog
                    title="Lager löschen"
                    message="Möchtest du dieses Lager wirklich löschen?"
                    onConfirm={handleDeleteConfirmed}
                    onCancel={() => setShowConfirm(false)}
                />
            )}
        </>
    );
}
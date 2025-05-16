'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authFetch } from '@/utils/authFetch';
import PageTitle from '@/components/ui/PageTitle';
import GenericEditableList from '@/components/ui/GenericEditableList';
import GenericCreateForm from '@/components/ui/GenericCreateForm';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

export default function ShoppingListManageView() {
    const [lists, setLists] = useState([]);
    const [newListName, setNewListName] = useState('');
    const [editListId, setEditListId] = useState(null);
    const [editListName, setEditListName] = useState('');
    const [deleteListId, setDeleteListId] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        loadLists();

        // 👤 Lade aktuellen Benutzer
        authFetch('/api/user/me')
            .then(res => res.json())
            .then(setCurrentUser);
    }, []);

    const loadLists = () => {
        authFetch('/api/shopping-list/my')
            .then(res => res.json())
            .then(data => setLists(data))
            .catch(err => console.error('Fehler beim Laden der Listen:', err));
    };

    const handleSave = async (id) => {
        const name = id ? editListName : newListName;
        if (!name.trim()) return;

        const url = id
            ? `/api/shopping-list/${id}/rename`
            : '/api/shopping-list';

        const method = id ? 'PUT' : 'POST';

        try {
            const res = await authFetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });

            if (res.ok) {
                setEditListId(null);
                setEditListName('');
                setNewListName('');
                loadLists();
            }
        } catch (err) {
            console.error('Fehler beim Speichern:', err);
        }
    };

    const confirmDelete = (id) => {
        setDeleteListId(id);
        setShowConfirm(true);
    };

    const handleDeleteConfirmed = async () => {
        try {
            const res = await authFetch(`/api/shopping-list/${deleteListId}`, { method: 'DELETE' });
            if (res.ok) loadLists();
        } catch (err) {
            console.error('Fehler beim Löschen:', err);
        } finally {
            setShowConfirm(false);
            setDeleteListId(null);
        }
    };

    return (
        <>
            <PageTitle icon="📝">Einkaufslisten verwalten</PageTitle>

            <GenericCreateForm
                label="Einkaufsliste"
                value={newListName}
                onChange={setNewListName}
                onSubmit={() => handleSave(null)}
            />

            <GenericEditableList
                entries={lists}
                editId={editListId}
                editValue={editListName}
                onEditClick={(id, name) => {
                    setEditListId(id);
                    setEditListName(name);
                }}
                onEditChange={setEditListName}
                onSave={handleSave}
                onDelete={confirmDelete}
                showManageMembers={true}
                onManageMembersClick={(id) => router.push(`/user/manage-shopping-list/member?id=${id}`)}
                currentUserId={currentUser?.id} // ✅ entscheidend
            />

            {showConfirm && (
                <ConfirmDialog
                    title="Einkaufsliste löschen"
                    message="Möchtest du diese Liste wirklich löschen?"
                    onConfirm={handleDeleteConfirmed}
                    onCancel={() => setShowConfirm(false)}
                />
            )}
        </>
    );
}

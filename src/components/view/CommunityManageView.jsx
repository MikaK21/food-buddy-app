'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authFetch } from '@/utils/authFetch';
import PageTitle from '@/components/ui/PageTitle';
import GenericCreateForm from '@/components/ui/GenericCreateForm';
import GenericEditableList from '@/components/ui/GenericEditableList';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

export default function CommunityManageView() {
    const [communities, setCommunities] = useState([]);
    const [newName, setNewName] = useState('');
    const [editId, setEditId] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [deleteError, setDeleteError] = useState('');
    const [currentUser, setCurrentUser] = useState(null);

    const router = useRouter();

    useEffect(() => {
        loadCommunities();
        authFetch('/api/user/me')
            .then(res => res.json())
            .then(setCurrentUser);
    }, []);

    const loadCommunities = () => {
        authFetch('/api/community/my')
            .then(res => res.json())
            .then(setCommunities);
    };

    const handleCreate = () => {
        if (!newName.trim()) return;
        authFetch('/api/community', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newName })
        }).then(() => {
            setNewName('');
            loadCommunities();
        });
    };

    const handleDelete = (id) => {
        setDeleteError('');
        setDeleteId(id);
        setShowConfirm(true);
    };

    const handleConfirmDelete = async () => {
        try {
            const res = await authFetch(`/api/community/${deleteId}`, { method: 'DELETE' });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Fehler beim Löschen');
            }

            setShowConfirm(false);
            setDeleteId(null);
            loadCommunities();
        } catch (err) {
            setDeleteError(err.message || 'Unbekannter Fehler');
        }
    };

    const handleEditClick = (id, name) => {
        setEditId(id);
        setEditValue(name);
    };

    const handleSave = (id) => {
        if (!editValue.trim()) return;
        authFetch(`/api/community/${id}/rename`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: editValue })
        }).then(() => {
            setEditId(null);
            setEditValue('');
            loadCommunities();
        });
    };

    const handleManageMembers = (id) => {
        router.push(`/user/manage-community/member?id=${id}`);
    };

    return (
        <div>
            <PageTitle icon="🏘️">Communities verwalten</PageTitle>

            <GenericCreateForm
                label="Community"
                value={newName}
                onChange={setNewName}
                onSubmit={handleCreate}
            />

            <GenericEditableList
                entries={communities}
                editId={editId}
                editValue={editValue}
                onEditClick={handleEditClick}
                onEditChange={setEditValue}
                onSave={handleSave}
                onDelete={handleDelete}
                showManageMembers={true}
                onManageMembersClick={handleManageMembers}
                currentUserId={currentUser?.id}
            />

            {showConfirm && (
                <ConfirmDialog
                    title="Community löschen"
                    message="Möchtest du diese Community wirklich löschen?"
                    onConfirm={handleConfirmDelete}
                    onCancel={() => {
                        setShowConfirm(false);
                        setDeleteId(null);
                        setDeleteError('');
                    }}
                    error={deleteError}
                />
            )}
        </div>
    );
}

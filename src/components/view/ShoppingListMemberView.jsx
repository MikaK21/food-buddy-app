'use client';

import CommunityMemberList from "@/components/ui/CommunityMemberList";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authFetch } from '@/utils/authFetch';

export default function ShoppingListMembersView() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const [list, setList] = useState(null);
    const [newMember, setNewMember] = useState('');
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        refresh();
        authFetch('/api/user/me')
            .then((res) => res.json())
            .then((user) => setCurrentUserId(user.id));
    }, [id]);

    const refresh = () => {
        authFetch('/api/shopping-list/my')
            .then((res) => res.json())
            .then((data) => {
                const found = data.find((l) => l.id.toString() === id);
                setList(found);
            });
    };

    const handleAdd = async () => {
        await authFetch(`/api/shopping-list/${id}/member`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: newMember }),
        });
        setNewMember('');
        refresh();
    };

    const handleRemove = async (username) => {
        await authFetch(`/api/shopping-list/${id}/member`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username }),
        });
        refresh();
    };

    const handleTransferLeader = async (username) => {
        await authFetch(`/api/shopping-list/${id}/transfer-leader`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newLeaderUsername: username }),
        });
        refresh();
    };

    if (!list || currentUserId === null) return <p className="p-4">Lade Daten…</p>;

    return (
        <div>
            <h1 className="text-xl font-semibold mb-2">Mitglieder von {list.name}</h1>

            <CommunityMemberList
                members={list.members}
                leaderId={list.leader.id}
                currentUserId={currentUserId}
                newMemberName={newMember}
                onNewMemberChange={setNewMember}
                onAddMember={handleAdd}
                onRemoveMember={handleRemove}
                onTransferLeader={undefined} // 👈 keine Funktion = kein Button
            />
        </div>
    );
}

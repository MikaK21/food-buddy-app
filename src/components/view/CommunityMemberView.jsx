import CommunityMemberList from "@/components/ui/CommunityMemberList";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authFetch } from '@/utils/authFetch';

export default function CommunityMemberView() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const [community, setCommunity] = useState(null);
    const [newMember, setNewMember] = useState('');
    const [currentUserId, setCurrentUserId] = useState(null); // ggf. via auth

    useEffect(() => {
        authFetch('/api/community/my')
            .then((res) => res.json())
            .then((data) => {
                const found = data.find((c) => c.id.toString() === id);
                setCommunity(found);
            });

        authFetch('/api/user/me') // oder je nachdem wie du User-ID bekommst
            .then((res) => res.json())
            .then((user) => setCurrentUserId(user.id));
    }, [id]);

    const handleAdd = async () => {
        await authFetch(`/api/community/${id}/add-member`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: newMember }),
        });
        setNewMember('');
        refresh();
    };

    const handleRemove = async (username) => {
        await authFetch(`/api/community/${id}/remove-member`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username }),
        });
        refresh();
    };

    const handleTransfer = async (username) => {
        await authFetch(`/api/community/${id}/transfer-leader`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newLeaderUsername: username }),
        });
        refresh();
    };

    const refresh = () => {
        authFetch('/api/community/my')
            .then((res) => res.json())
            .then((data) => {
                const found = data.find((c) => c.id.toString() === id);
                setCommunity(found);
            });
    };

    if (!community || currentUserId === null) return <p>Lade Daten…</p>;

    return (
        <div>
            <h1 className="text-xl font-semibold mb-4">Mitglieder von {community.name}</h1>

            <CommunityMemberList
                members={community.members}
                leaderId={community.leader.id}
                currentUserId={currentUserId}
                newMemberName={newMember}
                onNewMemberChange={setNewMember}
                onAddMember={handleAdd}
                onRemoveMember={handleRemove}
                onTransferLeader={handleTransfer}
            />
        </div>
    );
}

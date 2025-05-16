'use client';

import { useEffect, useRef } from 'react';
import GenericCreateForm from "@/components/ui/GenericCreateForm";

export default function CommunityMemberList({
                                                members = [],
                                                currentUserId,
                                                leaderId,
                                                onTransferLeader,
                                                onRemoveMember,
                                                newMemberName,
                                                onNewMemberChange,
                                                onAddMember,
                                            }) {
    const inputRef = useRef(null);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onAddMember();
        }
    };

    const sortedMembers = [...members].sort((a, b) => {
        if (a.id === leaderId) return -1;
        if (b.id === leaderId) return 1;
        return 0;
    });

    const isLeader = currentUserId === leaderId;

    return (
        <div>
            {/* Hinzufügen */}
            <GenericCreateForm
                label="Benutzer"
                value={newMemberName}
                onChange={onNewMemberChange}
                onSubmit={onAddMember}
                inputPlaceholder="Benutzername"
                inputWidth="w-[70%]"
                buttonWidth="w-[30%]"
            />

            {/* Mitgliederliste */}
            <ul className="space-y-2">
                {sortedMembers.map((member) => (
                    <li key={member.id} className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded">
                        <div>
                            <span className="font-medium">{member.username}</span>
                            {member.id === leaderId && (
                                <span className="ml-2 text-yellow-500">👑</span>
                            )}
                            <span className="ml-2 text-sm text-gray-500">({member.email})</span>
                        </div>
                        <div className="space-x-2">
                            {isLeader && member.id !== currentUserId && onTransferLeader && (
                                <button
                                    onClick={() => onTransferLeader(member.username)}
                                    className="px-2 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                                >
                                    👑 Zum Leader machen
                                </button>
                            )}
                            {isLeader && member.id !== leaderId && (
                                <button
                                    onClick={() => onRemoveMember(member.username)}
                                    className="px-2 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                                >
                                    🗑️ Entfernen
                                </button>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

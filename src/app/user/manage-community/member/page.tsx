'use client'

import CommunityMemberView from "@/components/view/CommunityMemberView";
import ProtectedRoute from "@/app/ProtectedRoute";

export default function Page() {
    return (
        <ProtectedRoute>
            <CommunityMemberView />
        </ProtectedRoute>
    )
}

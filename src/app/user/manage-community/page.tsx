'use client'

import CommunityManagementView from "@/components/view/CommunityManageView";
import ProtectedRoute from "@/app/ProtectedRoute";

export default function Page() {
    return (
        <ProtectedRoute>
            <CommunityManagementView />
        </ProtectedRoute>
    )
}

'use client'

import StorageManageView from "@/components/view/StorageManageView";
import ProtectedRoute from "@/app/ProtectedRoute";

export default function Page() {
    return (
        <ProtectedRoute>
            <StorageManageView />
        </ProtectedRoute>
    )
}

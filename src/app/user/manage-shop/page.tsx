'use client'

import ShopsManageView from "@/components/view/ShopsManageView";
import ProtectedRoute from "@/app/ProtectedRoute";

export default function Page() {
    return (
        <ProtectedRoute>
            <ShopsManageView />
        </ProtectedRoute>
    )
}

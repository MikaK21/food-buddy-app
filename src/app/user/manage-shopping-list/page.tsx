'use client'

import ShoppingListView from "@/components/view/ShoppingListManageView";
import ProtectedRoute from "@/app/ProtectedRoute";

export default function Page() {
    return (
        <ProtectedRoute>
            <ShoppingListView />
        </ProtectedRoute>
    )
}

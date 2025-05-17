'use client'

import ShoppingListMemberView from "@/components/view/ShoppingListMemberView.jsx";
import ProtectedRoute from "@/app/ProtectedRoute";

export default function Page() {
    return (
        <ProtectedRoute>
            <ShoppingListMemberView />
        </ProtectedRoute>
    )
}

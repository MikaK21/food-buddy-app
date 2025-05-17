'use client'

import ProtectedRoute from "@/app/ProtectedRoute";
import ItemDetailView from "@/components/view/ItemDetailView";

export default function Page() {

    return (
        <ProtectedRoute>
            <ItemDetailView />
        </ProtectedRoute>
    )
}

'use client'

import InventoryView from '@/components/view/InventoryView'
import ProtectedRoute from "@/app/ProtectedRoute";

export default function Page() {

    return (
        <ProtectedRoute>
            <InventoryView />
        </ProtectedRoute>
        )
    }

'use client'

import ProtectedRoute from "@/app/ProtectedRoute";
import ProductAddView from "@/components/view/ProductAddView";

export default function Page() {
    return (
        <ProtectedRoute>
            <ProductAddView />
        </ProtectedRoute>
    )
}

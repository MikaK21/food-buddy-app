'use client';

import { useEffect, useState } from 'react';
import { authFetch } from '@/utils/authFetch';
import ProductFormSection from '@/components/ui/ProductFormSection';

export default function ItemDetailView({ item, onBack, reload }) {
    const [editMode, setEditMode] = useState(false);
    const [storages, setStorages] = useState([]);

    const [formData, setFormData] = useState({
        name: item.name || '',
        category: item.category || '',
        expirationDate: item.expirationDate || '',
        quantity: item.quantity?.toString() || '0',
        unit: item.unit || 'GRAM',
        amount: item.amount?.toString() || '',
        storageId: item.storage?.id?.toString() || '',
        ingredients: item.ingredients?.join(', ') || '',
        brand: item.brand || '',
        kcal: item.nutritionInfo?.kcal?.toString() || '',
        carbohydrates: item.nutritionInfo?.carbohydrates?.toString() || '',
        sugar: item.nutritionInfo?.sugar?.toString() || '',
        protein: item.nutritionInfo?.protein?.toString() || '',
        fat: item.nutritionInfo?.fat?.toString() || '',
        saturatedFat: item.nutritionInfo?.saturatedFat?.toString() || '',
        salt: item.nutritionInfo?.salt?.toString() || '',
        fiber: item.nutritionInfo?.fiber?.toString() || '',
    });

    useEffect(() => {
        authFetch('/api/storage')
            .then((res) => res.json())
            .then((data) => setStorages(data))
            .catch(console.error);
    }, []);

    const handleChange = (name, value) => {
        setFormData((fd) => ({ ...fd, [name]: value }));
    };

    const handleSave = async () => {
        const payload = {
            ...item,
            name: formData.name,
            category: formData.category,
            expirationDate: formData.expirationDate,
            quantity: parseFloat(formData.quantity),
            unit: formData.unit,
            amount: parseFloat(formData.amount) || 0,
            ingredients: formData.ingredients
                .split(',')
                .map((i) => i.trim())
                .filter((i) => i.length > 0),
            storage: formData.storageId ? { id: parseInt(formData.storageId), name: '' } : undefined,
            brand: formData.brand,
            nutritionInfo: {
                kcal: parseFloat(formData.kcal) || 0,
                carbohydrates: parseFloat(formData.carbohydrates) || 0,
                sugar: parseFloat(formData.sugar) || 0,
                protein: parseFloat(formData.protein) || 0,
                fat: parseFloat(formData.fat) || 0,
                saturatedFat: parseFloat(formData.saturatedFat) || 0,
                salt: parseFloat(formData.salt) || 0,
                fiber: parseFloat(formData.fiber) || 0,
            },
        };

        try {
            await authFetch(`/api/items/${item.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            reload?.();
            onBack();
        } catch (err) {
            console.error('Fehler beim Speichern:', err);
        }
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">🧾 Produktdetails</h2>
            <div className="bg-white shadow rounded p-4 space-y-2">
                <ProductFormSection
                    formData={formData}
                    onChange={handleChange}
                    storages={storages}
                    readOnly={!editMode}
                />
            </div>
            <div className="flex gap-2">
                {editMode ? (
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        💾 Speichern
                    </button>
                ) : (
                    <button
                        onClick={() => setEditMode(true)}
                        className="px-4 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                    >
                        ✏️ Bearbeiten
                    </button>
                )}
                <button
                    onClick={onBack}
                    className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                >
                    🔙 Zurück zur Übersicht
                </button>
            </div>
        </div>
    );
}

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { authFetch } from '@/utils/authFetch';
import ProductFormSection from '@/components/ui/ProductFormSection';

export default function ItemDetailView() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const [item, setItem] = useState(null);
    const [formData, setFormData] = useState({});
    const [communities, setCommunities] = useState([]);
    const [storages, setStorages] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Lädt Daten
    const loadData = async () => {
        if (!id) return;

        try {
            setLoading(true);

            const [itemRes, communityRes] = await Promise.all([
                authFetch(`/api/item/${id}`),
                authFetch('/api/community/my'),
            ]);
            const itemData = await itemRes.json();
            const communityData = await communityRes.json();

            const matchedCommunity = communityData.find((c) =>
                c.storages.some((s) => s.id === itemData.storage?.id)
            );
            const matchedCommunityId = matchedCommunity?.id?.toString() || '';

            const storageListRes = await authFetch(`/api/storage/community/${matchedCommunityId}`);
            const storageList = await storageListRes.json();

            setItem(itemData);
            setCommunities(communityData);
            setStorages(storageList);

            setFormData({
                name: itemData.name || '',
                brand: itemData.brand || '',
                category: itemData.category || '',
                quantity: itemData.quantityValue?.toString() || '',
                unit: itemData.quantityUnit || 'GRAM',
                communityId: matchedCommunityId,
                storageId: itemData.storage?.id?.toString() || '',
                expirations: itemData.expirations || [],
                kcal: itemData.nutritionInfo?.kcal?.toString() || '',
                carbohydrates: itemData.nutritionInfo?.carbohydrates?.toString() || '',
                sugar: itemData.nutritionInfo?.sugar?.toString() || '',
                protein: itemData.nutritionInfo?.protein?.toString() || '',
                fat: itemData.nutritionInfo?.fat?.toString() || '',
                saturatedFat: itemData.nutritionInfo?.saturatedFat?.toString() || '',
                salt: itemData.nutritionInfo?.salt?.toString() || '',
                fiber: itemData.nutritionInfo?.fiber?.toString() || '',
                productGroup: itemData.productGroup || '',
            });

            setError('');
        } catch (err) {
            console.error(err);
            setError('Fehler beim Laden der Daten');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [id]);

    useEffect(() => {
        const loadStorages = async () => {
            if (formData.communityId) {
                try {
                    const res = await authFetch(`/api/storage/community/${formData.communityId}`);
                    const data = await res.json();
                    setStorages(data);
                } catch (err) {
                    console.error('Fehler beim Laden der Lagerorte:', err);
                }
            }
        };

        loadStorages();
    }, [formData.communityId]);

    const handleChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleExpirationChange = (index, key, value) => {
        const updated = [...formData.expirations];
        updated[index][key] = value;
        setFormData((prev) => ({ ...prev, expirations: updated }));
    };

    const addExpiration = () => {
        setFormData((prev) => ({
            ...prev,
            expirations: [...(prev.expirations || []), { amount: 1, expirationDate: '' }],
        }));
    };

    const handleSave = async () => {
        const payload = {
            ...item,
            name: formData.name,
            brand: formData.brand,
            category: formData.category,
            productGroup: formData.productGroup || '', // 👈 HINZUGEFÜGT
            quantityValue: parseFloat(formData.quantity),
            quantityUnit: formData.unit,
            storageId: formData.storageId ? parseInt(formData.storageId) : null,
            expirations: formData.expirations.map((e) => ({
                amount: parseInt(e.amount) || 0,
                expirationDate: e.expirationDate || '',
            })),
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
            await authFetch(`/api/item/${item.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            setEditMode(false);
            loadData();
        } catch (err) {
            console.error('Fehler beim Speichern:', err);
        }
    };

    if (!id) return <p>❌ Keine ID übergeben.</p>;
    if (loading) return <p>⏳ Lade Daten...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">🧾 Produktdetails</h2>

            <div className="bg-white shadow rounded p-6">
                <ProductFormSection
                    formData={formData}
                    onChange={handleChange}
                    storages={storages}
                    communities={communities}
                    onExpirationChange={handleExpirationChange}
                    onAddExpiration={addExpiration}
                    readOnly={!editMode}
                />
            </div>

            <div className="flex gap-2">
                {editMode ? (
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
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
            </div>
        </div>
    );
}

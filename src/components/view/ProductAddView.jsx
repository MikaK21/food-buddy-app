'use client';

import React, { useEffect, useState } from 'react';
import { authFetch } from '@/utils/authFetch';
import BarcodeScanner from '@/components/BarcodeScanner';
import BarcodeWithSearch from '@/components/BarcodeWithSearch.jsx';
import MessageBox from '@/components/MessageBox';
import ProductFormSection from '@/components/ui/ProductFormSection';
import ActionButton from '@/components/ActionButton';
import PageTitle from '@/components/ui/PageTitle';
import ImageScanner from '@/components/ImageScanner';

export default function AddProductView() {
    const [communities, setCommunities] = useState([]);
    const [storages, setStorages] = useState([]);
    const [message, setMessage] = useState('');
    const [scanning, setScanning] = useState(false);
    const [scanningMhdIndex, setScanningMhdIndex] = useState(null);
    const [mhdButtonStates, setMhdButtonStates] = useState({});

    const [formData, setFormData] = useState({
        barcode: '',
        name: '',
        category: '',
        quantity: 1,
        unit: 'GRAM',
        brand: '',
        communityId: '',
        storageId: '',
        expirations: [{ expirationDate: '', amount: 1 }],
        amount: '1',
        kcal: '',
        carbohydrates: '',
        sugar: '',
        fat: '',
        saturatedFat: '',
        salt: '',
        fiber: '',
        protein: '',
        productGroup: ''
    });

    // Lade Communities und initialen Lagerort
    useEffect(() => {
        const loadCommunitiesAndStorages = async () => {
            try {
                const res = await authFetch('/api/community/my');
                const data = await res.json();
                setCommunities(data);

                // NICHT automatisch Community/Lager setzen
                setStorages([]);
                setFormData(fd => ({
                    ...fd,
                    communityId: '',
                    storageId: ''
                }));
            } catch (err) {
                console.error('Fehler beim Laden der Community- und Lagerdaten:', err);
            }
        };

        loadCommunitiesAndStorages();
    }, []);

    // Lade Lagerorte bei Wechsel der Community
    useEffect(() => {
        const loadStorages = async () => {
            if (!formData.communityId) return;
            try {
                const res = await authFetch(`/api/storage/community/${formData.communityId}`);
                const data = await res.json();
                setStorages(data);
            } catch (err) {
                console.error('Fehler beim Nachladen der Lagerorte:', err);
            }
        };

        loadStorages();
    }, [formData.communityId]);

    useEffect(() => {
        const handler = (e) => {
            setScanningMhdIndex(e.detail.index);
        };
        window.addEventListener('trigger-mhd-scan', handler);
        return () => {
            window.removeEventListener('trigger-mhd-scan', handler);
        };
    }, []);

    const handleChange = (name, value) =>
        setFormData(fd => ({ ...fd, [name]: value }));

    const handleDetected = async code => {
        setFormData(fd => ({ ...fd, barcode: code }));
        setScanning(false);
        setMessage('🔍 Produktdaten werden geladen...');

        try {
            const res = await authFetch('/api/openfood/details', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ barcode: code })
            });

            if (!res.ok) throw new Error('API-Fehler');
            const data = await res.json();

            setFormData(fd => ({
                ...fd,
                barcode: code,
                name: data.name || code,
                category: data.category || '',
                brand: data.brand || '',
                quantity: data.quantity || 1,
                unit: data.unit || 'GRAM',
                kcal: data.kcal ?? '',
                carbohydrates: data.carbohydrates ?? '',
                sugar: data.sugar ?? '',
                fat: data.fat ?? '',
                saturatedFat: data.saturatedFat ?? '',
                salt: data.salt ?? '',
                fiber: data.fiber ?? '',
                protein: data.protein ?? '',
                productGroup: data.productGroup || ''
            }));

            setMessage('✅ Produktdaten übernommen!');
        } catch (err) {
            console.error('Fehler beim Laden der Produktdetails:', err);
            setMessage('⚠️ Produktinfos konnten nicht geladen werden.');
        }
    };

    const handleMhdDetected = async (file) => {
        const index = scanningMhdIndex;
        if (index === null) return;

        setButtonState(index, 'loading');
        setMessage('🔍 Verfallsdatum wird erkannt...');
        setScanningMhdIndex(null);

        const form = new FormData();
        form.append('image', file);

        try {
            const token = localStorage.getItem('token');

            const res = await fetch('http://localhost:8080/api/ocr/expiration', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: form
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();

            // Update expiration field
            setFormData(fd => {
                const expirations = [...fd.expirations];
                if (expirations[index]) {
                    expirations[index].expirationDate = data.expirationDate;
                }
                return { ...fd, expirations };
            });

            setButtonState(index, null);
            setMessage('✅ Verfallsdatum erkannt!');
        } catch (err) {
            console.error('OCR-Fehler:', err);
            setButtonState(index, 'error');

            // Nach 3 Sek zurück zu default
            setTimeout(() => setButtonState(index, null), 3000);
            setMessage('⚠️ Konnte Verfallsdatum nicht erkennen.');
        } finally {
            setTimeout(() => setMessage(''), 3000);
        }
    };



    const handleSubmit = async () => {
        const requiredFields = [
            { key: 'name', label: 'Name' },
            { key: 'quantity', label: 'Menge' },
            { key: 'unit', label: 'Einheit' },
            { key: 'category', label: 'Kategorie' },
            { key: 'productGroup', label: 'Produktgruppe' },
            { key: 'communityId', label: 'Community' },
            { key: 'storageId', label: 'Lagerort' },
        ];

// Ablaufdaten validieren separat
        const hasInvalidExpiration = formData.expirations.some(
            e => !e.expirationDate || !e.amount
        );

        const missingField = requiredFields.find(field => !formData[field.key]);
        if (missingField || hasInvalidExpiration) {
            const fieldName = missingField?.label || 'Ablaufdatum / Anzahl';
            setMessage(`❌ Bitte fülle das Pflichtfeld: ${fieldName}`);
            setTimeout(() => setMessage(''), 4000);
            return;
        }

        const payload = {
            barcode: formData.barcode,
            name: formData.name,
            category: formData.category,
            quantityValue: parseFloat(formData.quantity),
            productGroup: formData.productGroup || '',
            expirationDate: formData.expirationDate,
            brand: formData.brand,
            quantityUnit: formData.unit,
            storageId: formData.storageId ? parseInt(formData.storageId) : null,
            expirations: formData.expirations.map(e => ({
                expirationDate: e.expirationDate,
                amount: parseInt(e.amount)
            })),
            nutritionInfo: {
                kcal: parseFloat(formData.kcal) || 0,
                carbohydrates: parseFloat(formData.carbohydrates) || 0,
                sugar: parseFloat(formData.sugar) || 0,
                fat: parseFloat(formData.fat) || 0,
                saturatedFat: parseFloat(formData.saturatedFat) || 0,
                salt: parseFloat(formData.salt) || 0,
                fiber: parseFloat(formData.fiber) || 0,
                protein: parseFloat(formData.protein) || 0
            }
        };


        // 👇 Ausgabe für Debugging
        console.log('[PAYLOAD TO API]', JSON.stringify(payload, null, 2));


        try {
            const res = await authFetch('/api/item', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setMessage('✅ Produkt erfolgreich hinzugefügt!');
                setTimeout(() => setMessage(''), 3000);
                setFormData({
                    barcode: '',
                    name: '',
                    category: '',
                    quantity: 1,
                    unit: 'GRAM',
                    brand: '',
                    communityId: '',
                    storageId: '',
                    expirations: [{ expirationDate: '', amount: 1 }],
                    amount: '1',
                    kcal: '',
                    carbohydrates: '',
                    sugar: '',
                    fat: '',
                    saturatedFat: '',
                    salt: '',
                    fiber: '',
                    protein: '',
                    productGroup: ''
                });
            } else {
                setMessage('❌ Fehler beim Hinzufügen.');
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (err) {
            console.error(err);
            setMessage('❌ Netzwerk- oder Serverfehler.');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const setButtonState = (index, state) => {
        setMhdButtonStates(prev => ({
            ...prev,
            [index]: state
        }));
    };

    return (
        <div className="space-y-6">
            <PageTitle icon="📷">Produkt hinzufügen</PageTitle>

            {/*<MessageBox message={message} />*/}

            {scanning && (
                <BarcodeScanner
                    onDetected={handleDetected}
                    onClose={() => setScanning(false)}
                />
            )}

            {scanningMhdIndex !== null && (
                <ImageScanner
                    onCapture={handleMhdDetected}
                    onClose={() => setScanningMhdIndex(null)}
                />
            )}

            <form
                className="bg-white rounded shadow p-6 space-y-6"
                onSubmit={e => {
                    e.preventDefault();
                    handleSubmit();
                }}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <BarcodeWithSearch
                        barcode={formData.barcode}
                        onBarcodeChange={val => handleChange('barcode', val)}
                        onSearch={() => handleDetected(formData.barcode)}
                    />
                    <div>
                        <label className="invisible block text-sm font-medium mb-1">
                            Unsichtbares Label
                        </label>
                        <ActionButton
                            onClick={() => setScanning(true)}
                            className="w-full"
                        >
                            📸 Barcode scannen
                        </ActionButton>
                    </div>
                </div>


                <ProductFormSection
                    formData={formData}
                    onChange={handleChange}
                    storages={storages}
                    communities={communities}
                    mhdButtonStates={mhdButtonStates}
                    onTriggerScan={(idx) => setScanningMhdIndex(idx)}
                />

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    ➕ Produkt hinzufügen
                </button>
            </form>
        </div>
    );
}

'use client';

import React, { useState, useEffect } from 'react';
import FormField from '@/components/ui/interaction/FormField';
import QuantityWithUnit from '@/components/ui/interaction/QuantityWithUnit';
import SelectField from '@/components/ui/interaction/SelectField';

export default function ProductFormSection({
                                               formData,
                                               onChange,
                                               storages,
                                               communities,
                                               readOnly = false,
                                           }) {
    const [expirations, setExpirations] = useState(formData.expirations || []);

    useEffect(() => {
        onChange('expirations', expirations);
    }, [expirations]);

    const updateExpiration = (index, key, value) => {
        const updated = expirations.map((e, i) =>
            i === index ? { ...e, [key]: value } : e
        );
        setExpirations(updated);
    };

    const addExpiration = () => {
        setExpirations([...expirations, { expirationDate: '', amount: '' }]);
    };

    const getValue = (name) => formData[name] ?? '';

    return (
        <>
            <div className="mb-4 pt-4 border-t border-gray-200 md:col-span-2">
                <h3 className="text-md font-semibold text-gray-600 mb-4">Allgemeine Informationen</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    label="Name"
                    name="name"
                    value={getValue('name')}
                    onChange={(e) => onChange(e.target.name, e.target.value)}
                    disabled={readOnly}
                />
                <FormField
                    label="Hersteller"
                    name="brand"
                    value={getValue('brand')}
                    onChange={(e) => onChange(e.target.name, e.target.value)}
                    disabled={readOnly}
                />

                <QuantityWithUnit
                    quantity={getValue('quantity')}
                    unit={getValue('unit')}
                    onQuantityChange={(val) => onChange('quantity', val)}
                    onUnitChange={(val) => onChange('unit', val)}
                    readOnly={readOnly}
                />

                {/* Kategorie & Produktgruppe nebeneinander */}
                <div className="grid grid-cols-2 gap-4">
                    <SelectField
                        label="Kategorie"
                        name="category"
                        value={getValue('category')}
                        onChange={(e) => onChange(e.target.name, e.target.value)}
                        options={[
                            { value: '', label: '-- Kategorie wählen --' },
                            { value: 'FOOD', label: '🍽️ Lebensmittel' },
                            { value: 'DRINK', label: '🥤 Getränk' },
                            { value: 'MEDICATION', label: '💊 Medikament' },
                            { value: 'OTHER', label: '📦 Sonstiges' },
                        ]}
                        disabled={readOnly}
                    />
                    <SelectField
                        label="Produktgruppe"
                        name="productGroup"
                        value={getValue('productGroup')}
                        onChange={(e) => onChange(e.target.name, e.target.value)}
                        options={[
                            { value: '', label: '-- Produktgruppe wählen --' },
                            { value: 'FLEISCHPRODUKT', label: 'Fleischprodukt' },
                            { value: 'MILCHPRODUKT', label: 'Milchprodukt' },
                            { value: 'GEMUESE', label: 'Gemüse' },
                            { value: 'OBST', label: 'Obst' },
                            { value: 'KONSERVE', label: 'Konserve' },
                            { value: 'BACKWARE', label: 'Backware' },
                            { value: 'SONSTIGES', label: 'Sonstiges' },
                        ]}
                        disabled={readOnly}
                    />
                </div>

                <SelectField
                    label="Community"
                    name="communityId"
                    value={getValue('communityId')}
                    onChange={(e) => onChange(e.target.name, e.target.value)}
                    options={[
                        { value: '', label: '-- Community wählen --' },
                        ...communities.map((c) => ({
                            value: c.id.toString(),
                            label: c.name,
                        })),
                    ]}
                    disabled={readOnly}
                />

                <SelectField
                    label="Lagerort"
                    name="storageId"
                    value={getValue('storageId')}
                    onChange={(e) => onChange(e.target.name, e.target.value)}
                    options={[
                        { value: '', label: '-- Lager wählen --' },
                        ...storages.map((s) => ({
                            value: s.id.toString(),
                            label: s.name,
                        })),
                    ]}
                    disabled={readOnly}
                />
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 md:col-span-2">
                <h3 className="text-md font-semibold text-gray-600 mb-4">Ablaufdaten</h3>
                {expirations.map((entry, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                        <FormField
                            label="Ablaufdatum"
                            type="date"
                            value={entry.expirationDate}
                            onChange={(e) => updateExpiration(idx, 'expirationDate', e.target.value)}
                            disabled={readOnly}
                        />
                        <FormField
                            label="Anzahl"
                            type="number"
                            value={entry.amount}
                            onChange={(e) => updateExpiration(idx, 'amount', e.target.value)}
                            disabled={readOnly}
                        />
                    </div>
                ))}
                {!readOnly && (
                    <button
                        type="button"
                        onClick={addExpiration}
                        className="w-full mt-2 px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                        ➕ Weitere Ablaufdaten hinzufügen
                    </button>
                )}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 md:col-span-2">
                <h3 className="text-md font-semibold text-gray-600 mb-4">Nährwerte (pro 100g/ml)</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        'kcal',
                        'carbohydrates',
                        'sugar',
                        'protein',
                        'fat',
                        'saturatedFat',
                        'salt',
                        'fiber',
                    ].map((field) => (
                        <FormField
                            key={field}
                            label={field.charAt(0).toUpperCase() + field.slice(1)}
                            name={field}
                            value={getValue(field)}
                            onChange={(e) => onChange(e.target.name, e.target.value)}
                            disabled={readOnly}
                            type="number"
                            step="0.1"
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

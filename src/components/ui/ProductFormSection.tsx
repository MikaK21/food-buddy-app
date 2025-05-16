'use client';

import React from 'react';
import FormField from '@/components/ui/interaction/FormField';
import QuantityWithUnit from '@/components/ui/interaction/QuantityWithUnit';
import SelectField from '@/components/ui/interaction/SelectField';

type Storage = {
    id: number;
    name: string;
};

type FormData = {
    [key: string]: string;
};

type Props = {
    formData: FormData;
    onChange: (name: string, value: string) => void;
    storages: Storage[];
    readOnly?: boolean;
};

export default function ProductFormSection({
                                               formData,
                                               onChange,
                                               storages,
                                               readOnly = false,
                                           }: Props) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        onChange(name, value);
    };

    const getValue = (name: string): string => formData[name] ?? '';

    return (
        <>
            {/* 🔹 Neue Überschrift & Linie */}
            <div className="mb-4 pt-4 border-t border-gray-200 md:col-span-2">
                <h3 className="text-md font-semibold text-gray-600 mb-4">Allgemeine Informationen</h3>
            </div>

            {/* 🔹 Allgemeine Felder */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Name" name="name" value={getValue('name')} onChange={handleChange} disabled={readOnly} />
                <FormField label="Hersteller" name="brand" value={getValue('brand')} onChange={handleChange} disabled={readOnly} />
                <QuantityWithUnit
                    quantity={getValue('quantity')}
                    unit={getValue('unit')}
                    onQuantityChange={(val) => onChange('quantity', val)}
                    onUnitChange={(val) => onChange('unit', val)}
                    readOnly={readOnly}
                />
                <FormField label="Ablaufdatum" name="expirationDate" type="date" value={getValue('expirationDate')} onChange={handleChange} disabled={readOnly} />
                <FormField label="Anzahl" name="amount" value={getValue('amount')} type="number" onChange={handleChange} disabled={readOnly} />
                <SelectField
                    label="Kategorie"
                    name="category"
                    value={getValue('category')}
                    onChange={handleChange}
                    options={[
                        { value: '', label: '-- Kategorie wählen --' },
                        { value: 'FOOD', label: '🍽️ Lebensmittel' },
                        { value: 'DRINK', label: '🥤 Getränk' },
                        { value: 'MEDICATION', label: '💊 Medikament' },
                        { value: 'OTHER', label: '📦 Sonstiges' },
                    ]}
                    disabled={readOnly}
                />
                <FormField label="Zutaten" name="ingredients" value={getValue('ingredients')} onChange={handleChange} disabled={readOnly} />
                <SelectField
                    label="Lagerort"
                    name="storageId"
                    value={getValue('storageId')}
                    onChange={handleChange}
                    options={[
                        { value: '', label: '-- Lager wählen --' },
                        ...storages.map((s) => ({ value: s.id.toString(), label: s.name })),
                    ]}
                    disabled={readOnly}
                />
            </div>

            {/* 🔹 Nährwerte */}
            <div className="mt-6 pt-4 border-t border-gray-200 md:col-span-2">
                <h3 className="text-md font-semibold text-gray-600 mb-4">Nährwerte (pro 100g/ml)</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {["kcal", "carbohydrates", "sugar", "protein", "fat", "saturatedFat", "salt", "fiber"].map((field) => (
                    <FormField
                        key={field}
                        label={field.charAt(0).toUpperCase() + field.slice(1)}
                        name={field}
                        value={getValue(field)}
                        onChange={handleChange}
                        disabled={readOnly}
                        type="number"
                        step="0.1"
                    />
                ))}
            </div>
        </>
    );
}

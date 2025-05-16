'use client';

import React from 'react';

const UNIT_OPTIONS = [
    { label: 'Gramm', value: 'GRAM' },
    { label: 'Kilogramm', value: 'KILOGRAM' },
    { label: 'Milligramm', value: 'MILLIGRAM' },
    { label: 'Liter', value: 'LITER' },
    { label: 'Milliliter', value: 'MILLILITER' },
    { label: 'Stück', value: 'PIECE' },
];

type QuantityWithUnitProps = {
    quantity: number | string;
    unit: string;
    onQuantityChange: (value: string) => void;
    onUnitChange: (value: string) => void;
    readOnly?: boolean;
};

export default function QuantityWithUnit({
                                             quantity,
                                             unit,
                                             onQuantityChange,
                                             onUnitChange,
                                             readOnly = false,
                                         }: QuantityWithUnitProps) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1">Menge & Einheit</label>
            <div className="flex gap-0 w-full">
                <input
                    type="number"
                    step="any"
                    min="0"
                    className={`w-2/3 border rounded-l px-3 py-2 ${
                        readOnly ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
                    }`}
                    value={quantity}
                    onChange={(e) => onQuantityChange(e.target.value)}
                    disabled={readOnly}
                />
                <select
                    className={`w-1/3 border-t border-b border-r rounded-r px-2 py-2 ${
                        readOnly ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
                    }`}
                    value={unit}
                    onChange={(e) => onUnitChange(e.target.value)}
                    disabled={readOnly}
                >
                    {UNIT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

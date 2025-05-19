export default function BarcodeWithSearch({ barcode, onBarcodeChange, onSearch }) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1">Barcode</label>
            <div className="flex">
                <input
                    type="text"
                    className="w-2/3 border rounded-l px-3 py-2"
                    value={barcode}
                    onChange={e => onBarcodeChange(e.target.value)}
                />
                <button
                    type="button"
                    className="w-1/3 bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
                    onClick={onSearch}
                >
                    🔍 Search
                </button>
            </div>
        </div>
    );
}

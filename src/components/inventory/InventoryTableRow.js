export default function InventoryTableRow({ item, index, onSelectItem, getStoragesOfItemCommunity, onChangeStorage, onAction }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'EXPIRED': return 'bg-red-500';
            case 'WARNING': return 'bg-yellow-400';
            case 'OK': return 'bg-green-500';
            default: return 'bg-gray-300';
        }
    };

    const formatDateGerman = (isoDateString) => {
        if (!isoDateString) return '';
        const date = new Date(isoDateString);
        return date.toLocaleDateString('de-DE');
    };

    return (
        <tr
            className={`border-t ${index % 2 === 1 ? 'bg-gray-50' : ''} cursor-pointer hover:bg-green-100`}
            onClick={() => onSelectItem(item)}
        >
            <td className="px-4 py-2 text-black font-medium text-left">
                {item.name}
            </td>
            <td className="px-4 py-2 text-center">{formatDateGerman(item.expirations?.[0]?.expirationDate)}</td>
            <td className="px-4 py-2 text-center">
                <span className={`inline-block w-4 h-4 rounded-full ${getStatusColor(item.expirationStatus)}`}></span>
            </td>
            <td
                className="px-4 py-2 text-center cursor-default"
                onClick={(e) => e.stopPropagation()}
            >
                <select
                    value={item.storage?.id || ''}
                    onChange={e => onChangeStorage(item.id, e.target.value)}
                    className="px-2 py-1 border rounded text-sm"
                >
                    {getStoragesOfItemCommunity(item).map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </select>
            </td>
            <td
                className="px-4 py-2 text-center cursor-default"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex gap-2 justify-center">
                    <button
                        onClick={() => onAction(item.id, 'consume')}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                        🍽️ Gegessen
                    </button>
                    <button
                        onClick={() => onAction(item.id, 'discard')}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                        🗑️ Weggeschmissen
                    </button>
                </div>
            </td>
        </tr>
    );
}
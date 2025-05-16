export default function InventoryFilterBar({
                                               communities,
                                               selectedCommunityId,
                                               setSelectedCommunityId,
                                               selectedStorageId,
                                               setSelectedStorageId,
                                               sortBy,
                                               setSortBy,
                                               sortOrder,
                                               setSortOrder,
                                               getStoragesForSelectedCommunity,
                                           }) {
    return (
        <div className="flex flex-wrap gap-4 px-4">
            <select
                value={selectedCommunityId}
                onChange={(e) => {
                    setSelectedCommunityId(e.target.value);
                    setSelectedStorageId('ALL');
                }}
                className="p-2 border rounded"
            >
                <option value="ALL">🌍 Alle Communities</option>
                {communities.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </select>

            <select
                value={selectedStorageId}
                onChange={(e) => setSelectedStorageId(e.target.value)}
                className="p-2 border rounded"
            >
                <option value="ALL">📦 Alle Lager</option>
                {getStoragesForSelectedCommunity().map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                ))}
            </select>

            <div className="flex gap-2 items-center text-sm">
                <label>Sortieren nach:</label>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="px-2 py-1 border rounded">
                    <option value="name">Name</option>
                    <option value="expirationDate">MHD</option>
                    <option value="amount">Menge</option>
                </select>
                <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="px-2 py-1 border rounded">
                    <option value="asc">⬆️ Aufsteigend</option>
                    <option value="desc">⬇️ Absteigend</option>
                </select>
            </div>
        </div>
    );
}
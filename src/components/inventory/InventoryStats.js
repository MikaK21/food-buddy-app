export default function InventoryStats({ stats }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center text-sm bg-white p-4 rounded shadow mx-4">
            <div><div className="text-lg font-bold">{stats.total}</div>Artikel</div>
            <div><div className="text-lg text-red-600 font-bold">{stats.expired}</div>Abgelaufen</div>
            <div><div className="text-lg text-yellow-600 font-bold">{stats.soon}</div>Bald ablaufend</div>
        </div>
    );
}
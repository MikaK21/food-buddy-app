export default function InventoryToggles({ showOnlyExpired, setShowOnlyExpired, showOnlyExpiringSoon, setShowOnlyExpiringSoon }) {
    return (
        <div className="flex gap-6 items-center text-sm px-4">
            <label className="flex items-center gap-2">
                <input type="checkbox" checked={showOnlyExpired} onChange={(e) => setShowOnlyExpired(e.target.checked)} />
                Nur abgelaufene anzeigen
            </label>
            <label className="flex items-center gap-2">
                <input type="checkbox" checked={showOnlyExpiringSoon} onChange={(e) => setShowOnlyExpiringSoon(e.target.checked)} />
                Nur bald ablaufende anzeigen
            </label>
        </div>
    );
}
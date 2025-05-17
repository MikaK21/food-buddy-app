'use client'

import Link from 'next/link'
import LogoutButton from '@/components/ui/interaction/LogoutButton'
import { usePathname } from 'next/navigation'

const MAIN_TABS = {
    inventory: '📦 Lagerbestand',
    scan: '📷 Produkt hinzufügen',
    'shopping-list': '🛒 Einkaufslisten'
}

const MANAGE_TABS = {
    'manage-storage': '🛠️ Lager verwalten',
    'manage-shopping-list': '📝 Einkaufslisten verwalten',
    'manage-shop': '🏪 Läden verwalten',
    'manage-community': '🏘️ Communities verwalten'
}

export default function UserLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const activeTab = pathname.split('/')[2] // z. B. "inventory"

    const renderTabs = (tabs: Record<string, string>) =>
        Object.entries(tabs).map(([key, label]) => (
            <Link
                key={key}
                href={`/user/${key}`}
                className={`w-full text-left px-4 py-3 text-sm ${
                    activeTab === key
                        ? 'bg-green-100 text-green-700 font-semibold border-l-4 border-green-600'
                        : 'hover:bg-gray-100 text-gray-700'
                }`}
            >
                {label}
            </Link>
        ))

    return (
        <div className="h-screen flex overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-md flex flex-col justify-between h-screen fixed left-0 top-0">
                <div>
                    {/* Klickbares Logo */}
                    <Link
                        href="/user/inventory"
                        className="block p-4 text-2xl font-bold text-green-600 flex items-center gap-2 border-b border-green-600 hover:bg-green-50"
                    >
                        🥗 <span>FoodBuddy</span>
                    </Link>

                    <div className="flex flex-col">
                        {/* Hauptfunktionen */}
                        {renderTabs(MAIN_TABS)}

                        {/* Grüne Trennlinie */}
                        <div className="border-t border-green-600 mx-4 my-2" />

                        {/* Verwaltungsfunktionen */}
                        {renderTabs(MANAGE_TABS)}
                    </div>
                </div>

                {/* Logout mit Hand-Cursor */}
                <div className="p-4 border-t border-red-500">
                    <LogoutButton className="w-full text-left px-4 py-3 text-red-600 cursor-pointer hover:bg-red-50" />
                </div>
            </div>

            {/* Main content */}
            <div className="ml-64 flex-1 h-screen overflow-y-auto bg-gray-100 p-6">
                <div className="bg-white p-6 rounded-xl shadow w-full">{children}</div>
            </div>
        </div>
    )
}

export default function PageTitle({ icon, children }) {
    return (
        <div className="pb-4">
            <h1 className="text-xl font-semibold flex items-center gap-2">
                <span>{icon}</span> {children}
            </h1>
        </div>
    );
}
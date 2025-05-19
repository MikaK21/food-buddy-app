export default function MessageBox({ message }) {
    if (!message) return null;
    return (
        <div className="p-2 bg-blue-100 text-blue-700 rounded text-sm">
            {message}
        </div>
    );
}

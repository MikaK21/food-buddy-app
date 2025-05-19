export default function ActionButton({ children, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="w-full bg-green-500 text-white px-4 h-[42px] text-sm font-medium rounded hover:bg-green-600"
        >
            {children}
        </button>
    );
}

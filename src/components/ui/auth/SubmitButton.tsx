'use client'

export default function SubmitButton({
                                         label,
                                         disabled = false,
                                     }: {
    label: string;
    disabled?: boolean;
}) {
    return (
        <button
            type="submit"
            disabled={disabled}
            className={`w-full py-2 font-semibold rounded-xl transition duration-200 ${
                disabled
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-green-500 text-white hover:bg-green-600'
            }`}
        >
            {label}
        </button>
    );
}

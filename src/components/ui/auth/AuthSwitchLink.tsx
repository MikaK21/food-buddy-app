'use client'
import Link from 'next/link';

export default function AuthSwitchLink({
                                           text,
                                           linkText,
                                           href,
                                       }: {
    text: string;
    linkText: string;
    href: string;
}) {
    return (
        <p className="text-sm text-gray-500 mt-4 text-center">
            {text}{' '}
            <Link href={href} className="text-green-600 hover:underline">
                {linkText}
            </Link>
        </p>
    );
}

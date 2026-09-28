import type { ReactNode } from 'react';
import { Sparkles } from 'lucide-react';

const points = [
    'Separate workspaces, one account',
    'Channels stay with the people in them',
    'Sign in once, then pick a workspace',
];

export function AuthShell({ children }: { children: ReactNode }) {
    return (
        <div className="h-dvh overflow-hidden bg-linear-to-br from-blue-50 via-white to-purple-50 lg:grid lg:grid-cols-2">
            <aside className="relative hidden h-dvh overflow-hidden bg-linear-to-br from-blue-600 via-blue-700 to-purple-700 text-white lg:flex lg:flex-col lg:justify-between lg:p-8 xl:p-10">
                <div className="pointer-events-none absolute top-16 left-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
                <div className="pointer-events-none absolute right-8 bottom-10 h-56 w-56 rounded-full bg-purple-400/20 blur-3xl" />

                <div className="relative z-10">
                    <div className="mb-8 flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <p className="text-2xl font-black tracking-tighter">
                            Dev<span className="text-blue-200">Col</span>
                        </p>
                    </div>
                    <h1 className="max-w-md text-3xl font-bold leading-tight xl:text-4xl">
                        Your team, in one workspace
                    </h1>
                    <p className="mt-3 max-w-sm text-sm text-blue-100 xl:text-base">
                        Channels, messages, and members stay inside the workspace you picked.
                    </p>
                </div>

                <ul className="relative z-10 space-y-2 text-sm text-blue-50">
                    {points.map((point) => (
                        <li key={point} className="rounded-lg border border-white/15 bg-white/10 px-3 py-2">
                            {point}
                        </li>
                    ))}
                </ul>
            </aside>

            <div className="flex h-dvh items-center justify-center overflow-y-auto px-5 py-6 sm:px-8">
                <div className="w-full max-w-md">{children}</div>
            </div>
        </div>
    );
}

export function AuthCard({
    title,
    description,
    children,
}: {
    title: string;
    description: string;
    children: ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-blue-500/10">
            <div className="mb-4 lg:hidden">
                <p className="text-lg font-black tracking-tighter text-gray-900">
                    Dev<span className="text-blue-600">Col</span>
                </p>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h2>
            <p className="mt-1 text-sm text-gray-600">{description}</p>
            <div className="mt-5">{children}</div>
        </div>
    );
}

export function AuthError({ message }: { message: string }) {
    if (!message) return null;
    return (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {message}
        </div>
    );
}

export const authLabelClass = 'text-sm font-semibold text-gray-900';
export const authInputClass =
    'h-10 rounded-lg text-gray-900 font-medium placeholder:text-gray-400';

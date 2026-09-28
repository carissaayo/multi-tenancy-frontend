import Link from 'next/link';
import { ArrowRight, Compass } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function NotFound() {
    return (
        <main className="flex h-dvh flex-col items-center justify-center overflow-hidden bg-linear-to-br from-blue-50 via-white to-purple-50 px-6">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-blue-700 shadow-sm ring-1 ring-blue-100">
                <Compass className="h-6 w-6" />
            </span>
            <p className="mt-6 text-xs font-bold tracking-[0.2em] text-blue-700 uppercase">
                Error 404
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900">
                Page not found
            </h1>
            <p className="mt-3 max-w-md text-center text-sm text-gray-600">
                That address is not part of this workspace.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link href="/login">
                    <Button className="h-10 rounded-lg bg-blue-600 px-5 text-white hover:bg-blue-700">
                        Back to sign in
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </Link>
                <Link href="/select-workspace">
                    <Button variant="outline" className="h-10 rounded-lg px-5">
                        Workspaces
                    </Button>
                </Link>
            </div>
        </main>
    );
}

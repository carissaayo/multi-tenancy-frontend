'use client';

import { useState } from 'react';
import { useLogin } from '@/hooks/auth';

const initialFormData = {
    email: '',
    password: '',
};

export function useLoginPage(redirectTo?: string) {
    const login = useLogin(redirectTo);
    const [formData, setFormData] = useState(initialFormData);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.email || !formData.password) {
            setError('Please enter your email and password.');
            return;
        }

        try {
            await login.mutateAsync(formData);
            // useLogin onSuccess redirects to /select-workspace
        } catch (err: unknown) {
            const msg =
                err && typeof err === 'object' && 'response' in err
                    ? (err.response as { data?: { message?: string } })?.data?.message
                    : null;
            setError(msg || 'Invalid email or password. Please try again.');
        }
    };

    return {
        formData,
        setFormData,
        error,
        loading: login.isPending,
        handleSubmit,
    };
}
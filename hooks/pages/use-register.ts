
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRegister } from '@/hooks/auth';

const initialFormData = {
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: '',
};

export function useRegisterPage() {
    const router = useRouter();
    const register = useRegister();
    const [formData, setFormData] = useState(initialFormData);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await register.mutateAsync(formData);
            setSuccess(true);
            setTimeout(() => router.push('/login'), 2000);
        } catch (err: unknown) {
            const msg =
                err && typeof err === 'object' && 'response' in err
                    ? (err.response as { data?: { message?: string } })?.data?.message
                    : null;
            setError(msg || 'Registration failed. Please try again.');
        }
    };

    return {
        formData,
        setFormData,
        error,
        success,
        loading: register.isPending,
        handleSubmit,
    };
}
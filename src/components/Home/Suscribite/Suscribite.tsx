'use client';

import { useState } from 'react';
import { subscribeToNewsletter } from '@/actions/Administration/Newsletter/mutations';

export default function Suscribite() {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsSubmitting(true);
        setMessage('');

        try {
            const result = await subscribeToNewsletter(email);

            if (result.success) {
                setIsSuccess(true);
                setMessage(result.message);
                setEmail('');
            } else {
                setIsSuccess(false);
                setMessage(result.message);
            }
        } catch (error) {
            setIsSuccess(false);
            setMessage('Error inesperado. Intentalo nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative z-50 px-4 py-16 md:w-[650px]">
            <div className="w-full max-w-md">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="correo electronico"
                            required
                            disabled={isSubmitting}
                            className="border-azul text-azul placeholder-azul font-basic-sans focus:ring-fucsia w-full rounded-[10px] border bg-transparent px-4 py-[10px] text-center text-[18px] focus:border-transparent focus:ring-2 focus:outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || !email}
                        className="font-basic-sans text-azul w-full cursor-pointer border-none bg-transparent px-4 py-3 text-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSubmitting ? 'ENVIANDO...' : 'SUSCRÍBETE A NUESTRO BOLETÍN MENSUAL'}
                    </button>
                </form>

                {message && (
                    <div
                        className={`mt-4 rounded-md p-3 text-center ${
                            isSuccess
                                ? 'border border-green-200 bg-green-100 text-green-700'
                                : 'border border-red-200 bg-red-100 text-red-700'
                        }`}
                    >
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}

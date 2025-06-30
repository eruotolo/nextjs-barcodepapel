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
        <div className="relative z-50 flex w-full justify-center px-4 py-8 sm:py-12 md:py-16">
            <div className="w-full max-w-sm sm:max-w-md md:max-w-lg">
                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                    <div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="correo electronico"
                            required
                            disabled={isSubmitting}
                            className="border-azul text-azul placeholder-azul font-basic-sans focus:ring-fucsia w-full rounded-[10px] border bg-transparent px-3 py-[8px] text-center text-[16px] focus:border-transparent focus:ring-2 focus:outline-none sm:px-4 sm:py-[10px] sm:text-[17px] md:text-[18px]"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || !email}
                        className="font-basic-sans text-azul w-full cursor-pointer border-none bg-transparent px-3 py-2 text-[14px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:py-3 sm:text-[16px] md:text-lg"
                    >
                        {isSubmitting ? 'ENVIANDO...' : 'SUSCRÍBETE A NUESTRO BOLETÍN MENSUAL'}
                    </button>
                </form>

                {message && (
                    <div
                        className={`mt-3 rounded-md p-2 text-center text-sm sm:mt-4 sm:p-3 sm:text-base ${
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

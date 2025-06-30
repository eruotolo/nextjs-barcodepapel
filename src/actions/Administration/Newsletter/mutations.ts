'use server';

interface NewsletterSubscriptionResult {
    success: boolean;
    message: string;
    error?: string;
}

export async function subscribeToNewsletter(email: string): Promise<NewsletterSubscriptionResult> {
    try {
        // Validacion basica del email
        if (!email || !email.includes('@')) {
            return {
                success: false,
                message: 'Email invalido',
                error: 'INVALID_EMAIL'
            };
        }

        // Importacion dinamica de Brevo
        const brevoModule = await import('@getbrevo/brevo');
        
        // Configuracion de la API
        const apiKey = process.env.BREVO_API_KEY || '';
        if (!apiKey) {
            console.error('BREVO_API_KEY no esta configurado');
            return {
                success: false,
                message: 'Error de configuracion del servidor',
                error: 'MISSING_API_KEY'
            };
        }

        // Configuracion de la instancia de API
        const apiInstance = new brevoModule.TransactionalEmailsApi();
        apiInstance.setApiKey(brevoModule.TransactionalEmailsApiApiKeys.apiKey, apiKey);

        // Configuracion del email
        const sendSmtpEmail = new brevoModule.SendSmtpEmail();
        sendSmtpEmail.subject = 'Confirmacion de Suscripcion al Boletin';
        sendSmtpEmail.to = [{ email: email }];
        sendSmtpEmail.sender = { 
            name: 'Chubby Dashboard', 
            email: 'crowadvancegx@gmail.com' 
        };
        
        // Contenido HTML del email
        sendSmtpEmail.htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
                    <h1 style="color: #333; margin-bottom: 20px;">¡Bienvenido a nuestro boletin!</h1>
                    <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        Gracias por suscribirte a nuestro boletin mensual. Te mantendremos informado sobre los ultimos eventos, noticias y novedades.
                    </p>
                    <p style="color: #666; font-size: 16px; line-height: 1.6;">
                        Tu email <strong>${email}</strong> ha sido registrado exitosamente.
                    </p>
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                        <p style="color: #999; font-size: 14px;">
                            Si no te suscribiste a este boletin, puedes ignorar este email.
                        </p>
                    </div>
                </div>
            </div>
        `;

        // Envio del email
        await apiInstance.sendTransacEmail(sendSmtpEmail);

        return {
            success: true,
            message: 'Suscripcion exitosa! Revisa tu email para confirmar.'
        };

    } catch (error) {
        console.error('Error al enviar email de suscripcion:', error);
        return {
            success: false,
            message: 'Error al procesar la suscripcion. Intentalo nuevamente.',
            error: 'SEND_ERROR'
        };
    }
}
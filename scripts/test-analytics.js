#!/usr/bin/env node

/**
 * Script de testing para Google Analytics
 * Ejecutar con: node scripts/test-analytics.js
 */

import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Testing Google Analytics Configuration\n');

// Verificar que existe el archivo .env.local
const envPath = path.join(__dirname, '..', '.env.local');

if (!fs.existsSync(envPath)) {
    console.log('❌ No se encontró el archivo .env.local');
    console.log('   Crea el archivo y configura las variables de Google Analytics\n');
    process.exit(1);
}

// Cargar variables de entorno manualmente
const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n');
envLines.forEach((line) => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
        const value = valueParts.join('=').replace(/^["']|["']$/g, '');
        process.env[key] = value;
    }
});

// Verificar variables de entorno básicas
const checkEnvVar = (varName, description) => {
    const value = process.env[varName];
    const exists = value && value.length > 0 && !value.includes('TU_') && !value.includes('AQUI');
    console.log(
        `  ${exists ? '✅' : '❌'} ${varName}: ${exists ? 'Configurado' : 'No configurado'}`,
    );
    return exists;
};

console.log('📋 Verificando variables de entorno:');
const propertyId = checkEnvVar('GOOGLE_ANALYTICS_PROPERTY_ID', 'ID de propiedad GA4');
const serviceAccount = checkEnvVar('GOOGLE_SERVICE_ACCOUNT_KEY', 'Credenciales de Service Account');
const refreshInterval = checkEnvVar('ANALYTICS_REFRESH_INTERVAL', 'Intervalo de actualización');

console.log('');

if (!propertyId || !serviceAccount) {
    console.log('❌ Configuración incompleta');
    console.log('\n📖 Para configurar Google Analytics, sigue estos pasos:');
    console.log('\n1. 🌐 Google Cloud Console (https://console.cloud.google.com):');
    console.log('   - Crear/seleccionar proyecto');
    console.log('   - Habilitar "Google Analytics Data API"');
    console.log('   - Crear Service Account con rol "Viewer"');
    console.log('   - Generar y descargar clave JSON');

    console.log('\n2. 📊 Google Analytics (https://analytics.google.com):');
    console.log('   - Ir a Admin > Property Settings');
    console.log('   - Copiar Property ID (solo números)');
    console.log('   - Agregar email del Service Account como usuario con rol "Viewer"');

    console.log('\n3. 🔧 Archivo .env.local:');
    console.log('   - GOOGLE_ANALYTICS_PROPERTY_ID="123456789"');
    console.log("   - GOOGLE_SERVICE_ACCOUNT_KEY='{...json completo...}'");
    console.log('');
    process.exit(1);
}

console.log('✅ Variables de entorno configuradas correctamente');
console.log('\n🔄 Para probar la conexión en tiempo real, usa el dashboard de la aplicación');
console.log('   Navega a: http://localhost:3000/admin/dashboard');
console.log('\n📚 Documentación completa en: docs/ANALYTICS_DASHBOARD.md');
console.log('\n🎉 ¡Listo para usar Google Analytics!');

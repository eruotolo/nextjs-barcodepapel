#!/usr/bin/env node

/**
 * Script de Verificación - Google Analytics API Setup
 *
 * Este script verifica que la configuración de Google Analytics esté correcta
 * antes de hacer deploy a producción.
 *
 * Uso: node scripts/verify-analytics-setup.js
 */

import { config } from 'dotenv';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

// Cargar variables de entorno
config({ path: '.env.local' });

const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m',
    bold: '\x1b[1m',
};

const log = {
    success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
    error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
    warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
    info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
    title: (msg) => console.log(`${colors.bold}${colors.blue}🔍 ${msg}${colors.reset}\n`),
};

async function verifyEnvironmentVariables() {
    log.title('Verificando Variables de Entorno');

    const requiredVars = [
        'GOOGLE_ANALYTICS_PROPERTY_ID',
        'GOOGLE_SERVICE_ACCOUNT_KEY',
        'ANALYTICS_REFRESH_INTERVAL',
    ];

    let allValid = true;

    for (const varName of requiredVars) {
        const value = process.env[varName];

        if (!value) {
            log.error(`Variable ${varName} no está definida`);
            allValid = false;
            continue;
        }

        switch (varName) {
            case 'GOOGLE_ANALYTICS_PROPERTY_ID':
                if (!/^\d+$/.test(value)) {
                    log.error(`${varName} debe ser solo números (ej: 497602966)`);
                    allValid = false;
                } else {
                    log.success(`${varName}: ${value}`);
                }
                break;

            case 'GOOGLE_SERVICE_ACCOUNT_KEY':
                try {
                    const parsed = JSON.parse(value);
                    const requiredFields = [
                        'type',
                        'project_id',
                        'private_key_id',
                        'private_key',
                        'client_email',
                        'client_id',
                        'auth_uri',
                        'token_uri',
                    ];

                    const missingFields = requiredFields.filter((field) => !parsed[field]);

                    if (missingFields.length > 0) {
                        log.error(`${varName} JSON falta campos: ${missingFields.join(', ')}`);
                        allValid = false;
                    } else if (parsed.type !== 'service_account') {
                        log.error(`${varName} debe ser tipo 'service_account'`);
                        allValid = false;
                    } else {
                        log.success(`${varName}: JSON válido`);
                        log.info(`  Proyecto: ${parsed.project_id}`);
                        log.info(`  Email: ${parsed.client_email}`);
                    }
                } catch (error) {
                    log.error(`${varName} contiene JSON inválido: ${error.message}`);
                    allValid = false;
                }
                break;

            case 'ANALYTICS_REFRESH_INTERVAL':
                const interval = parseInt(value);
                if (isNaN(interval) || interval < 60000) {
                    log.warning(`${varName} debería ser al menos 60000ms (1 minuto)`);
                } else {
                    const minutes = Math.floor(interval / 60000);
                    log.success(`${varName}: ${interval}ms (${minutes} minutos)`);
                }
                break;
        }
    }

    return allValid;
}

async function testAnalyticsConnection() {
    log.title('Probando Conexión con Google Analytics');

    try {
        const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID;
        const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

        if (!propertyId || !serviceAccountKey) {
            log.error('Variables de entorno no están configuradas');
            return false;
        }

        // Crear cliente Analytics
        const credentials = JSON.parse(serviceAccountKey);
        const analyticsDataClient = new BetaAnalyticsDataClient({
            credentials,
        });

        log.info('Realizando consulta de prueba...');

        // Hacer consulta simple para verificar conexión
        const [response] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [
                {
                    startDate: '7daysAgo',
                    endDate: 'today',
                },
            ],
            metrics: [
                {
                    name: 'activeUsers',
                },
            ],
            limit: 1,
        });

        if (response && (response.rows || response.totals)) {
            log.success('Conexión exitosa con Google Analytics');

            if (response.totals && response.totals[0] && response.totals[0].metricValues) {
                const activeUsers = response.totals[0].metricValues[0].value || '0';
                log.info(`Usuarios activos (últimos 7 días): ${activeUsers}`);
            }

            return true;
        } else {
            log.warning('Conexión establecida pero sin datos disponibles');
            log.info('Esto puede ser normal si la propiedad es nueva o no tiene tráfico');
            return true;
        }
    } catch (error) {
        log.error(`Error de conexión: ${error.message}`);

        // Proporcionar ayuda específica según el error
        if (error.message.includes('403')) {
            log.warning(
                'Solución: Verificar que el Service Account tiene acceso "Viewer" en Google Analytics',
            );
        } else if (error.message.includes('404')) {
            log.warning('Solución: Verificar que el Property ID es correcto');
        } else if (error.message.includes('400')) {
            log.warning('Solución: Verificar que Google Analytics Data API v1 está habilitada');
        } else if (error.message.includes('401')) {
            log.warning('Solución: Regenerar credenciales del Service Account');
        }

        return false;
    }
}

async function checkProjectDependencies() {
    log.title('Verificando Dependencias del Proyecto');

    try {
        // Verificar que las dependencias necesarias están instaladas
        const packageJson = await import('../package.json', { assert: { type: 'json' } });
        const dependencies = {
            ...packageJson.default.dependencies,
            ...packageJson.default.devDependencies,
        };

        const requiredPackages = ['@google-analytics/data', 'recharts', 'swr', 'date-fns'];

        let allInstalled = true;

        for (const pkg of requiredPackages) {
            if (dependencies[pkg]) {
                log.success(`${pkg}: ${dependencies[pkg]}`);
            } else {
                log.error(`Dependencia faltante: ${pkg}`);
                allInstalled = false;
            }
        }

        if (!allInstalled) {
            log.warning('Ejecutar: bun add @google-analytics/data recharts swr date-fns');
        }

        return allInstalled;
    } catch (error) {
        log.error(`Error verificando dependencias: ${error.message}`);
        return false;
    }
}

async function generateSetupReport() {
    log.title('Reporte de Configuración');

    const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID;
    const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

    if (serviceAccountKey) {
        try {
            const credentials = JSON.parse(serviceAccountKey);

            console.log(`${colors.blue}📋 Información de Configuración:${colors.reset}`);
            console.log(`   Property ID: ${propertyId || 'No configurado'}`);
            console.log(`   Proyecto GCP: ${credentials.project_id || 'No disponible'}`);
            console.log(`   Service Account: ${credentials.client_email || 'No disponible'}`);
            console.log(
                `   Refresh Interval: ${process.env.ANALYTICS_REFRESH_INTERVAL || 'No configurado'}ms`,
            );
            console.log('');
        } catch (error) {
            log.warning('No se pudo parsear información del Service Account');
        }
    }
}

async function main() {
    console.log(
        `${colors.bold}${colors.blue}🚀 Verificador de Configuración - Google Analytics API${colors.reset}`,
    );
    console.log(
        `${colors.blue}Verificando configuración para Dashboard de Analytics...${colors.reset}\n`,
    );

    const checks = [
        { name: 'Variables de Entorno', fn: verifyEnvironmentVariables },
        { name: 'Dependencias del Proyecto', fn: checkProjectDependencies },
        { name: 'Conexión con Analytics', fn: testAnalyticsConnection },
    ];

    let allPassed = true;

    for (const check of checks) {
        try {
            const result = await check.fn();
            if (!result) {
                allPassed = false;
            }
        } catch (error) {
            log.error(`Error en ${check.name}: ${error.message}`);
            allPassed = false;
        }
        console.log(''); // Separador
    }

    await generateSetupReport();

    // Resultado final
    if (allPassed) {
        log.success('🎉 ¡Configuración completamente válida!');
        log.info('El Dashboard de Analytics está listo para funcionar');
        process.exit(0);
    } else {
        log.error('❌ Hay problemas en la configuración');
        log.info('Por favor revisar los errores anteriores');
        log.info('Consultar: docs/GOOGLE_ANALYTICS_API_SETUP.md');
        process.exit(1);
    }
}

// Ejecutar verificación
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch((error) => {
        log.error(`Error inesperado: ${error.message}`);
        process.exit(1);
    });
}

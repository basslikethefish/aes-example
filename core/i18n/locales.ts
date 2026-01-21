import { buildConfig } from '~/build-config/reader';

const localeNodes = buildConfig.get('locales');

// Ensure locales added in BigCommerce are honored, and allow explicit additions
// when build-config.json isn't refreshed yet.
const additionalLocales = ['es-MX'];
const configuredLocales = localeNodes.map((locale) => locale.code);

export const locales = Array.from(new Set([...configuredLocales, ...additionalLocales]));
export const defaultLocale = localeNodes.find((locale) => locale.isDefault)?.code ?? 'en';

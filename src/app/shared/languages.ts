export const SUPPORTED_LANGUAGES = ['es', 'vl', 'en', 'ru', 'ua'] as const;
export type LangCode = typeof SUPPORTED_LANGUAGES[number];

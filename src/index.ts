import {
  Locale,
  type UnparsedLocale,
  type NestedTranslations,
} from "./locales/locale";
import { LocaleX, type LocaleXOptions } from "./localex";

export { Locale, UnparsedLocale, NestedTranslations };
export { LocaleX, LocaleXOptions };

export function createLocaleX(options: LocaleXOptions) {
  return new LocaleX(options);
}

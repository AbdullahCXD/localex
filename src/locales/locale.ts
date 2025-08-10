/**
 * Represents an unparsed locale loaded from a file
 * Contains the base locale data plus any additional metadata
 */
export type UnparsedLocale = {
  /** Unique identifier for the locale (e.g., 'en', 'en-US') */
  id: string;
  /** Display name for the locale (e.g., 'English', 'English (United States)') */
  title: string;
  /** Nested translation object */
  translations?: NestedTranslations;
  /** Optional locale metadata */
  meta?: LocaleMetadata;
  /** Any additional custom fields */
  [key: string]: any;
};

/**
 * Nested translation structure supporting deep nesting
 */
export type NestedTranslations = {
  [key: string]: string | NestedTranslations;
};

/**
 * Optional metadata for locales
 */
export interface LocaleMetadata {
  /** Language code (ISO 639-1) */
  language?: string;
  /** Country/region code (ISO 3166-1 alpha-2) */
  region?: string;
  /** Text direction (ltr/rtl) */
  direction?: "ltr" | "rtl";
  /** Locale author/maintainer */
  author?: string;
  /** Version of the locale file */
  version?: string;
  /** Last update timestamp */
  lastUpdated?: string;
  /** Completion percentage (0-100) */
  completeness?: number;
  /** Fallback locale ID */
  fallback?: string;
}

/**
 * Parameters for translation interpolation
 */
export type TranslationParams = Record<string, string | number | boolean>;

/**
 * Options for translation formatting
 */
export interface TranslationOptions {
  /** Parameters to interpolate */
  params?: TranslationParams;
  /** Fallback text if translation not found */
  fallback?: string;
  /** Enable/disable parameter escaping for security */
  escapeParams?: boolean;
  /** Count for pluralization */
  count?: number;
}

/**
 * Enhanced Locale class with advanced translation features
 */
export class Locale {
  public readonly id: string;
  public readonly title: string;
  public readonly translations: NestedTranslations;
  public readonly meta: LocaleMetadata;

  constructor(
    id: string,
    title: string,
    translations: NestedTranslations = {},
    meta: LocaleMetadata = {},
  ) {
    this.id = id;
    this.title = title;
    this.translations = translations;
    this.meta = meta;
  }

  /**
   * Creates a Locale instance from unparsed locale data
   * @param unparsed Raw locale data from file
   * @returns New Locale instance
   */
  static fromUnparsed(unparsed: UnparsedLocale): Locale {
    const {
      id,
      title,
      translations = {},
      meta = {},
      ...otherFields
    } = unparsed;

    // Merge other fields into meta if they don't conflict
    const mergedMeta = { ...meta, ...otherFields };

    return new Locale(id, title, translations, mergedMeta);
  }

  /**
   * Translates a key with advanced formatting options
   * @param key Translation key (supports dot notation)
   * @param options Translation options
   * @returns Formatted translation string
   */
  translate(key: string, options: TranslationOptions = {}): string {
    const { params, fallback = key, escapeParams = true, count } = options;

    // Get the base translation
    let translation = this.getNestedTranslation(key);

    // Handle pluralization if count is provided
    if (count !== undefined && translation) {
      translation = this.handlePluralization(translation, count);
    }

    // Return fallback if translation not found
    if (!translation) {
      return fallback;
    }

    // Interpolate parameters if provided
    if (params && Object.keys(params).length > 0) {
      return this.interpolateParams(translation, params, escapeParams);
    }

    return translation;
  }

  /**
   * Simple translation method for backward compatibility
   * @param key Translation key
   * @param fallback Optional fallback text
   * @returns Translation string
   * @deprecated Use translate() instead
   */
  format(key: string, fallback?: string): string {
    return this.translate(key, { fallback });
  }

  /**
   * Gets a nested translation using dot notation
   * @param key Dot-notated key (e.g., 'greeting.hello')
   * @returns Translation string or undefined
   */
  private getNestedTranslation(key: string): string | undefined {
    const keys = key.split(".");
    let current: any = this.translations;

    for (const k of keys) {
      if (current && typeof current === "object" && k in current) {
        current = current[k];
      } else {
        return undefined;
      }
    }

    return typeof current === "string" ? current : undefined;
  }

  /**
   * Handles simple pluralization based on count
   * @param translation Base translation string
   * @param count Number for pluralization
   * @returns Pluralized translation
   */
  private handlePluralization(translation: string, count: number): string {
    // Simple pluralization: look for | separator
    // Format: "singular|plural" or "zero|singular|plural"
    if (!translation.includes("|")) {
      return translation;
    }

    const parts = translation.split("|");

    if (parts.length === 2) {
      // Simple singular|plural
      return count === 1 ? parts[0] : parts[1];
    } else if (parts.length === 3) {
      // zero|singular|plural
      if (count === 0) return parts[0];
      return count === 1 ? parts[1] : parts[2];
    }

    return translation; // Fallback to original
  }

  /**
   * Interpolates parameters in translation strings
   * @param text Translation text with placeholders
   * @param params Parameters to interpolate
   * @param escape Whether to escape parameter values
   * @returns Interpolated string
   */
  private interpolateParams(
    text: string,
    params: TranslationParams,
    escape: boolean,
  ): string {
    return text.replace(/\{\{(\w+)\}\}/g, (match, paramName) => {
      const value = params[paramName];
      if (value === undefined || value === null) {
        return match; // Keep placeholder if param not found
      }

      const stringValue = String(value);
      return escape ? this.escapeHtml(stringValue) : stringValue;
    });
  }

  /**
   * Simple HTML escaping for security
   * @param text Text to escape
   * @returns Escaped text
   */
  private escapeHtml(text: string): string {
    const div =
      typeof document !== "undefined" ? document.createElement("div") : null;
    if (div) {
      div.textContent = text;
      return div.innerHTML;
    }

    // Fallback for server-side
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;");
  }

  /**
   * Checks if this locale matches the given ID
   * @param id ID to check against
   * @returns True if IDs match
   */
  isId(id: string): boolean {
    return this.id === id;
  }

  /**
   * Checks if this locale matches the given title
   * @param title Title to check against
   * @returns True if titles match
   */
  isTitle(title: string): boolean {
    return this.title === title;
  }

  /**
   * Checks if a translation key exists
   * @param key Translation key to check
   * @returns True if key exists
   */
  hasTranslation(key: string): boolean {
    return this.getNestedTranslation(key) !== undefined;
  }

  /**
   * Gets all available translation keys (flattened)
   * @returns Array of all translation keys
   */
  getAllKeys(): string[] {
    return this.flattenKeys(this.translations);
  }

  /**
   * Recursively flattens nested translation keys
   * @param obj Object to flatten
   * @param prefix Current key prefix
   * @returns Array of flattened keys
   */
  private flattenKeys(obj: NestedTranslations, prefix = ""): string[] {
    const keys: string[] = [];

    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (typeof value === "string") {
        keys.push(fullKey);
      } else if (typeof value === "object" && value !== null) {
        keys.push(...this.flattenKeys(value, fullKey));
      }
    }

    return keys;
  }

  /**
   * Gets locale completion percentage based on a reference locale
   * @param referenceLocale Locale to compare against
   * @returns Completion percentage (0-100)
   */
  getCompleteness(referenceLocale: Locale): number {
    const referenceKeys = referenceLocale.getAllKeys();
    const thisKeys = new Set(this.getAllKeys());

    if (referenceKeys.length === 0) return 100;

    const matchingKeys = referenceKeys.filter((key) => thisKeys.has(key));
    return Math.round((matchingKeys.length / referenceKeys.length) * 100);
  }

  /**
   * Creates a copy of this locale with updated translations
   * @param newTranslations New translations to merge
   * @returns New Locale instance
   */
  withTranslations(newTranslations: NestedTranslations): Locale {
    const merged = this.deepMerge(this.translations, newTranslations);
    return new Locale(this.id, this.title, merged, this.meta);
  }

  /**
   * Deep merges two translation objects
   * @param target Target object
   * @param source Source object to merge
   * @returns Merged object
   */
  private deepMerge(
    target: NestedTranslations,
    source: NestedTranslations,
  ): NestedTranslations {
    const result = { ...target };

    for (const [key, value] of Object.entries(source)) {
      if (
        typeof value === "object" &&
        value !== null &&
        typeof result[key] === "object" &&
        result[key] !== null
      ) {
        result[key] = this.deepMerge(result[key] as NestedTranslations, value);
      } else {
        result[key] = value;
      }
    }

    return result;
  }

  /**
   * Converts locale to JSON representation
   * @returns JSON object representing the locale
   */
  toJSON(): UnparsedLocale {
    return {
      id: this.id,
      title: this.title,
      translations: this.translations,
      meta: this.meta,
    };
  }

  /**
   * Gets a string representation of the locale
   * @returns String representation
   */
  toString(): string {
    return `Locale(${this.id}: ${this.title})`;
  }
}

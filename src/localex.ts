import {
  Locale,
  type UnparsedLocale,
  type NestedTranslations,
  type TranslationOptions,
} from "./locales/locale";
import YAML from "yaml";
import { Logging, type LoggingFormatterFunction } from "./utils/logging";
import path from "path";
import fs from "fs";

/**
 * Configuration options for LocaleX
 */
export interface LocaleXOptions {
  /**
   * The place where locales are placed
   */
  localeDirectory: string;
  /**
   * Specific loadable locales, used when `loadSpecifiedLocales` is enabled
   */
  locales?: string[];
  /**
   * Enables loading specific locales from `locales`
   */
  loadSpecifiedLocales?: boolean;
  /**
   * Extension for each locale file, the content must be in YAML format!
   */
  ext: string;
  /**
   * Logging options
   */
  logging?: {
    format?: LoggingFormatterFunction;
    debug?: boolean;
    disableLogging?: boolean;
  };
}

/**
 * LocaleX - A powerful internationalization system that manages locale files
 *
 * Features:
 * - Load all locales from directory or specific ones
 * - YAML-based locale files with validation
 * - Built-in logging with customizable formatting
 * - Locale retrieval and translation methods
 * - Hot-reloading support (optional)
 *
 * @example
 * ```typescript
 * const localeX = new LocaleX({
 *   localeDirectory: './locales',
 *   ext: 'yml',
 *   logging: { debug: true }
 * });
 *
 * localeX.loadLocales();
 * const greeting = localeX.translate('en', 'greeting.hello', 'World');
 * ```
 */
export class LocaleX {
  private loadedLocales: Locale[] = [];
  private logger: Logging;
  private options: LocaleXOptions;
  private localeDirectory: string;
  private localeExtension: string;

  constructor(options: LocaleXOptions) {
    this.options = options;
    this.localeDirectory = options.localeDirectory;
    this.localeExtension = options.ext;
    this.logger = new Logging(options.logging?.format, {
      debug: options.logging?.debug,
      disableLogging: options.logging?.disableLogging,
    });

    // Validate directory exists
    if (!fs.existsSync(this.localeDirectory)) {
      throw new Error(
        `Locale directory '${this.localeDirectory}' does not exist!`,
      );
    }
  }

  /**
   * Loads locales based on configuration
   * Uses loadSpecifiedLocales() or loadAllLocales() depending on options
   */
  loadLocales(): void {
    this.logger.info("Starting locale loading process...");

    if (this.options.loadSpecifiedLocales) {
      this.loadSpecifiedLocales();
    } else {
      this.loadAllLocales();
    }

    this.logger.info(
      "Loaded %s locales successfully",
      this.loadedLocales.length.toString(),
    );
  }

  /**
   * Loads only the locales specified in options.locales
   * @throws Error if locales array is not provided
   */
  loadSpecifiedLocales(): void {
    if (!this.options.locales) {
      throw new Error(
        "Cannot load specific locales without the locales array in the options!",
      );
    }

    this.logger.debug(
      "Loading specified locales: %s",
      this.options.locales.join(", "),
    );

    const localePaths = this.options.locales.map((v) => ({
      fileName: v,
      filePath: path.join(this.localeDirectory, v + this.formatExtension()),
    }));

    for (const { fileName, filePath } of localePaths) {
      if (!fs.existsSync(filePath)) {
        this.logger.error("Locale: %s cannot be loaded or found!", fileName);
        continue;
      }

      if (!fs.statSync(filePath).isFile()) {
        this.logger.error(
          "Locale: %s cannot be loaded because it's a directory!",
          fileName,
        );
        continue;
      }

      try {
        const unparsedLocale = this.loadLocaleFile(filePath);
        const locale = this.parseAndValidateLocale(unparsedLocale, fileName);

        if (locale) {
          this.registerLocale(locale);
          this.logger.debug("Successfully loaded locale: %s", fileName);
        }
      } catch (error) {
        this.logger.error(
          "Failed to load locale %s: %s",
          fileName,
          (error as Error).message,
        );
      }
    }
  }

  /**
   * Loads all locale files from the locale directory
   */
  loadAllLocales(): void {
    this.logger.debug(
      "Loading all locales from directory: %s",
      this.localeDirectory,
    );

    try {
      const files = fs.readdirSync(this.localeDirectory);
      const localeFiles = files.filter(
        (file) =>
          file.endsWith(this.formatExtension()) &&
          fs.statSync(path.join(this.localeDirectory, file)).isFile(),
      );

      if (localeFiles.length === 0) {
        this.logger.warn(
          "No locale files found in directory: %s",
          this.localeDirectory,
        );
        return;
      }

      for (const file of localeFiles) {
        const fileName = path.basename(file, this.formatExtension());
        const filePath = path.join(this.localeDirectory, file);

        try {
          const unparsedLocale = this.loadLocaleFile(filePath);
          const locale = this.parseAndValidateLocale(unparsedLocale, fileName);

          if (locale) {
            this.registerLocale(locale);
            this.logger.debug("Successfully loaded locale: %s", fileName);
          }
        } catch (error) {
          this.logger.error(
            "Failed to load locale %s: %s",
            fileName,
            (error as Error).message,
          );
        }
      }
    } catch (error) {
      this.logger.error(
        "Failed to read locale directory: %s",
        (error as Error).message,
      );
    }
  }

  /**
   * Loads and parses a YAML locale file
   * @param filePath Path to the locale file
   * @returns Parsed locale object
   */
  loadLocaleFile(filePath: string): UnparsedLocale {
    const content = fs.readFileSync(filePath, "utf-8");
    return YAML.parse(content) as UnparsedLocale;
  }

  /**
   * Parses and validates an unparsed locale
   * @param unparsedLocale Raw locale data from file
   * @param fileName Name of the file being processed
   * @returns Validated locale or null if validation fails
   */
  private parseAndValidateLocale(
    unparsedLocale: UnparsedLocale,
    fileName: string,
  ): Locale | null {
    const requiredFields: (keyof Pick<UnparsedLocale, "id" | "title">)[] = [
      "title",
      "id",
    ];
    const missingFields = requiredFields.filter(
      (field) => !unparsedLocale[field],
    );

    if (missingFields.length > 0) {
      this.logger.error(
        "Locale %s is missing required fields: %s",
        fileName,
        missingFields.join(", "),
      );
      return null;
    }

    try {
      // Use the static factory method from the new Locale class
      const locale = Locale.fromUnparsed(unparsedLocale);

      // Validate that the locale was created successfully
      if (!locale.id || !locale.title) {
        this.logger.error("Failed to create valid locale from %s", fileName);
        return null;
      }

      return locale;
    } catch (error) {
      this.logger.error(
        "Error parsing locale %s: %s",
        fileName,
        (error as Error).message,
      );
      return null;
    }
  }

  /**
   * Registers a locale in the system
   * @param locale The locale to register
   * @throws Error if locale with same ID already exists
   */
  registerLocale(locale: Locale): void {
    if (this.loadedLocales.find((x) => x.id === locale.id)) {
      throw new Error(`Already registered locale with ID: ${locale.id}`);
    }

    this.loadedLocales.push(locale);
    this.logger.debug("Registered locale: %s (%s)", locale.id, locale.title);
  }

  /**
   * Gets a locale by its ID
   * @param localeId The ID of the locale to retrieve
   * @returns The locale object or undefined if not found
   */
  getLocale(localeId: string): Locale | undefined {
    return this.loadedLocales.find((locale) => locale.id === localeId);
  }

  /**
   * Gets all loaded locales
   * @returns Array of all loaded locales
   */
  getAllLocales(): Locale[] {
    return [...this.loadedLocales]; // Return copy to prevent external modification
  }

  /**
   * Gets the IDs of all loaded locales
   * @returns Array of locale IDs
   */
  getAvailableLocaleIds(): string[] {
    return this.loadedLocales.map((locale) => locale.id);
  }

  /**
   * Translates a key using the specified locale with advanced options
   * @param localeId The locale to use for translation
   * @param key The translation key (supports dot notation like 'greeting.hello')
   * @param options Translation options including parameters, fallback, etc.
   * @returns Translated text or fallback
   */
  translate(
    localeId: string,
    key: string,
    options: TranslationOptions = {},
  ): string {
    const locale = this.getLocale(localeId);

    if (!locale) {
      this.logger.warn("Locale not found: %s", localeId);
      return options.fallback || key;
    }

    return locale.translate(key, options);
  }

  /**
   * Simple translation method for backward compatibility
   * @param localeId The locale to use for translation
   * @param key The translation key
   * @param fallback Fallback text if translation is not found
   * @param params Parameters to interpolate in the translation
   * @returns Translated text or fallback
   * @deprecated Use translate() with TranslationOptions instead
   */
  translateSimple(localeId: string, key: string, fallback?: string): string {
    return this.translate(localeId, key, { fallback });
  }

  /**
   * Reloads all locales (useful for hot-reloading)
   */
  reloadLocales(): void {
    this.logger.info("Reloading all locales...");
    this.loadedLocales = [];
    this.loadLocales();
  }

  /**
   * Checks if a locale exists
   * @param localeId The locale ID to check
   * @returns True if locale exists, false otherwise
   */
  hasLocale(localeId: string): boolean {
    return this.loadedLocales.some((locale) => locale.id === localeId);
  }

  /**
   * Checks if a translation key exists in the specified locale
   * @param localeId The locale to check
   * @param key The translation key to check
   * @returns True if the key exists, false otherwise
   */
  hasTranslation(localeId: string, key: string): boolean {
    const locale = this.getLocale(localeId);
    return locale ? locale.hasTranslation(key) : false;
  }

  /**
   * Gets all available translation keys for a locale
   * @param localeId The locale to get keys from
   * @returns Array of translation keys or empty array if locale not found
   */
  getTranslationKeys(localeId: string): string[] {
    const locale = this.getLocale(localeId);
    return locale ? locale.getAllKeys() : [];
  }

  /**
   * Gets the completion percentage of a locale compared to a reference locale
   * @param localeId The locale to check
   * @param referenceLocaleId The reference locale to compare against
   * @returns Completion percentage (0-100) or 0 if either locale not found
   */
  getLocaleCompleteness(localeId: string, referenceLocaleId: string): number {
    const locale = this.getLocale(localeId);
    const referenceLocale = this.getLocale(referenceLocaleId);

    if (!locale || !referenceLocale) {
      this.logger.warn(
        "Cannot calculate completeness: locale %s or reference %s not found",
        localeId,
        referenceLocaleId,
      );
      return 0;
    }

    return locale.getCompleteness(referenceLocale);
  }

  /**
   * Gets locale metadata
   * @param localeId The locale to get metadata from
   * @returns Locale metadata or undefined if locale not found
   */
  getLocaleMetadata(localeId: string) {
    const locale = this.getLocale(localeId);
    return locale ? locale.meta : undefined;
  }

  /**
   * Updates a locale's translations (creates a new locale instance)
   * @param localeId The locale to update
   * @param newTranslations New translations to merge
   * @returns True if successful, false if locale not found
   */
  updateLocaleTranslations(
    localeId: string,
    newTranslations: NestedTranslations,
  ): boolean {
    const localeIndex = this.loadedLocales.findIndex(
      (locale) => locale.id === localeId,
    );

    if (localeIndex === -1) {
      this.logger.error("Cannot update locale %s: not found", localeId);
      return false;
    }

    const currentLocale = this.loadedLocales[localeIndex];
    if (!currentLocale) {
      this.logger.error("Cannot update locale %s: not found", localeId);
      return false;
    }
    const updatedLocale = currentLocale.withTranslations(newTranslations);

    this.loadedLocales[localeIndex] = updatedLocale;
    this.logger.debug("Updated translations for locale: %s", localeId);

    return true;
  }

  /**
   * Formats the file extension with leading dot if needed
   * @private
   */
  private formatExtension(): string {
    return this.localeExtension.startsWith(".")
      ? this.localeExtension
      : `.${this.localeExtension}`;
  }
}

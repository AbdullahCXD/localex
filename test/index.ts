import * as LocaleX from "..";

const localex = LocaleX.createLocaleX({
  localeDirectory: "locales",
  ext: "lang",
  logging: {
    disableLogging: true
  }
});

localex.loadLocales();

console.log(localex.translate("en", "greetings.hello.world"));

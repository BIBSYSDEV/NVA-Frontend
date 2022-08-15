# Transalation docs

The NVA frontend app is designed with internationalization (i18n) in mind, meaning it can support multiple languages. Every text string in the app is just a “key”, where every supported languages has a dedicated language file that denotes what each key should display for that language.

Say we have support for English and Norwegian, with English translations located in a file named `enTranslations.json` looking like this:

```json
{
  "common": {
    "cancel": "Cancel",
    "save": "Save"
  }
}
```

And Norwegian translations located in a file named `nbTranslations.json` looking like this:

```json
{
  "common": {
    "cancel": "Avbryt",
    "save": "Lagre"
  }
}
```

With these two files in place the frontend can use the keys `common.cancel` and `common.save`, and the app will display the translation for the language selected by the user. If the user changes language, the text strings will be changed accordingly on-the-fly.

This document will describe how non-developers can make adjustments to translations/text on the frontend app. This will minimize overhead for smaller tasks like editing texts, as well as enable us to add (and outsource) translations for new languages unknown to the developers.

## Tools

- [Lokalise](https://lokalise.com/) is used to handle translations, and should be used by non-developers to update texts on the frontend app. We are signed up to the Enterprise Open Source plan, which is free.

- For questions related to Lokalise/translations use the #nva-oversettelser channel in the Sikt workspace in Slack. ~~Notifications about updated translations will be posted by the Lokalise bot there as well.~~ (TODO)

- All currently deployed translations are kept in the frontend app on GitHub, and can be viewed [here](https://github.com/BIBSYSDEV/NVA-Frontend/tree/main/src/translations). Translators will not need any knowledge of this in particular, as descibed in next chapter.

## Workflow for updating translations

🌍= tasks for translators, 💻= tasks for developer(s)

1. 💻Developers adds all necessary keys/terms in the source code, and preferrably adds a translation for the languages they master.
2. 💻When new keys are merged to the `main` branch in GitHub, they are automatically synced to Lokalise. Developers can also choose to add keys/translations to Lokalise earlier if necessary.
3. 🌍Translators changes/adds translations in the web view of [Lokalise](https://app.lokalise.com/project/8976449362e0d7af005bc1.77420911/).
   - If translator is not added as an contributor for the project yet, request this in #nva-oversettelser channel in Slack to get access to the project in Lokalise.
4. 🌍Translators notifies developers when they are done making changes (preferrably in #nva-oversettelser)
5. 💻Developers creates a PR with the suggested changes from Lokalise
   - Evaluate if any translations are changed as much as it would make sense to update the key as well in order to avoid confusion. Create tasks if necessary, e.g. when a persisted value should be updated.
6. 💻Developer merges the PR, and the new translations are added.

## Find correct key/term to translate

Every translation is related to a key, meaning one have to find the correct key in order to update/add a translation. We try to give all keys a logical name separated with `.` where the last part describes the content to translate, while everything before should descibes where it is used.

Keys starting with `common` are translations that can be used in many different contexts, e.g. `common.save = "Lagre"`.

As another example, the following translation are supposed to be displayed on the `Add employee` subpage of `Basic data`: `basic_data.add_employee.no_matching_persons_found = "Hvis du ikke finner riktig person i Personregisteret kan du opprette ny person."`.

Even though these keys are given with best intentions at the time they are implemented, they sometimes tend to drift in use, and may not always be 100% intuitive. To simplify the process of finding which keys are used at any place in the app, one can display the actual keys instead of their translations by setting `lng=cimode` for the URL query parameter. This is done by appending `?lng=cimode` to the URL, or appending `&lng=cimode` if the URL already has som query parameters.

Example:

- https://frontend.dev.nva.aws.unit.no/?lng=cimode
- https://frontend.dev.nva.aws.unit.no/projects?id=https%3A%2F%2Fapi.dev.nva.aws.unit.no%2Fcristin%2Fproject%2F404031&lng=cimode

Note: this means one can send a link with a predefined language selection by setting `lng` to either `nob` (Norwegian, bokmål) or `eng` (English) as well. (This works due to the `i18next-browser-languagedetector` package used in the frontend app.)

<figure>
  <img src="./images/cimode.png?raw=true" >
  <figcaption align="center">App showing keys instead of translations (https://frontend.dev.nva.aws.unit.no/?lng=cimode)</figcaption>
</figure>

<figure>
  <img src="./images/key_search.png?raw=true" >
  <figcaption align="center">One can find the translations for "common.search" by searching for "common::search" in Lokalise. Simply replace every "." (dot) with "::" (double colon).</figcaption>
</figure>

## Translation of persisted values

Some translations are based on values persisted in NVA. In these cases the persisted value are usually used as the key for the translation, and can be identified as the keys that starts with an uppercase letter, usually using `PascalCase` format.

<figure>
  <img src="./images/persisted_values.png?raw=true" >
  <figcaption align="center">Translation of persisted values in Lokalise. Note use of PascalCase instead of snake_case</figcaption>
</figure>

This means that the system will persist a value identical to the key (`DegreePhd`, `DegreeBachelor` and `DegreeMaster` in the image above), and the stored value will be looked up in the translation file when needed. If the persisted value changes at any point, e.g. if `DegreeBachelor` is renamed to `StudentDegreeBachelor`, the original translation is lost, and the same translation must be added for the new `StudentDegreeBachelor` value.

The developers should ensure that these keys are up to date and matches the actual stored values at any time. If the translation for a persisted value changes, the developers must evaluate if the persisted value should also be changed accordingly. If so, the old translation should be removed to avoid keeping (and maintaining) unused translations.

## Interpolation

If we want to include some dynamic text inside a translation this can be achieved by interpolating using `{{xxx}}` inside the translation, where `xxx` can be any custom variable name decided by the frontend developers.

Details: https://www.i18next.com/translation-function/interpolation

<figure>
  <img src="./images/interpolation.png?raw=true" >
  <figcaption align="center">"contributorName" being interpolated into translation in Lokalise</figcaption>
</figure>

It is also possible to reference another key, to reuse it’s translation, as shown in the image below.

<figure>
  <img src="./images/reuse_keys.png?raw=true" >
  <figcaption>The "editor.allowed" key (top) is reused is reused for the "editor.allowed_description" key (bottom).</figcaption>
</figure>

Some interpolation cases might be more complex, e.g. when a link or other formatting should appear within a translation. To achieve this some “mystical” `<0> </0>` or similar will appear in the translation, which can be a bit difficult to understand. These special cases should mainly be the developers responsibility. In short, it means that the content between `<0>` and `</0>` should have som extra formatting.

Details: https://react.i18next.com/latest/trans-component

<figure>
  <img src="./images/trans_component.png?raw=true" >
  <figcaption align="center">Advanced interpolation where a link is inserted around “Mine Meldinger”. Screenshot from Lokalise on top, and screenshot from the result in NVA below.</figcaption>
</figure>

## Pluralization

Some strings might depend on some variable whether it should display the text in singular or plural form. In these cases keys/terms can be postfixed with `_one` or `_other` (and a few more options for special cases). Which form will be used will depend on whether the protected `count` parameter qualifies for singular or plural form. Below is a simple example for both English and Norwegian from Lokalise. Note that some translations for some languages will be similar anyway, as for Norwegian in this case.

Details: https://www.i18next.com/translation-function/plurals

<figure>
  <img src="./images/pluralization.png?raw=true" >
  <figcaption>Pluralization in Lokaliser.</figcaption>
</figure>

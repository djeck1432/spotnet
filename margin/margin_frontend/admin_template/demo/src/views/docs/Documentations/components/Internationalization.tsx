import SyntaxHighlighter from '@/components/shared/SyntaxHighlighter'

const Internationalization = () => {
    return (
        <>
            <p>
                Elstar use{' '}
                <a
                    href="https://react.i18next.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    react-i18next
                </a>{' '}
                for internationalization, you can find corresponding files can
                be found in <code>src/locales/*</code>
            </p>
            <div className="mt-10" id="translatingText">
                <h5>Translating text</h5>
                <p className="mt-1">
                    One of the simplest usage for translate text is using{' '}
                    <code>useTranslate</code> hook provided by react-i18next.
                </p>
                <SyntaxHighlighter language="tsx">{`import { useTranslation } from 'react-i18next'

const Component = () => {

    const { t } = useTranslation()

    return (
        <div>{t('your.translate.key')}</div>
    )
}

export default Component`}</SyntaxHighlighter>
            </div>
            <div className="mt-10" id="changingLanguage">
                <h5>Changing language</h5>
                <p className="mt-1">
                    You can also use <code>useTranslate</code> hook to update
                    the current language
                </p>
                <SyntaxHighlighter language="tsx">{`import { useTranslation } from 'react-i18next'

const Component = () => {

    const { i18n } = useTranslation()

    return (
        <button onClick={() => i18n.changeLanguage('fr')}>Change language</button>
    )
}

export default Component`}</SyntaxHighlighter>
            </div>
            <div className="mt-10" id="addNewLocale">
                <h5>Add new locale</h5>
                <p className="mt-1">
                    We store all the locale data under{' '}
                    <code>src/locales/lang/*</code>. To add a new locale, create
                    a Json file under this directory. For example{' '}
                    <code>fr.json</code>
                </p>
                <SyntaxHighlighter language="json">{`{
    "your": {
        "translate": {
            "key": "votre clé de traduction"
        },
    }
}`}</SyntaxHighlighter>
                <p>
                    Now you can import this file into{' '}
                    <code>src/locales/index.ts</code> & inject them to{' '}
                    <code>resources</code> field, this is the entry file of all
                    locales. Also, create an object to load date locale
                    dynamically from{' '}
                    <a
                        href="https://github.com/iamkun/dayjs/tree/dev/src/locale"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <code>dayjs</code>
                    </a>
                    .
                </p>
                <SyntaxHighlighter language="ts">{`import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './lang/en.json'
import fr from './lang/fr.json'

const resources = {
    en: {
        translation: en
    },
    fr: { // <--- this will be the value you use on changeLanguage method
        translation: fr
    },
}

// Consistent the key with resource to load relavant locale from day.js
export const dateLocales: {
    [key: string]: () => Promise<ILocale>;
} = {
    en: () => import('dayjs/locale/en'),
    fr: () => import('dayjs/locale/fr'),
}

`}</SyntaxHighlighter>
                <p>And, the new locale is basically set.</p>
            </div>
            <div className="mt-10" id="settingDefaultLanguage">
                <h5>Remove internationalization</h5>
                <p className="mt-1">
                    To set the default language, you might need to visit{' '}
                    <code>src/configs/app.config.ts</code> and change the{' '}
                    <code>locale</code> field value
                </p>
                <SyntaxHighlighter language="ts">{`export const appConfig = {
    ...
    locale: 'fr'
}`}</SyntaxHighlighter>
            </div>
        </>
    )
}

export default Internationalization

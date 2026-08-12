import { useTranslation } from 'react-i18next';

interface PageSEOProps {
    titleKey: string;
    descriptionKey: string;
    dynamicValues?: Record<string, string | number>;
}

export const PageSEO = ({ titleKey, descriptionKey, dynamicValues }: PageSEOProps) => {
    const { t } = useTranslation();

    const title = t(titleKey, dynamicValues);
    const description = t(descriptionKey, dynamicValues);

    return (
        <>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
        </>
    );
};

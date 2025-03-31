const TextOverflow = () => {
    return (
        <div className="mx-auto max-w-sm p-8 border border-gray-200 dark:border-gray-600">
            <div className="mb-8">
                <span className="text-sm text-slate-500 font-mono mb-3 dark:text-slate-400">
                    Truncate
                </span>
                <p className="truncate">
                    The longest word in any of the major English language
                    dictionaries is
                    <span className="heading-text font-semibold">
                        pneumonoultramicroscopicsilicovolcanoconiosis,
                    </span>
                    a word that refers to a lung disease contracted from the
                    inhalation of very fine silica particles, specifically from
                    a volcano; medically, it is the same as silicosis.
                </p>
            </div>
            <div className="mb-8">
                <span className="text-sm text-slate-500 font-mono mb-3 dark:text-slate-400">
                    Ellipsis
                </span>
                <p className="text-ellipsis overflow-hidden">
                    The longest word in any of the major English language
                    dictionaries is
                    <span className="heading-text font-semibold">
                        {' '}
                        pneumonoultramicroscopicsilicovolcanoconiosis,{' '}
                    </span>
                    a word that refers to a lung disease contracted from the
                    inhalation of very fine silica particles, specifically from
                    a volcano; medically, it is the same as silicosis.
                </p>
            </div>
            <div>
                <span className="text-sm text-slate-500 font-mono mb-3 dark:text-slate-400">
                    Ellipsis
                </span>
                <p className="text-clip overflow-hidden">
                    The longest word in any of the major English language
                    dictionaries is
                    <span className="heading-text font-semibold">
                        {' '}
                        pneumonoultramicroscopicsilicovolcanoconiosis,{' '}
                    </span>
                    a word that refers to a lung disease contracted from the
                    inhalation of very fine silica particles, specifically from
                    a volcano; medically, it is the same as silicosis.
                </p>
            </div>
        </div>
    )
}

export default TextOverflow

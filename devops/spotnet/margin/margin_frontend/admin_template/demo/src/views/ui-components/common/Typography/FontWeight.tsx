const FontWeight = () => {
    return (
        <div className="flex flex-col gap-8">
            <div>
                <span className="text-sm text-slate-500 font-mono mb-3 dark:text-slate-400">
                    font-light
                </span>
                <p className="font-light heading-text">
                    The quick brown fox jumps over the lazy dog.
                </p>
            </div>
            <div>
                <span className="text-sm text-slate-500 font-mono mb-3 dark:text-slate-400">
                    font-normal
                </span>
                <p className="font-normal heading-text">
                    The quick brown fox jumps over the lazy dog.
                </p>
            </div>
            <div>
                <span className="text-sm text-slate-500 font-mono mb-3 dark:text-slate-400">
                    font-medium
                </span>
                <p className="font-medium heading-text">
                    The quick brown fox jumps over the lazy dog.
                </p>
            </div>
            <div>
                <span className="text-sm text-slate-500 font-mono mb-3 dark:text-slate-400">
                    font-semibold
                </span>
                <p className="font-semibold heading-text">
                    The quick brown fox jumps over the lazy dog.
                </p>
            </div>
            <div>
                <span className="text-sm text-slate-500 font-mono mb-3 dark:text-slate-400">
                    font-bold
                </span>
                <p className="font-bold heading-text">
                    The quick brown fox jumps over the lazy dog.
                </p>
            </div>
        </div>
    )
}

export default FontWeight

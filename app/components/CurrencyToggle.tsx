const CurrencyToggle = () => (
    <span
        className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-zinc-900 dark:text-white"
        aria-label="Prices displayed in US dollars"
        title="Prices displayed in US dollars"
    >
        <span aria-hidden="true">$</span>
        <span>USD</span>
    </span>
);

export default CurrencyToggle;

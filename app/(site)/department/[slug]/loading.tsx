export default function DepartmentLoadingSkeleton() {
    return (
        <div className="min-h-screen bg-[#fafbf9] pb-16 dark:bg-[var(--color-background-dark)]" aria-busy="true">
            <div className="container-custom animate-pulse pt-5 md:pt-7">
                <div className="mb-4 h-3 w-44 rounded bg-gray-100 dark:bg-white/10" />
                <div className="mb-6 h-9 w-52 rounded bg-gray-100 dark:bg-white/10" />
                <div className="grid gap-6 lg:grid-cols-[272px_minmax(0,1fr)] xl:grid-cols-[288px_minmax(0,1fr)] xl:gap-8">
                    <div className="hidden h-[560px] rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5 lg:block" />
                    <div>
                        <div className="mb-5 flex justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-white/5">
                            <div className="h-11 w-[440px] max-w-full rounded-xl bg-gray-100 dark:bg-white/10" />
                            <div className="h-11 w-44 rounded-xl bg-gray-100 dark:bg-white/10" />
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3 2xl:grid-cols-4">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="rounded-2xl border border-gray-200 p-3 dark:border-white/10">
                                    <div className="aspect-square rounded-xl bg-gray-100 dark:bg-white/5" />
                                    <div className="space-y-3 pt-4">
                                        <div className="h-3 w-20 rounded bg-gray-100 dark:bg-white/10" />
                                        <div className="h-4 w-full rounded bg-gray-100 dark:bg-white/10" />
                                        <div className="h-4 w-2/3 rounded bg-gray-100 dark:bg-white/10" />
                                        <div className="h-9 rounded-xl bg-gray-100 dark:bg-white/10" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
    return (
        <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700 mb-1">
            {children}
        </label>
    );
}

export function RequiredMark() {
    return <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>;
}

export function Input({
    id, type = "text", value, onChange, placeholder, disabled, autoComplete, autoFocus, error,
}: {
    id: string; type?: string; value: string; onChange: (v: string) => void;
    placeholder?: string; disabled?: boolean; autoComplete?: string; autoFocus?: boolean; error?: boolean;
}) {
    return (
        <input
            id={id}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete={autoComplete}
            autoFocus={autoFocus}
            aria-invalid={error ? "true" : "false"}
            className={[
                "w-full px-3 py-2.5 rounded-lg border text-sm font-sans transition-colors duration-150",
                "bg-white placeholder:text-slate-400 text-slate-900",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                "disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed",
                error
                    ? "border-red-400 bg-red-50"
                    : "border-slate-300",
            ].join(" ")}
        />
    );
}

export function PrimaryButton({
    children, disabled, loading, type = "button", onClick, fullWidth = true,
}: {
    children: React.ReactNode; disabled?: boolean; loading?: boolean;
    type?: "button" | "submit"; onClick?: () => void; fullWidth?: boolean;
}) {
    return (
        <button
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            className={[
                "relative flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg",
                "bg-blue-600 text-white text-sm font-semibold tracking-wide",
                "transition-all duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "enabled:hover:bg-blue-700 enabled:active:scale-[0.98]",
                fullWidth ? "w-full" : "",
            ].join(" ")}
        >
            {loading && (
                <svg className="animate-spin size-4 text-white/70" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
            )}
            {children}
        </button>
    );
}

export function GhostButton({ children, onClick, disabled }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="text-sm text-blue-600 font-medium hover:underline disabled:opacity-40 disabled:no-underline disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
        >
            {children}
        </button>
    );
}

export function Banner({
    type, children,
}: {
    type: "error" | "warning" | "success" | "info";
    children: React.ReactNode;
}) {
    const styles = {
        error: "bg-red-50 border-red-300 text-red-800",
        warning: "bg-yellow-50 border-yellow-300 text-yellow-800",
        success: "bg-green-50 border-green-300 text-green-800",
        info: "bg-blue-50 border-blue-300 text-blue-800",
    };
    const icons = {
        error: (
            <svg className="size-4 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-4.5a.75.75 0 001.5 0v-4a.75.75 0 00-1.5 0v4zm.75-7a1 1 0 110 2 1 1 0 010-2z" clipRule="evenodd" />
            </svg>
        ),
        warning: (
            <svg className="size-4 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 110-2 1 1 0 010 2z" clipRule="evenodd" />
            </svg>
        ),
        success: (
            <svg className="size-4 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
        ),
        info: (
            <svg className="size-4 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
            </svg>
        ),
    };
    return (
        <div role="alert" className={`flex gap-2 rounded-lg border px-3 py-2.5 text-sm ${styles[type]}`}>
            {icons[type]}
            <span>{children}</span>
        </div>
    );
}

export function FieldError({ id, message }: { id: string; message: string }) {
    return (
        <p id={id} role="alert" className="mt-1 text-xs text-red-600 flex items-center gap-1">
            <svg className="size-3 shrink-0" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
                <path d="M6 0a6 6 0 100 12A6 6 0 006 0zm-.75 3.5a.75.75 0 011.5 0v3a.75.75 0 01-1.5 0v-3zm.75 6a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
            {message}
        </p>
    );
}

export function AuthShell({ children, title, subtitle }: {
    children: React.ReactNode; title: string; subtitle?: string;
}) {
    return (
        <div className="min-h-full bg-slate-50 flex flex-col items-center justify-center px-4 py-10">
            <div className="w-full max-w-sm">
                {/* Wordmark */}
                <div className="mb-8 flex flex-col items-center gap-1">
                    <div className="flex items-center gap-2.5">
                        <div className="size-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
                            <svg className="size-5 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path d="M2.5 3A1.5 1.5 0 001 4.5v4A1.5 1.5 0 002.5 10h3.75a.75.75 0 000-1.5H2.5V4.5A.5.5 0 003 4h14a.5.5 0 01.5.5v4h-3.75a.75.75 0 000 1.5H17.5A1.5 1.5 0 0019 8.5v-4A1.5 1.5 0 0017.5 3h-15z" />
                                <path d="M1 11.5A1.5 1.5 0 012.5 10h15a1.5 1.5 0 011.5 1.5v4A1.5 1.5 0 0117.5 17h-15A1.5 1.5 0 011 15.5v-4zm1.5 0a.5.5 0 00-.5.5v4a.5.5 0 00.5.5h15a.5.5 0 00.5-.5v-4a.5.5 0 00-.5-.5h-15z" />
                            </svg>
                        </div>
                        <span className="text-lg font-bold text-slate-900 tracking-tight">RiskEval PWA</span>
                    </div>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-7">
                    <h1 className="text-xl font-bold text-slate-900 mb-1">{title}</h1>
                    {subtitle && <p className="text-sm text-slate-500 mb-6">{subtitle}</p>}
                    {!subtitle && <div className="mb-5" />}
                    {children}
                </div>
            </div>
        </div>
    );
}
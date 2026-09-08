export function EmptyState({ message, icon, actionLabel, onAction }) {
  return (
    <div className="glass-card flex flex-col items-center justify-center text-center py-12 px-6 my-4">
      {icon && <div className="mb-4 text-4xl animate-bounce-gentle">{icon}</div>}
      {message && <p className="text-sm font-bold text-slate-700 max-w-md">{message}</p>}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="btn-primary mt-4 text-xs py-2 px-5 shadow-md"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

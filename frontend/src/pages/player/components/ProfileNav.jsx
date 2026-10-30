import { cn } from '../../../utils/cn';

export default function ProfileNav({ tabs, active, onChange }) {
  return (
    <nav className="flex gap-1 overflow-x-auto rounded-xl border border-outline-variant bg-white p-1.5 shadow-card lg:sticky lg:top-6 lg:flex-col lg:overflow-visible lg:p-3">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={cn(
            'flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors lg:w-full',
            active === tab.value ? 'bg-primary text-white shadow-primary' : 'text-ink-muted hover:bg-surface-variant-2 hover:text-ink'
          )}
        >
          <tab.icon className="size-4 shrink-0" />
          {tab.label}
        </button>
      ))}
    </nav>
  );
}


import { Trophy } from 'lucide-react';
import courtImage from '../../assets/courts/badminton.jpg';

export default function AuthLayout({ headline, subtext, features = [], children }) {
  return (
    <div className="grid min-h-screen grid-cols-1 bg-background lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
        <img
          src={courtImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover [filter:saturate(1.4)_contrast(1.08)]"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-primary/60 to-ink/80" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/40 via-transparent to-ink/50" />
        <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-accent/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-14 size-96 rounded-full bg-primary-container-alt/20 blur-3xl" />

        <div className="relative flex items-center gap-2.5 text-white">
          <span className="flex size-10 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25 backdrop-blur-sm">
            <Trophy className="size-5" />
          </span>
          <span className="text-display-athletic text-lg">NhuToan</span>
        </div>

        <div className="relative max-w-md animate-fade-in-up">
          <h2 className="text-display-athletic text-4xl leading-[1.1] text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.45)] xl:text-5xl">
            {headline}
          </h2>
          {subtext && <p className="mt-4 text-base text-white/90 [text-shadow:0_1px_8px_rgba(0,0,0,0.35)]">{subtext}</p>}

          {features.length > 0 && (
            <ul className="mt-9 space-y-4">
              {features.map(({ icon: Icon, text }, i) => (
                <li key={text} className="flex items-start gap-3">
                  <span
                    className={
                      i === 1
                        ? 'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-ink shadow-glow-accent'
                        : 'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/25'
                    }
                  >
                    <Icon className={i === 1 ? 'size-4' : 'size-4 text-white'} />
                  </span>
                  <span className="text-sm leading-relaxed text-white/95">{text}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="relative text-xs text-white/60">
          © {new Date().getFullYear()} NhuToan Sports — Hệ thống đặt sân cầu lông &amp; pickleball.
        </p>
      </div>

      <div className="relative flex items-center justify-center overflow-hidden px-4 py-10 sm:px-6 lg:px-12 xl:px-20">

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(203,213,225,0.7) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="pointer-events-none absolute left-1/2 top-1/2 size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-container/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-16 size-72 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative w-full max-w-md animate-fade-in-up">

          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-white shadow-primary">
              <Trophy className="size-5" />
            </span>
            <span className="text-display-athletic text-lg text-ink">NhuToan</span>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}


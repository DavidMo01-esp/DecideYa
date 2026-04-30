import { Link } from 'react-router-dom';

interface NotFoundProps {
  description?: string;
  title?: string;
}

export default function NotFound({
  description = 'La ruta que buscas no existe o fue movida a otra ubicacion.',
  title = 'Pagina no encontrada',
}: NotFoundProps) {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-124px)] max-w-5xl items-center px-6 py-10">
      <section className="glass-card relative w-full overflow-hidden rounded-[2.8rem] p-10 fade-in-up">
        <div className="pointer-events-none absolute -right-10 -top-12 h-52 w-52 rounded-full bg-[color:var(--coral-soft)] blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-44 w-44 rounded-full bg-[color:var(--sky-soft)] blur-3xl" />

        <div className="relative z-10 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
            Error 404
          </p>
          <h2 className="font-display mt-5 text-5xl leading-[0.92] text-slate-950 sm:text-6xl">
            {title}
          </h2>
          <p className="mt-5 text-base leading-8 text-slate-600">
            {description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              className="inline-flex items-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-[color:var(--paper)] transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800"
              to="/"
            >
              Volver al inicio
            </Link>
            <Link
              className="inline-flex items-center rounded-full border border-[color:var(--line)] bg-white/80 px-5 py-3 text-sm font-semibold text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:bg-white"
              to="/decisions"
            >
              Ir a decisiones
            </Link>
          </div>
        </div>

        <div className="pointer-events-none absolute right-8 top-6 font-display text-[7rem] leading-none text-white/70 sm:text-[9rem]">
          404
        </div>
      </section>
    </main>
  );
}

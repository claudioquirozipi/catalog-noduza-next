import type { Metadata } from "next";
import Link from "next/link";
import { Background } from "./_landing/background";
import { Nody } from "./_landing/nody";

export const metadata: Metadata = {
  title: "Noduza · Tu catálogo online para vender por WhatsApp",
  description:
    "Crea el catálogo de tu negocio, compártelo con un enlace y recibe los pedidos ordenados en tu WhatsApp. Sin comisiones por venta.",
  openGraph: {
    title: "Noduza · Tu catálogo online para vender por WhatsApp",
    description: "Sube tus productos, comparte un enlace y recibe los pedidos en tu WhatsApp. Sin comisiones por venta.",
    locale: "es_PE",
    type: "website",
    siteName: "Noduza",
  },
};

// Panel de Noduza (proyecto Angular), donde el negocio se registra y administra su catálogo.
const APP_URL = process.env.NODUZA_APP_URL ?? "https://noduza.com";
const REGISTER_URL = `${APP_URL}/auth/register`;
const LOGIN_URL = `${APP_URL}/auth/login`;

// Mismos estilos que los componentes ui-card y ui-button del panel de Angular.
const CARD =
  "rounded-xl border border-violet-300 bg-linear-to-tl from-violet-200 to-violet-50 shadow-md dark:border-violet-500 dark:from-violet-950/80 dark:to-violet-900/80";
const BUTTON_PRIMARY = "bg-linear-to-tl from-violet-700 to-violet-500 text-white hover:from-violet-800 hover:to-violet-600";
const BUTTON_OUTLINE =
  "border-2 border-violet-500 text-violet-600 hover:bg-violet-50 dark:text-violet-400 dark:hover:bg-violet-500/10";
const MUTED = "text-gray-600 dark:text-gray-300";

const STEPS = [
  {
    title: "Crea tu tienda",
    description: "Regístrate y agrega el nombre, el logo y los colores de tu negocio.",
  },
  {
    title: "Sube tus productos",
    description: "Fotos, precios, categorías, tallas y stock. Lo agotado se marca solo.",
  },
  {
    title: "Comparte tu enlace",
    description: "Ponlo en tu bio de Instagram, en tus estados o envíalo por chat. Los pedidos te llegan al WhatsApp.",
  },
];

const DEMOS = [
  {
    id: "500164f7-c61b-4277-8c0f-6625d5fb6e1d",
    name: "Sabor Urbano",
    kind: "Comida",
    description: "Hamburguesas, alitas y salchipapas para pedir por delivery.",
    icon: (
      <>
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
        <path d="M7 2v20" />
        <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
      </>
    ),
    tone: "from-orange-500 to-red-600",
  },
  {
    id: "4e7ebf7c-efa3-42c4-bb6d-f53600c81c38",
    name: "Aura Botánica",
    kind: "Cosmética natural",
    description: "Jabones, aceites y cuidado facial hechos a mano.",
    icon: (
      <>
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
      </>
    ),
    tone: "from-emerald-500 to-teal-700",
  },
  {
    id: "e73f6037-14e9-4bf4-8d20-316826e14e34",
    name: "Regala Bonito",
    kind: "Regalos",
    description: "Boxes personalizados para cumpleaños, desayunos y ocasiones especiales.",
    icon: (
      <>
        <rect x="3" y="8" width="18" height="4" rx="1" />
        <path d="M12 8v13" />
        <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
        <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
      </>
    ),
    tone: "from-pink-500 to-fuchsia-700",
  },
];

const PLAN_FEATURES = [
  "Catálogo con tu logo y tus colores",
  "Productos con fotos, variantes y stock",
  "Pedidos ordenados directo a tu WhatsApp",
  "Sin comisiones por venta",
];

const FAQS = [
  {
    question: "¿Necesito saber de tecnología?",
    answer: "No. Si sabes usar WhatsApp, puedes armar tu catálogo: llenas los datos de tu negocio, subes tus productos y compartes el enlace.",
  },
  {
    question: "¿Cómo me llegan los pedidos?",
    answer:
      "Tu cliente arma su pedido en el catálogo y lo envía a tu WhatsApp con los productos, las cantidades, el total, si es delivery o recojo y cómo va a pagar.",
  },
  {
    question: "¿Noduza cobra comisión por venta?",
    answer: "No. Tu cliente te paga directo a ti, por Yape, Plin o en efectivo. El dinero nunca pasa por Noduza.",
  },
  {
    question: "¿Qué pasa cuando termine el periodo gratis?",
    answer:
      "El plan costará S/ 29 al mes. Te avisaremos con anticipación antes de empezar a cobrar, y si decides no continuar, no tendrás que pagar nada.",
  },
  {
    question: "¿Sirve para servicios o reservas?",
    answer:
      "Por ahora Noduza está pensado para vender productos y comida. Para servicios con citas u horarios estamos trabajando en algo mejor.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-1 flex-col font-sans text-gray-900 dark:text-gray-100">
      <Background />
      <Header />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <CustomerView />
        <Demos />
        <Pricing />
        <Faq />
        <ForShoppers />
      </main>
      <Footer />
    </div>
  );
}

function Logo() {
  return (
    <span className="flex items-center gap-2 text-lg font-bold">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-tl from-violet-700 to-violet-500 text-white ring-2 ring-amber-500 ring-offset-1 ring-offset-violet-100 dark:ring-offset-gray-950">
        N
      </span>
      Noduza
    </span>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-violet-300 bg-violet-100/70 backdrop-blur-md dark:border-violet-800 dark:bg-gray-950/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Logo />
        <nav className="hidden items-center gap-6 text-sm text-gray-600 md:flex dark:text-gray-300">
          <a href="#como-funciona" className="hover:text-violet-600 dark:hover:text-violet-400">Cómo funciona</a>
          <a href="#ejemplos" className="hover:text-violet-600 dark:hover:text-violet-400">Ejemplos</a>
          <a href="#precio" className="hover:text-violet-600 dark:hover:text-violet-400">Precio</a>
          <a href="#preguntas" className="hover:text-violet-600 dark:hover:text-violet-400">Preguntas</a>
        </nav>
        <div className="flex items-center gap-2 text-sm font-medium">
          <a href={LOGIN_URL} className="hidden px-3 py-2 text-gray-700 hover:text-violet-600 sm:block dark:text-gray-200">
            Iniciar sesión
          </a>
          <a href={REGISTER_URL} className={`rounded-lg px-4 py-2 ${BUTTON_PRIMARY}`}>
            Crear mi catálogo
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-12 pb-16 md:grid-cols-[1.2fr_1fr] md:pt-20 md:pb-24">
      <div className="text-center md:text-left">
        <p className="inline-flex items-center gap-2 rounded-full bg-linear-to-tl from-amber-600 to-amber-500 px-3 py-1 text-sm font-semibold text-white">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-white" />
          Gratis durante el lanzamiento
        </p>
        <h1 className="mt-6 text-4xl leading-tight font-bold tracking-tight sm:text-5xl">
          Tu catálogo online, listo para vender por{" "}
          <span className="text-[#1DA851] dark:text-[#25D366]">WhatsApp</span>
        </h1>
        <p className={`mx-auto mt-5 max-w-xl text-lg md:mx-0 ${MUTED}`}>
          Sube tus productos, comparte un solo enlace y recibe los pedidos ordenados en tu WhatsApp. Sin comisiones por venta.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
          <a
            href={REGISTER_URL}
            className={`rounded-lg px-6 py-3.5 text-center font-semibold shadow-lg shadow-violet-600/30 ${BUTTON_PRIMARY}`}
          >
            Crear mi catálogo gratis
          </a>
          <a
            href="#ejemplos"
            className={`rounded-lg px-6 py-3.5 text-center font-semibold ${BUTTON_OUTLINE}`}
          >
            Ver un ejemplo
          </a>
        </div>
      </div>
      <Nody pose="hero" priority className="mx-auto w-56 sm:w-72 md:w-full md:max-w-sm" />
    </section>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {subtitle && <p className={`mt-3 text-lg ${MUTED}`}>{subtitle}</p>}
    </div>
  );
}

function HowItWorks() {
  return (
    <section id="como-funciona" className="scroll-mt-16 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionTitle title="Listo en tres pasos" subtitle="Sin instalar nada y sin saber de diseño." />
        <div className="grid items-center gap-10 md:grid-cols-[1fr_2fr]">
          <Nody pose="share" className="mx-auto w-48 sm:w-60 md:w-full md:max-w-xs" />
          <ol className="grid gap-6 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <li key={step.title} className={`p-6 ${CARD}`}>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-tl from-amber-600 to-amber-500 font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                <p className={`mt-2 ${MUTED}`}>{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function CustomerView() {
  return (
    <section className="py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 md:grid-cols-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Así compra tu cliente</h2>
          <ul className="mt-6 space-y-4 text-gray-700 dark:text-gray-200">
            {[
              "Busca entre tus productos y ve fotos, precios y tallas.",
              "Arma su pedido con las cantidades que quiere.",
              "Elige delivery o recojo y cómo va a pagar.",
              "Te lo envía a tu WhatsApp, listo para confirmar.",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <CheckIcon />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <OrderMessagePreview />
      </div>
    </section>
  );
}

// Imita el mensaje que arma el carrito del catálogo (ver orderMessage en [businessId]/cart.tsx).
function OrderMessagePreview() {
  return (
    <div className="mx-auto w-full max-w-sm rounded-3xl border-2 border-amber-500 bg-[#efeae2] p-4 shadow-xl dark:bg-[#0b141a]">
      <p className="mb-3 text-center text-xs text-neutral-500">Pedido recibido en tu WhatsApp</p>
      <div className="ml-auto max-w-[90%] rounded-2xl rounded-tr-sm bg-[#d9fdd3] p-3 text-sm leading-relaxed text-neutral-900 shadow-sm dark:bg-[#005c4b] dark:text-neutral-100">
        <p>Hola Sabor Urbano, quiero hacer este pedido:</p>
        <p className="mt-2">• 2 x Hamburguesa clásica — S/ 54.00</p>
        <p>• 1 x Papas loaded — S/ 11.00</p>
        <p className="mt-2 font-bold">Total: S/ 65.00</p>
        <p className="mt-2">Nombre: Lucía</p>
        <p>Entrega: Delivery</p>
        <p>Dirección: Av. Primavera 123</p>
        <p>Pago: Yape</p>
        <p className="mt-1 text-right text-[11px] text-neutral-500 dark:text-neutral-300">12:41 ✓✓</p>
      </div>
    </div>
  );
}

function Demos() {
  return (
    <section id="ejemplos" className="scroll-mt-16 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionTitle title="Mira cómo se ve" subtitle="Tiendas de ejemplo hechas con Noduza. Entra y pruébalas como si fueras un cliente." />
        <ul className="grid gap-6 sm:grid-cols-3">
          {DEMOS.map((demo) => (
            <li key={demo.id}>
              <Link
                href={`/${demo.id}`}
                className={`group block h-full overflow-hidden transition-transform hover:scale-[1.02] ${CARD}`}
              >
                <div className={`flex h-28 items-center justify-center bg-linear-to-br ${demo.tone}`}>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.75}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-12 w-12 text-white drop-shadow-sm transition-transform group-hover:scale-110"
                  >
                    {demo.icon}
                  </svg>
                </div>
                <div className="p-5">
                  <p className="text-xs font-medium tracking-wide text-violet-600 uppercase dark:text-violet-400">{demo.kind}</p>
                  <h3 className="mt-1 text-lg font-semibold">{demo.name}</h3>
                  <p className={`mt-1 text-sm ${MUTED}`}>{demo.description}</p>
                  <p className="mt-4 text-sm font-medium text-violet-600 group-hover:underline dark:text-violet-400">Ver catálogo →</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="precio" className="scroll-mt-16 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionTitle title="Un solo plan, sin letra chica" subtitle="Lo que vendes es tuyo: tu cliente te paga directo a ti." />
        <div className="mx-auto grid max-w-3xl items-center gap-10 md:grid-cols-[1fr_1.4fr]">
          <Nody pose="celebrate" className="mx-auto w-44 sm:w-56 md:w-full" />
          <div className="relative rounded-xl border-2 border-amber-500 bg-linear-to-tl from-violet-200 to-violet-50 p-8 shadow-xl dark:from-violet-950/80 dark:to-violet-900/80">
            <p className="absolute -top-3 left-8 rounded-full bg-linear-to-tl from-amber-600 to-amber-500 px-3 py-1 text-xs font-semibold text-white">
              Gratis durante el lanzamiento
            </p>
            <h3 className="text-lg font-semibold">Plan Noduza</h3>
            <p className="mt-2">
              <span className="text-4xl font-bold">S/ 29</span>
              <span className={MUTED}> / mes</span>
            </p>
            <ul className="mt-6 space-y-3">
              {PLAN_FEATURES.map((feature) => (
                <li key={feature} className="flex gap-3">
                  <CheckIcon />
                  {feature}
                </li>
              ))}
            </ul>
            <a
              href={REGISTER_URL}
              className={`mt-8 block rounded-lg py-3 text-center font-semibold ${BUTTON_PRIMARY}`}
            >
              Empezar gratis
            </a>
            <p className={`mt-3 text-center text-sm ${MUTED}`}>Te avisaremos antes de empezar a cobrar.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section id="preguntas" className="scroll-mt-16 py-20">
      <div className="mx-auto max-w-3xl px-4">
        <SectionTitle title="Preguntas frecuentes" />
        <div className="space-y-3">
          {FAQS.map((faq) => (
            <details
              key={faq.question}
              className={`group p-5 ${CARD}`}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                {faq.question}
                <span aria-hidden="true" className="text-xl text-amber-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className={`mt-3 ${MUTED}`}>{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// Para quien llega aquí buscando la tienda de un negocio y no sabe qué es Noduza.
function ForShoppers() {
  return (
    <section className="py-20">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 px-4 text-center sm:flex-row sm:text-left">
        <Nody pose="search" className="w-36 shrink-0 sm:w-44" />
        <div>
          <h2 className="text-2xl font-bold">¿Llegaste buscando una tienda?</h2>
          <p className={`mt-3 ${MUTED}`}>
            Cada negocio en Noduza tiene su propio enlace. Pídeselo por WhatsApp o búscalo en sus redes sociales, y podrás ver
            su catálogo y hacer tu pedido.
          </p>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-violet-300 bg-violet-100/50 dark:border-violet-800 dark:bg-gray-950/50">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-gray-600 sm:flex-row dark:text-gray-300">
        <Logo />
        <div className="flex gap-6">
          <a href={LOGIN_URL} className="hover:text-violet-600">Iniciar sesión</a>
          <a href={REGISTER_URL} className="hover:text-violet-600">Crear cuenta</a>
        </div>
        <p>© {new Date().getFullYear()} Noduza</p>
      </div>
    </footer>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-5 w-5 shrink-0 text-amber-500">
      <path
        fillRule="evenodd"
        d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

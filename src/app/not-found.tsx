export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p className="text-5xl font-semibold text-foreground/30">404</p>
      <h1 className="mt-4 text-2xl font-semibold">No encontramos esta tienda</h1>
      <p className="mt-2 text-foreground/70">
        Revisa que el enlace esté completo. Si te lo compartió un negocio, pídele que te lo envíe de nuevo.
      </p>
    </main>
  );
}

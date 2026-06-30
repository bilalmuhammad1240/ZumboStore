/**
 * Layout público — Loja (Sprint 4 implementa Header e Footer completos).
 * Por agora, wrap simples para que a home e categorias funcionem.
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header será implementado no Módulo 9 (Home Page) */}
      <main className="flex-1">{children}</main>
      {/* Footer será implementado no Módulo 9 (Home Page) */}
    </div>
  );
}

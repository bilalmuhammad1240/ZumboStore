import type { NextConfig } from "next";

// Deriva o hostname do Supabase a partir da variável de ambiente —
// nunca fica desatualizado se o projeto Supabase mudar.
// O campo "hostname" do remotePatterns só aceita o domínio puro,
// sem protocolo nem caminho.
function getSupabaseHostname(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!url) {
    // Em builds sem .env (ex.: CI/lint), não falha o build.
    return "**";
  }

  try {
    return new URL(url).hostname;
  } catch {
    return "**";
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: getSupabaseHostname(),
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // Impede que dados sensíveis do servidor vazem para o bundle do cliente.
  serverExternalPackages: [],

  // Headers de segurança aplicados em todas as rotas.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

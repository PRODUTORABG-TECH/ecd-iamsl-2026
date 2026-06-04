import { Suspense } from "react";
import StatusContent from "./StatusContent"; // Vamos criar este ficheiro no Passo 2

export const metadata = {
  title: "Aviso - Encontro com Deus 2026",
  description: "Status da inscrição para o Encontro com Deus 2026.",
};

export default function ObrigadoErroPage() {
  return (
    // O Suspense é obrigatório no Next.js quando lemos parâmetros da URL no cliente
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50">A carregar...</div>}>
      <StatusContent />
    </Suspense>
  );
}
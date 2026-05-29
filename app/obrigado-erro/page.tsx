import Link from "next/link";

export const metadata = {
  title: "Erro - Encontro com Deus 2026",
  description:
    "Ocorreu um erro durante a inscrição para o Encontro com Deus 2026.",
};

export default function ObrigadoErroPage() {
  return (
    <div className="min-h-screen bg-[#fee2e2] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Erro na Inscrição
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          Desculpe, algo deu errado durante o processo. Por favor, entre em
          contato com a equipe para ajuda.
        </p>
        <div className="mt-6 text-sm text-gray-700">
          <p className="font-semibold">Contate a equipe:</p>
          <Link
            rel="stylesheet"
            className="mt-2"
            href="https://wa.me/5527997558607?text=Tive%20um%20problema%20ao%20realizar%20meu%20cadastro%20no%20Encontro%20com%20Deus%202026%20e%20preciso%20de%20ajuda%20para%20corrigir%20as%20informa%C3%A7%C3%B5es."
          >
            <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-white font-semibold text-sm transition-all hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100">
              Bruna Ramos
            </button>
          </Link>
        </div>

        <div className="mt-6 text-xs text-gray-400">Encontro com Deus 2026</div>
      </div>
    </div>
  );
}

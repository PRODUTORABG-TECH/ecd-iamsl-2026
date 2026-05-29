export const metadata = {
  title: "Pendente - Encontro com Deus 2026",
  description: "Pagamento pendente para o Encontro com Deus 2026.",
};

export default function ObrigadoPendentePage() {
  return (
    <div className="min-h-screen bg-[#fff7eb] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-5">
          <svg
            className="w-8 h-8 text-yellow-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 19.5A7.5 7.5 0 114.5 12 7.509 7.509 0 0112 19.5z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Inscrição Pendente</h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          Recebemos sua solicitação, mas ainda aguardamos a confirmação do pagamento.
          Verifique os dados do boleto ou comprovante e finalize o processo.
        </p>
        <div className="mt-6 text-xs text-gray-400">Encontro com Deus 2026</div>
      </div>
    </div>
  );
}

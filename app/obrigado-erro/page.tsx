import Link from "next/link";

export const metadata = {
  title: "Aviso - Encontro com Deus 2026",
  description:
    "Status da inscrição para o Encontro com Deus 2026.",
};

export default function ObrigadoErroPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  // 1. Captura os parâmetros que o Mercado Pago injeta na URL
  const paymentId = searchParams?.payment_id;
  const status = searchParams?.status;
  const preference_id = searchParams?.preference_id

  // 2. Verifica se a pessoa abandonou o checkout (volta pra loja sem pagar)
  const foiAbandono = !paymentId || paymentId === "null" || status === "null";

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${foiAbandono ? "bg-orange-50" : "bg-[#fee2e2]"}`}>
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">
        
        {foiAbandono ? (
          /* =========================================================
             TELA DE ABANDONO DE CARRINHO (AMIGÁVEL)
             ========================================================= */
          <>
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-5">
              {/* Ícone de Alerta/Atenção (Laranja) */}
              <svg className="w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Pagamento Pendente
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Notamos que você retornou antes de concluir o pagamento. Sua inscrição ainda <strong>não foi finalizada</strong>.
            </p>
            
            {/* Altere o "/" para o link da sua página inicial de inscrição se for diferente */}
            <Link href={preference_id?`https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=${preference_id}`:"/"} className="block w-full mt-2">
              <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 text-white font-semibold text-sm transition-all hover:bg-orange-600 active:scale-[0.98]">
                Tentar Pagar Novamente
              </button>
            </Link>
            <div className="mt-6 text-sm text-gray-700">
              <p className="font-semibold">Contate a equipe:</p>
              <Link
                href="https://wa.me/5527997558607?text=Tive%20um%20problema%20ao%20realizar%20meu%20cadastro%20no%20Encontro%20com%20Deus%202026%20e%20preciso%20de%20ajuda%20para%20corrigir%20as%20informa%C3%A7%C3%B5es."
                className="block mt-2"
                target="_blank"
              >
                <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-white font-semibold text-sm transition-all hover:bg-blue-700 active:scale-[0.98]">
                  Bruna Ramos
                </button>
              </Link>
            </div>
          </>
        ) : (
          /* =========================================================
             TELA DE ERRO REAL / PAGAMENTO RECUSADO (A SUA ORIGINAL)
             ========================================================= */
          <>
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Erro na Inscrição
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              Desculpe, algo deu errado durante o processo ou o pagamento foi recusado. Por favor, entre em contato com a equipe para ajuda.
            </p>
            <div className="mt-6 text-sm text-gray-700">
              <p className="font-semibold">Contate a equipe:</p>
              <Link
                href="https://wa.me/5527997558607?text=Tive%20um%20problema%20ao%20realizar%20meu%20cadastro%20no%20Encontro%20com%20Deus%202026%20e%20preciso%20de%20ajuda%20para%20corrigir%20as%20informa%C3%A7%C3%B5es."
                className="block mt-2"
                target="_blank"
              >
                <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-white font-semibold text-sm transition-all hover:bg-blue-700 active:scale-[0.98]">
                  Bruna Ramos
                </button>
              </Link>
            </div>
          </>
        )}

        <div className="mt-6 text-xs text-gray-400">Encontro com Deus 2026</div>
      </div>
    </div>
  );
}
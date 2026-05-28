export default function ObrigadoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-indigo-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Inscrição Confirmada!</h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          Sua vaga no <strong>ECD 2026</strong> está garantida. Em breve você receberá mais
          informações via WhatsApp. Fique de olho nas mensagens!
        </p>
        <div className="mt-6 text-xs text-gray-400">Encontro de Casais e Desafios 2026</div>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Reservado - Encontro com Deus 2026",
  description: "Reserva registrada para o Encontro com Deus 2026.",
};

export default function ReservadoPage() {
  return (
    <div className="min-h-screen bg-[#fff7eb] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">
        <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-5">
          <svg
            className="w-14 h-14 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Reserva Registrada!</h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          Sua reserva para o <strong>Encontro com Deus da Igreja Monte Sião Linhares</strong> foi registrada.
        </p>
        <div className="mt-6 text-xs text-gray-400">Encontro com Deus 2026</div>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Termos e Condições — Encontro com Deus 2025",
};

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-[#fdf1e6] px-4 py-10">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-8">
        <header>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">
            Igreja Monte Sião Linhares
          </p>
          <h1 className="text-2xl font-bold text-gray-900">
            Termos e Condições de Uso
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Encontro com Deus 2025
          </p>
        </header>

        <Section title="Descrição do Evento">
          <p>
            O <strong>Encontro com Deus</strong> é um tempo de imersão cujo objetivo é criar um
            ambiente propício para que os participantes tenham uma experiência sobrenatural e
            transformadora com Deus. São três dias em que sua única preocupação será ouvir a voz
            de Deus e se permitir transformar pelo Espírito.
          </p>
          <p className="mt-3">O evento é composto de:</p>
          <ul className="mt-2 space-y-3 list-none">
            <li>
              <strong>Pré-encontro:</strong> É um tempo essencial de preparação para aquilo que
              Deus fará. É o momento de alinhar o coração, ajustar motivações e expectativas, além
              de receber orientações práticas que ajudarão os encontristas a viverem com
              profundidade tudo o que será ministrado nos dias do Encontro com Deus.
            </li>
            <li>
              <strong>Encontro:</strong> Retiro no sítio informado.
            </li>
            <li>
              <strong>Pós-encontro:</strong> É um tempo de consolidação. Após viver dias tão
              marcantes na presença de Deus, esse é o momento de aprofundar as verdades recebidas,
              alinhar a caminhada com o propósito de Deus e fortalecer as bases de uma vida
              transformada.
            </li>
          </ul>
          <p className="mt-3 font-semibold text-gray-700">17 a 19 de julho</p>
        </Section>

        <Section title="Programação">
          <ul className="space-y-3">
            <ScheduleItem
              label="Pré-encontro"
              note="participação obrigatória"
              detail="12 de agosto, às 19h30"
              location="Igreja Monte Sião Linhares"
            />
            <ScheduleItem
              label="Saída da Igreja"
              detail="15 de agosto, 18h"
              location="Igreja Monte Sião Linhares"
            />
            <ScheduleItem
              label="Retiro — Encontro com Deus"
              detail="15 a 17 de agosto"
              location="Sítio Touza"
              extra="Retornaremos no domingo para o culto de recepção na Igreja Monte Sião Linhares."
            />
            <ScheduleItem
              label="Recepção"
              detail="17 de agosto, 18h"
              location="Igreja Monte Sião Linhares"
              extra="Ao retornarem do Encontro com Deus, os encontristas são recebidos pela igreja e por seus familiares em um culto ao Senhor para celebrar as bênçãos recebidas. É um momento especial para testemunhar, compartilhar da unção recebida e glorificar ao Senhor por tudo o que foi vivido."
            />
            <ScheduleItem
              label="Pós-encontro"
              note="participação obrigatória"
              detail="19 de agosto, às 19h30"
              location="Igreja Monte Sião Linhares"
            />
          </ul>
        </Section>

        <Section title="Investimento">
          <div className="grid sm:grid-cols-2 gap-4">
            <PriceCard
              role="Encontrista"
              description="Quem vai para receber"
              total="R$ 380,00"
              entry="Entrada de R$ 100,00 no ato da inscrição"
              remainder="Restante até 31 de julho de 2025"
            />
            <PriceCard
              role="Encontreiro"
              description="Quem vai para trabalhar"
              total="R$ 220,00"
              entry="Entrada de R$ 70,00 no ato da inscrição"
              remainder="Restante até 31 de julho de 2025"
            />
          </div>
        </Section>

        <Section title="Requisitos">
          <ul className="space-y-2">
            <li className="flex gap-2">
              <span className="text-blue-500 font-bold shrink-0">•</span>
              Para se inscrever como <strong>encontrista</strong>, você precisa ter a idade mínima
              de <strong>12 anos</strong>.
            </li>
            <li className="flex gap-2">
              <span className="text-blue-500 font-bold shrink-0">•</span>
              Para se inscrever como <strong>encontreiro</strong>, você precisa já ter ido ao
              encontro como encontrista.
            </li>
          </ul>
        </Section>

        <Section title="Pagamento">
          <p>
            O pagamento deve ser feito via site de inscrições, podendo ser realizado via{" "}
            <strong>Pix</strong>, <strong>boleto</strong> ou{" "}
            <strong>cartão de crédito</strong> dividido em até <strong>4x</strong>.
          </p>
          <p className="mt-3 text-sm text-gray-500">
            Dúvidas? Entre em contato com a comunicação:{" "}
            <a
              href="https://wa.me/5527995280013"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline underline-offset-2 hover:text-blue-700"
            >
              +55 27 99528-0013
            </a>
          </p>
        </Section>

        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 leading-relaxed">
          <p className="font-bold mb-1">⚠ Atenção</p>
          <p>
            Sua inscrição só será registrada mediante pagamento da entrada. Em caso de desistência,
            os valores pagos <strong>não serão ressarcidos</strong>.
          </p>
        </div>

        <div className="pt-2 text-center">
          <Link
            href="/inscricao"
            className="inline-block rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 active:scale-[0.98]"
          >
            Voltar para a inscrição
          </Link>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-base font-bold text-gray-800 border-b border-gray-100 pb-2 mb-3">
        {title}
      </h2>
      <div className="text-sm text-gray-600 leading-relaxed">{children}</div>
    </section>
  );
}

function ScheduleItem({
  label,
  note,
  detail,
  location,
  extra,
}: {
  label: string;
  note?: string;
  detail: string;
  location: string;
  extra?: string;
}) {
  return (
    <li className="flex gap-2">
      <span className="text-blue-500 font-bold shrink-0 mt-0.5">•</span>
      <div>
        <p>
          <strong>{label}</strong>
          {note && (
            <span className="ml-1 text-xs font-medium text-orange-600">
              ({note})
            </span>
          )}
          : {detail} — {location}.
        </p>
        {extra && <p className="mt-1 text-gray-500">{extra}</p>}
      </div>
    </li>
  );
}

function PriceCard({
  role,
  description,
  total,
  entry,
  remainder,
}: {
  role: string;
  description: string;
  total: string;
  entry: string;
  remainder: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-1">
      <p className="font-bold text-gray-800">{role}</p>
      <p className="text-xs text-gray-500">{description}</p>
      <p className="text-lg font-extrabold text-blue-600 mt-1">{total}</p>
      <p className="text-xs text-gray-600">{entry}</p>
      <p className="text-xs text-gray-600">{remainder}</p>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const API_BASE = "https://n8n.produtorabg.com/webhook";

type Step = "notice" | "phone" | "otp" | "form";

interface FormData {
  nome_completo: string;
  email: string;
  nome_familiar: string;
  telefone_familiar: string;
  idade: string;
  sexo_biologico: string;
  id_ingresso: string;
  restricoes_alimentares: string;
  restricoes_outro: string;
  alergias: string;
  aceite_termos: boolean;
  cupom: string;
  metodo_pagamento: string;
}

interface Ticket {
  id_ingresso: string;
  nome_ingresso: string;
  desc_ingresso: string;
  valor_cartao: number;
  valor_pix: number;
  max_parcelas_cartao: number;
}

interface CupomState {
  valido: boolean | null;
  desconto: number;
  mensagem: string;
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function toE164(formatted: string): string {
  const digits = formatted.replace(/\D/g, "");
  return `+55${digits}`;
}

function toRaw(formatted: string): string {
  return formatted.replace(/\D/g, "");
}

const STORAGE_KEY = "ecd2026_inscricao";

function loadSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSession(data: object) {
  try {
    console.log("Salvando dados")
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch { }
}

function clearSession() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch { }
}

export default function InscricaoPage() {
  const [step, setStep] = useState<Step>("notice");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [validatedPhone, setValidatedPhone] = useState("");
  const [otp, setOtp] = useState("");

  const [form, setForm] = useState<FormData>({
    nome_completo: "",
    email: "",
    nome_familiar: "",
    telefone_familiar: "",
    idade: "",
    sexo_biologico: "",
    id_ingresso: "",
    restricoes_alimentares: "",
    restricoes_outro: "",
    alergias: "",
    aceite_termos: false,
    cupom: "",
    metodo_pagamento: "pix"
  });


  const [ingressos, setIngressos] = useState<Ticket[]>([]);
  const [precosLoading, setPrecosLoading] = useState(true);
  const [cupomState, setCupomState] = useState<CupomState>({
    valido: null,
    desconto: 0,
    mensagem: ""
  });

  useEffect(() => {
    const saved = loadSession();
    if (!saved) return;
    if (saved.step) setStep(saved.step);
    if (saved.name) setName(saved.name);
    if (saved.phone) setPhone(saved.phone);
    if (saved.validatedPhone) setValidatedPhone(saved.validatedPhone);
    if (saved.form) setForm(saved.form);
  }, []);

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    saveSession({ step, name, phone, validatedPhone, form });
  }, [step, name, phone, validatedPhone, form]);

  useEffect(() => {
    async function fetchPrecos() {
      try {
        const res = await fetch(`${API_BASE}/tabela-precos`);
        const data = await res.json();

        if (data.success && data.tickets) {
          setIngressos(data.tickets);
        } else {
          setError("Não foi possível carregar a tabela de preços.");
        }
      } catch (err) {
        setError("Erro de conexão ao buscar preços.");
        console.error(err);
      } finally {
        setPrecosLoading(false);
      }
    }

    fetchPrecos();
  }, []);

  async function handleRequestOtp(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    console.log("handleRequestOtp", phone, name);
    try {
      const res = await fetch(`${API_BASE}/generate-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone: toRaw(phone) }),
      });
      const data = await res.json();
      console.log("Response:", data);
      if (data.success) {
        setValidatedPhone(phone);
        if (data.valid) {
          setForm((f) => ({ ...f, nome_completo: name }));
          setStep("form");
        } else {
          setStep("otp");
        }
      } else {
        setError(data.mensagem || "Erro ao enviar código.");
      }
    } catch {
      setError("Falha de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  async function handleValidateOtp(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    console.log("Validating OTP for", validatedPhone, "with code", otp);
    try {
      const res = await fetch(`${API_BASE}/validate-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: toE164(validatedPhone), code: otp }),
      });
      const data = await res.json();
      console.log("OTP Validation Response:", data);

      if (data.success) {
        setForm((f) => ({ ...f, nome_completo: name }));
        setStep("form");
      } else {
        setError(data.message || "Código inválido.");
      }
    } catch {
      setError("Falha de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitForm(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Certifique-se de que o endpoint "/inscricao" é o correto no seu n8n
      const res = await fetch(`${API_BASE}/ecd2026-form`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome_completo: form.nome_completo,
          email: form.email,
          telefone: toE164(validatedPhone), // Envia o telefone validado
          nome_familiar: form.nome_familiar,
          telefone_familiar: form.telefone_familiar ? toE164(form.telefone_familiar) : "",
          idade: form.idade,
          sexo_biologico: form.sexo_biologico,
          restricoes_alimentares: form.restricoes_alimentares === "Outras" ? form.restricoes_outro : form.restricoes_alimentares,
          alergias: form.alergias,
          aceite_termos: form.aceite_termos,

          // AS TRÊS VARIÁVEIS CRUCIAIS DA NOVA ARQUITETURA:
          id_ingresso: form.id_ingresso,
          cupom: form.cupom || "",
          metodo_pagamento: "reserva"
          // metodo_pagamento: form.metodo_pagamento
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
          clearSession()

        if (data.redirect_to) {
          window.location.href = data.redirect_to;
        } else {
          window.location.href = "/obrigado-confirmado";
        }
      } else {
        setError(data.message || "Ocorreu um erro ao processar a inscrição.");
      }
    } catch (err) {
      setError("Erro ao enviar inscrição.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fdf1e6] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black">Encontro com Deus 2026</h1>
          <p className="text-black mt-1 text-sm">Igreja Monte Sião Linhares</p>
          {step !== "notice" && <StepIndicator step={step} />}
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
              <span className="mt-0.5 shrink-0">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {step === "notice" && (
            <NoticeStep onContinue={() => setStep("phone")} />
          )}

          {step === "phone" && (
            <PhoneStep
              name={name}
              phone={phone}
              loading={loading}
              onNameChange={setName}
              onPhoneChange={(v) => setPhone(formatPhone(v))}
              onSubmit={handleRequestOtp}
            />
          )}

          {step === "otp" && (
            <OtpStep
              phone={validatedPhone}
              otp={otp}
              loading={loading}
              onOtpChange={setOtp}
              onSubmit={handleValidateOtp}
              onBack={() => {
                setStep("phone");
                setError("");
                setOtp("");
              }}
            />
          )}

          {step === "form" && (
            <MainForm
              form={form}
              phone={validatedPhone}
              tickets={ingressos}
              precosLoading={precosLoading}
              loading={loading}
              onBack={() => setStep("phone")}
              onChange={(field, value) =>
                setForm((f) => ({ ...f, [field]: value }))
              }
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmitForm(e);
              }}
            />
          )}

          {/* {step === "payment" && (
            <PaymentStep
              form={form}
              ingressos={ingressos}
              cupomState={cupomState}
              setCupomState={setCupomState}
              onChange={(field, value) => setForm((f) => ({ ...f, [field]: value }))}
              onSubmit={handleSubmitForm}
              onBack={() => setStep("form")}
              loading={loading}
            />
          )} */}
        </div>
      </div>
    </div>
  );
}

function PaymentStep({
  form,
  ingressos,
  cupomState,
  setCupomState,
  onChange,
  onSubmit,
  onBack,
  loading,
}: {
  form: FormData;
  ingressos: Ticket[];
  cupomState: CupomState;
  setCupomState: React.Dispatch<React.SetStateAction<CupomState>>;
  onChange: (field: keyof FormData, value: string | boolean) => void;
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  onBack: () => void;
  loading: boolean;
}) {
  const [validandoCupom, setValidandoCupom] = useState(false);

  // 1. Encontrar o ingresso selecionado
  const ingressoSelecionado = ingressos.find((i) => i.id_ingresso === form.id_ingresso);

  // 2. Definir o preço base mediante o método de pagamento
  let precoBase = 0;
  if (ingressoSelecionado) {
    if (form.metodo_pagamento === "pix") precoBase = ingressoSelecionado.valor_pix;
    else if (form.metodo_pagamento === "cartao") precoBase = ingressoSelecionado.valor_cartao;
    else precoBase = ingressoSelecionado.valor_pix; // Preço padrão antes de escolher
  }

  // 3. Calcular desconto visual
  const valorDesconto = cupomState.valido ? precoBase * (cupomState.desconto / 100) : 0;
  const precoFinal = precoBase - valorDesconto;

  // 4. Função para validar o cupão no n8n
  const handleValidarCupom = async () => {
    if (!form.cupom) return;
    setValidandoCupom(true);
    try {
      const res = await fetch(`${API_BASE}/validar-cupom`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cupom: form.cupom }),
      });
      const data = await res.json();

      if (data.valid && data.success) {
        setCupomState({ valido: true, desconto: data.amount, mensagem: "Cupom aplicado!" });
      } else {
        setCupomState({ valido: false, desconto: 0, mensagem: data.message || "Cupom inválido." });
        onChange("cupom", "")
      }
    } catch (err) {
      setCupomState({ valido: false, desconto: 0, mensagem: "Erro ao validar cupom." });
      onChange("cupom", "")
    } finally {
      setValidandoCupom(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      {/* Resumo do Ingresso */}
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Resumo da Inscrição</h3>
        <p className="text-gray-900 font-medium">
          {ingressoSelecionado ? ingressoSelecionado.nome_ingresso : "Ingresso não selecionado"}
        </p>
      </div>

      {/* Secção de Cupão */}
      <Field label="Tem um cupom de desconto?">
        <div className="flex gap-2">
          <input
            type="text"
            value={form.cupom}
            onChange={(e) => onChange("cupom", e.target.value.toUpperCase())}
            placeholder="Ex: LIDERANCA10"
            className="input font-mono uppercase flex-1"
            disabled={cupomState.valido === true}
          />
          <button
            type="button"
            onClick={handleValidarCupom}
            disabled={!form.cupom || validandoCupom || cupomState.valido === true}
            className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-50"
          >
            {validandoCupom ? "A validar..." : cupomState.valido ? "Aplicado" : "Aplicar"}
          </button>
        </div>
        {cupomState.mensagem && (
          <p className={`text-xs mt-1 font-medium ${cupomState.valido ? "text-green-600" : "text-red-600"}`}>
            {cupomState.mensagem}
          </p>
        )}
      </Field>

      {/* Escolha do Método de Pagamento */}
      <Field label="Método de Pagamento">
        <div className="grid grid-cols-2 gap-3">
          <label className={`border rounded-xl p-4 cursor-pointer flex flex-col items-center gap-2 transition-all ${form.metodo_pagamento === "pix" ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600" : "border-gray-200 hover:border-gray-300"}`}>
            <input type="radio" name="pagamento" value="pix" className="sr-only" onChange={() => onChange("metodo_pagamento", "pix")} />
            <span className="font-semibold text-gray-900">Pix</span>
            {ingressoSelecionado && (
              <span className="text-xs text-green-600 font-medium">Mais barato</span>
            )}
          </label>

          <label className={`border rounded-xl p-4 cursor-pointer flex flex-col items-center gap-2 transition-all ${form.metodo_pagamento === "cartao" ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600" : "border-gray-200 hover:border-gray-300"}`}>
            <input type="radio" name="pagamento" value="cartao" className="sr-only" onChange={() => onChange("metodo_pagamento", "cartao")} />
            <span className="font-semibold text-gray-900">Cartão</span>
            {ingressoSelecionado && (
              <span className="text-xs text-gray-500">Até {ingressoSelecionado.max_parcelas_cartao}x</span>
            )}
          </label>
        </div>
      </Field>

      {/* Total Visual */}
      {form.metodo_pagamento && (
        <div className="flex justify-between items-end py-4 border-t border-gray-100">
          <span className="text-gray-600 font-medium">Total a pagar:</span>
          <div className="text-right">
            {cupomState.valido && (
              <span className="text-sm text-gray-400 line-through mr-2">
                R$ {precoBase.toFixed(2)}
              </span>
            )}
            <span className="text-2xl font-bold text-gray-900">
              R$ {precoFinal.toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {/* Botão Final */}
      <div className="flex flex-col gap-3 pt-2">
        <SubmitButton
          loading={loading}
          disabled={!form.metodo_pagamento}
          label={!form.metodo_pagamento ? "Selecione o pagamento" : "Finalizar Inscrição"}
        />

        {/* NOVO BOTÃO DE VOLTAR */}
        <button
          type="button"
          disabled={loading}
          onClick={onBack}
          className="w-full text-sm text-gray-500 hover:text-gray-800 transition-colors py-2 font-medium"
        >
          ← Voltar para editar dados
        </button>
      </div>
    </form>
  );
}

function StepIndicator({ step }: { step: Exclude<Step, "notice"> }) {
  const steps = ["phone", "otp", "form"] as const;
  const index = steps.indexOf(step);
  const labels = ["Telefone", "Código", "Dados"];
  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${i <= index
                ? "bg-[#f8ba88] text-white"
                : "bg-[#a46c40] text-white"
              }`}
          >
            {i < index ? "✓" : i + 1}
          </div>
          <span
            className={`text-xs hidden sm:block ${i <= index ? "text-black" : "text-black"
              }`}
          >
            {labels[i]}
          </span>
          {i < steps.length - 1 && (
            <div
              className={`w-6 h-px mx-1 ${i < index ? "bg-[#f8ba88]" : "bg-[#f8ba88]"
                }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function NoticeStep({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Encontro Suspenso</h2>
        <p className="text-gray-500 text-sm mt-3 leading-relaxed">
          Infelizmente, precisamos cancelar o nosso Encontro com Deus. Não
          tivemos inscrições suficientes e, por isso, vamos suspender o
          encontro por enquanto. Manteremos uma lista de interessados e,
          dependendo de como ela evoluir, remarcaremos o evento e
          divulgaremos uma nova data em breve.
        </p>
        <p className="text-gray-500 text-sm mt-3 leading-relaxed">
          Você ainda pode reservar a sua vaga para o encontro, entraremos em
          contato quando tivermos mais informações.
        </p>
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-white font-semibold text-sm transition-all hover:bg-blue-700 active:scale-[0.98]"
      >
        Fazer reserva
      </button>
    </div>
  );
}

function PhoneStep({
  name,
  phone,
  loading,
  onNameChange,
  onPhoneChange,
  onSubmit,
}: {
  name: string;
  phone: string;
  loading: boolean;
  onNameChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Validação de WhatsApp</h2>
        <p className="text-gray-500 text-sm mt-1">
          Enviaremos um código de 4 dígitos para confirmar seu número.
        </p>
      </div>

      <Field label="Seu nome completo">
        <input
          type="text"
          required
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="João da Silva"
          className="input"
        />
      </Field>

      <Field label="WhatsApp (com DDD)">
        <input
          type="tel"
          required
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          placeholder="(27) 99999-9999"
          className="input"
        />
      </Field>

      <SubmitButton loading={loading} label="Receber Código" />
    </form>
  );
}

function OtpStep({
  phone,
  otp,
  loading,
  onOtpChange,
  onSubmit,
  onBack,
}: {
  phone: string;
  otp: string;
  loading: boolean;
  onOtpChange: (v: string) => void;
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  onBack: () => void;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Confirme o Código</h2>
        <p className="text-gray-500 text-sm mt-1">
          Enviamos um código para{" "}
          <span className="font-medium text-gray-700">{phone}</span> via
          WhatsApp.
        </p>
      </div>

      <Field label="Código de 4 dígitos">
        <input
          type="text"
          required
          inputMode="numeric"
          maxLength={4}
          value={otp}
          onChange={(e) =>
            onOtpChange(e.target.value.replace(/\D/g, "").slice(0, 4))
          }
          placeholder="0000"
          className="input text-center text-2xl tracking-[0.5em] font-mono"
        />
      </Field>

      <SubmitButton loading={loading} label="Validar Código" />

      <button
        type="button"
        onClick={onBack}
        className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors mt-1"
      >
        ← Alterar número
      </button>
    </form>
  );
}

function MainForm({
  form,
  phone,
  loading,
  onBack,
  tickets,
  precosLoading,
  onChange,
  onSubmit,
}: {
  form: FormData;
  phone: string;
  loading: boolean;
  tickets: Ticket[];
  onBack: () => void;
  precosLoading: boolean;
  onChange: (field: keyof FormData, value: string | boolean) => void;
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
}) {
  const ingressoSelecionado = tickets.find((ing) => ing.id_ingresso === form.id_ingresso);
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Dados da Inscrição</h2>
        <p className="text-gray-500 text-sm mt-1">
          Preencha os campos abaixo para finalizar.
        </p>
      </div>

      <Field label="Nome completo">
        <input
          type="text"
          required
          value={form.nome_completo}
          onChange={(e) => onChange("nome_completo", e.target.value)}
          placeholder="João da Silva"
          className="input"
        />
      </Field>

      <Field label="E-mail">
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => onChange("email", e.target.value)}
          placeholder="joao@email.com"
          className="input"
        />
      </Field>

      <Field label="WhatsApp validado">
        <input
          type="text"
          value={phone}
          readOnly
          className="input bg-gray-50 text-gray-400 cursor-not-allowed"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Sexo biológico">
          <select
            required
            value={form.sexo_biologico}
            onChange={(e) => onChange("sexo_biologico", e.target.value)}
            className="input"
          >
            <option value="">Selecionar</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
          </select>
        </Field>

        <Field label="Idade">
          <input
            type="number"
            required
            min={1}
            max={120}
            value={form.idade}
            onChange={(e) => onChange("idade", e.target.value)}
            placeholder="Ex: 28"
            className="input"
          />
        </Field>
      </div>

      <Field label="Tipo de ingresso">
        <select
          required
          value={form.id_ingresso}
          onChange={(e) => onChange("id_ingresso", e.target.value)}
          disabled={precosLoading}
          className="input"
        >
          <option value="">
            {precosLoading ? "A carregar ingressos..." : "Selecionar"}
          </option>
          {tickets.map((ing) => (
            <option key={ing.id_ingresso} value={ing.id_ingresso}>
              {ing.nome_ingresso}
            </option>
          ))}
        </select>
        <p className="text-gray-500 text-sm mt-1">
          {ingressoSelecionado
            ? ingressoSelecionado.desc_ingresso
            : "Selecione um ingresso para ver os detalhes."}
        </p>
      </Field>

      <div className="border-t border-gray-100 pt-4">
        <p className="text-sm font-semibold text-gray-600 mb-3">
          Familiar / Contao Emergência
        </p>
        <div className="space-y-4">
          <Field label="Nome do familiar">
            <input
              type="text"
              value={form.nome_familiar}
              onChange={(e) => onChange("nome_familiar", e.target.value)}
              placeholder="Maria da Silva"
              className="input"
            />
          </Field>
          <Field label="Telefone do familiar">
            <input
              type="tel"
              value={form.telefone_familiar}
              onChange={(e) =>
                onChange("telefone_familiar", formatPhone(e.target.value))
              }
              placeholder="(27) 99999-9999"
              className="input"
            />
          </Field>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <p className="text-sm font-semibold text-gray-600 mb-3">Saúde</p>
        <div className="space-y-4">
          <Field label="Restrições alimentares">
            <select
              value={form.restricoes_alimentares}
              onChange={(e) =>
                onChange("restricoes_alimentares", e.target.value)
              }
              className="input"
            >
              <option value="">Selecionar</option>
              <option value="Nenhuma">Nenhuma</option>
              <option value="Vegetariano">Vegetariano</option>
              <option value="Vegano">Vegano</option>
              <option value="Sem glúten">Sem glúten</option>
              <option value="Sem lactose">Sem lactose</option>
              <option value="Outro">Outro</option>
            </select>
          </Field>
          {form.restricoes_alimentares === "Outro" && (
            <Field label="Especifique a restrição">
              <input
                type="text"
                required
                value={form.restricoes_outro}
                onChange={(e) => onChange("restricoes_outro", e.target.value)}
                placeholder="Descreva sua restrição"
                className="input"
              />
            </Field>
          )}
          <Field label="Alergias">
            <input
              type="text"
              value={form.alergias}
              onChange={(e) => onChange("alergias", e.target.value)}
              placeholder="Ex: Amendoim, Frutos do mar... ou Nenhuma"
              className="input"
            />
          </Field>
        </div>
      </div>

      <div className="flex items-start gap-3 pt-1">
        <input
          type="checkbox"
          id="termos"
          required
          checked={form.aceite_termos}
          onChange={(e) => onChange("aceite_termos", e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 cursor-pointer"
        />
        <label
          htmlFor="termos"
          className="text-sm text-gray-600 cursor-pointer leading-snug"
        >
          Li e concordo com os{" "}
          <Link
            href="/termos"
            rel="noopener noreferrer"
            className="text-blue-600 underline underline-offset-2 hover:text-blue-700"
          >
            termos e condições
          </Link>{" "}
          do evento.
        </label>
      </div>

      <SubmitButton loading={loading} label="Ir para Pagamento" />
      <button
        type="button"
        onClick={onBack}
        className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors mt-1"
      >
        ← Alterar número
      </button>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}

function SubmitButton({
  loading,
  label,
  disabled = false,
}: {
  loading: boolean;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-white font-semibold text-sm transition-all hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
    >
      {loading ? (
        <>
          <Spinner />
          Aguarde...
        </>
      ) : (
        label
      )}
    </button>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

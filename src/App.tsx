import { motion } from "motion/react";
import {
  Bot,
  Cloud,
  RefreshCw,
  Target,
  Users,
  Wrench,
  Instagram,
  Youtube,
  MessageCircle,
  Plane,
} from "lucide-react";

const BENTO_FEATURES = [
  {
    id: 1,
    title: "Diagnósticos IA",
    description: "Descubra com precisão por que o seu avião derriva ou estola. A IA analisa os sintomas e entrega a causa exata.",
    icon: <Bot className="w-5 h-5 text-[#F27D26]" />,
  },
  {
    id: 2,
    title: "Setup por IA",
    description: "Configuração de rádio automática. Responda perguntas simples e receba o setup ideal para o seu modelo.",
    icon: <Wrench className="w-5 h-5 text-[#F27D26]" />,
  },
  {
    id: 3,
    title: "Comunidade de Pilotos",
    description: "Conecte-se com outros pilotos de RC em tempo real. Troque experiências, tire dúvidas e evolua junto.",
    icon: <Users className="w-5 h-5 text-[#F27D26]" />,
  },
  {
    id: 4,
    title: "14 Missões Estruturadas",
    description: "Uma trilha de progressão clara, do solo ao ar. Cumpra missões e evolua suas habilidades com segurança.",
    icon: <Target className="w-5 h-5 text-[#F27D26]" />,
  },
  {
    id: 5,
    title: "Hangar na Nuvem",
    description: "Tenha todos os seus aeromodelos, helicópteros e drones sincronizados e organizados em um só lugar.",
    icon: <Cloud className="w-5 h-5 text-[#F27D26]" />,
  },
  {
    id: 6,
    title: "10 Análises IA/mês",
    description: "Suas análises de voo e setup renovam automaticamente todo mês para você continuar voando com inteligência.",
    icon: <RefreshCw className="w-5 h-5 text-[#F27D26]" />,
  },
];

export default function App() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] font-sans selection:bg-[#F27D26] selection:text-white pb-20 relative overflow-hidden flex flex-col justify-between">
      {/* Background Decorative Element */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#F27D26] opacity-10 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-[1024px] mx-auto px-6 sm:px-10 pt-10">
        
        {/* Top Navigation/Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-center z-10 mb-16 gap-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F27D26] flex items-center justify-center font-black text-black text-xl italic">
              V+
            </div>
            <span className="text-2xl font-bold tracking-tighter uppercase">VOO+</span>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#F27D26] rounded-full animate-pulse"></span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#F27D26]">Status: Preparando Decolagem</span>
            </div>
            <div className="px-4 py-1 border border-white/20 rounded-full text-[11px] uppercase tracking-widest font-medium">
              Lançamento em breve
            </div>
          </div>
        </motion.header>

        {/* Hero Section */}
        <motion.main 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="z-10 mt-6 mb-20"
        >
          <div className="max-w-3xl">
            <h2 className="text-5xl md:text-7xl font-extrabold leading-[0.9] tracking-tighter uppercase mb-6">
              O seu hangar <br className="hidden md:block" /> inteligente <span className="text-[#F27D26]">quase</span> pronto.
            </h2>
            <p className="mt-6 text-lg text-white/60 font-light max-w-xl leading-relaxed mb-8">
              Estamos finalizando a integração das ferramentas de Inteligência Artificial e garantindo que tudo funcione perfeitamente. 
              Como comprador do <strong className="text-white font-medium">Meu Aeromodelo PRO</strong>, suas ferramentas garantidas já estão reservadas.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a 
                href="#comunidade"
                className="w-full sm:w-auto bg-[#F27D26] text-black px-8 py-4 sm:py-3 font-bold uppercase text-sm flex items-center justify-center gap-4 hover:bg-white transition-colors"
              >
                ENTRAR NO GRUPO VIP
                <span className="text-xl">→</span>
              </a>
              <a 
                href="#features"
                className="w-full sm:w-auto px-8 py-4 sm:py-3 bg-transparent border border-white/20 hover:border-white/40 text-[#F5F5F5] font-bold uppercase text-sm flex items-center justify-center gap-2 transition-colors"
              >
                VER FERRAMENTAS
              </a>
            </div>
          </div>
        </motion.main>

        {/* The 6 Promises Contract */}
        <motion.div 
          id="features"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-24 relative z-10"
        >
          <div className="mb-8">
            <h3 className="text-2xl font-bold tracking-tighter uppercase mb-2">O Seu Contrato Conosco</h3>
            <p className="text-white/60 font-light">Assim que o Voo+ for liberado, você terá acesso imediato a estas 6 funções.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {BENTO_FEATURES.map((feature, i) => (
              <motion.div 
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (i * 0.05) }}
                className="bg-white/5 border border-white/10 p-5 group hover:border-[#F27D26]/50 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-[#F27D26] text-xs font-mono uppercase tracking-tighter">
                    0{i+1}.
                  </div>
                  {feature.icon}
                </div>
                <h4 className="font-bold text-lg mb-1 tracking-tight">{feature.title}</h4>
                <p className="text-sm text-white/40 leading-tight">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Social / Waiting CTA */}
        <motion.div 
          id="comunidade"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 border border-white/10 p-8 md:p-12 z-10 relative"
        >
          <h3 className="text-2xl font-bold tracking-tighter uppercase mb-4">Mantenha a ansiedade no ar</h3>
          <p className="text-white/60 font-light max-w-2xl mb-8">
            Enquanto ajustamos os últimos fios do ESC e calibramos o CG do Voo+, 
            junte-se ao nosso grupo silencioso de avisos no WhatsApp e siga nossos bastidores.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="https://chat.whatsapp.com/CV09cxERRZv9DtAw5PQth0" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 px-6 py-4 sm:py-3 bg-[#25D366] hover:bg-[#20b858] text-black font-bold uppercase text-sm transition-colors border border-transparent">
              <MessageCircle className="w-5 h-5" />
              Notificação VIP
            </a>
            <a href="https://www.instagram.com/auladeaeromodelismo/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 px-6 py-4 sm:py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold uppercase text-sm transition-colors">
              <Instagram className="w-4 h-4 text-[#F27D26]" />
              Instagram
            </a>
            <a href="https://www.youtube.com/c/AulasdeAeromodelismo" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 px-6 py-4 sm:py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold uppercase text-sm transition-colors">
              <Youtube className="w-4 h-4 text-[#F27D26]" />
              YouTube
            </a>
          </div>
        </motion.div>

      </div>
      
      {/* Bottom Text Ornament */}
      <div className="absolute bottom-[-20px] sm:bottom-[-50px] right-[-10px] sm:right-[-20px] rotate-[-2deg] opacity-[0.03] select-none pointer-events-none z-0">
        <span className="text-[100px] sm:text-[280px] font-black italic tracking-tighter leading-none uppercase">FLIGHT</span>
      </div>
    </div>
  );
}


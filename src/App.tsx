import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  ShieldCheck, 
  GraduationCap, 
  ArrowRight, 
  Menu, 
  X, 
  CheckCircle2, 
  MessageSquare, 
  Database,
  Globe,
  Mail,
  Locate,
  Phone,
  Send,
  Loader2,
  Sparkles,
  Search,
  LayoutGrid,
  Scale,
  Users2,
  Lock,
  Leaf,
  Briefcase,
  FileSearch,
  Target
} from 'lucide-react';
import { cn } from './lib/utils';
import { GoogleGenAI } from "@google/genai";

const CLIENTS = [
  'MINISTERIO DE EDUCACIÓN',
  'CONSEJO SUPERIOR JUDICATURA',
  'ALCALDÍA DE BOGOTÁ',
  'ALCALDÍA GRANADA META',
  'POLICÍA NACIONAL',
  'DANE',
  'SUPERFINANCIERA',
  'SUPERSERVICIOS',
  'CONTALORÍA STA MARTA',
  'UAESP',
  'FNA',
  'SNT'
];

const ISO_LIST = [
  { 
    code: 'ISO 9001', 
    name: { ES: 'Gestión de Calidad', EN: 'Quality Management' },
    purpose: { ES: 'Estandarizar procesos para asegurar la satisfacción del cliente.', EN: 'Standardize processes to ensure customer satisfaction.' },
    benefits: { ES: ['Mejora la eficiencia', 'Reconocimiento internacional', 'Reducción de errores'], EN: ['Better efficiency', 'International recognition', 'Error reduction'] }
  },
  { 
    code: 'ISO 27001', 
    name: { ES: 'Seguridad de la Información', EN: 'Information Security' },
    purpose: { ES: 'Proteger la integridad, confidencialidad y disponibilidad de los datos.', EN: 'Protect the integrity, confidentiality, and availability of data.' },
    benefits: { ES: ['Protección contra ciberataques', 'Cumplimiento legal', 'Confianza del cliente'], EN: ['Cyberattack protection', 'Legal compliance', 'Customer trust'] }
  },
  { 
    code: 'ISO 45001', 
    name: { ES: 'Salud y Seguridad en el Trabajo', EN: 'Occupational Health & Safety' },
    purpose: { ES: 'Prevenir lesiones y enfermedades relacionadas con el trabajo.', EN: 'Prevent work-related injuries and illnesses.' },
    benefits: { ES: ['Reducción de ausentismo', 'Cultura de seguridad', 'Mejor clima laboral'], EN: ['Reduced absenteeism', 'Safety culture', 'Better work climate'] }
  },
  { 
    code: 'ISO 14001', 
    name: { ES: 'Gestión Ambiental', EN: 'Environmental Management' },
    purpose: { ES: 'Gestionar el impacto ambiental de la organización.', EN: 'Manage the environmental impact of the organization.' },
    benefits: { ES: ['Ahorro de recursos', 'Mejora de imagen verde', 'Cumplimiento normativo'], EN: ['Resource savings', 'Improved green image', 'Regulatory compliance'] }
  },
  { 
    code: 'ISO 37001', 
    name: { ES: 'Sistemas Antisoborno', EN: 'Anti-bribery Systems' },
    purpose: { ES: 'Prevenir y detectar el soborno en la organización.', EN: 'Prevent and detect bribery in the organization.' },
    benefits: { ES: ['Transparencia total', 'Mitigación de riesgos legales', 'Ética corporativa'], EN: ['Total transparency', 'Legal risk mitigation', 'Corporate ethics'] }
  },
  { 
    code: 'ISO 22301', 
    name: { ES: 'Continuidad del Negocio', EN: 'Business Continuity' },
    purpose: { ES: 'Asegurar que el negocio no se detenga ante crisis.', EN: 'Ensure the business doesn\'t stop during a crisis.' },
    benefits: { ES: ['Resiliencia operativa', 'Protección de reputación', 'Ventaja competitiva'], EN: ['Operational resilience', 'Reputation protection', 'Competitive advantage'] }
  },
  { 
    code: 'ISO 50001', 
    name: { ES: 'Gestión de la Energía', EN: 'Energy Management' },
    purpose: { ES: 'Optimizar el uso de energía para reducir costos.', EN: 'Optimize energy use to reduce costs.' },
    benefits: { ES: ['Reducción de consumo', 'Menor huella de carbono', 'Eficiencia financiera'], EN: ['Reduced consumption', 'Lower carbon footprint', 'Financial efficiency'] }
  },
  { 
    code: 'ISO 31000', 
    name: { ES: 'Gestión de Riesgos', EN: 'Risk Management' },
    purpose: { ES: 'Identificar y mitigar amenazas antes de que ocurran.', EN: 'Identify and mitigate threats before they occur.' },
    benefits: { ES: ['Previsión estratégica', 'Protección de activos', 'Decisiones informadas'], EN: ['Strategic foresight', 'Asset protection', 'Informed decisions'] }
  }
];

function Modal({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-brutalist-black/80 backdrop-blur-sm" 
      />
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="relative bg-white border-4 border-brutalist-black shadow-brutalist-lg w-full max-w-2xl overflow-hidden"
      >
        <div className="bg-brutalist-black text-white p-4 flex justify-between items-center">
          <h3 className="text-xl font-display font-black uppercase italic tracking-tight">{title}</h3>
          <button onClick={onClose} className="hover:text-brutalist-yellow transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-8 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

const SERVICES = [
  {
    id: 'consulting',
    icon: Building2,
    title: { ES: 'Consultoría Estratégica', EN: 'Strategic Consulting' },
    desc: { 
      ES: 'Acompañamos la toma de decisiones con datos reales y marcos normativos actualizados.',
      EN: 'We support decision-making with real data and updated regulatory frameworks.'
    },
    features: {
      ES: ['Estructuración de procesos', 'Auditoría interna', 'Gestión de riesgos', 'Compliance público'],
      EN: ['Process structuring', 'Internal audit', 'Risk management', 'Public compliance']
    },
    color: 'bg-brutalist-blue/10'
  },
  {
    id: 'audit',
    icon: ShieldCheck,
    title: { ES: 'Certificación ISO', EN: 'ISO Certification' },
    desc: {
      ES: 'Expertos en llevar su organización a los más altos estándares internacionales.',
      EN: 'Experts in bringing your organization to the highest international standards.'
    },
    features: {
      ES: ['ISO 9001, 27001, 45001', 'Sistemas Antisoborno 37001', 'Continuidad del negocio', 'Auditorías de brecha'],
      EN: ['ISO 9001, 27001, 45001', 'Anti-bribery 37001', 'Business continuity', 'Gap audits']
    },
    color: 'bg-brutalist-yellow/10'
  },
  {
    id: 'training',
    icon: GraduationCap,
    title: { ES: 'Capacitación EVA', EN: 'EVA Training' },
    desc: {
      ES: 'Formación técnica y ejecutiva para equipos de alto rendimiento.',
      EN: 'Technical and executive training for high-performance teams.'
    },
    features: {
      ES: ['Plataforma LMS propia', 'Certificaciones técnicas', 'Webinars en vivo', 'Contenido on-demand'],
      EN: ['Proprietary LMS platform', 'Technical certifications', 'Live webinars', 'On-demand content']
    },
    color: 'bg-brutalist-red/10'
  }
];

const SOLUTIONS = [
  {
    title: 'LICITUS AI',
    subtitle: 'End-to-End GovCon',
    desc: {
      ES: 'Solución integral para dominar el SECOP II. Desde el radar de oportunidades hasta la gestión inteligente de la oferta con IA.',
      EN: 'Integral solution to dominate SECOP II. From opportunities radar to bid intelligent management with AI.'
    },
    tags: ['GovTech', 'AI', 'Big Data'],
    cta: { ES: 'Explorar Licitus', EN: 'Explore Licitus' }
  },
  {
    title: 'EVA LMS',
    subtitle: 'Virtual Education Platform',
    desc: {
      ES: 'Plataforma de educación y formación virtual diseñada para estandarizar procesos y capacitar personal en normatividad vigente y procesos ISO.',
      EN: 'E-learning platform designed to standardize processes and train personnel in current regulations and ISO processes.'
    },
    tags: ['EdTech', 'ISO', 'Training'],
    cta: { ES: 'Ver Demo EVA', EN: 'View EVA Demo' }
  }
];

function Chatbot() {
  const [messages, setMessages] = useState<{role: 'user'|'bot', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            role: "user",
            parts: [{ text: `Eres el experto consultor de B&A Consulting.
            CONTEXTO CORPORATIVO:
            - 25 años de experiencia en sector público y privado en LATAM.
            - Expertos en Modernización del Estado, Gobernanza, Ética y Compliance.
            - Productos Estrella: 
              1. LICITUS: Inteligencia para SECOP II (Radar de oportunidades, Bid Pricer, Análisis de Viabilidad).
              2. EVA: Plataforma E-learning para capacitación organizacional y certificación ISO.
            - Portafolio ISO Completo: 9001, 27001, 45001, 37001, 14001, 22301, 50001, 31000, 20000.
            - Especialidades: MIPG, SAGRILAFT, SST, Gestión de Riesgos, Diversidad e Inclusión (NTC 6626).
            - Clientes: Ministerios, Alcaldías, Policía Nacional, etc.
            - Contacto WhatsApp Sebastián: +57 3043283237.
            
            ESTILO DE RESPUESTA:
            - Profesional, audaz (brutalista), eficiente.
            - Idioma: Responde en el mismo idioma en que te hablen.
            - Objetivo: Agendar una cita o redireccionar a WhatsApp.
            
            Usuario pregunta: ${userMsg}` }]
          }
        ]
      });
      
      setMessages(prev => [...prev, { role: 'bot', text: response.text || "Lo siento, tuve un problema procesando tu mensaje." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "Error de conexión con Gemini. Por favor intenta más tarde." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-brutalist-yellow border-2 border-brutalist-black p-4 shadow-brutalist hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-6 w-[350px] max-w-[calc(100vw-3rem)] h-[500px] bg-white border-2 border-brutalist-black shadow-brutalist-lg z-50 flex flex-col"
          >
            <div className="bg-brutalist-black text-white p-4 font-display font-black uppercase text-sm flex justify-between items-center">
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-brutalist-yellow" />
                B&A AI ASSISTANT
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-brutalist-paper/30">
              {messages.length === 0 && (
                <div className="bg-brutalist-blue/10 border-2 border-dashed border-brutalist-blue p-4 text-xs font-bold text-brutalist-blue uppercase">
                  Hola! Soy la IA de B&A. ¿En qué puedo ayudarte hoy con consultoría, capacitación y/o auditoría? ¿Quieres entrar en la lista de espera de Licitus y EVA? 
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={cn(
                  "p-3 text-xs border-2 border-brutalist-black font-bold max-w-[85%]",
                  m.role === 'user' ? "ml-auto bg-brutalist-yellow text-brutalist-black" : "mr-auto bg-white"
                )}>
                  {m.text}
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-2 p-2">
                  <div className="w-2 h-2 bg-brutalist-black animate-bounce" />
                  <div className="w-2 h-2 bg-brutalist-black animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-brutalist-black animate-bounce [animation-delay:0.4s]" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t-2 border-brutalist-black bg-white">
              <div className="relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="ESCRIBE TU DUDA..."
                  className="w-full bg-white border-2 border-brutalist-black p-2 pr-10 text-xs font-bold uppercase focus:outline-none focus:bg-brutalist-yellow/10"
                />
                <button 
                  onClick={handleSend}
                  disabled={isTyping}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-brutalist-black hover:text-brutalist-blue disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Marquee({ items }: { items: string[] }) {
  return (
    <div className="w-full overflow-hidden whitespace-nowrap bg-white border-y-2 border-brutalist-black py-8 relative">
      <motion.div 
        animate={{ x: [0, -1000] }}
        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
        className="inline-block"
      >
        {[...items, ...items, ...items].map((item, i) => (
          <span key={i} className="mx-8 font-display font-black text-2xl opacity-40 hover:opacity-100 transition-opacity cursor-default grayscale hover:grayscale-0">
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

const DETAILED_SERVICES = [
  {
    title: { ES: 'Gestión Pública & MIPG', EN: 'Public Management & MIPG' },
    icon: LayoutGrid,
    items: ['ISO 9001:2015', 'Modelos MIPG', 'Control Interno', 'Gobernanza']
  },
  {
    title: { ES: 'Ética & Compliance', EN: 'Ethics & Compliance' },
    icon: Scale,
    items: ['ISO 37001 Antisoborno', 'ISO 37301 Compliance', 'SAGRILAFT', 'Transparencia']
  },
  {
    title: { ES: 'Diversidad & Inclusión', EN: 'Diversity & Inclusion' },
    icon: Users2,
    items: ['NTC 6626 Sello Oro', 'Equidad de Género', 'Derechos Humanos', 'Clima Laboral']
  },
  {
    title: { ES: 'Seguridad de Información', EN: 'Information Security' },
    icon: Lock,
    items: ['ISO 27001', 'Seguridad TI', 'Continuidad Negocio', 'Ciberseguridad']
  },
  {
    title: { ES: 'Sostenibilidad & SIG', EN: 'Sustainability & SIG' },
    icon: Leaf,
    items: ['ISO 14001', 'ISO 46001 (Agua)', 'ISO 50001 (Energía)', 'Gestión Ambiental']
  },
  {
    title: { ES: 'Sectores Especializados', EN: 'Specialized Sectors' },
    icon: Briefcase,
    items: ['ISO 22000 Alimentos', 'ISO 21401 Turismo', 'ISO 34101 Cacao', 'ISO 35001 Bioriesgo']
  }
];

const FAQ_DATA = {
  ES: [
    { q: "¿Qué es LICITUS AI?", a: "Es nuestra plataforma de Decision Intelligence que optimiza la contratación pública. Usa IA para detectar oportunidades en SECOP II y calcular la viabilidad mediante un score preciso." },
    { q: "¿En qué consiste la plataforma EVA?", a: "EVA es nuestro entorno virtual de aprendizaje diseñado para estandarizar procesos y capacitar equipos en normativas ISO y gestión organizacional de forma dinámica." },
    { q: "¿Qué normas ISO certifican?", a: "Somos expertos en un amplio portafolio que incluye ISO 9001 (Calidad), 27001 (Seguridad), 45001 (SST), 14001 (Ambiental), 37001 (Antisoborno) y más." },
    { q: "¿Cuál es el tiempo promedio de una consultoría?", a: "Depende de la complejidad del proyecto, pero típicamente oscila entre 3 a 6 meses para implementaciones integrales de sistemas de gestión." }
  ],
  EN: [
    { q: "What is LICITUS AI?", a: "It is our Decision Intelligence platform that optimizes public procurement. It uses AI to detect opportunities in SECOP II and calculate viability through a precise score." },
    { q: "What is the EVA platform?", a: "EVA is our virtual learning environment designed to standardize processes and train teams in ISO regulations and organizational management dynamically." },
    { q: "Which ISO standards do you certify?", a: "We are experts in a wide portfolio including ISO 9001 (Quality), 27001 (Security), 45001 (S&H), 14001 (Environmental), 37001 (Anti-bribery), and more." },
    { q: "What is the average consulting time?", a: "It depends on the complexity of the project, but it typically ranges from 3 to 6 months for comprehensive management system implementations." }
  ]
};

function FAQItem({ q, a }: { q: string, a: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-2 border-brutalist-black mb-4 bg-white shadow-brutalist hover:shadow-brutalist-hover transition-all">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 text-left flex justify-between items-center group"
      >
        <span className="font-display font-black uppercase text-sm md:text-base">{q}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="bg-brutalist-black text-white p-1"
        >
          <ArrowRight className="h-4 w-4 rotate-90" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 pt-0 font-medium text-sm text-brutalist-black/70 border-t-2 border-brutalist-black/5">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeLang, setActiveLang] = useState<'ES' | 'EN'>('ES');
  const [selectedIso, setSelectedIso] = useState<any>(null);
  const [selectedSolution, setSelectedSolution] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Form state
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: string) => {
    let error = '';
    if (!value.trim()) {
      error = activeLang === 'ES' ? 'Campo obligatorio' : 'Required field';
    } else if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      error = activeLang === 'ES' ? 'Correo inválido' : 'Invalid email';
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const content = {
    ES: {
      hero: "INTELIGENCIA PARA GESTIÓN PÚBLICA Y CONTRATACIÓN.",
      heroSub: "Transformamos procesos desorganizados en sistemas inteligentes, datos dispersos en decisiones informadas. Consultoría de negocios, capacitación, auditoría y soluciones AI-native para entidades públicas y empresas privadas en LATAM.",
      servicios: "NUESTROS SERVICIOS",
      serviciosSub: "Tres verticales articuladas que se refuerzan mutuamente para maximizar tu valor e impacto organizacional.",
      soluciones: "SOLUCIONES ESTRATÉGICAS",
      clientes: "ENTIDADES QUE CONFÍAN EN NOSOTROS",
      cta: "SOLICITAR INFORMACIÓN",
      footerMsg: "Líderes en modernización de gestión pública y privada en Colombia. 25 años cerrando brechas con tecnología y ética.",
      form: {
        name: "NOMBRE COMPLETO",
        email: "CORREO",
        company: "ENTIDAD / EMPRESA",
        interest: "Interés en:",
        message: "MENSAJE",
        send: "ENVIAR SOLICITUD"
      }
    },
    EN: {
      hero: "INTELLIGENCE FOR PUBLIC MANAGEMENT & CONTRACTING.",
      heroSub: "We transform disorganied processes into intelligent systems, dispersed data into informed decisions. Business consulting, auditing, training, and AI-native solutions for public entities and private companies in LATAM.",
      servicios: "OUR SERVICES",
      serviciosSub: "Three integrated verticals that reinforce each other to maximize your organizational value and impact.",
      soluciones: "STRATEGIC SOLUTIONS",
      clientes: "ENTITIES THAT TRUST US",
      cta: "REQUEST INFORMATION",
      footerMsg: "Leaders in modernization of public and private management in Colombia. 25 years closing gaps with technology and ethics.",
      form: {
        name: "FULL NAME",
        email: "EMAIL",
        company: "ENTITY / COMPANY",
        interest: "Interest in:",
        message: "MESSAGE",
        send: "SEND REQUEST"
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b-2 border-brutalist-black">
        <nav className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-brutalist-black text-white p-1 font-display font-bold text-xl flex flex-col leading-none items-center justify-center aspect-square">
              <span>B</span>
              <span>&</span>
              <span>A</span>
            </div>
            <span className="font-display font-black text-xl tracking-tight hidden sm:inline">CONSULTORES</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <div className="relative flex items-center">
              <AnimatePresence>
                {isSearchOpen && (
                  <div className="absolute top-full right-0 mt-2">
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-white border-4 border-brutalist-black shadow-brutalist-lg p-2 w-64"
                    >
                      <input
                        type="text"
                        placeholder={activeLang === 'ES' ? 'BUSCAR...' : 'SEARCH...'}
                        className="brutalist-input w-full py-1 px-3 text-xs focus:shadow-none mb-2"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                      />
                      <div className="max-h-48 overflow-y-auto space-y-1">
                        {[
                          { title: 'Licitus AI', id: 'soluciones' },
                          { title: 'EVA LMS', id: 'soluciones' },
                          { title: 'ISO 9001', id: 'servicios' },
                          { title: 'Gestión Pública', id: 'servicios' },
                          { title: 'Contacto', id: 'contacto' },
                          { title: 'FAQ', id: 'faq' }
                        ]
                        .filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((item, idx) => (
                          <a
                            key={idx}
                            href={`#${item.id}`}
                            onClick={() => setIsSearchOpen(false)}
                            className="block p-2 text-[10px] font-bold uppercase hover:bg-brutalist-yellow transition-colors"
                          >
                            {item.title}
                          </a>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="ml-2 p-2 hover:bg-brutalist-yellow/20 transition-colors border-2 border-transparent hover:border-brutalist-black shadow-none"
              >
                {isSearchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
              </button>
            </div>
            {[
              { ES: 'Quiénes somos', EN: 'About us', id: 'quiénes-somos' },
              { ES: 'Servicios', EN: 'Services', id: 'servicios' },
              { ES: 'Soluciones', EN: 'Solutions', id: 'soluciones' },
              { ES: 'Clientes', EN: 'Clients', id: 'clientes' }
            ].map((item) => (
              <a 
                key={item.id} 
                href={`#${item.id}`}
                className="font-display font-bold uppercase text-sm hover:text-brutalist-blue transition-colors"
              >
                {item[activeLang]}
              </a>
            ))}
            <button 
              onClick={() => setActiveLang(activeLang === 'ES' ? 'EN' : 'ES')}
              className="font-display font-bold border-brutalist-black border-2 px-2 hover:bg-brutalist-black hover:text-white transition-colors"
            >
              {activeLang}
            </button>
            <a href="#contacto" className="brutalist-button bg-brutalist-yellow text-xs py-2 px-4 shadow-sm hover:translate-y-[-2px]">
              {content[activeLang].cta}
            </a>
          </div>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
               <motion.div
                 initial={{ opacity: 0, y: -20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -20 }}
                 className="md:hidden absolute top-full left-0 right-0 bg-white border-b-2 border-brutalist-black p-4 flex flex-col gap-4 shadow-brutalist-lg"
               >
                 {[
                   { ES: 'Quiénes somos', EN: 'About us', id: 'quiénes-somos' },
                   { ES: 'Servicios', EN: 'Services', id: 'servicios' },
                   { ES: 'Soluciones', EN: 'Solutions', id: 'soluciones' },
                   { ES: 'Clientes', EN: 'Clients', id: 'clientes' }
                 ].map((item) => (
                   <a 
                     key={item.id} 
                     href={`#${item.id}`}
                     className="font-display font-bold uppercase text-lg"
                     onClick={() => setIsMenuOpen(false)}
                   >
                     {item[activeLang]}
                   </a>
                 ))}
                 <div className="flex gap-4">
                <button 
                  onClick={() => setActiveLang(activeLang === 'ES' ? 'EN' : 'ES')}
                  className="font-display font-bold border-brutalist-black border-2 px-4 py-2 flex-1"
                >
                  {activeLang}
                </button>
                <a href="#contacto" className="brutalist-button bg-brutalist-yellow flex-1 text-center py-2">
                  SOLICITAR INFO
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="mt-16 overflow-hidden">
        {/* Hero Section / Quiénes somos */}
        <section id="quiénes-somos" className="relative bg-white pt-20 pb-20 md:pt-32 md:pb-32 px-4 md:px-8 border-b-2 border-brutalist-black">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <span className="inline-block bg-brutalist-red text-white font-display font-bold px-3 py-1 text-xs mb-6 brutalist-card shadow-none">
                PORTAFOLIO DE SERVICIOS 2026
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-8xl leading-[0.9] mb-8 font-black uppercase">
                {activeLang === 'ES' ? (
                  <>
                    INTELIGENCIA PARA <br />
                    <span className="text-brutalist-blue italic tracking-tighter">GESTIÓN PÚBLICA</span> <br />
                    Y CONTRATACIÓN.
                  </>
                ) : (
                  <>
                    INTELLIGENCE FOR <br />
                    <span className="text-brutalist-blue italic tracking-tighter">PUBLIC MGMT</span> <br />
                    & CONTRACTING.
                  </>
                )}
              </h1>
              <p className="text-lg md:text-xl font-medium max-w-xl mb-10 text-brutalist-black/70">
                {content[activeLang].heroSub}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="https://wa.me/573043283237" className="brutalist-button bg-brutalist-yellow hover:bg-brutalist-black hover:text-white group">
                  <MessageSquare className="mr-2 h-5 w-5 fill-current" />
                  CONTACTAR WHATSAPP
                </a>
                <a href="#servicios" className="brutalist-button bg-white hover:bg-brutalist-black hover:text-white">
                  CONOCER MÁS
                </a>
              </div>
            </motion.div>
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="relative hidden lg:block"
            >
              <div className="brutalist-card bg-brutalist-blue p-8 rotate-1">
                <div className="bg-white border-2 border-brutalist-black p-8 -rotate-2 relative z-10 flex flex-col gap-6">
                  <div className="flex items-center gap-4 border-b-2 border-brutalist-black pb-4">
                    <Database className="h-10 w-10 text-brutalist-blue" />
                    <div>
                      <h3 className="text-xl">LICITUS AI</h3>
                      <p className="text-xs">DECISION INTELLIGENCE</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm font-bold">
                      <span>VIABILIDAD SECOP II</span>
                      <span className="text-brutalist-blue">84% SCORE</span>
                    </div>
                    <div className="h-4 bg-brutalist-paper border-2 border-brutalist-black relative">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: '84%' }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="absolute inset-0 bg-brutalist-blue" 
                      />
                    </div>
                  </div>
                  <ul className="text-xs space-y-2 uppercase font-bold">
                    <li className="flex items-center gap-2">
                       <CheckCircle2 className="h-4 w-4 text-green-600" />
                       BID PRICER OPTIMIZADO
                    </li>
                    <li className="flex items-center gap-2">
                       <CheckCircle2 className="h-4 w-4 text-green-600" />
                       RADAR DE OPORTUNIDADES ACTIVO
                    </li>
                  </ul>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-brutalist-red border-2 border-brutalist-black -z-10" />
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-brutalist-yellow border-2 border-brutalist-black -z-10" />
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-brutalist-black text-white py-12 border-b-2 border-brutalist-black">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { val: '25+', label: 'Años de Trayectoria' },
              { val: '100+', label: 'Entidades Certificadas' },
              { val: '6M+', label: 'COP en Contratos' },
              { val: 'ISO', label: 'Auditores Líderes' }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-display font-black text-brutalist-yellow">{stat.val}</div>
                <div className="text-[10px] md:text-sm uppercase font-bold tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Services Section */}
        <section id="servicios" className="py-24 px-4 md:px-8 bg-brutalist-paper">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-6xl mb-4 font-display font-black uppercase tracking-tight">
              {content[activeLang].servicios}
            </h2>
            <div className="w-32 h-2 bg-brutalist-red mb-8" />
            <p className="text-xl max-w-xl font-medium mb-16 underline decoration-brutalist-blue decoration-4 underline-offset-4">
              {content[activeLang].serviciosSub}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
              {SERVICES.map((service, i) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2 }}
                  viewport={{ once: true }}
                  className={cn(
                    "brutalist-card flex flex-col h-full bg-white",
                    service.id === 'audit' && "md:-translate-y-4"
                  )}
                >
                  <div className={cn("p-6 border-b-2 border-brutalist-black", service.color)}>
                    <service.icon className="h-12 w-12 text-brutalist-black mb-4 p-2 bg-white border-2 border-brutalist-black" />
                    <h3 className="text-2xl">{service.title[activeLang]}</h3>
                  </div>
                  <div className="p-6 flex-grow flex flex-col bg-white">
                    <p className="text-sm font-medium mb-8 leading-relaxed">
                      {service.desc[activeLang]}
                    </p>
                    <ul className="space-y-3 mb-8">
                      {service.features[activeLang].map((f: string) => (
                        <li key={f} className="flex items-start gap-2 text-xs font-bold uppercase tracking-tight">
                          <div className={cn("w-3 h-3 mt-0.5 border border-brutalist-black", service.color)} />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <a href="#contacto" className="brutalist-button mt-auto bg-brutalist-black text-white text-xs py-2 hover:bg-white hover:text-brutalist-black group-hover:scale-105 group-hover:rotate-1 transition-transform">
                      {service.id === 'audit' 
                        ? (activeLang === 'ES' ? 'Ver Plan de Certificación' : 'View Certification Plan')
                        : (activeLang === 'ES' ? 'Saber más' : 'Learn More')}
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Detailed Services Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {DETAILED_SERVICES.map((section, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="border-2 border-brutalist-black p-6 hover:bg-brutalist-yellow/10 transition-all bg-white shadow-brutalist hover:shadow-brutalist-lg"
                >
                   <div className="flex items-center gap-3 mb-6">
                      <section.icon className="h-6 w-6 text-brutalist-blue" />
                      <h4 className="text-lg">{section.title[activeLang]}</h4>
                   </div>
                   <ul className="space-y-3 mb-8">
                      {section.items.map(item => (
                        <li key={item} className="flex items-center gap-2 text-[10px] font-bold uppercase text-brutalist-black/60">
                           <div className="w-1.5 h-1.5 bg-brutalist-red" />
                           {item}
                        </li>
                      ))}
                   </ul>
                   <a href="#contacto" className="text-[10px] font-display font-black uppercase italic hover:text-brutalist-blue flex items-center gap-1 group/link">
                      {activeLang === 'ES' ? 'Solicitar Consultoría' : 'Request Consulting'}
                      <ArrowRight className="h-3 w-3 group-hover/link:translate-x-1 transition-transform" />
                   </a>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-16 flex flex-wrap gap-4 justify-center">
               {ISO_LIST.map(iso => (
                 <div key={iso.code} className="group relative">
                   <button 
                     onClick={() => setSelectedIso(iso)}
                     className="bg-brutalist-black text-white px-4 py-2 font-display font-black text-sm border-2 border-brutalist-black hover:bg-white hover:text-brutalist-black transition-all cursor-pointer block hover:scale-110 active:scale-95"
                   >
                      {iso.code}
                   </button>
                   <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-white border-2 border-brutalist-black shadow-brutalist text-[10px] uppercase font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 w-40 text-center">
                      {iso.name[activeLang]}
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </section>

        <Marquee items={CLIENTS} />

        {/* Solutions Section (The Window) */}
        <section id="soluciones" className="py-24 px-4 md:px-8 border-y-2 border-brutalist-black bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="grid gap-8 order-2 lg:order-1">
                {SOLUTIONS.map((sol, i) => (
                  <motion.div
                    key={sol.title}
                    initial={{ x: -30, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.3 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedSolution(sol)}
                    className="brutalist-card p-8 group overflow-hidden relative bg-white cursor-pointer hover:shadow-brutalist-lg transition-all"
                  >
                    <div className="relative z-10">
                       <h3 className="text-3xl mb-1">{sol.title}</h3>
                       <p className="text-brutalist-blue font-bold uppercase text-sm mb-4 tracking-tighter">{sol.subtitle}</p>
                       <p className="text-sm font-medium mb-6 leading-relaxed max-w-md">
                         {sol.desc[activeLang]}
                       </p>
                       <div className="flex gap-2 flex-wrap mb-6">
                         {sol.tags.map(t => (
                           <span key={t} className="text-[9px] bg-brutalist-paper px-2 py-1 border-2 border-brutalist-black font-black uppercase italic">#{t}</span>
                         ))}
                       </div>
                       <button className="flex items-center gap-2 font-display font-black text-xs uppercase group-hover:translate-x-2 transition-transform">
                         {sol.cta[activeLang]} <ArrowRight className="h-4 w-4" />
                       </button>
                    </div>
                    <div className={cn(
                      "absolute -right-8 -bottom-8 w-32 h-32 rotate-12 opacity-10 group-hover:opacity-20 transition-opacity",
                      i === 0 ? "bg-brutalist-blue" : "bg-brutalist-yellow"
                    )} />
                  </motion.div>
                ))}
              </div>
              <motion.div
                 initial={{ opacity: 0 }}
                 whileInView={{ opacity: 1 }}
                 viewport={{ once: true }}
                 className="relative order-1 lg:order-2"
              >
                <div className="brutalist-card shadow-brutalist-lg p-2 bg-brutalist-black">
                  <div className="bg-white border-2 border-brutalist-black p-10 flex flex-col items-center text-center">
                    <GraduationCap className="h-20 w-20 text-brutalist-red mb-6" />
                    <h2 className="text-4xl mb-4">EVA PLATFORM</h2>
                    <p className="text-sm font-medium leading-relaxed mb-8">
                      {activeLang === 'ES' 
                        ? '"Capacitación que trasciende el cumplimiento. No solo enseñamos la norma, la convertimos en cultura viva dentro de su organización."'
                        : '"Training that transcends compliance. We don\'t just teach the standard, we turn it into a living culture within your organization."'
                      }
                    </p>
                    <div className="flex gap-4 w-full">
                       <div className="flex-1 brutalist-card bg-brutalist-paper p-4">
                          <span className="text-3xl font-black block">100%</span>
                          <span className="text-[10px] font-bold uppercase">Virtual / LMS</span>
                       </div>
                       <div className="flex-1 brutalist-card bg-brutalist-paper p-4">
                          <span className="text-3xl font-black block">ISO</span>
                          <span className="text-[10px] font-bold uppercase">Ready</span>
                       </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -left-4 bg-brutalist-yellow border-2 border-brutalist-black px-4 py-2 font-display font-black text-xs -rotate-6 shadow-brutalist">
                   SISTEMA DE GESTIÓN EDUCATIVA
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Clients Section Marquee Implemented */}

        {/* FAQ Section */}
        <section id="faq" className="py-24 px-4 md:px-8 bg-brutalist-paper/50 border-t-2 border-brutalist-black overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brutalist-yellow/10 -rotate-12 translate-x-32 -translate-y-32" />
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
              <div>
                <h2 className="text-4xl md:text-6xl mb-2 tracking-tighter uppercase">FAQ</h2>
                <p className="font-display font-black text-brutalist-blue uppercase text-sm italic">
                  {activeLang === 'ES' ? 'Respuestas Directas' : 'Direct Answers'}
                </p>
              </div>
              <div className="hidden md:block w-32 h-2 bg-brutalist-black mb-2" />
            </div>
            
            <div className="space-y-4">
              {FAQ_DATA[activeLang].map((item, i) => (
                <FAQItem key={i} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section id="contacto" className="py-24 px-4 md:px-8 bg-white border-t-2 border-brutalist-black">
          <div className="max-w-7xl mx-auto">
            <div className="brutalist-card bg-brutalist-blue p-1 shadow-brutalist-lg">
              <div className="bg-white border-2 border-brutalist-black p-8 md:p-16 grid grid-cols-1 lg:grid-cols-2 gap-16">
                  <div>
                     <h2 className="text-5xl mb-8 leading-[0.9]">
                       {activeLang === 'ES' ? (
                         <>¿LISTO PARA TRANSFORMAR <br /> <span className="text-brutalist-blue italic">TU GESTIÓN?</span></>
                       ) : (
                         <>READY TO TRANSFORM <br /> <span className="text-brutalist-blue italic">YOUR MGMT?</span></>
                       )}
                     </h2>
                     <p className="text-lg font-medium mb-12">
                       {activeLang === 'ES' 
                         ? "Contáctanos para una consulta gratuita. Te mostraremos cómo Licitus y nuestros servicios de consultoría pueden impulsar tu organización hoy."
                         : "Contact us for a free consultation. We'll show you how Licitus and our consulting services can drive your organization today."
                       }
                     </p>
                     
                     <div className="space-y-4">
                       <div className="flex items-center gap-4">
                         <div className="bg-brutalist-yellow p-2 border-2 border-brutalist-black">
                           <MessageSquare className="h-6 w-6" />
                         </div>
                         <a href="https://wa.me/573043283237" className="font-display font-black hover:text-brutalist-blue uppercase">
                           {activeLang === 'ES' ? 'WHATSAPP PERSONAL' : 'PERSONAL WHATSAPP'}
                         </a>
                       </div>
                     </div>
                  </div>

                  <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-1">
                        <input 
                          type="text" 
                          name="name"
                          value={formData.name}
                          onChange={handleFormChange}
                          placeholder={content[activeLang].form.name} 
                          className={cn("brutalist-input w-full", errors.name && "border-brutalist-red")} 
                        />
                        {errors.name && <p className="text-[10px] font-bold text-brutalist-red uppercase">{errors.name}</p>}
                       </div>
                       <div className="space-y-1">
                        <input 
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleFormChange}
                          placeholder={content[activeLang].form.email} 
                          className={cn("brutalist-input w-full", errors.email && "border-brutalist-red")} 
                        />
                        {errors.email && <p className="text-[10px] font-bold text-brutalist-red uppercase">{errors.email}</p>}
                       </div>
                     </div>
                     <div className="space-y-1">
                      <input 
                        type="text" 
                        name="company"
                        value={formData.company}
                        onChange={handleFormChange}
                        placeholder={content[activeLang].form.company} 
                        className={cn("brutalist-input w-full", errors.company && "border-brutalist-red")} 
                      />
                      {errors.company && <p className="text-[10px] font-bold text-brutalist-red uppercase">{errors.company}</p>}
                     </div>
                     <select className="brutalist-input uppercase font-bold text-sm w-full">
                        <option>{content[activeLang].form.interest} LICITUS AI</option>
                        <option>{content[activeLang].form.interest} CERTIFICACIÓN ISO</option>
                        <option>{content[activeLang].form.interest} CONSULTORÍA ESTRATÉGICA</option>
                        <option>{content[activeLang].form.interest} FORMACIÓN EVA</option>
                     </select>
                     <div className="space-y-1">
                      <textarea 
                        name="message"
                        value={formData.message}
                        onChange={handleFormChange}
                        placeholder={content[activeLang].form.message} 
                        rows={4} 
                        className={cn("brutalist-input w-full", errors.message && "border-brutalist-red")}
                      ></textarea>
                      {errors.message && <p className="text-[10px] font-bold text-brutalist-red uppercase">{errors.message}</p>}
                     </div>
                     <button 
                       type="submit" 
                       disabled={Object.values(errors).some(e => e) || !formData.name}
                       className="brutalist-button w-full bg-brutalist-black text-white text-xl py-4 hover:bg-brutalist-yellow hover:text-brutalist-black disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                        {content[activeLang].form.send}
                     </button>
                  </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Chatbot />
      <footer className="bg-brutalist-black text-white pt-24 pb-12 px-4 md:px-8 border-t-2 border-brutalist-black">
        <div className="max-w-7xl mx-auto flex flex-col gap-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-left">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-8">
                <div className="bg-white text-brutalist-black p-1 font-display font-bold text-xl flex flex-col leading-none items-center justify-center aspect-square border-2 border-brutalist-black shadow-brutalist cursor-pointer hover:rotate-12 transition-transform">
                  <span>B</span>
                  <span>&</span>
                  <span>A</span>
                </div>
                <span className="font-display font-black text-xl tracking-tight">CONSULTORES</span>
              </div>
              <p className="text-xs font-bold text-white/50 leading-loose uppercase">
                {content[activeLang].footerMsg}
              </p>
              <div className="flex gap-4 mt-8">
                 {[1, 2, 3].map(i => (
                   <div key={i} className="w-10 h-10 border-2 border-white/20 hover:border-brutalist-yellow transition-colors cursor-pointer flex items-center justify-center">
                     <Globe className="h-5 w-5" />
                   </div>
                 ))}
              </div>
            </div>

            <div>
              <h4 className="text-brutalist-yellow text-sm mb-8 font-black uppercase italic tracking-[0.2em]">Consultoría</h4>
              <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-white/70">
                 <li className="hover:text-brutalist-yellow cursor-pointer transition-colors">Auditoría ISO</li>
                 <li className="hover:text-brutalist-yellow cursor-pointer transition-colors">Compliance</li>
                 <li className="hover:text-brutalist-yellow cursor-pointer transition-colors">Sostenibilidad</li>
                 <li className="hover:text-brutalist-yellow cursor-pointer transition-colors">Gobernanza</li>
              </ul>
            </div>

            <div>
              <h4 className="text-brutalist-yellow text-sm mb-8 font-black uppercase italic tracking-[0.2em]">Servicios</h4>
              <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-white/70">
                 <li className="hover:text-brutalist-yellow cursor-pointer transition-colors">Capacitación</li>
                 <li className="hover:text-brutalist-yellow cursor-pointer transition-colors">Auditoría Interna</li>
                 <li className="hover:text-brutalist-yellow cursor-pointer transition-colors">Licitus IA</li>
                 <li className="hover:text-brutalist-yellow cursor-pointer transition-colors">Plataforma EVA</li>
              </ul>
            </div>

            <div>
              <h4 className="text-brutalist-yellow text-sm mb-8 font-black uppercase italic tracking-[0.2em]">Contacto</h4>
              <ul className="space-y-4 text-xs font-bold text-white/70 uppercase">
                 <li className="flex items-center gap-3">
                   <Locate className="h-4 w-4 text-brutalist-red" />
                   Bogotá, Colombia
                 </li>
                 <li className="flex flex-col gap-2">
                   <a href="https://wa.me/573118698998" target="_blank" className="flex items-center gap-3 hover:text-brutalist-yellow transition-colors">
                     <MessageSquare className="h-4 w-4 text-brutalist-red" />
                     B&A / EVA: +57 311 869-8998
                   </a>
                   <a href="https://wa.me/573043283237" target="_blank" className="flex items-center gap-3 hover:text-brutalist-yellow transition-colors">
                     <MessageSquare className="h-4 w-4 text-brutalist-red" />
                     Licitus: +57 304 328-3237
                   </a>
                 </li>
                 <li className="flex items-center gap-3">
                   <Mail className="h-4 w-4 text-brutalist-red" />
                   <a href="mailto:ba.consultores@hotmail.com" className="hover:text-brutalist-yellow transition-colors italic">ba.consultores@hotmail.com</a>
                 </li>
              </ul>
            </div>
          </div>

          <div className="border-t-2 border-white/10 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
              © 2026 B&A Consultores LTDA Todos los derechos reservados.
            </p>
            <div className="flex gap-8 text-[10px] font-bold text-white/30 uppercase tracking-widest">
               <span className="hover:text-white cursor-pointer transition-colors">Política de privacidad</span>
               <span className="hover:text-white cursor-pointer transition-colors">Términos legales</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WA button for mobile */}
      <a 
        href="https://wa.me/573043283237" 
        className="fixed bottom-6 right-6 z-40 bg-brutalist-yellow border-2 border-brutalist-black p-4 shadow-brutalist hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all md:hidden"
      >
        <MessageSquare className="h-6 w-6" />
      </a>
      <Chatbot />
      
      {/* Modals */}
      <AnimatePresence>
        {selectedIso && (
          <Modal 
            isOpen={!!selectedIso} 
            onClose={() => setSelectedIso(null)} 
            title={`${selectedIso.code} - ${selectedIso.name[activeLang]}`}
          >
            <div className="space-y-6">
              <div className="p-4 bg-brutalist-blue/10 border-l-4 border-brutalist-blue">
                <h4 className="font-display font-black uppercase text-sm mb-2 italic">
                  {activeLang === 'ES' ? 'Propósito' : 'Purpose'}
                </h4>
                <p className="text-sm font-medium">{selectedIso.purpose[activeLang]}</p>
              </div>
              <div>
                <h4 className="font-display font-black uppercase text-sm mb-4 italic">
                  {activeLang === 'ES' ? 'Beneficios Clave' : 'Key Benefits'}
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedIso.benefits[activeLang].map((benefit: string) => (
                    <li key={benefit} className="flex items-center gap-3 p-3 border-2 border-brutalist-black bg-brutalist-paper text-[10px] font-bold uppercase tracking-tight">
                      <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-6 border-t-2 border-brutalist-black">
                <button 
                   onClick={() => setSelectedIso(null)}
                   className="brutalist-button w-full bg-brutalist-yellow"
                >
                  {activeLang === 'ES' ? 'Solicitar Asesoría para esta Norma' : 'Request Advice for this Standard'}
                </button>
              </div>
            </div>
          </Modal>
        )}

        {selectedSolution && (
          <Modal 
            isOpen={!!selectedIso} // reuse logic
            onClose={() => setSelectedSolution(null)} 
            title={selectedSolution.title}
          >
            <div className="space-y-6">
               <div className="aspect-video bg-brutalist-black border-4 border-brutalist-black flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-brutalist-blue opacity-20" />
                  <div className="relative z-10 flex flex-col items-center gap-4">
                     <Database className="h-16 w-16 text-brutalist-blue" />
                     <span className="font-display font-black uppercase text-white/50 tracking-widest text-xs italic">[ Interactive Demo Loading... ]</span>
                  </div>
               </div>
               <div>
                  <h4 className="font-display font-black uppercase text-sm mb-2 italic">
                    {activeLang === 'ES' ? 'Descripción de la Solución' : 'Solution Description'}
                  </h4>
                  <p className="text-sm font-medium leading-relaxed">
                    {selectedSolution.desc[activeLang]}
                  </p>
               </div>
               <div className="pt-6 border-t-2 border-brutalist-black">
                  <button className="brutalist-button w-full bg-brutalist-yellow mb-4">
                    {activeLang === 'ES' ? 'Ver Documentación Técnica' : 'View Technical Docs'}
                  </button>
                  <a href="https://wa.me/573043283237" className="brutalist-button w-full bg-white block text-center">
                    {activeLang === 'ES' ? 'Hablar con un Experto' : 'Speak with an Expert'}
                  </a>
               </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

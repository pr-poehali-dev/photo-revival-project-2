import { useState, useRef, useCallback } from "react";
import Icon from "@/components/ui/icon";

const DEMO_PHOTO = "https://cdn.poehali.dev/projects/745ccdfc-fe51-4747-9b4d-fb4753a71cda/bucket/de72d84a-2c66-469d-9b89-428352fa6791.jpg";

const steps = [
  { icon: "Upload", label: "Загрузи фото" },
  { icon: "Cpu", label: "ИИ анализирует" },
  { icon: "Play", label: "Получи анимацию" },
];

export default function Index() {
  const [dragOver, setDragOver] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sliderPos, setSliderPos] = useState(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setUploadedImage(url);
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 3000);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const handleSliderMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDraggingSlider || !sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const pos = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    setSliderPos(pos);
  }, [isDraggingSlider]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0ece4] font-golos overflow-x-hidden">

      {/* Grain overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "200px" }} />

      {/* Header */}
      <header className="px-6 md:px-12 py-6 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#c9b99a] flex items-center justify-center">
            <Icon name="Sparkles" size={14} className="text-[#0a0a0a]" />
          </div>
          <span className="font-cormorant text-xl tracking-widest uppercase text-[#c9b99a]">Живые фото</span>
        </div>
        <span className="text-xs text-white/30 tracking-wider uppercase">ИИ-анимация</span>
      </header>

      {/* Hero */}
      <section className="px-6 md:px-12 pt-16 pb-12 max-w-5xl mx-auto">
        <div className="mb-2 text-xs tracking-[0.3em] uppercase text-[#c9b99a]/60">Технология нейросетей</div>
        <h1 className="font-cormorant text-5xl md:text-7xl font-light leading-[1.1] mb-6">
          Оживи<br />
          <em className="italic text-[#c9b99a]">старые снимки</em>
        </h1>
        <p className="text-white/40 text-lg max-w-lg leading-relaxed font-light">
          Загрузи фотографию — искусственный интеллект добавит естественное движение, дыхание и жизнь в каждый кадр.
        </p>
      </section>

      {/* Upload + Demo */}
      <section className="px-6 md:px-12 pb-16 max-w-5xl mx-auto grid md:grid-cols-2 gap-8">

        {/* Upload zone */}
        <div>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border transition-all duration-300 cursor-pointer rounded-sm overflow-hidden
              ${dragOver ? "border-[#c9b99a] bg-[#c9b99a]/5" : "border-white/10 hover:border-white/20 bg-white/[0.02]"}
            `}
            style={{ minHeight: 340 }}
          >
            {uploadedImage ? (
              <div className="relative w-full h-full" style={{ minHeight: 340 }}>
                <img src={uploadedImage} alt="Загруженное фото" className="w-full h-full object-cover" style={{ minHeight: 340 }} />
                {isProcessing && (
                  <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-2 border-[#c9b99a]/20 border-t-[#c9b99a] animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon name="Cpu" size={20} className="text-[#c9b99a]" />
                      </div>
                    </div>
                    <p className="text-sm text-white/60 tracking-widest uppercase animate-pulse">Анализирую...</p>
                  </div>
                )}
                {!isProcessing && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3 opacity-0 hover:opacity-100 transition-opacity">
                    <Icon name="RefreshCw" size={24} className="text-white/60" />
                    <p className="text-sm text-white/60">Загрузить другое</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 p-10" style={{ minHeight: 340 }}>
                <div className={`w-16 h-16 rounded-full border border-dashed flex items-center justify-center transition-colors
                  ${dragOver ? "border-[#c9b99a] text-[#c9b99a]" : "border-white/20 text-white/20"}`}>
                  <Icon name="Upload" size={24} />
                </div>
                <div className="text-center">
                  <p className="text-white/50 text-sm mb-1">Перетащи фото или нажми</p>
                  <p className="text-white/20 text-xs">JPG, PNG, WEBP — до 10 МБ</p>
                </div>
                <div className="mt-4 px-6 py-2.5 border border-[#c9b99a]/40 text-[#c9b99a] text-sm tracking-wider uppercase hover:bg-[#c9b99a]/10 transition-colors rounded-sm">
                  Выбрать фото
                </div>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
          </div>

          {/* Steps */}
          <div className="mt-6 flex gap-4">
            {steps.map((step, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 text-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all
                  ${i === 0 ? "bg-[#c9b99a] text-[#0a0a0a]" : "bg-white/5 text-white/30"}`}>
                  {i + 1}
                </div>
                <p className="text-xs text-white/30 leading-tight">{step.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Demo Before/After slider */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs tracking-widest uppercase text-white/30">Пример результата</span>
            <span className="text-xs text-[#c9b99a]/60">← перетащи →</span>
          </div>

          <div
            ref={sliderRef}
            className="relative rounded-sm overflow-hidden cursor-col-resize select-none"
            style={{ minHeight: 320 }}
            onMouseDown={() => setIsDraggingSlider(true)}
            onMouseUp={() => setIsDraggingSlider(false)}
            onMouseLeave={() => setIsDraggingSlider(false)}
            onMouseMove={handleSliderMove}
            onTouchStart={() => setIsDraggingSlider(true)}
            onTouchEnd={() => setIsDraggingSlider(false)}
            onTouchMove={handleSliderMove}
          >
            {/* After (animated) */}
            <div className="absolute inset-0">
              <img
                src={DEMO_PHOTO}
                alt="После"
                className="w-full h-full object-cover"
                style={{
                  filter: "brightness(1.05) contrast(1.05) saturate(1.2)",
                  animation: "subtleFloat 4s ease-in-out infinite",
                }}
              />
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-xs px-2 py-1 rounded-sm text-[#c9b99a] tracking-wider">
                С анимацией
              </div>
            </div>

            {/* Before (static) */}
            <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPos}%` }}>
              <img
                src={DEMO_PHOTO}
                alt="До"
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  width: `${100 / (sliderPos / 100)}%`,
                  filter: "grayscale(0.4) brightness(0.9) contrast(0.9)",
                }}
              />
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-xs px-2 py-1 rounded-sm text-white/50 tracking-wider">
                Оригинал
              </div>
            </div>

            {/* Slider handle */}
            <div className="absolute top-0 bottom-0 flex items-center" style={{ left: `calc(${sliderPos}% - 1px)` }}>
              <div className="w-0.5 h-full bg-white/60" />
              <div className="absolute w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg -translate-x-1/2">
                <Icon name="ChevronsLeftRight" size={14} className="text-black" />
              </div>
            </div>
          </div>

          <p className="mt-4 text-xs text-white/20 leading-relaxed">
            Фотография сделана 11 лет назад. ИИ добавляет тонкое движение — моргание, дыхание, лёгкие повороты головы.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-white/5 px-6 md:px-12 py-16">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-px bg-white/5">
          {[
            { icon: "Wind", title: "Естественное движение", desc: "Дыхание, моргание, мимика — всё выглядит органично" },
            { icon: "Clock", title: "Семейная история", desc: "Оживи снимки родителей, бабушек, далёкого детства" },
            { icon: "Shield", title: "Приватно", desc: "Фотографии не хранятся на серверах после обработки" },
          ].map((f, i) => (
            <div key={i} className="bg-[#0a0a0a] p-8">
              <div className="w-10 h-10 mb-5 flex items-center justify-center border border-white/10 rounded-sm">
                <Icon name={f.icon as any} size={18} className="text-[#c9b99a]" />
              </div>
              <h3 className="font-cormorant text-xl mb-2 font-light">{f.title}</h3>
              <p className="text-sm text-white/30 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-12 py-16 text-center">
        <p className="font-cormorant text-3xl md:text-4xl font-light text-white/80 mb-8">
          Каждая фотография хранит историю.<br />
          <em className="italic text-[#c9b99a]">Пусть она оживёт.</em>
        </p>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-3 bg-[#c9b99a] text-[#0a0a0a] px-8 py-4 text-sm tracking-widest uppercase font-medium hover:bg-[#d4c5aa] transition-colors"
        >
          <Icon name="Upload" size={16} />
          Загрузить фото
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 md:px-12 py-6 flex items-center justify-between">
        <span className="font-cormorant text-[#c9b99a]/40 tracking-widest text-sm">Живые фото</span>
        <span className="text-xs text-white/20">На основе нейросетей</span>
      </footer>

      <style>{`
        @keyframes subtleFloat {
          0%, 100% { transform: scale(1) translate(0, 0); }
          25% { transform: scale(1.005) translate(0.5px, -0.5px); }
          50% { transform: scale(1.008) translate(0, 1px); }
          75% { transform: scale(1.005) translate(-0.5px, 0.5px); }
        }
        .font-cormorant { font-family: 'Cormorant', serif; }
        .font-golos { font-family: 'Golos Text', sans-serif; }
      `}</style>
    </div>
  );
}

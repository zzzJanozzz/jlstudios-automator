"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Download, QrCode, Globe, CheckCircle, Loader2 } from "lucide-react";

export function ExportPanel() {
  const { businessData, setStep } = useAppStore();
  const [isExporting, setIsExporting] = useState(false);
  const [isGeneratingQr, setIsGeneratingQr] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [siteUrl, setSiteUrl] = useState("");

  const handleExportZip = async () => {
    if (!businessData) return;

    setIsExporting(true);
    // Cambiamos el paso visualmente para dar feedback
    setStep("exporting");

    try {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessData }),
      });

      if (!response.ok) {
        throw new Error("Error al generar el archivo ZIP.");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      // Creamos un nombre de archivo limpio basado en el nombre del local
      const fileName = businessData.businessName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-");
        
      a.download = `${fileName}-website.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("¡ZIP descargado! El sitio está listo para el hosting.");
    } catch (err: any) {
      toast.error(err.message || "Fallo en la exportación.");
    } finally {
      setIsExporting(false);
      setStep("editing");
    }
  };

  const handleGenerateQR = async () => {
    if (!siteUrl.trim()) {
      toast.error("Ingresá la URL del sitio (ej: https://tudominio.com) para generar el QR.");
      return;
    }

    setIsGeneratingQr(true);
    try {
      const response = await fetch("/api/qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: siteUrl }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Error al generar QR");

      setQrDataUrl(data.qr);
      toast.success("¡Código QR generado con éxito!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsGeneratingQr(false);
    }
  };

  if (!businessData) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6 p-1"
    >
      <div>
        <h2 className="text-xl font-bold text-white mb-2">🚀 Finalizar Proyecto</h2>
        <p className="text-sm text-zinc-400">
          Revisá todo por última vez antes de entregar el trabajo al cliente.
        </p>
      </div>

      {/* CARD: EXPORTACIÓN ZIP */}
      <div className="glass-panel p-6 border-violet-500/20 bg-violet-500/5">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-violet-500/10 rounded-xl text-violet-400">
            <Download size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-white">Descargar Paquete Web</h3>
            <p className="text-xs text-zinc-500 mt-1 mb-4">
              Genera un archivo .zip con el HTML, CSS y assets optimizados para producción.
            </p>
            <button
              onClick={handleExportZip}
              disabled={isExporting}
              className="btn-primary w-full sm:w-auto"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Empaquetando...
                </>
              ) : (
                "Generar ZIP"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* CARD: GENERADOR DE QR */}
      <div className="glass-panel p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-zinc-800 rounded-xl text-zinc-400">
            <QrCode size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-white">Herramientas de Marketing</h3>
            <p className="text-xs text-zinc-500 mt-1 mb-4">
              Crea un código QR para que los clientes del local escaneen y vean el menú.
            </p>
            
            <div className="space-y-4">
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                <input
                  type="url"
                  placeholder="https://tulocal.netlify.app"
                  value={siteUrl}
                  onChange={(e) => setSiteUrl(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
              
              <button 
                onClick={handleGenerateQR}
                disabled={isGeneratingQr}
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                {isGeneratingQr ? <Loader2 className="w-4 h-4 animate-spin" /> : <QrCode size={16} />}
                Generar Código QR
              </button>
            </div>

            {qrDataUrl && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mt-6 flex flex-col items-center p-4 bg-white rounded-2xl border-4 border-zinc-200 shadow-xl"
              >
                <img src={qrDataUrl} alt="QR Code" className="w-40 h-40" />
                <a
                  href={qrDataUrl}
                  download={`${businessData.businessName}-QR.png`}
                  className="mt-4 text-xs font-bold text-violet-600 hover:text-violet-800 flex items-center gap-1"
                >
                  <Download size={12} />
                  Descargar Imagen QR
                </a>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* CHECKLIST FINAL */}
      <div className="p-4 border border-zinc-800 rounded-xl bg-zinc-900/30">
        <h4 className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-3">Checklist de Calidad</h4>
        <ul className="space-y-2">
          <li className="flex items-center gap-2 text-xs text-zinc-400">
            <CheckCircle size={14} className="text-green-500" /> Colores verificados en Mobile
          </li>
          <li className="flex items-center gap-2 text-xs text-zinc-400">
            <CheckCircle size={14} className="text-green-500" /> Precios extraídos correctamente
          </li>
          <li className="flex items-center gap-2 text-xs text-zinc-400">
            <CheckCircle size={14} className="text-green-500" /> Botón de WhatsApp configurado
          </li>
        </ul>
      </div>
    </motion.div>
  );
}
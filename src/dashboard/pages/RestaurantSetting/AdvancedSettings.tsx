import { useState } from 'react';
import { Power, Wallet, Globe, Smartphone, Landmark, Clock3, Percent, Video } from 'lucide-react';
import { BsInstagram } from 'react-icons/bs';
import { FaFacebook } from 'react-icons/fa';

const AdvancedSettings = () => {
  // 1. State pou Ijans Ouvè/Fèmen
  const [isStoreOpen, setIsStoreOpen] = useState(true);

  // 2. State pou Metòd Peman yo
  const [payments, setPayments] = useState({
    cash: true,
    moncash: false,
    natcash: false,
    card: false,
  });

  // 3. State pou Lyen ak Kontak
  const [whatsapp, setWhatsapp] = useState("+509 3700-0000");
  const [website, setWebsite] = useState("www.kantinpeyimwen.com");
  const [instagram, setInstagram] = useState("kantin_peyi_mwen");
  const [facebook, setFacebook] = useState("kantinpeyimwen");
  const [tiktok, setTiktok] = useState("kantinpeyimwen"); // 🚀 NOUVO: TikTok state

  // 4. State pou Tan Preparasyon ak Taks
  const [prepTime, setPrepTime] = useState("20-30");
  const [taxRate, setTaxRate] = useState(10);

  return (
    <div className="space-y-6">
      
      {/* SEKSYON 1: PANIC BUTTON (OUVÈ / FÈMEN IJAN) */}
      <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 flex items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-xs font-black text-gray-800 flex items-center gap-1.5">
            Status Restoran an (An Tan Reyèl)
          </h3>
          <p className="text-[11px] text-gray-400">Ou ka fèmen restoran an byen vit si gen yon ijans.</p>
        </div>

        <button
          type="button"
          onClick={() => setIsStoreOpen(!isStoreOpen)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 ${
            isStoreOpen 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
              : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}
        >
          <Power size={14} className={isStoreOpen ? "animate-pulse" : ""} />
          <span>{isStoreOpen ? "LOUVRI" : "FÈMEN"}</span>
        </button>
      </div>

      {/* SEKSYON 2: OPERASYON AK FINANS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 border border-gray-100 rounded-2xl bg-gray-50/20">
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
            <Clock3 size={12} className="text-orange-500" /> Tan Preparasyon Mwayèn (Minit)
          </label>
          <select 
            value={prepTime}
            onChange={(e) => setPrepTime(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:border-orange-500 transition-all appearance-none"
          >
            <option value="10-15">10 - 15 minit</option>
            <option value="15-20">15 - 20 minit</option>
            <option value="20-30">20 - 30 minit</option>
            <option value="30-45">30 - 45 minit</option>
            <option value="45+">Plis pase 45 minit</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
            <Percent size={12} className="text-orange-500" /> Taks sou chak kòmand (%)
          </label>
          <div className="relative">
            <input 
              type="number" 
              min="0"
              max="100"
              value={taxRate || ''}
              onChange={(e) => setTaxRate(parseInt(e.target.value) || 0)}
              placeholder="0"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:border-orange-500 transition-all"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">%</span>
          </div>
        </div>
      </div>

      {/* SEKSYON 3: METÒD PEMAN */}
      <div className="space-y-3">
        <div>
          <h3 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
            <Wallet size={14} className="text-orange-500" />
            Metòd Peman yo Aksepte
          </h3>
          <p className="text-[11px] text-gray-400">Chwazi kijan kliyan yo ka peye pou manje a.</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'cash', label: 'Kach nan Livrezon', sub: 'Lajan kach (COD)' },
            { id: 'moncash', label: 'MonCash', sub: 'Peman mobil Digicel' },
            { id: 'natcash', label: 'Natcash', sub: 'Peman mobil Natcom' },
            { id: 'card', label: 'Kat Kredi / Debit', sub: 'Stripe / Visa / Master' },
          ].map((item) => {
            const isChecked = payments[item.id as keyof typeof payments];
            return (
              <label 
                key={item.id}
                className={`p-3 rounded-xl border cursor-pointer flex items-start gap-3 transition-all select-none ${
                  isChecked ? 'bg-white border-orange-500 shadow-sm' : 'bg-gray-50/30 border-gray-100 hover:border-gray-200'
                }`}
              >
                <input 
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => setPayments({ ...payments, [item.id]: !isChecked })}
                  className="mt-0.5 h-3.5 w-3.5 rounded-md border-gray-300 text-orange-500 focus:ring-orange-500 accent-orange-500"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-800">{item.label}</span>
                  <span className="text-[10px] text-gray-400 font-medium">{item.sub}</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* SEKSYON 4: LYEN, KONTAK AK REZO SOSYAL */}
      <div className="space-y-3">
        <div>
          <h3 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
            <Globe size={14} className="text-orange-500" />
            Lyen Piblik, Kontak & Rezo Sosyal
          </h3>
          <p className="text-[11px] text-gray-400">Mete lyen kote kliyan yo ka swiv pwofil nou oswa jwenn sipò.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* WhatsApp */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <Smartphone size={12} className="text-emerald-500" /> WhatsApp Sipò
            </label>
            <input 
              type="text" 
              value={whatsapp} 
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="Egz: +509 3700-0000"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:bg-white focus:border-orange-500 transition-all"
            />
          </div>

          {/* Sit Web */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <Landmark size={12} className="text-blue-500" /> Sit Web (Opsyonèl)
            </label>
            <input 
              type="text" 
              value={website} 
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="Egz: www.restoranou.com"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:bg-white focus:border-orange-500 transition-all"
            />
          </div>

          {/* Instagram */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <BsInstagram size={12} className="text-pink-500" /> Instagram Username
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">@</span>
              <input 
                type="text" 
                value={instagram} 
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="username_restoran"
                className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:bg-white focus:border-orange-500 transition-all"
              />
            </div>
          </div>

          {/* Facebook */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <FaFacebook size={12} className="text-blue-600" /> Facebook Page ID
            </label>
            <input 
              type="text" 
              value={facebook} 
              onChange={(e) => setFacebook(e.target.value)}
              placeholder="Egz: paj_restoran"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:bg-white focus:border-orange-500 transition-all"
            />
          </div>

          {/* 🚀 NOUVO: TikTok Input */}
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <Video size={12} className="text-cyan-500" /> TikTok Username
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">@</span>
              <input 
                type="text" 
                value={tiktok} 
                onChange={(e) => setTiktok(e.target.value)}
                placeholder="username_tiktok"
                className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:bg-white focus:border-orange-500 transition-all"
              />
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default AdvancedSettings;
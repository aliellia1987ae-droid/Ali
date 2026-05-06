/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import { 
  Phone, 
  MapPin, 
  Bus, 
  Hotel, 
  Trees, 
  Train,
  ChevronRight, 
  ChevronLeft,
  Instagram, 
  Facebook, 
  MessageCircle, 
  Twitter,
  Plus,
  Menu, 
  X,
  Award,
  ShieldCheck,
  Clock,
  Upload,
  Star,
  Trash2
} from "lucide-react";
import React, { useState, useEffect } from "react";

const APP_DATA = {
  name: "حملة الباشا لنقل المسافرين",
  phones: ["07800053542", "07728985000"],
  address: "العراق، الناصرية - سوق الشيوخ، مكتب شركة الباشا",
  services: [
    {
      title: "باصات VIP حديثة",
      description: "أسطول من أحدث الحافلات المجهزة بأعلى سبل الراحة والترفيه لضمان رحلة ممتعة.",
      icon: <Bus className="w-8 h-8 text-brand-gold" />,
    },
    {
      title: "فنادق فاخرة",
      description: "حجوزات في أفضل فنادق الشمال الإيراني المطلة على الطبيعة الخلابة.",
      icon: <Hotel className="w-8 h-8 text-brand-gold" />,
    },
  ],
  packages: [],
  featuredTrip: {
    title: "",
    subtitle: "",
    price: "",
    image: "",
    details: []
  },
  socials: {
    instagram: "https://instagram.com/albasha_travel",
    facebook: "https://facebook.com/albasha.tourism",
    twitter: "https://twitter.com/albasha_tourism",
    whatsapp: "https://wa.me/07800053542"
  }
};

const PackageSnapshotCarousel = ({ images, onImageClick, heightClassName = "h-64 md:h-72" }: { images: string[], onImageClick: (src: string) => void, heightClassName?: string }) => {
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <div className={`relative ${heightClassName} rounded-[30px] overflow-hidden group shadow-xl`}>
      <motion.div 
        className="flex h-full"
        animate={{ x: `-${index * 100}%` }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {images.map((src, i) => (
          <div key={i} className="min-w-full h-full relative">
            <img 
              src={src} 
              className="w-full h-full object-cover cursor-zoom-in" 
              alt={`Trip image ${i + 1}`} 
              onClick={() => onImageClick(src)}
            />
          </div>
        ))}
      </motion.div>

      {images.length > 1 && (
        <>
          <button 
            type="button"
            onClick={(e) => { e.preventDefault(); setIndex(prev => (prev === 0 ? images.length - 1 : prev - 1)); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/40 transition-all z-20"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
          </button>
          <button 
            type="button"
            onClick={(e) => { e.preventDefault(); setIndex(prev => (prev === images.length - 1 ? 0 : prev + 1)); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/40 transition-all z-20"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {images.map((_, i) => (
              <div 
                key={i} 
                className={`w-1.5 h-1.5 rounded-full transition-all ${index === i ? "bg-brand-gold w-4" : "bg-white/50"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [packages, setPackages] = useState(APP_DATA.packages);
  const [userImages, setUserImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1620919246169-dc3400a94437?q=80&w=1200&auto=format&fit=crop"
  ]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedLightboxImage, setSelectedLightboxImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    travelers: "1",
    additionalPassengers: [] as string[],
    package: packages.length > 0 ? packages[0].title : "",
    paymentPlan: "الدفع الكامل",
    paymentMethod: "الدفع في المكتب / نقداً",
    requests: "",
    flightType: "ذهاب وإياب",
    destination: ""
  });

  const selectedPackageDetail = packages.find(p => p.title === formData.package);
  const isFlightSelected = formData.package.includes("طيران");

  const [passportImage, setPassportImage] = useState<string | null>(null);

  const handlePassportUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setPassportImage(url);
    }
  };

  const [isAdmin, setIsAdmin] = useState(false);
  const [newPackage, setNewPackage] = useState({
    title: "",
    description: "",
    price: "",
    itinerary: "",
    includes: "",
    image: ""
  });

  const [deleteId, setDeleteId] = useState("");

  const handleAddPackage = (e: React.FormEvent) => {
    e.preventDefault();
    const id = newPackage.title;
    const itineraryArray = newPackage.itinerary.split('\n').filter(line => line.trim() !== "");
    const includesArray = newPackage.includes.split(',').map(item => item.trim()).filter(item => item !== "");
    
    const nuevoPackage = {
      id,
      title: `${newPackage.title} - ${newPackage.price}`,
      description: newPackage.description,
      images: newPackage.image ? [newPackage.image] : ["https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop"],
      itinerary: itineraryArray,
      includes: includesArray
    };

    setPackages(prev => [...prev, nuevoPackage]);
    setNewPackage({
      title: "",
      description: "",
      price: "",
      itinerary: "",
      includes: "",
      image: ""
    });
    alert("تم إضافة الرحلة بنجاح!");
  };

  const handleDeletePackage = (id: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذه الرحلة؟")) {
      setPackages(prev => prev.filter(p => p.id !== id));
    }
  };

  const [tripImages, setTripImages] = useState({
    hero: "https://images.unsplash.com/photo-1520201163981-8cc95007dd2a?q=80&w=2000&auto=format&fit=crop",
    featured: packages.length > 0 ? (packages[0].images?.[0] || "") : "",
    religious: packages.length > 1 ? (packages[1].images?.[0] || "") : "",
    custom: packages.length > 0 ? (packages[packages.length - 1].images?.[0] || "") : "",
  });

  const handleTripImageUpload = (key: keyof typeof tripImages) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setTripImages(prev => ({ ...prev, [key]: url }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files) as File[];
      const newImages = filesArray.map(file => URL.createObjectURL(file));
      setUserImages(prev => [...newImages, ...prev]);
    }
  };

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    
    // Prepare WhatsApp message
    const additionalNames = formData.additionalPassengers.filter(name => name.trim() !== "").join('\n- ');
    const message = `
*حجز جديد من موقع حملة الباشا* 📋
-------------------------
*الاسم:* ${formData.name}
*الهاتف:* ${formData.phone}
*عدد المسافرين:* ${formData.travelers}
${additionalNames ? `*أسماء المسافرين الإضافيين:*\n- ${additionalNames}` : ""}
*الباقة المختارة:* ${formData.package}
${isFlightSelected ? `*نوع الرحلة:* ${formData.flightType}\n*الوجهة:* ${formData.destination}` : ""}
*خطة الدفع:* ${formData.paymentPlan} ${formData.paymentPlan === "تقسيط" ? "(مقدمة 100 ألف + 50 ألف قسط شهري)" : ""}
*طريقة الدفع:* ${formData.paymentMethod}
${passportImage ? "*تم إرفاق الجواز:* ✅ نعم (الرجاء اختيار الصورة من المعرض وإرسالها مع الرسالة)" : "*مرفق الجواز:* ❌ لم يتم إرفاق صورة"}
${formData.requests ? `*طلبات خاصة:* ${formData.requests}` : ""}
-------------------------
تم الإرسال إلكترونياً عبر الموقع
    `.trim();

    const whatsappNumber = "9647728985000";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    console.log("Booking Data sent to WhatsApp with Passport Info:", formData);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen arabic-text selection:bg-brand-gold selection:text-white">
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-md shadow-md py-3" : "bg-transparent py-5"}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-brand-emerald rounded-xl flex items-center justify-center shadow-xl border-2 border-brand-gold/30">
              <span className="text-brand-gold font-black text-2xl font-serif">ب</span>
            </div>
            <div className="flex flex-col">
              <span className={`text-2xl font-black font-serif leading-none tracking-tight ${scrolled ? "text-brand-emerald" : "text-white"}`}>
                حملة الباشا
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-[0.2em] transform scale-x-110 origin-right ${scrolled ? "text-brand-gold" : "text-brand-gold"}`}>
                لنقل المسافرين والسياحة
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#الحجز" className="bg-brand-emerald text-brand-gold px-6 py-2 rounded-full font-bold shadow-lg hover:bg-emerald-900 transition-all active:scale-95">
              احجز الآن
            </a>
          </div>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? (
              <X className={scrolled ? "text-slate-800" : "text-white"} />
            ) : (
              <Menu className={scrolled ? "text-slate-800" : "text-white"} />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-6 flex flex-col gap-6 md:hidden"
          >
            {["الرئيسية", "خدماتنا", "الحجز", "تواصل معنا"].map((item) => (
              <a 
                key={item} 
                href={`#${item}`} 
                className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <div className="mt-auto pb-12 flex flex-col gap-4">
              <p className="text-center text-slate-500 font-bold">تواصل معنا مباشرة</p>
              {APP_DATA.phones.map(p => (
                <a key={p} href={`tel:${p}`} className="flex items-center justify-center gap-2 bg-brand-cream py-4 rounded-xl text-brand-emerald font-bold border border-emerald-100 shadow-sm">
                  <Phone size={18} />
                  {p}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="الرئيسية" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={tripImages.hero} 
            className="w-full h-full object-cover"
            alt="Northern Iran Landscape"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-emerald/70 via-brand-emerald/40 to-brand-emerald/90" />
          
          {isAdmin && (
            <label className="absolute top-32 right-10 z-20 cursor-pointer group">
              <input type="file" className="hidden" accept="image/*" onChange={handleTripImageUpload('hero')} />
              <div className="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/40 hover:bg-white/40 transition-all text-white flex items-center gap-2">
                <Plus size={20} />
                <span className="font-bold text-sm">تغيير خلفية الواجهة</span>
              </div>
            </label>
          )}
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Service icons removed per user request */}

            <span className="inline-block bg-brand-gold/20 backdrop-blur-sm border border-brand-gold/30 text-brand-gold px-6 py-2 rounded-full mb-6 font-bold tracking-wider">
              سفرات سياحيه _ سفرات دينيه _ خدمات علاجيه
            </span>
            {/* Secondary tagline removed per user request */}
            {/* Title removed per user request */}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#الحجز" className="w-full sm:w-auto text-center bg-brand-gold text-brand-emerald px-10 py-4 rounded-xl font-black text-lg shadow-2xl hover:bg-yellow-500 hover:-translate-y-1 transition-all">
                ابدأ رحلتك الآن
              </a>
            </div>

          </motion.div>
        </div>

        {/* Scroll indicator removed per user request */}
      </section>

      {/* Services Section removed per user request */}

      {/* Featured Trip Section removed per user request */}

      {/* Religious Trip Section with Carousel removed per user request */}


      {/* Packages Gallery Section removed per user request */}

      {/* Video Tour Section removed per user request */}


      {/* Booking Section */}
      <section id="الحجز" className="py-24 bg-brand-cream relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white to-transparent opacity-50" />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-brand-emerald mb-4 font-serif">احجز مقعدك الآن</h2>
            <div className="w-24 h-1.5 bg-brand-gold mx-auto rounded-full" />
            <p className="text-slate-500 mt-6 font-bold">املأ البيانات التالية لتبدأ مغامرتك القادمة في الشمال الإيراني</p>
          </div>

          <div className="bg-white rounded-[40px] shadow-2xl p-8 md:p-12 border border-slate-100">
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleBooking} 
                  className="grid md:grid-cols-2 gap-8"
                >
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-brand-emerald font-bold text-sm">اختر الباقة</label>
                    <select 
                      className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-brand-gold outline-none font-bold"
                      value={formData.package}
                      onChange={(e) => setFormData({...formData, package: e.target.value})}
                    >
                      {packages.map(p => (
                        <option key={p.id} value={p.title}>{p.title}</option>
                      ))}
                    </select>

                    <AnimatePresence>
                      {selectedPackageDetail && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="bg-brand-cream/40 rounded-2xl p-6 mt-2 border border-brand-cream border-dashed">
                            <div className="relative mb-4">
                              <PackageSnapshotCarousel 
                                images={selectedPackageDetail.images || ["https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop"]} 
                                onImageClick={(src) => setSelectedLightboxImage(src)}
                              />
                            </div>
                            <h4 className="font-black text-brand-emerald mb-2 flex items-center gap-2">
                              <ShieldCheck size={18} className="text-brand-gold" />
                              تفاصيل الباقة:
                            </h4>
                            <p className="text-sm text-slate-600 font-bold mb-4">{selectedPackageDetail.description}</p>
                            
                            <div className="grid grid-cols-1 gap-4">
                              <div>
                                <h5 className="text-xs font-black text-brand-gold uppercase mb-2">المسار والبرنامج:</h5>
                                <ul className="space-y-1">
                                  {selectedPackageDetail.itinerary.map((step, idx) => (
                                    <li key={idx} className="text-[11px] font-bold text-slate-700 flex items-start gap-2">
                                      <div className="w-1.5 h-1.5 bg-brand-gold rounded-full mt-1 flex-shrink-0" />
                                      {step}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h5 className="text-xs font-black text-brand-gold uppercase mb-2">ماذا تشمل الرحلة:</h5>
                                <div className="flex flex-wrap gap-2">
                                  {selectedPackageDetail.includes.map((item, idx) => (
                                    <span key={idx} className="bg-white px-2 py-1 rounded-lg text-[10px] font-black text-brand-emerald shadow-sm border border-slate-100 flex items-center gap-1">
                                      <Plus size={10} className="text-brand-gold" />
                                      {item}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <AnimatePresence>
                    {isFlightSelected && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:col-span-2 grid md:grid-cols-2 gap-8 bg-brand-emerald/5 p-6 rounded-[30px] border border-brand-emerald/10 mb-4 overflow-hidden"
                      >
                        <div className="flex flex-col gap-2">
                          <label className="text-brand-emerald font-bold text-sm">نوع حجز الطيران</label>
                          <select 
                            className="w-full bg-white border-none rounded-2xl p-4 focus:ring-2 focus:ring-brand-gold outline-none font-bold"
                            value={formData.flightType}
                            onChange={(e) => setFormData({...formData, flightType: e.target.value})}
                          >
                            <option value="ذهاب وإياب">ذهاب وإياب</option>
                            <option value="ذهاب فقط">ذهاب فقط</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-brand-emerald font-bold text-sm">الوجهة (إلى أين؟)</label>
                          <input 
                            type="text" 
                            placeholder="مثال: دبي، طهران، اسطنبول..."
                            className="w-full bg-white border-none rounded-2xl p-4 focus:ring-2 focus:ring-brand-gold outline-none font-bold"
                            value={formData.destination}
                            onChange={(e) => setFormData({...formData, destination: e.target.value})}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex flex-col gap-2">
                    <label className="text-brand-emerald font-bold text-sm">الاسم الكامل</label>
                    <input 
                      required
                      type="text" 
                      placeholder="أدخل اسمك الكريم"
                      className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-brand-gold outline-none font-bold"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-brand-emerald font-bold text-sm">رقم الهاتف</label>
                    <input 
                      required
                      type="tel" 
                      placeholder="07XXXXXXXX"
                      className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-brand-gold outline-none font-bold font-mono"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-brand-emerald font-bold text-sm">عدد المسافرين</label>
                    <select 
                      className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-brand-gold outline-none font-bold"
                      value={formData.travelers}
                      onChange={(e) => {
                        const count = parseInt(e.target.value);
                        setFormData({
                          ...formData, 
                          travelers: e.target.value,
                          additionalPassengers: Array(Math.max(0, count - 1)).fill("")
                        });
                      }}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                        <option key={n} value={n}>{n} {n === 1 ? "مسافر" : "مسافرين"}</option>
                      ))}
                    </select>
                  </div>

                  <AnimatePresence>
                    {formData.additionalPassengers.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:col-span-2 space-y-4 overflow-hidden"
                      >
                        <h4 className="text-brand-emerald font-black text-xs uppercase tracking-wider flex items-center gap-2 mt-2">
                          <Plus size={14} className="text-brand-gold" />
                          أسماء المسافرين الإضافيين
                        </h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          {formData.additionalPassengers.map((name, idx) => (
                            <div key={idx} className="flex flex-col gap-1.5">
                              <label className="text-slate-400 font-bold text-[10px]">اسم المسافر {idx + 2}</label>
                              <input 
                                required
                                type="text" 
                                placeholder={`الاسم الكامل للمسافر ${idx + 2}`}
                                className="w-full bg-white border border-slate-100 rounded-xl p-3 focus:ring-2 focus:ring-brand-gold outline-none font-bold text-sm shadow-sm"
                                value={name}
                                onChange={(e) => {
                                  const newNames = [...formData.additionalPassengers];
                                  newNames[idx] = e.target.value;
                                  setFormData({...formData, additionalPassengers: newNames});
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="flex flex-col gap-2">
                    <label className="text-brand-emerald font-bold text-sm">خطة الدفع</label>
                    <select 
                      className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-brand-gold outline-none font-bold"
                      value={formData.paymentPlan}
                      onChange={(e) => setFormData({...formData, paymentPlan: e.target.value})}
                    >
                      <option value="الدفع الكامل">الدفع الكامل</option>
                      <option value="تقسيط">تقسيط (مقدمة 100 ألف + 50 ألف شهري)</option>
                    </select>
                    {formData.paymentPlan === "تقسيط" && (
                      <p className="text-[10px] text-brand-gold font-bold px-2">يتم دفع 100 ألف كدفعة أولى و50 ألف كقسط شهري ثابت</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-brand-emerald font-bold text-sm">طريقة الدفع</label>
                    <select 
                      className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-brand-gold outline-none font-bold"
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                    >
                      <option value="الدفع في المكتب / نقداً">الدفع في المكتب / نقداً</option>
                      <option value="زين كاش - Zain Cash">زين كاش - Zain Cash</option>
                      <option value="ماستر كارد - Mastercard">ماستر كارد - Mastercard</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-brand-emerald font-bold text-sm">صورة الجواز (اختياري)</label>
                    <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-4 bg-white hover:border-brand-emerald/30 transition-colors">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handlePassportUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-brand-cream rounded-xl flex items-center justify-center text-brand-emerald">
                          <Upload size={20} />
                        </div>
                        <div className="flex-1">
                          <p className="text-slate-600 font-bold text-sm">اضغط لتحميل صورة الجواز</p>
                          <p className="text-slate-400 text-[10px] mt-0.5">يساعدنا ذلك في تسريع عملية الحجز</p>
                        </div>
                        {passportImage && (
                          <div className="flex flex-col items-end gap-1">
                            <div className="w-12 h-9 rounded-lg overflow-hidden border-2 border-brand-emerald shadow-sm bg-brand-cream">
                              <img src={passportImage} className="w-full h-full object-cover" alt="Passport Preview" />
                            </div>
                            <span className="text-[9px] font-black text-brand-emerald bg-brand-gold/20 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                              <ShieldCheck size={10} />
                              جاهز للإرسال
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-brand-emerald font-bold text-sm">طلبات خاصة أو استفسارات</label>
                    <textarea 
                      rows={4}
                      placeholder="أي معلومات إضافية ترغب في تزويدنا بها..."
                      className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-brand-gold outline-none font-bold resize-none"
                      value={formData.requests}
                      onChange={(e) => setFormData({...formData, requests: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2 mt-4">
                    <button 
                      type="submit"
                      className="w-full bg-brand-emerald text-brand-gold py-5 rounded-2xl font-black text-xl shadow-xl hover:bg-emerald-900 transition-all active:scale-95 flex flex-col items-center justify-center gap-1"
                    >
                      <div className="flex items-center gap-2">
                        تأكيد الحجز المبدئي
                        <ChevronRight className="w-6 h-6 rotate-180" />
                      </div>
                      <span className="text-[10px] opacity-70">خليك باشا بالسفر مع الباشا</span>
                    </button>
                    <p className="text-center text-slate-400 text-xs mt-4 font-bold">
                      بمجرد التأكيد، سيقوم فريقنا بالتواصل معك هاتفياً لإتمام إجراءات الحجز الرسمي.
                    </p>
                  </div>
                </motion.form>
              ) : (
                <motion.div 
                  key="confirmation"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-24 h-24 bg-emerald-100 text-brand-emerald rounded-full flex items-center justify-center mx-auto mb-8">
                    <ShieldCheck size={48} />
                  </div>
                  <h3 className="text-3xl font-bold text-brand-emerald mb-4">تم استلام طلبك بنجاح!</h3>
                  <p className="text-slate-600 mb-8 font-bold leading-relaxed">
                    شكراً لك <span className="text-brand-gold">{formData.name}</span>. <br />
                    لقد اخترت باقة <span className="text-emerald-700">{formData.package}</span> لعدد {formData.travelers} مسافرين. <br />
                    خطة الدفع: <span className="text-brand-gold">{formData.paymentPlan} {formData.paymentPlan === "تقسيط" ? "(100مقدم + 50شهر)" : ""}</span>. <br />
                    طريقة الدفع: <span className="text-brand-gold">{formData.paymentMethod}</span>. <br />
                    {passportImage && (
                      <div className="bg-brand-emerald text-white p-4 rounded-2xl my-6 border-2 border-brand-gold relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold opacity-10 blur-2xl rounded-full -mr-12 -mt-12" />
                        <div className="flex items-center gap-4 text-right">
                          <Upload className="flex-shrink-0 animate-bounce" size={24} />
                          <div>
                            <p className="font-black text-sm">خطوة أخيرة هامة:</p>
                            <p className="text-xs opacity-90 font-bold leading-relaxed">
                              لقد قمت بتحميل صورة الجواز إلكترونياً. يرجى "إرفاق" الصورة يدوياً الآن في محادثة الواتساب التي فُتحت لضمان سرعة إكمال الحجز.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    <br />
                    سيقوم موظف شركة الباشا بالتواصل معك على الرقم <span className="font-mono">{formData.phone}</span> خلال أقل من 12 ساعة.
                  </p>
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="bg-brand-cream text-brand-emerald px-8 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-all border border-emerald-100"
                  >
                    إجراء حجز جديد
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* User Uploads Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 blur-3xl rounded-full -mr-32 -mt-32" />
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="inline-block p-5 bg-brand-gold/10 rounded-3xl mb-8">
            <Instagram className="text-brand-gold w-10 h-10" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-brand-emerald mb-4 font-serif">شاركنا صور رحلتك</h2>
          <div className="w-24 h-1.5 bg-brand-gold mx-auto rounded-full mb-8" />
          <p className="text-slate-500 mb-12 font-bold max-w-2xl mx-auto">
            هل استمتعت برحلتك مع شركة الباشا؟ يسعدنا أن تشاركنا أجمل اللحظات التي التقطتها بعدستك لتظهر في معرضنا الخاص.
          </p>
          
          <div className="flex flex-col items-center gap-10">
            <label className="relative group cursor-pointer active:scale-95 transition-transform">
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileUpload}
              />
              <div className="bg-brand-emerald text-brand-gold px-12 py-6 rounded-2xl font-black text-xl shadow-2xl hover:bg-emerald-900 transition-all flex items-center gap-3 border-4 border-white">
                <Plus className="w-8 h-8" />
                تحميل الصور من هاتفك
              </div>
            </label>

            <AnimatePresence>
              {userImages.length > 0 && (
                <div className="w-full max-w-5xl mx-auto">
                  {/* Image Carousel */}
                  <div className="relative group px-4">
                    <div className="overflow-hidden rounded-[40px] border-8 border-brand-cream shadow-2xl bg-slate-100 aspect-[16/9] md:aspect-[21/9]">
                      <motion.div 
                        className="flex h-full"
                        animate={{ x: `-${currentSlideIndex * 100}%` }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      >
                        {userImages.map((src, idx) => (
                          <div key={idx} className="min-w-full h-full relative">
                            <img 
                              src={src} 
                              className="w-full h-full object-cover cursor-zoom-in" 
                              alt={`User upload ${idx + 1}`} 
                              onClick={() => setSelectedLightboxImage(src)}
                            />
                            <div className="absolute bottom-6 right-6 bg-black/40 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-black">
                              {idx + 1} / {userImages.length}
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    </div>

                    {/* Navigation Controls */}
                    {userImages.length > 1 && (
                      <>
                        <button 
                          onClick={() => setCurrentSlideIndex(prev => (prev === 0 ? userImages.length - 1 : prev - 1))}
                          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 md:-translate-x-1/2 bg-white text-brand-emerald p-3 md:p-4 rounded-full shadow-2xl border border-slate-100 hover:bg-brand-gold hover:text-brand-emerald transition-all z-20"
                        >
                          <ChevronRight className="w-6 h-6 rotate-180" />
                        </button>
                        <button 
                          onClick={() => setCurrentSlideIndex(prev => (prev === userImages.length - 1 ? 0 : prev + 1))}
                          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 md:translate-x-1/2 bg-white text-brand-emerald p-3 md:p-4 rounded-full shadow-2xl border border-slate-100 hover:bg-brand-gold hover:text-brand-emerald transition-all z-20"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Thumbnail Row */}
                  <div className="flex justify-center gap-3 mt-8 overflow-x-auto py-4 px-2 no-scrollbar">
                    {userImages.map((src, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setCurrentSlideIndex(idx)}
                        className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-4 transition-all ${currentSlideIndex === idx ? "border-brand-gold scale-110 shadow-lg" : "border-white opacity-60 hover:opacity-100"}`}
                      >
                        <img src={src} className="w-full h-full object-cover" alt={`Thumb ${idx}`} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section id="موقعنا" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 h-[450px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d54753.84589255679!2d46.4253966!3d30.8837267!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3fe0f90c00000001%3A0x64b8559067f9c2d!2sSuq%20Al-Shuyukh!5e0!3m2!1sen!2siq!4v1714986561000!5m2!1sen!2siq" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-4xl font-bold text-brand-emerald mb-6 font-serif">تفضلوا بزيارة مكتبنا</h2>
            <p className="text-slate-600 mb-8 leading-relaxed font-semibold">
              نحن جاهزون لاستقبالكم والرد على جميع استفساراتكم في مكتبنا الرئيسي في بغداد. نوفر مواقف للسيارات واستراحة مريحة لعملائنا أثناء إتمام إجراءات الحجز.
            </p>
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                <div className="bg-brand-emerald/10 p-3 rounded-lg">
                  <MapPin className="text-brand-emerald" />
                </div>
                <div>
                  <h4 className="font-bold text-brand-emerald text-lg">العنوان</h4>
                  <p className="text-slate-500 font-bold">{APP_DATA.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                <div className="bg-brand-emerald/10 p-3 rounded-lg">
                  <Phone className="text-brand-emerald" />
                </div>
                <div>
                  <h4 className="font-bold text-brand-emerald text-lg">اتصل بنا</h4>
                  <div className="flex flex-col gap-1">
                    {APP_DATA.phones.map(p => (
                      <span key={p} className="text-slate-500 font-bold font-mono tracking-wider">{p}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics / Trust Section (Bottom) */}
      <div className="py-12 bg-brand-cream/30">
        <div className="max-w-lg mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
            {[
              { label: "رحلة ناجحة", val: "+1200", icon: <ShieldCheck className="text-brand-gold" /> },
            ].map((m, i) => (
              <div key={i} className="text-center flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-brand-gold/10 rounded-full flex items-center justify-center">
                  {m.icon}
                </div>
                <span className="text-4xl font-black text-brand-emerald">{m.val}</span>
                <span className="text-slate-500 text-lg font-bold">{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Admin Control Panel - Add New Packages */}
      <AnimatePresence>
        {isAdmin && (
          <motion.section 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-brand-emerald py-16 overflow-hidden"
          >
            <div className="max-w-4xl mx-auto px-6">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-brand-gold rounded-2xl flex items-center justify-center shadow-xl">
                  <Plus className="text-brand-emerald" size={28} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white font-serif">لوحة تحكم المشرف</h2>
                  <p className="text-brand-gold font-bold">إضافة عروض ورحلات جديدة للموقع</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-[40px] p-8 md:p-12 border border-white/10">
                <form onSubmit={handleAddPackage} className="grid md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-brand-gold font-bold text-xs">اسم الرحلة (مثال: رحلة الشمال)</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-brand-gold outline-none font-bold placeholder:text-white/20"
                      placeholder="أدخل عنوان الرحلة..."
                      value={newPackage.title}
                      onChange={e => setNewPackage({...newPackage, title: e.target.value})}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-brand-gold font-bold text-xs">السعر (مثال: 450 ألف)</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-brand-gold outline-none font-bold placeholder:text-white/20"
                      placeholder="أدخل تفاصيل السعر..."
                      value={newPackage.price}
                      onChange={e => setNewPackage({...newPackage, price: e.target.value})}
                    />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-brand-gold font-bold text-xs">وصف الرحلة</label>
                    <textarea 
                      required
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-brand-gold outline-none font-bold placeholder:text-white/20 resize-none"
                      placeholder="اكتب وصفاً موجزاً للرحلة..."
                      value={newPackage.description}
                      onChange={e => setNewPackage({...newPackage, description: e.target.value})}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-brand-gold font-bold text-xs">صورة الرحلة</label>
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <input 
                          type="text" 
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-brand-gold outline-none font-bold placeholder:text-white/20"
                          placeholder="رابط الصورة أو ارفع ملفاً..."
                          value={newPackage.image}
                          onChange={e => setNewPackage({...newPackage, image: e.target.value})}
                        />
                      </div>
                      <label className="bg-white/10 border border-white/10 rounded-xl px-4 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-all text-brand-gold group shrink-0">
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*" 
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                if (event.target?.result) {
                                  setNewPackage({...newPackage, image: event.target.result as string});
                                }
                              };
                              reader.readAsDataURL(e.target.files[0]);
                            }
                          }}
                        />
                        <Upload size={20} className="group-hover:scale-110 transition-transform" />
                      </label>
                    </div>
                    {newPackage.image && (
                      <div className="mt-2 relative w-20 h-20 rounded-lg overflow-hidden border border-white/20 shadow-lg">
                        <img src={newPackage.image} className="w-full h-full object-cover" alt="Preview" />
                        <button 
                          type="button"
                          onClick={() => setNewPackage({...newPackage, image: ""})}
                          className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-brand-gold font-bold text-xs">ماذا تشمل الرحلة؟ (افصل بينها بفاصلة ,)</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-brand-gold outline-none font-bold placeholder:text-white/20"
                      placeholder="فيزا, فندق, وجبات..."
                      value={newPackage.includes}
                      onChange={e => setNewPackage({...newPackage, includes: e.target.value})}
                    />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-brand-gold font-bold text-xs">البرنامج اليومي (كل سطر يعتبر يوم أو نقطة في المسار)</label>
                    <textarea 
                      required
                      rows={5}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-brand-gold outline-none font-bold placeholder:text-white/20 resize-none"
                      placeholder="اليوم الأول: الانطلاق...&#10;اليوم الثاني: زيارة..."
                      value={newPackage.itinerary}
                      onChange={e => setNewPackage({...newPackage, itinerary: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2 mt-4">
                    <button 
                      type="submit"
                      className="w-full bg-brand-gold text-brand-emerald py-5 rounded-2xl font-black text-xl hover:bg-yellow-500 transition-all shadow-2xl flex items-center justify-center gap-3"
                    >
                      <Plus size={24} />
                      تثبيت وإضافة الرحلة الجديدة للموقع
                    </button>
                  </div>
                  <div className="md:col-span-2 mt-2 text-center text-white/40 text-xs font-bold">
                    كل رحلة تضيفها ستظهر فوراً في قائمة حجز الرحلات للمستخدمين
                  </div>
                </form>

                <div className="mt-8 pt-8 border-t border-white/10">
                  <label className="text-brand-gold font-bold text-xs mb-2 block">حذف سريع (أدخل اسم أو معرف الرحلة)</label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input 
                      type="text" 
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-red-500 outline-none font-bold placeholder:text-white/20"
                      placeholder="ابحث عن الرحلة المراد حذفها..."
                      value={deleteId}
                      onChange={e => setDeleteId(e.target.value)}
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        if (!deleteId) return;
                        const pkg = packages.find(p => p.id === deleteId || p.title.includes(deleteId));
                        if (pkg) {
                          handleDeletePackage(pkg.id);
                          setDeleteId("");
                        } else {
                          alert("عذراً، لم يتم العثور على رحلة بهذا الاسم أو المعرف.");
                        }
                      }}
                      className="bg-red-500/20 text-red-500 px-6 py-4 rounded-xl font-black hover:bg-red-500 hover:text-white transition-all border border-red-500/30 flex items-center justify-center gap-2"
                    >
                      <Trash2 size={20} />
                      تأكيد الحذف
                    </button>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button 
                      type="button"
                      onClick={() => {
                        if (window.confirm("تحذير: هل أنت متأكد من مسح جميع الرحلات من الموقع نهائياً؟")) {
                          setPackages([]);
                        }
                      }}
                      className="text-red-400 text-[10px] font-black underline hover:text-red-300"
                    >
                      مسح كافة الرحلات الحالية
                    </button>
                  </div>
                </div>

                {packages.length > 0 && (
                  <div className="mt-16 pt-12 border-t border-white/10">
                    <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                      <Clock size={20} className="text-brand-gold" />
                      إدارة الرحلات الحالية ({packages.length})
                    </h3>
                    <div className="grid gap-4">
                      {packages.map(pkg => (
                        <div key={pkg.id} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm">
                              <img src={pkg.images[0]} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div>
                              <h4 className="text-white font-bold">{pkg.title}</h4>
                              <p className="text-brand-gold/60 text-[10px] font-bold">ID: {pkg.id}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleDeletePackage(pkg.id)}
                            className="w-10 h-10 bg-red-500/20 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                            title="حذف الرحلة"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer id="تواصل معنا" className="bg-slate-900 pt-24 pb-12 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-emerald/10 blur-[100px] -mr-32 -mt-32 rounded-full" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-4 gap-12 mb-16 pb-16 border-b border-white/5">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-brand-emerald rounded-2xl flex items-center justify-center shadow-2xl border-2 border-brand-gold/20">
                  <span className="text-brand-gold font-black text-4xl font-serif">ب</span>
                </div>
                <div className="flex flex-col">
                  <h3 className="text-4xl font-black font-serif text-white leading-none">حملة الباشا</h3>
                  <span className="text-xs text-brand-gold font-black tracking-[0.2em] mt-2 underline transition-all">خليك باشا بالسفر</span>
                </div>
              </div>
              {/* Footer description removed per user request */}
              <div className="flex gap-4">
                <a href={APP_DATA.socials.instagram} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center hover:bg-brand-gold hover:text-brand-emerald transition-all">
                  <Instagram size={20} />
                </a>
                <a href={APP_DATA.socials.facebook} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center hover:bg-brand-gold hover:text-brand-emerald transition-all">
                  <Facebook size={20} />
                </a>
                <a href={APP_DATA.socials.twitter} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center hover:bg-brand-gold hover:text-brand-emerald transition-all">
                  <Twitter size={20} />
                </a>
                <a href={APP_DATA.socials.whatsapp} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center hover:bg-brand-gold hover:text-brand-emerald transition-all">
                  <MessageCircle size={20} />
                </a>
              </div>
            </div>

            {/* Quick links removed per user request */}

            <div>
              <h4 className="text-xl font-bold mb-6 text-brand-gold">للحجز والاستفسار</h4>
              <div className="flex flex-col gap-6">
                {APP_DATA.phones.map(p => (
                  <a key={p} href={`tel:${p}`} className="group">
                    <div className="flex items-center gap-3">
                      <div className="bg-brand-gold/10 p-2 rounded-lg text-brand-gold group-hover:bg-brand-gold group-hover:text-brand-emerald transition-all">
                        <Phone size={18} />
                      </div>
                      <span className="text-2xl font-bold font-mono tracking-widest">{p}</span>
                    </div>
                  </a>
                ))}
                <p className="text-sm text-slate-500 font-bold mt-2">متواجدون على مدار الساعة لخدمتكم</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-sm font-bold">
            <p>© 2026 {APP_DATA.name}. جميع الحقوق محفوظة.</p>
            <div className="flex gap-8 items-center">
              <button 
                onClick={() => setIsAdmin(!isAdmin)}
                className={`px-4 py-2 rounded-lg transition-all ${isAdmin ? "bg-brand-gold text-brand-emerald" : "bg-white/5 hover:bg-white/10"}`}
              >
                {isAdmin ? "إغلاق وضع التعديل" : "دخول وضع الشركة (المشرف)"}
              </button>
              <span>سياسة الخصوصية</span>
              <span>الشروط والأحكام</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a 
        href={`https://wa.me/${APP_DATA.phones[0].replace(/\s/g, '')}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 left-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all animate-pulse"
      >
        <MessageCircle size={32} />
      </a>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedLightboxImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedLightboxImage(null)}
            className="fixed inset-0 z-[100] bg-brand-emerald/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedLightboxImage(null)}
                className="absolute top-0 right-0 md:-top-12 md:-right-12 text-white hover:text-brand-gold transition-colors p-2"
              >
                <X size={40} />
              </button>
              <img 
                src={selectedLightboxImage} 
                className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl border-4 border-white/10" 
                alt="Enlarged view" 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


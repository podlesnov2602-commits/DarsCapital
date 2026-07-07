import React from 'react';
import { Phone, Mail, Instagram } from 'lucide-react';
import { Button } from '../components/ui/button';

const ContactPage = () => {
  return (
    <div className="w-full pt-24 md:pt-28 pb-14 md:pb-20 bg-muted min-h-screen">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-primary mb-4">Свяжитесь с нами</h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">Мы всегда готовы ответить на ваши вопросы и предложить лучшие варианты недвижимости</p>
          <div className="w-16 h-px bg-border mx-auto mt-8"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 bg-white p-5 sm:p-8 md:p-12 shadow-[0_12px_34px_rgba(15,31,58,0.08)]">

          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-serif text-primary mb-8">Контактная информация</h2>

            <div className="space-y-8 mb-12">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-muted flex items-center justify-center flex-shrink-0">
                  <Phone size={20} className="text-accentblue" />
                </div>
                <div>
                  <h4 className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Телефон / WhatsApp</h4>
                  <a href="tel:+77077157249" className="text-xl font-serif text-primary hover:text-accentblue transition-colors block">+7 707 715 72 49</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-muted flex items-center justify-center flex-shrink-0">
                  <Mail size={20} className="text-accentblue" />
                </div>
                <div>
                  <h4 className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Email</h4>
                  <a href="mailto:darscapital@gmail.com" className="text-xl font-serif text-primary hover:text-accentblue transition-colors block">darscapital@gmail.com</a>
                </div>
              </div>

            </div>

            <div>
              <h4 className="text-sm text-muted-foreground uppercase tracking-widest mb-4">Социальные сети</h4>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/d.darsil" target="_blank" rel="noopener noreferrer" className="w-12 h-12 border border-border flex items-center justify-center text-primary hover:bg-accentblue hover:text-white hover:border-accentblue transition-all">
                  <Instagram size={20} />
                </a>
              </div>
            </div>
          </div>

          <div className="bg-muted p-8 md:p-10">
            <h2 className="text-2xl font-serif text-primary mb-8">Свяжитесь с нами</h2>
            <p className="text-primary/80 mb-6">Для консультации свяжитесь с нами удобным способом — по телефону, WhatsApp или через Instagram.</p>
            <div className="space-y-4">
              <a href="tel:+77077157249" className="block">
                <Button className="w-full bg-accentblue hover:bg-accentblue-hover text-white rounded-none py-6 uppercase tracking-widest text-sm transition-all duration-300">
                  Позвонить
                </Button>
              </a>
              <a href="https://wa.me/77077157249" target="_blank" rel="noopener noreferrer" className="block">
                <Button className="w-full bg-[#25D366] hover:bg-[#1EBE5A] text-white rounded-none py-6 uppercase tracking-widest text-sm transition-all duration-300 shadow-[0_10px_24px_rgba(37,211,102,0.35)]">
                  Написать в WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContactPage;

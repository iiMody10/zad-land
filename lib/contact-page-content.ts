export interface ContactPageContent {
    pageEnabled: boolean;
    heroEnabled: boolean;
    whatsappEnabled: boolean;
    contactInfoEnabled: boolean;
    addressEnabled: boolean;
    hoursEnabled: boolean;
    emailEnabled: boolean;
    socialEnabled: boolean;
    facebookEnabled: boolean;
    instagramEnabled: boolean;
    formEnabled: boolean;
    contactWhatsappUrl: string;
    contactFacebookUrl: string;
    contactInstagramUrl: string;
    heroBadgeAr: string;
    heroBadgeEn: string;
    heroTitleAr: string;
    heroTitleEn: string;
    heroDescriptionAr: string;
    heroDescriptionEn: string;
    whatsappTitleAr: string;
    whatsappTitleEn: string;
    whatsappDescriptionAr: string;
    whatsappDescriptionEn: string;
    addressTitleAr: string;
    addressTitleEn: string;
    addressLineAr: string;
    addressLineEn: string;
    addressDescriptionAr: string;
    addressDescriptionEn: string;
    hoursTitleAr: string;
    hoursTitleEn: string;
    hoursLineAr: string;
    hoursLineEn: string;
    hoursDescriptionAr: string;
    hoursDescriptionEn: string;
    emailTitleAr: string;
    emailTitleEn: string;
    socialTitleAr: string;
    socialTitleEn: string;
    formTitleAr: string;
    formTitleEn: string;
    formDescriptionAr: string;
    formDescriptionEn: string;
    successTitleAr: string;
    successTitleEn: string;
    successDescriptionAr: string;
    successDescriptionEn: string;
    nameLabelAr: string;
    nameLabelEn: string;
    namePlaceholderAr: string;
    namePlaceholderEn: string;
    businessLabelAr: string;
    businessLabelEn: string;
    businessPlaceholderAr: string;
    businessPlaceholderEn: string;
    phoneLabelAr: string;
    phoneLabelEn: string;
    phonePlaceholderAr: string;
    phonePlaceholderEn: string;
    messageLabelAr: string;
    messageLabelEn: string;
    messagePlaceholderAr: string;
    messagePlaceholderEn: string;
    submitLabelAr: string;
    submitLabelEn: string;
    sendingLabelAr: string;
    sendingLabelEn: string;
    seoTitleAr: string;
    seoTitleEn: string;
    seoDescriptionAr: string;
    seoDescriptionEn: string;
}

export const DEFAULT_CONTACT_PAGE_CONTENT: ContactPageContent = {
    pageEnabled: true,
    heroEnabled: true,
    whatsappEnabled: true,
    contactInfoEnabled: true,
    addressEnabled: true,
    hoursEnabled: true,
    emailEnabled: true,
    socialEnabled: true,
    facebookEnabled: true,
    instagramEnabled: true,
    formEnabled: true,
    contactWhatsappUrl: '',
    contactFacebookUrl: '',
    contactInstagramUrl: '',
    heroBadgeAr: 'خدمة عملاء وتوريد الجملة',
    heroBadgeEn: 'Wholesale Support & Sales',
    heroTitleAr: 'تواصل معنا - شركة زاد لاند',
    heroTitleEn: 'Contact Zad Land Wholesale',
    heroDescriptionAr: 'فريق مبيعات الجملة والتوزيع جاهز للرد على استفساراتكم وتزويدكم بعروض الأسعار وجداول التسليم لكافة المحافظات.',
    heroDescriptionEn: 'Our wholesale sales & distribution team is ready to assist your business with customized supply quotes and scheduled deliveries.',
    whatsappTitleAr: 'محادثة مباشرة عبر واتساب',
    whatsappTitleEn: 'Chat via WhatsApp',
    whatsappDescriptionAr: 'استجابة فورية لطلبات الجملة وقوائم الأسعار',
    whatsappDescriptionEn: 'Instant response for wholesale quotes',
    addressTitleAr: 'المقر الرئيسي والمستودعات',
    addressTitleEn: 'Headquarters & Warehouses',
    addressLineAr: 'المنطقة الصناعية - حمص، سوريا',
    addressLineEn: 'Industrial Area - Homs, Syria',
    addressDescriptionAr: 'أسطول توزيع يغطي كافة المحافظات',
    addressDescriptionEn: 'Logistics fleet covering all governorates',
    hoursTitleAr: 'أوقات العمل والتوزيع',
    hoursTitleEn: 'Operating Hours',
    hoursLineAr: 'السبت - الخميس: ٨:٠٠ ص - ٦:٠٠ م',
    hoursLineEn: 'Sat - Thu: 8:00 AM - 6:00 PM',
    hoursDescriptionAr: 'استقبال طلبات الشحن على مدار الساعة',
    hoursDescriptionEn: '24/7 order dispatch processing',
    emailTitleAr: 'البريد الإلكتروني التجاري',
    emailTitleEn: 'Commercial Email',
    socialTitleAr: 'تابع صفحاتنا الرسمية:',
    socialTitleEn: 'Follow Official Channels:',
    formTitleAr: 'طلب تسعير أو استفسار جملة',
    formTitleEn: 'Request Wholesale Quote',
    formDescriptionAr: 'أرسل تفاصيل نشاطك التجاري وسيتواصل معك مندوب المبيعات المعتمد فوراً.',
    formDescriptionEn: 'Fill out your business details and our dedicated sales representative will reach out promptly.',
    successTitleAr: 'تم استلام طلبكم بنجاح!',
    successTitleEn: 'Inquiry Received Successfully!',
    successDescriptionAr: 'شكراً لتواصلكم مع شركة زاد لاند. سيقوم فريق المبيعات بالتواصل معكم في أقرب وقت.',
    successDescriptionEn: 'Thank you for reaching out to Zad Land. Our wholesale sales team will contact you shortly.',
    nameLabelAr: 'الاسم الكامل *',
    nameLabelEn: 'Full Name *',
    namePlaceholderAr: 'محمد خالد',
    namePlaceholderEn: 'John Doe',
    businessLabelAr: 'اسم المتجر / الشركة *',
    businessLabelEn: 'Business / Store Name *',
    businessPlaceholderAr: 'سوبرماركت الأمانة',
    businessPlaceholderEn: 'Al-Amana Supermarket',
    phoneLabelAr: 'رقم الهاتف أو الواتساب *',
    phoneLabelEn: 'Phone or WhatsApp Number *',
    phonePlaceholderAr: '+963...',
    phonePlaceholderEn: '+963...',
    messageLabelAr: 'تفاصيل الطلب أو الاستفسار *',
    messageLabelEn: 'Inquiry / Order Details *',
    messagePlaceholderAr: 'اكتب المنتجات أو الكميات المطلوبة والمحافظة...',
    messagePlaceholderEn: 'Specify products, quantities needed, and location...',
    submitLabelAr: 'إرسال الرسالة',
    submitLabelEn: 'Send Message',
    sendingLabelAr: 'جاري الإرسال...',
    sendingLabelEn: 'Sending...',
    seoTitleAr: 'تواصل معنا | زاد لاند',
    seoTitleEn: 'Contact Zad Land Wholesale',
    seoDescriptionAr: 'تواصل مع فريق مبيعات وتوزيع شركة زاد لاند. استفسارات طلبات الجملة، عقود التوريد التجاري، وخدمة العملاء في كافة المحافظات.',
    seoDescriptionEn: 'Contact the Zad Land wholesale sales and distribution team for product inquiries, business supply, and customer support.',
};

export function parseContactPageContent(value: unknown): ContactPageContent {
    let parsed: unknown = value;
    if (typeof value === 'string') {
        try {
            parsed = JSON.parse(value);
        } catch {
            parsed = null;
        }
    }

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        return { ...DEFAULT_CONTACT_PAGE_CONTENT };
    }

    const source = parsed as Record<string, unknown>;
    const result = { ...DEFAULT_CONTACT_PAGE_CONTENT };
    for (const key of Object.keys(result) as (keyof ContactPageContent)[]) {
        const candidate = source[key];
        if (typeof result[key] === 'boolean') {
            if (typeof candidate === 'boolean') result[key] = candidate as never;
        } else if (typeof candidate === 'string') {
            result[key] = candidate as never;
        }
    }
    return result;
}

import { formatItemsPerPackage, formatPackageQuantity } from "./packaging";

export type WhatsAppOrder = {
    id: string;
    shopName?: string | null;
    Name: string;
    phone: string;
    city: string;
    streetAddress: string;
    notes?: string | null;
    totalAmount: number | string;
    items: {
        quantity: number;
        price: number | string;
        options?: string | null;
        product: { name: string; nameAr?: string | null; packaging?: string | null; itemsPerPackage?: string | null };
    }[];
};

export function buildWhatsAppOrderUrl(phone: string, order: WhatsAppOrder, formatPrice: (usdPrice: number) => string) {
    const lines = [
        "🛒 *طلب جملة جديد – زاد لاند*",
        `📦 *رقم الطلب:* #${order.id.slice(-8).toUpperCase()}`,
        order.shopName ? `🏪 *المحل:* ${order.shopName}` : null,
        `👤 *صاحب الطلب:* ${order.Name}`,
        `📞 *الهاتف:* ${order.phone}`,
        `📍 *المحافظة:* ${order.city}`,
        `🏢 *العنوان:* ${order.streetAddress}`,
        "━━━━━━━━━━━━━━━━━━",
        "*المنتجات المطلوبة:*",
        ...order.items.map((item, index) => {
            const details = formatItemsPerPackage(item.product.itemsPerPackage, item.product.packaging, "ar");
            const quantity = formatPackageQuantity(item.quantity, item.product.packaging, "ar");
            const option = item.options ? ` (${item.options})` : "";
            return `${index + 1}. ${item.product.nameAr || item.product.name}${option}\n   ${quantity}${details ? ` · ${details}` : ""} · ${formatPrice(Number(item.price) * item.quantity)}`;
        }),
        "━━━━━━━━━━━━━━━━━━",
        `💰 *إجمالي المنتجات:* ${formatPrice(Number(order.totalAmount))}`,
        "موعد التوصيل وتكلفته يؤكدهما فريق المبيعات. لا يتم تحصيل دفعة إلكترونية الآن.",
        order.notes ? `📝 *ملاحظات:* ${order.notes}` : null,
        "يرجى تأكيد استلام الطلب وجدولته مع فريق التوزيع.",
    ].filter((line): line is string => Boolean(line));
    let number = phone.replace(/\D/g, "");
    if (number.startsWith("00963")) number = `963${number.slice(5)}`;
    else if (number.startsWith("09") && number.length === 10) number = `963${number.slice(1)}`;
    return `https://wa.me/${number}?text=${encodeURIComponent(lines.join("\n"))}`;
}

import type { PaymentMethod } from "@/types/Payment";

export const PaymentMethodLabel: Record<PaymentMethod, string> = {
    promptpay: 'QR พร้อมเพย์',
    cod: 'เก็บเงินปลายทาง',
}
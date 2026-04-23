import type { OrderStatus } from "@/types/Order";

export const OrderStatusLabel: Record<OrderStatus, string> = {
    pending: 'รอชำระเงิน',
    waiting_verify: 'รอการตรวจสอบการชำระเงิน',
    confirmed: 'ยืนยันคำสั่งซื้อ',
    picking: 'กำลังเตรียมสินค้า',
    shipped: 'กำลังจัดส่ง',
    done: 'จัดส่งสำเร็จ',
    cancelled: 'ยกเลิก',
}

export const OrderStatusColor: Record<OrderStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-700 border border-yellow-400',
    waiting_verify: 'bg-orange-100 text-orange-700 border border-orange-400',
    confirmed: 'bg-blue-100 text-blue-700 border border-blue-400',
    picking: 'bg-purple-100 text-purple-700 border border-purple-400',
    shipped: 'bg-sky-100 text-sky-700 border border-sky-400',
    done: 'bg-green-100 text-green-700 border border-green-400',
    cancelled: 'bg-red-100 text-red-700 border border-red-400',
}

export const OrderStatusLabelCustomer: Record<OrderStatus, string> = {
    pending: 'รอชำระเงิน',
    waiting_verify: 'รอตรวจสอบการชำระเงิน',
    confirmed: 'ยืนยันคำสั่งซื้อแล้ว',
    picking: 'ร้านกำลังเตรียมสินค้า',
    shipped: 'กำลังจัดส่ง',
    done: 'ได้รับสินค้าแล้ว',
    cancelled: 'ยกเลิก',
}

export const OrderStatusIcon: Record<OrderStatus, string> = {
    pending: 'pi pi-clock',
    waiting_verify: 'pi pi-credit-card',
    confirmed: 'pi pi-check-circle',
    picking: 'pi pi-box',
    shipped: 'pi pi-truck',
    done: 'pi pi-check',
    cancelled: 'pi pi-times-circle',
}
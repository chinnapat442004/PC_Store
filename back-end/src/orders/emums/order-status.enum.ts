export enum OrderStatus {
    PENDING = 'pending',                 // ยังไม่จ่ายเงิน
    WAITING_VERIFY = 'waiting_verify',   // โอนแล้ว รอตรวจสลิป
    CONFIRMED = 'confirmed',             //ดรวจสลิปผาน
    PICKING = 'picking',                 // กำลังแพ็ค
    SHIPPED = 'shipped',                 // ส่งแล้ว
    DONE = 'done',                       // สำเร็จ
    CANCELLED = 'cancelled',             // ยกเลิก
}


export enum PaymentMethod {
    PROMPTPAY = 'promptpay',
    COD = 'cod'

}
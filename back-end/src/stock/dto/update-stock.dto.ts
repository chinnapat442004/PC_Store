export class UpdateStockDto {
  product_id: number;
  branch_id: number;
  quantity: number; // +เพิ่ม / -ลด
  type: 'SALE' | 'PURCHASE' | 'ADJUST' | 'RETURN' | 'TRANSFER';
  ref_id?: number;
  note?: string;
}
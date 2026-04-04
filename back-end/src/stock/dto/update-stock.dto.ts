export class UpdateStockDto {
  product_id: number;
  quantity: number; 
  branch_id: number;
  ref_id?: number;
  note?: string;
}
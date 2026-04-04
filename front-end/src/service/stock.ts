import type { UpdateStock } from "@/types/Stock";
import http from "./http";

function getStocks(page: number, limit: number, search: string) {
  return http.get(`/stock?page=${page}&limit=${limit}&search=${search}`)
}


function updateStock(data:UpdateStock) {
   return http.post('/stock/update', data);
}

export default {
getStocks,updateStock

}
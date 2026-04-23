import http from "./http";
export function getPaymentQr(orderId: number) {
    return http.get(`/payment/${orderId}/qr`)
}

export function getPaymentByOrder(orderId: number) {
    return http.get(`/payment/${orderId}`)
}

function uploadSlip(paymentId: number, file: File) {
    const formData = new FormData();
    formData.append("slip_image", file);

    return http.post(`/payment/${paymentId}/slip`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}
export default { getPaymentByOrder, getPaymentQr, uploadSlip }
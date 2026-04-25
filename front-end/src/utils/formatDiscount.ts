export function formatDiscount(type: 'percent' | 'fixed', value: number) {
    if (type === 'percent') {
        return `${value}%`;
    }
    return `฿${value}`;
}

export function formatType(type: 'percent' | 'fixed') {
    return type === 'percent' ? 'เปอร์เซ็นต์' : 'จำนวนเงิน';
}
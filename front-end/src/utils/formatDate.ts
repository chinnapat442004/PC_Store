export const formatThaiDateTime = (date: string | Date) => {
    const d = new Date(date)

    const months = [
        'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
        'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ]

    const day = d.getDate()
    const month = months[d.getMonth()]
    const year = d.getFullYear() + 543

    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')

    return `${day} ${month} ${year} ${hours}:${minutes}`
}

export const formatThaiDate = (date: string | Date) => {
    const d = new Date(date)

    const months = [
        'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
        'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ]

    const day = d.getDate()
    const month = months[d.getMonth()]
    const year = d.getFullYear() + 543
    return `${day} ${month} ${year} `
}
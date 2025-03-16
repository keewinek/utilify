export function leading_zero(num: number) {
    return num < 10 ? `0${num}` : num;
}

export function get_formatted_timestamp(timestamp: string) {
    const date = new Date(parseInt(timestamp));
    return `${leading_zero(date.getDate())}.${leading_zero(date.getMonth() + 1)}.${date.getFullYear()} ${leading_zero(date.getHours())}:${leading_zero(date.getMinutes())}`;
}
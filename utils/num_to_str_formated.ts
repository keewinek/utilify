interface format_milestone
{
    decimals: number
    symbol: string
}

const milestone_list: format_milestone[] = [
    { decimals: 4, symbol: "K" },
    { decimals: 7, symbol: "M" },
    { decimals: 10, symbol: "B" },
    { decimals: 13, symbol: "T" },
    { decimals: 16, symbol: "Q" },
    { decimals: 19, symbol: "R" },
    { decimals: 22, symbol: "S" },
    { decimals: 25, symbol: "Ts" },
    { decimals: 28, symbol: "Te" },
    { decimals: 31, symbol: "N" },
    { decimals: 34, symbol: "D" },
    { decimals: 37, symbol: "U" },
    { decimals: 40, symbol: "Db" },
    { decimals: 43, symbol: "Tc" }
]

export function num_to_str_formatted(num: number)
{
    num = Math.floor(num);
    const num_str = num.toString();

    for (let i = milestone_list.length - 1; i >= 0; i--) {
        if (num_str.length >= milestone_list[i].decimals) {
            let num_str_formatted = num_str.slice(0, -milestone_list[i].decimals + 1);
            const floating_index = num_str.length - milestone_list[i].decimals + 1;

            if (num_str[floating_index] != "0") {
                num_str_formatted += "." + num_str[floating_index]
            }

            num_str_formatted += milestone_list[i].symbol;
            return num_str_formatted;
        }
    }

    return num_str;
}

export function ntsf(num: number)
{
    return num_to_str_formatted(num);
}
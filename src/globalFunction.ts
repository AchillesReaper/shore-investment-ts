import { price_aapl, price_amzn, price_googl, price_nvda, price_tsla } from "./components/data_price";
import { transaction_cashflow, transaction_trade } from "./components/types";

export function formatNumberString(origin_number: number, decimal_plcaes: number): string {

    return origin_number.toLocaleString('en-us', {
        style: 'decimal',
        minimumFractionDigits: decimal_plcaes,
        maximumFractionDigits: decimal_plcaes,
    });
}


export function getCurrentTime(): string {
    // Create a new Date object
    const currentDate = new Date();

    // Get individual components of the date and time
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Month is zero-based, so add 1
    const day = currentDate.getDate();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();

    // Format the date and time as a string
    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    // Return the formatted time
    return formattedDateTime;
}

export function logCashflowRecord(amount: number, i_o: string, note: string) {
    const prevCount: number = parseInt(window.localStorage.getItem('Cashflow_Count')!)
    window.localStorage.setItem('Cashflow_Count', String(prevCount + 1))

    let newCashflow: transaction_cashflow = {
        "id": `CF${prevCount + 1}`,
        "time": getCurrentTime(),
        "amount": amount,
        "i_o": i_o,
        "note": note
    }

    let transactions_ary: transaction_cashflow[];
    let transactions_str: string | null = window.localStorage.getItem('transaction_cashflow')
    if (transactions_str) {
        transactions_ary = JSON.parse(transactions_str)
    } else {
        transactions_ary = []
    }
    transactions_ary.unshift(newCashflow)
    window.localStorage.setItem('transaction_cashflow', JSON.stringify(transactions_ary))
    window.dispatchEvent(new Event('storage'))
}

export function logTradeRecord(ticker: string, tradePrice: number, tradeAmount: number, b_s: string) {

    const prevCount = parseInt(window.localStorage.getItem('Trade_Count')!)
    window.localStorage.setItem('Trade_Count', String(prevCount + 1))

    let newTransactionTrade: transaction_trade = {
        "id": `T${prevCount + 1}`,
        "time": getCurrentTime(),
        "ticker": ticker,
        "price": tradePrice,
        "amount": tradeAmount,
        "b_s": b_s

    }

    let transactions_ary: transaction_trade[]
    let transactions_str = window.localStorage.getItem('transaction_trade')
    if (transactions_str) {
        transactions_ary = JSON.parse(transactions_str)
    } else {
        transactions_ary = []
    }
    transactions_ary.unshift(newTransactionTrade)
    window.localStorage.setItem('transaction_trade', JSON.stringify(transactions_ary))
    window.dispatchEvent(new Event('storage'))
}


export function quoteFromSample(ticker: string): string[] | null {
    if (!ticker) {
        alert('enter ticker')
        return null
    } else {
        let data;
        switch (ticker) {
            case 'aapl':
                data = price_aapl
                break;
            case 'amzn':
                data = price_amzn
                break;
            case 'googl':
                data = price_googl
                break;
            case 'nvda':
                data = price_nvda
                break;
            case 'tsla':
                data = price_tsla
                break;
            default:
                return null
                break;
        }
        if (data) {
            const dataEntries = Object.entries(data["Time Series (5min)"])
            const latestPrice = [dataEntries[0][0], dataEntries[0][1]["4. close"]]
            return latestPrice
        } else {
            return null
        }
    }
}
export interface Portfolio {
    refresh_time: string,
    portfolio_value: number,
    position: {
        [ticker: string]: Ticker;
    }
}

export interface Ticker {
    average_buy_price: number,
    amount: number,
    market_price: number,
    market_value: number,
    p_l: number
}

export interface transaction_trade {
    id: string,
    time: string,
    ticker: string,
    price: number,
    amount: number,
    b_s: string
}

export interface transaction_cashflow {
    id: string,
    time: string,
    amount: number,
    i_o: string,
    note: string
}
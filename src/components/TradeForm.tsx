import { Container, Row, Col } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { logCashflowRecord, logTradeRecord, quoteFromSample } from "../globalFunction";

export default function TradeForm() {
    const [ticker, setTicker] = useState<string>("")
    const [latestPrice, setLatestPrice] = useState<string[]>([])
    const [quoteTime, setQuoteTime] = useState<number>(0)
    const [tradePrice, setTradePrice] = useState<number>(0)
    const [tradeAmount, setTradeAmount] = useState<number>(0)
    let btnLock = tradeAmount < 1 || tradePrice < 0.01 || !ticker || !latestPrice

    useEffect(() => {
        // quoteTime record how many time the ticker is quoted ( when the quote btn is clicked)
        if (quoteTime > 0 && ticker) {
            let quotePrice: string[] | null = quoteFromSample(ticker)
            //check if the price quote successeful, if not, reset ticker and lastPrice to disable buy/sell buttons
            if (quotePrice) {
                setLatestPrice(quotePrice)
                setTradePrice(parseFloat(quotePrice[1]))
            } else {
                setTicker("")
                setLatestPrice([])
            }
        }
    }, [quoteTime])

    const buy = () => {
        // check the account balance before buying
        let cash = parseFloat(window.localStorage.getItem('Cash_Balance')!)
        if (tradePrice * tradeAmount > cash) {
            alert('not enough fund')
        } else {
            // sufficient cash -> process transaction,
            // a) log transaction records, b) deduct cash, c) current position
            // -> a)
            logTradeRecord(ticker, tradePrice, tradeAmount, 'buy')
            logCashflowRecord(tradeAmount * tradePrice, 'out', 'buy stock')

            // -> b) update cash balance
            let currentBal = parseFloat(window.localStorage.getItem('cashBalance')) - tradeAmount * tradePrice
            window.localStorage.setItem('cashBalance', currentBal)


            // -> c) update current position
            // --> c1) get the currentPosition from localStorage
            let currentPosition = JSON.parse(window.localStorage.getItem('currentPosition'));

            // --> b2) update the currentPosition
            let market_price = parseFloat(quoteFromSample(ticker)[1])
            // sinario 1: `currentPosition['position']` is not empty, i)ticker also exist, ii)no record for ticker
            if (currentPosition['position']) {
                let positionFound = false;

                // i) ticker also exist
                for (const ticker_record in currentPosition['position']) {
                    if (ticker_record == ticker) {
                        positionFound = true;
                        // update the ticker's position
                        const amount_origin = currentPosition['position'][ticker_record].amount;
                        const average_buy_price_origin = currentPosition['position'][ticker_record].average_buy_price;
                        currentPosition['position'][ticker_record].average_buy_price = ((amount_origin * average_buy_price_origin) + (tradeAmount * tradePrice)) / (amount_origin + tradeAmount);
                        currentPosition['position'][ticker_record].amount += tradeAmount;
                        currentPosition['position'][ticker_record].market_price = market_price
                        currentPosition['position'][ticker_record].market_value = (amount_origin + tradeAmount) * market_price
                        currentPosition['position'][ticker_record].p_l = (market_price - currentPosition['position'][ticker_record].average_buy_price) * currentPosition['position'][ticker_record].amount
                        // update the overall market value
                        currentPosition['market_value'] += currentPosition['position'][ticker_record].market_value - amount_origin * average_buy_price_origin
                        break;
                    }
                }
                // ii) no record for ticker
                if (!positionFound) {
                    currentPosition['position'][ticker] = {
                        "average_buy_price": tradePrice,
                        "amount": tradeAmount,
                        "market_price": market_price,
                        "market_value": tradeAmount * market_price,
                        "p_l": (market_price - tradePrice) * tradeAmount
                    }
                    console.log("current pos when no pos found:", currentPosition)
                }

            } else {
                //sinario 2: `currentPosition['position']` is empty -> create a new position for ticker
                currentPosition["position"] = {
                    [ticker]: {
                        "average_buy_price": tradePrice,
                        "amount": tradeAmount,
                        "market_price": market_price,
                        "market_value": tradeAmount * market_price,
                        "p_l": (market_price - tradePrice) * tradeAmount
                    }
                }

            }

            window.localStorage.setItem('currentPosition', JSON.stringify(currentPosition))

            refreshCurrentPositionValue()

        }
    }

    return (
        <div>
            //return value
        </div>
    );
}

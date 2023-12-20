import { Container, Row, Col } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { formatNumberString, logCashflowRecord, logTradeRecord, quoteFromSample, refreshCurrentPositionValue } from "../globalFunction";
import { Portfolio, Ticker } from "./types";
import { cpuUsage } from "process";

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

    function buy() {
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
            let currentBal: number = parseFloat(window.localStorage.getItem('Cash_Balance')!) - tradeAmount * tradePrice
            window.localStorage.setItem('Cash_Balance', String(currentBal))


            // -> c) update current position
            // --> c1) get the currentPosition from localStorage
            let currentPosition: Portfolio = JSON.parse(window.localStorage.getItem('Current_Position')!);

            // --> b2) update the currentPosition
            let market_price: number = parseFloat(latestPrice[1])
            // market_price here make use of the price quote before -> ignoring temporary price movement
            // market price of each ticker will be refresh at the final step

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
                        currentPosition['portfolio_value'] += currentPosition['position'][ticker_record].market_value - amount_origin * average_buy_price_origin
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

            window.localStorage.setItem('Current_Position', JSON.stringify(currentPosition))
            // this line can be remove if refreshing all pos in the next step

            refreshCurrentPositionValue()

        }
    }

    function sell() {
        // Before selling current position needs to be examine if ther sufficient holding
        // if no -> refuse trading
        // if yes -> sufficient holding? -> process the trade -> update a)'trade_fund'; b)'currentPosition'; c)'cashBalance'
        const currentPos_str: string | null = window.localStorage.getItem('Current_Position')
        console.log(currentPos_str);
        if (currentPos_str) {
            let currentPos: Portfolio = JSON.parse(currentPos_str)
            let positionFound = false

            for (const ticker_record in currentPos['position']) {
                if (ticker_record == ticker) {
                    positionFound = true
                    const amount_origin = currentPos['position'][ticker].amount;
                    const average_buy_price_origin = currentPos['position'][ticker].average_buy_price;

                    if (tradeAmount <= amount_origin) {
                        // -> updated local storage
                        // a) transaction records, b) cash balance, c) current position
                        // a) update transaction records
                        logTradeRecord(ticker, tradePrice, tradeAmount, 'sell')
                        logCashflowRecord(tradeAmount * tradePrice, 'in', 'sell stock')


                        // b) update cash balance 
                        let currentBal = parseFloat(window.localStorage.getItem('Cash_Balance')!) + tradeAmount * tradePrice
                        window.localStorage.setItem('Cash_Balance', String(currentBal))


                        // c) update current position: update holding amount & avg buy-in price
                        if (amount_origin == tradeAmount) {
                            delete currentPos['position'][ticker]
                        } else {
                            currentPos['position'][ticker].amount -= tradeAmount;
                        }
                        window.localStorage.setItem('Current_Position', JSON.stringify(currentPos))

                        refreshCurrentPositionValue()
                    } else {
                        alert(`insufficient position for ${ticker}. Currently holding: ${amount_origin} share(s))`);
                    }

                    break;

                }
            }
            if (!positionFound) {
                alert(`currently have no position for ${ticker}`);
            }

        } else {
            alert(`currently have no position for ${ticker}`);
        }
    }

    return (
        <Container
            className="p-2 border border-primary rounded-3 my-1"
        >
            <Row className="text-center"><h3>Order Book</h3></Row>
            <Row sm={2} className="justify-content-evenly">
                <Col className="border-end border-primary">
                    <Row className="my-2">
                        <Col>Ticker:</Col>
                        <Col>
                            <input
                                name="ticker-input"
                                type="text"
                                placeholder="ticker symble"
                                value={ticker}
                                onChange={(e) => setTicker(e.target.value)}
                            ></input>
                        </Col>

                    </Row>
                    <Row className="justify-content-center">
                        <Button
                            className="mx-2"
                            style={{ width: '80px' }}
                            variant="primary"
                            onClick={() => {
                                setQuoteTime(prev => (prev + 1))
                            }}>
                            Quote
                        </Button>
                    </Row>
                    <Row >
                        <p>Last Price: {latestPrice ? `${latestPrice[1]} @ ${latestPrice[0]}` : null}</p>
                    </Row>
                </Col>
                <Col >
                    <Row className="my-2 justify-content-between">
                        <Col>Trade Price:</Col>
                        <Col>
                            <input
                                type="number"
                                min={0}
                                value={tradePrice}
                                onChange={(e) => setTradePrice(parseFloat(e.target.value))}
                            />
                        </Col>
                    </Row>

                    <Row className="my-2">
                        <Col>Trade Amount:</Col>
                        <Col>
                            <input
                                type="number"
                                min={1}
                                value={tradeAmount}
                                onChange={(e) => setTradeAmount(parseInt(e.target.value))}
                            />
                        </Col>
                    </Row>
                    <Row className='justify-content-center'>
                        <Button
                            className="my-2 mx-3"
                            style={{ width: '100px' }}
                            variant="primary"
                            disabled={btnLock}
                            onClick={buy}>
                            Buy
                        </Button>
                        <Button
                            className="my-2 mx-3"
                            style={{ width: '100px' }}
                            variant="primary"
                            disabled={btnLock}
                            onClick={sell}>
                            Sell
                        </Button>
                    </Row>
                    <Row>
                    </Row>
                </Col>


            </Row >
        </Container>
    );
}

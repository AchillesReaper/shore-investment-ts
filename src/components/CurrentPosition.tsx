import { useEffect, useState } from "react";
import { Portfolio } from "./types";
import { formatNumberString, refreshCurrentPositionValue } from "../globalFunction";
import { Button, Container, Table } from "react-bootstrap";

export default function CurrentPosition() {
    let tableBody: JSX.Element[] = [];
    const [currentPosition, setCurrentPosition] = useState<Portfolio | null>(() => {
        try {
            return JSON.parse(window.localStorage.getItem('Current_Position')!)
        } catch (e) {
            return null
        }
    })

    const renderCurrentPosition = () => {
        if (currentPosition) {
            tableBody = (Object.keys(currentPosition['position']).map((ticker) => {
                const tickerInfo = currentPosition['position'][ticker];
                return (
                    <tr key={ticker}>
                        <td>{ticker}</td>
                        <td>{formatNumberString(tickerInfo.average_buy_price, 2)}</td>
                        <td>{tickerInfo.amount}</td>
                        <td>{formatNumberString(tickerInfo.market_price, 2)}</td>
                        <td>{formatNumberString(tickerInfo.market_value, 2)}</td>
                        <td>{formatNumberString(tickerInfo.p_l, 2)}</td>
                    </tr>
                )
            }))
        }
    }

    renderCurrentPosition()

    useEffect(() => {
        const handlePositionUpdate = () => {
            setCurrentPosition(JSON.parse(window.localStorage.getItem('Current_Position')!))
        }

        window.addEventListener('storage', handlePositionUpdate)

        return () => { window.removeEventListener('storage', handlePositionUpdate) }
    }, [])

    return (
        <Container className="border border-primary rounded-3 my-1" style={{overflow: 'scroll'}}>
            <h3>Current Position</h3>
            <div className="row justify-content-evenly">
                <label>last update: {currentPosition ? currentPosition.refresh_time : null}</label>
                <Button
                    className="mx-2"
                    style={{ width: '120px' }}
                    onClick={refreshCurrentPositionValue}
                >
                    Refresh
                </Button>
            </div>
            <p>


            </p>
            <Table striped bordered hover variant="dark"> 
                <thead style={{position:'sticky', top: '0', zIndex: 1000}}>
                    <tr>
                        <th>Ticker</th>
                        <th>Buy-in Price</th>
                        <th>Amount</th>
                        <th>Market Price</th>
                        <th>Market Value</th>
                        <th>P/L</th>
                    </tr>
                </thead>
                <tbody>
                    {tableBody}
                </tbody>
            </Table>
        </Container>
    );
}

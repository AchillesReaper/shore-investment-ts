import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { formatNumberString } from "../globalFunction";
import { transaction_trade } from "./types";

export default function TradeRecord() {
    let tableBody: JSX.Element[] = [];
    const [tradeRec, setTradeRec] = useState<transaction_trade[]>(() => {
        try {
            return JSON.parse(localStorage.getItem("transaction_trade")!)
        } catch (e) {
            return null
        }
    })

    if (tradeRec) {
        tableBody = tradeRec.map((record) => {
            return (
                <tr key={record.id}>
                    <td>{record.time}</td>
                    <td>{record.ticker}</td>
                    <td>{formatNumberString(record.price, 2)}</td>
                    <td>{record.amount}</td>
                    <td>{record.b_s}</td>
                </tr>
            )
        })
    }

    useEffect(() => {
        const handleTradeUpdate = () => {
            try {
                setTradeRec(JSON.parse(window.localStorage.getItem('Trade_Record')!))
            }catch{
                return
            }
        }
        window.addEventListener('storage', handleTradeUpdate)
        return () => { window.removeEventListener('storage', handleTradeUpdate) }
    }, [])

    return (
        <Table striped bordered hover variant="dark">
            <thead style={{ position: 'sticky', top: '0', zIndex: 1000 }}>
                <tr>
                    <th>Time</th>
                    <th>Ticker</th>
                    <th>Price</th>
                    <th>Amount</th>
                    <th>B/S</th>
                </tr>
            </thead>
            <tbody>
                {tableBody}
            </tbody>
        </Table>
    );
}

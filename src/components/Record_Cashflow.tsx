import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { formatNumberString } from "../globalFunction";
import { transaction_cashflow } from "./types";

export default function CashflowRecord() {
    let tableBody: JSX.Element[] = []
    const [fundRec, setFundRec] = useState<transaction_cashflow[]>(() => {
        try {
            return JSON.parse(localStorage.getItem("Cashflow_Record")!)
        } catch (e) {
            return null
        }
    })

    if (fundRec) {
        tableBody = fundRec.map((record) => {
            return (
                <tr key={record.id}>
                    <td>{record.time}</td>
                    <td>{formatNumberString(record.amount, 2)}</td>
                    <td>{record.i_o}</td>
                    <td>{record.note}</td>
                </tr>
            )
        })
    }

    useEffect(() => {
        const handleFundUpdate = () => {
            try {
                setFundRec(JSON.parse(window.localStorage.getItem('Cashflow_Record')!))
            } catch {
                return
            }
        }
        window.addEventListener('storage', handleFundUpdate)
        return () => { window.removeEventListener('storage', handleFundUpdate) }
    }, [])

    return (
        <Table striped bordered hover variant="dark">
            <thead
                style={{ position: 'sticky', top: 0, zIndex: 1000 }}
            >
                <tr >
                    <th>Time</th>
                    <th>Amount</th>
                    <th>I/O</th>
                    <th>note</th>
                </tr>
            </thead>
            <tbody>
                {tableBody}
            </tbody>
        </Table>
    );
}

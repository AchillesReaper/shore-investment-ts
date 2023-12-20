import { useEffect, useState } from "react";
import { Button, Container, Col, Row } from "react-bootstrap";
import { formatNumberString, logCashflowRecord } from "../globalFunction";

export default function CashflowForm() {
    const [cashBalance, setCashBalance] = useState<number>(parseFloat(window.localStorage.getItem('Cash_Balance')!));
    const [cashflow, setCashflow] = useState<number>(0)

    useEffect(() => {
        const handleStorageChange = () => {
            setCashBalance(parseFloat(window.localStorage.getItem('Cash_Balance')!))
        }
        window.addEventListener('storage', handleStorageChange)

        return () => {
            window.removeEventListener('storage', handleStorageChange)
        }
    }, [])

    return (
        <Container
            className="text-center p-2 border border-primary rounded-3 my-1"
        >
            <h3>Cashflow</h3>
            <Row className="my-2">
                <label > Current Available Balance: {formatNumberString(cashBalance, 2)} </label>
            </Row>
            <Row className="my-2">
                <label >
                    Amount:
                    <input
                        type="number"
                        value={cashflow}
                        onChange={(e) => {
                            setCashflow(parseFloat(e.target.value))

                        }}
                    />
                </label>
            </Row>

            <Row className='my-2 justify-content-center'>

                <Button
                    className="m-2"
                    style={{ width: '100px' }}
                    variant="primary"
                    onClick={() => {
                        window.localStorage.setItem('Cash_Balance', String(cashBalance + cashflow))
                        window.dispatchEvent(new Event('storage'))
                        logCashflowRecord(cashflow, 'in', "Deposit")
                    }}
                >
                    Deposit
                </Button>

                <Button
                    className="m-2"
                    style={{ width: '100px' }}
                    variant="primary"
                    onClick={() => {
                        if (cashBalance < cashflow) {
                            alert("Insufficient Funds")
                        } else {
                            window.localStorage.setItem('Cash_Balance', String(cashBalance - cashflow))
                            window.dispatchEvent(new Event('storage'))
                            logCashflowRecord(cashflow, 'out', "Withdraw")
                        }

                    }}
                >
                    Withdraw
                </Button>

            </Row>

        </Container>
    );
}

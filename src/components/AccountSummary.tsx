import { useEffect, useState } from "react";
import { Portfolio } from "./types";
import { Container, Table } from "react-bootstrap";
import { formatNumberString } from "../globalFunction";


export default function AccountSummary() {
    let netAssetValue: number = 0;

    // initialize the cash balance with local storage
    const [cashBalance, setCashBalance] = useState<number>(() => {
        return parseFloat(window.localStorage.getItem('Cash_Balance')!)
    })


    // initialize the current position with local storage
    const [portfolioValue, setPortfolioValue] = useState<number>(() => {
        return JSON.parse(window.localStorage.getItem('Current_Position')!).portfolio_value
    })

    netAssetValue = cashBalance! + portfolioValue!;
    
    // listener on localstorage is added to ensure immediate update for cash balance and position
    useEffect(() => {
        const handleStorageChange = () => {
            setCashBalance(parseFloat(window.localStorage.getItem('Cash_Balance')!))
            setPortfolioValue(JSON.parse(window.localStorage.getItem('Current_Position')!).portfolio_value!)
        }

        window.addEventListener('storage', handleStorageChange)

        return () => {
            window.removeEventListener('storage', handleStorageChange)
        }
    }, [])

    return (
        <Container className="border border-primary rounded-3 mt-1 mb-1" >
            <h3>Account Summary</h3>
            <Table striped bordered hover variant="dark">

                <thead>
                    <tr>
                        <th>Net Asset Value</th>
                        <th>Cash Balance</th>
                        <th>Position Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{formatNumberString(netAssetValue, 2)}</td>
                        <td>{formatNumberString(cashBalance, 2)}</td>
                        <td>{formatNumberString(portfolioValue, 2)}</td>
                    </tr>
                </tbody>
            </Table>
        </Container>
    );
}

import { useEffect, useState } from "react";
import { Portfolio } from "./types";
import { Container, Table } from "react-bootstrap";
import { formatNumberString } from "../globalFunction";


export default function AccountSummary() {
    const [netAssetValue, setNetAssetValue] = useState<number>(0)
    const [cashBalance, setCashBalance] = useState<number>(0)
    const [portfolioValue, setPortfolioValue] = useState<number>(0)

    useEffect(() => {
        console.log('netAssetValue:', netAssetValue);
        console.log('cashBalance:', cashBalance);
        console.log('portfolioValue:', portfolioValue);
    }, [netAssetValue, cashBalance, portfolioValue])

    useEffect(() => {
        setNetAssetValue(cashBalance + portfolioValue)
    }, [cashBalance, portfolioValue])

    useEffect(() => {
        // initialize the cash balance and current position value with local storage
        let cashBalInLocalStorage = parseFloat(window.localStorage.getItem('Cash_Balance') || '0')
        let portfolioValueInLocalStorage = JSON.parse(window.localStorage.getItem('Current_Position')!).portfolio_value || 0
        setCashBalance(cashBalInLocalStorage)
        setPortfolioValue(portfolioValueInLocalStorage)

        // listener on localstorage is added to ensure immediate update for cash balance and position
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

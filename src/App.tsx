
import { json } from 'stream/consumers';
import './App.css';
import AccountSummary from './components/AccountSummary';
import { initial_cashBal, initial_portfolio } from './components/defaultAppStorage';
import CashflowForm from './components/CashflowForm';
import TradeForm from './components/TradeForm';
import CurrentPosition from './components/CurrentPosition';
import Record from './components/Record';

function App() {
    // counts for trades and cashflow help in identifying entries and in turn the rendering of transaction record


    // let tradeExisit: string | null = window.localStorage.getItem('Trade_Count')
    // if (!tradeExisit) { window.localStorage.setItem('Trade_Count', '0') }

    // let cashBalExist: string | null = window.localStorage.getItem('Cash_Balance')
    // if (!cashBalExist) { window.localStorage.setItem('Cash_Balance', JSON.stringify(initial_cashBal)) }

    // let positionExit: string | null = window.localStorage.getItem('Current_Position')
    // if (!positionExit) { window.localStorage.setItem('Current_Position', JSON.stringify(initial_portfolio)) }


    if (!window.localStorage.getItem('Cashflow_Count')) {
        window.localStorage.setItem('Cashflow_Count', '0')
        window.localStorage.setItem('Cashflow_Record', '')
    }

    if (!window.localStorage.getItem('Trade_Count')) {
        window.localStorage.setItem('Trade_Count', '0')
        window.localStorage.setItem('Trade_Record', '')
    }

    if (!window.localStorage.getItem('Cash_Balance')) {
        window.localStorage.setItem('Cash_Balance', JSON.stringify(initial_cashBal))
    }

    if (!window.localStorage.getItem('Current_Position')) {
        window.localStorage.setItem('Current_Position', JSON.stringify(initial_portfolio))
    }



    return (
        <div className="container">
            <div
                className='row text-center d-flex align-items-center rounded-top-5'
                style={{
                    backgroundImage: 'url(/north_shore.jpg)',
                    backgroundPositionY: 'center',
                    backgroundSize: 'cover',
                    height: '150px',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10000,
                }}
            >
                <h1 className="font-monospace text-white font-weight-bold"> Shore Investment</h1>
            </div>

            <div className='row text-center'>
                <AccountSummary />
            </div>

            <div className='row justify-content-between border border-success my-1'>
                <div className='col-md-4 d-flex align-items-stretch text-center'>
                    <CashflowForm />
                </div>
                <div className='col-md-8 d-flex align-items-stretch'>
                    <TradeForm />
                </div>
            </div>

            <div className='row text-center'>
                <CurrentPosition />
            </div>

            <div className='row text-center'>
                <Record />
            </div>

        </div>
    );
}

export default App;

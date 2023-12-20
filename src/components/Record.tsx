import { Container, Nav, Row, Tabs, Tab } from "react-bootstrap";
import { useState } from "react";
import CashflowRecord from "./Record_Cashflow";
import TradeRecord from "./Record_Trade";

export default function Record() {
    const [recordKey, setRecordKey] = useState('trade')

    let displayContent;
    switch (recordKey) {
        case 'cashflow':
            displayContent = <CashflowRecord />
            break;
        case 'trade':
            displayContent = <TradeRecord />
            break;

        default:
            displayContent = null
            break;
    }

    return (
        <Container className="p-2 border border-primary rounded-3 my-1">
            <Row><h3>Record</h3></Row>
            <Tabs
                fill
                defaultActiveKey={'trade'}
                onSelect={selectedKey => setRecordKey(selectedKey!)}
            >
                <Tab title='Trade' eventKey='trade'  > </Tab>
                <Tab title='Cashflow' eventKey='cashflow' > </Tab>


            </Tabs>
            <Row className="px-2 border-primary rounded-3" style={{ maxHeight: '40vh', overflow: 'scroll' }}>
                {displayContent}
            </Row>
        </Container>
    );
}

import {Table} from "react-bootstrap";

const InvoiceList = ({props, invoiceList}) => {

    const sumOfProducts = (items) => {
        let sum = 0;
        items.forEach(product => sum += product.price * product.quantity);
        return sum;
    }

    const goBackToHomePage = () => {
        props.history.push('/');
    }

    return (
        <div>
            <table className="table table-striped table-bordered">
                <thead>
                <tr>
                    <th>Sent</th>
                    <th>Expires</th>
                    <th>Status</th>
                    <th>Serial Number</th>
                    <th>Buyer</th>
                    <th>Price</th>
                </tr>
                </thead>

                <tbody>
                {
                    invoiceList.map(
                        (invoice) => (
                            <tr key={invoice.id}>
                                <td>{invoice.invoiceDate}</td>
                                {/*TODO: Change invoice.expirationDate to invoice.expiryDate when axios is implemented*/}
                                <td>{invoice.expirationDate}</td>
                                {/*TODO: Add status when backend has it*/}
                                <td>PENDING</td>
                                <td>{invoice.id}</td>
                                <td>{invoice.customerName}</td>

                                {/*TODO: add seller*/}
                                <td>A. Finman</td>
                                <td>{sumOfProducts(invoice.items)}</td>
                                <td>
                                    <button className="btn btn-info">Preview</button>
                                </td>
                            </tr>
                        )
                    )
                }
                </tbody>
            </table>

            <button onClick={goBackToHomePage} className="btn btn-info">Return</button>
        </div>
    )
}

export default InvoiceList
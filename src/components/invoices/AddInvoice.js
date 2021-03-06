import React, { useState } from "react";
import AddItem from "./AddItem";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Col, Container, Row, Tab, Table, Tabs } from "react-bootstrap";
import InvoiceService from "../../services/InvoiceService";
import { pdf } from "@react-pdf/renderer";
import PdfDocument from "../pdf/PdfDocument";
import "../../styles/index.css";
import { FaTimes } from "react-icons/fa";
import InvoicePosts from "./InvoicePosts";
import CustomerDropdown from "./CustomerDropdown";

const blobToPdf = (blob, fileName) => {
  blob.lastModifiedDate = new Date();
  blob.name = fileName;
  console.log("SIZE: " + blob.size);
  console.log("TYPE: " + blob.type);
  return blob;
};

const AddInvoice = ({ owner, productList, customerList }) => {
  const [invoiceDate, setInvoiceDate] = useState("2021-04-30");
  const [expirationDate, setExpirationDate] = useState("2021-05-02");
  const [items, setItems] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");

  const invoiceData = {
    source: owner,
    invoiceDate: invoiceDate,
    expiryDate: expirationDate,
    seller: "finman@block.chain",
    customer: selectedCustomer, //There shouldn't be several customers here, only one.
    items: items,
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Extract pdf
    let pdfBlob = await pdf(<PdfDocument invoice={invoiceData} />).toBlob();
    pdfBlob = blobToPdf(pdfBlob, "invoice.pdf");

    // Create and send Invoice
    InvoiceService.createInvoice(
      invoiceData,
      pdfBlob,
      invoiceData.customer.email
    );

    setInvoiceDate("");
    setExpirationDate("");
    setItems([]);
    setSelectedCustomer("");
  };

  //Adds an item to this invoice's items list
  const addItem = (item) => {
    const found = items.find((i) => i.name === item.name);
    if (found === undefined) {
      // If the item doesn't exist then add it to the list
      setItems([...items, item]);
    } else {
      // If the item already exists, sum the amount
      let updatedItems = items.map((i) => {
        if (i.name === item.name)
          i.amount = parseInt(i.amount) + parseInt(item.amount);
        return i;
      });
      setItems([...updatedItems]);
    }
  };

  //Deletes an item from the invoice's items list
  const deleteItem = (name) => {
    setItems(items.filter((item) => item.name !== name));
  };

  const sumOfProducts = (items) => {
    let sum = 0;
    items.forEach((product) => (sum += product.price * product.amount));
    return sum;
  };

  return (
    <Container>
      <CustomerDropdown
        customerList={customerList}
        onAddCustomer={setSelectedCustomer}
      />
      <Form>
        <Row>
          {selectedCustomer !== "" ? (
            <Table striped bordered hover size="sm" variant="dark">
              <thead>
                <tr>
                  <th width="300px">Name</th>
                  <th width="200px">Telephone</th>
                  <th width="300px">Email</th>
                  <th width="450px">Address</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{selectedCustomer.name}</td>
                  <td>{selectedCustomer.telephone}</td>
                  <td>{selectedCustomer.email}</td>
                  <td>
                    {selectedCustomer.address}
                    {", "}
                    {selectedCustomer.zipCode}
                    {", "}
                    {selectedCustomer.city}
                    {", "}
                    {selectedCustomer.country}
                  </td>
                </tr>
              </tbody>
            </Table>
          ) : (
            <></>
          )}
          <Col>
            <Form.Group controlId="formInvoiceDate">
              <Form.Label className="invoice-label">Invoice Date</Form.Label>
              <Form.Control
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formExpirationDate">
              <Form.Label className="invoice-label">Expiration Date</Form.Label>
              <Form.Control
                type="date"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <Tabs defaultActiveKey="products">
          <Tab eventKey="products" title="Products">
            <Row className="row-create-item">
              <AddItem
                owner={owner}
                productList={productList}
                onAddItem={addItem}
              />
            </Row>
          </Tab>

          <Tab eventKey="posts" title="Posts">
            <Row className="row-create-item">
              <InvoicePosts owner={owner} onAddItem={addItem} />
            </Row>
          </Tab>
        </Tabs>

        <Row>
          {items.length > 0 ? (
            <Table striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Amount</th>
                  <th>Unit Price</th>
                  <th>Price</th>
                  <th>Delete</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item) => (
                  <tr key={item.name}>
                    <td>{item.name}</td>
                    <td>{item.amount}</td>
                    <td>{item.price} kr/st</td>
                    <td>{item.price * item.amount} kr</td>
                    <td>
                      <FaTimes
                        style={{
                          color: "red",
                          cursor: "pointer",
                          margin: 3,
                        }}
                        onClick={() => deleteItem(item.name)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className={"invoice-label"}>No Items To Show</p>
          )}
        </Row>
        <Row className="invoice-label">{"Total: " + sumOfProducts(items)}</Row>
        <Row>
          <Button
            disabled={
              !(
                invoiceDate &&
                expirationDate &&
                items.length !== 0 &&
                selectedCustomer
              )
            }
            variant="primary"
            type="submit"
            onClick={onSubmit}
            className={"marginBottom"}
          >
            Send invoice
          </Button>
        </Row>
      </Form>
    </Container>
  );
};

export default AddInvoice;

"use client";

import { FormLabel, Row, Col, Button } from "react-bootstrap";
import { FormControl } from "react-bootstrap";
import { FormSelect } from "react-bootstrap";
import { FormCheck } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { InputGroup } from "react-bootstrap";
import InputGroupText from "react-bootstrap/InputGroupText";

export default function BootstrapForms() {
    return (
        <>
            <div id="wd-css-styling-forms">
                <h2>Forms</h2>
                <FormLabel>Email address</FormLabel>
                <FormControl type="email" placeholder="name@example.com" />
                <FormLabel>Example textarea</FormLabel>
                <FormControl as="textarea" rows={3} />
            </div>

            <div id="wd-css-styling-dropdowns">
                <h3>Dropdowns</h3>
                <FormSelect>
                    <option value="0" defaultChecked>Open this select menu</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                </FormSelect>
            </div>

            <div id="wd-css-styling-switches">
                <h3>Switches</h3>
                <FormCheck type="switch" defaultChecked={false} label="Unchecked switch checkbox input"/>
                <FormCheck type="switch" defaultChecked={true}  label="Checked switch checkbox input"/>
                <FormCheck type="switch" defaultChecked={false} label="Unchecked disabled switch checkbox input" disabled/>
                <FormCheck type="switch" defaultChecked={true}  label="Checked disabled switch checkbox input"   disabled/>
            </div>

            <div id="wd-css-styling-range-and-sliders">
                <h3>Range</h3>
                <FormLabel>Example range</FormLabel>
                <Form.Range min="0" max="5" step="0.5" />
            </div>

            <div id="wd-css-styling-addons">
                <h3>Addons</h3>
                <InputGroup className="mb-3">
                    <InputGroupText>$</InputGroupText>
                    <InputGroupText>0.00</InputGroupText>
                    <FormControl />
                </InputGroup>
                <InputGroup>
                    <FormControl />
                    <InputGroupText>$</InputGroupText>
                    <InputGroupText>0.00</InputGroupText>
                </InputGroup>
            </div>

            <div id="wd-css-responsive-forms-1">
                <h3>Responsive forms</h3>

                <Form.Group as={Row} className="mb-3" controlId="email1">
                    <FormLabel column sm={2}>Email</FormLabel>
                    <Col sm={10}>
                    <FormControl type="email" defaultValue="email@example.com" />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="password1">
                    <FormLabel column sm={2}>Password</FormLabel>
                    <Col sm={10}>
                    <FormControl type="password" />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="textarea2">
                    <FormLabel column sm={2}>Bio</FormLabel>
                    <Col sm={10}>
                    <FormControl as="textarea" style={{ height: "100px" }} />
                    </Col>
                </Form.Group>
            </div>

            <div id="wd-css-responsive-forms-2">
                <h3>Responsive forms 2</h3>

                <Form>
                    <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
                    <FormLabel column sm={2}>Email</FormLabel>
                    <Col sm={10}>
                        <FormControl type="email" placeholder="Email" />
                    </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formHorizontalPassword">
                    <FormLabel column sm={2}>Password</FormLabel>
                    <Col sm={10}>
                        <FormControl type="password" placeholder="Password" />
                    </Col>
                    </Form.Group>

                    <fieldset>
                    <Row className="mb-3">
                        <FormLabel as="legend" column sm={2}>Radios</FormLabel>
                        <Col sm={10}>
                        <FormCheck
                            type="radio"
                            label="First radio"
                            name="formHorizontalRadios"
                            defaultChecked
                        />
                        <FormCheck type="radio" label="Second radio" name="formHorizontalRadios" />
                        <FormCheck type="radio" label="Third radio" name="formHorizontalRadios" />
                        <FormCheck type="checkbox" label="Remember me" />
                        </Col>
                    </Row>
                    </fieldset>

                    <Row>
                    <Col sm={{ span: 10, offset: 2 }}>
                        <Button type="submit">Sign in</Button>
                    </Col>
                    </Row>
                </Form>
            </div>
        </>
);}
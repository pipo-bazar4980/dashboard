import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import GameList from "./ChildComp/GameList";
import { Link } from "react-router-dom"
import { getProducts } from "../../../Api";


const GameCart = () => {
    const [product, setProduct] = useState([])
    useEffect(() => {
        getProducts()
            .then((res) => {
                let allData = res.data
                setProduct(allData)
            })
            .catch((err) => {
                console.log(err.response);
            });
    }, []);

    return (
        <>
            <Row className="mt-4">
                {product.map((product, index) => {
                    if (product.disabled === false) {
                        return (
                            <Col key={product._id} xs={6} sm={4} md={3} lg={3} xl={2} className=" text-decoration-none">
                                <Link to={`topup-${product._id}`}><GameList data={product} /></Link>
                            </Col>
                        );
                    }
                })}
            </Row>
        </>
    )
}
export default GameCart
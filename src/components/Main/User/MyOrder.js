import React, { useEffect, useState } from "react";
import { Container, Table } from "react-bootstrap";
import { getOrdersById } from "../../../Api/order";
import { userInfo } from '../../../utils/auth';
import NavBar from "../../../components/Main/Navbar/Navbar";
import Footer from "../../../components/Main/Footer";
import moment from "moment";
import Lottie from "react-lottie";
import animationData from "../../../assets/lotte/82138-order-delivered.json";
import "./userinfo.css"
import Tables from "./paginationOrder";
import Pagination from "./Paginate";

const MyOrder = () => {
    const [orders, setOrders] = useState([]);
    const { token, id } = userInfo();
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(10);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true)
        getOrdersById(token, id)
            .then(response => {
                setOrders(response.data)
                setLoading(false)
            })
    }, [orders])


    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    };
    // Get current posts
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = orders.slice(indexOfFirstPost, indexOfLastPost);

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <>
            <NavBar />
            <div className="text-center">
                <Lottie
                    options={defaultOptions}
                    width={400}
                />
            </div>
            <Container>
                <div className="d-flex justify-content-center"><h1>My Order</h1></div>
                <div className="scroll-table">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Order ID</th>
                                <th>Date</th>
                                <th>Product Name</th>
                                <th>Purchased Package</th>
                                <th>Order Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <Tables myOrders={currentPosts} loading={loading} paginate={currentPage} />
                        </tbody>
                    </Table>
                    <Pagination
                        postsPerPage={postsPerPage}
                        totalPosts={orders.length}
                        paginate={paginate}
                    />
                </div>

            </Container>
            <br />
            <br />
            <br />
            <br />
            <br />
            <Footer />
        </>
    )
}
export default MyOrder
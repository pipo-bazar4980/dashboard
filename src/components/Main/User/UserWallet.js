import React, { useEffect, useState } from "react";
import {Card, Container, ListGroup, ListGroupItem, Table} from "react-bootstrap";
import { userInfo } from '../../../utils/auth';
import { getWalletById } from '../../../Api/wallet';
import { notify } from "utils/notification";
import NavBar from "../../../components/Main/Navbar/Navbar";
import Footer from "../../../components/Main/Footer";
import { findTransactionById } from '../../../Api/addWallet';
import moment from "moment";
import Lottie from "react-lottie";
import animationData from "../../../assets/lotte/47954-wallet.json";
import "./userinfo.css"
import Pagination from './Paginate'
import Tables from "./Pagination";

const UserWallet = () => {
    const [walletInfo, setWalletInfo] = useState({});
    const [transaction, setTransaction] = useState([]);
    const { token, wallet, id } = userInfo();
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(10);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getWalletById(token, wallet)
            .then(res => setWalletInfo(res.data))
    }, [walletInfo]);

    useEffect(() => {
        setLoading(true)
        findTransactionById(token, id)
            .then(res => setTransaction(res.data))
        setLoading(false)
    }, [transaction]);

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
    const currentPosts = transaction.slice(indexOfFirstPost, indexOfLastPost);

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);
    return (
        <>
            <NavBar />
            <Container>
                <div style={{minHeight: '50rem'}}>
                    <div className="text-center">
                        <Lottie
                            options={defaultOptions}
                            width={200}
                        />
                        <div>
                            Your Wallet
                        </div>
                    </div>
                <br />
                <Card className='text-center'>
                    <Card.Body>
                        <ListGroup className="list-group-flush">
                            <ListGroupItem>
                                {walletInfo.currentAmount === 0 && (<>
                                    <div>
                                        00
                                    </div>
                                </>)}
                                {walletInfo.currentAmount > 0 && (<>
                                    <div>
                                        {walletInfo.currentAmount}
                                    </div>
                                </>)}<div>Available Balance</div>
                            </ListGroupItem>
                        </ListGroup>
                        <div className='d-flex  justify-content-around'>
                            <div>
                                {walletInfo.totalOrder === 0 && (<>
                                    <div>
                                        00
                                    </div>
                                </>)}
                                {walletInfo.totalOrder > 0 && (<>
                                    <div>
                                        {walletInfo.totalOrder}
                                    </div>
                                </>)}
                                <div>
                                    Total Orders
                                </div>
                            </div>
                            <div>
                                {walletInfo.spentAmount === 0 && (<>
                                    <div>
                                        00
                                    </div>
                                </>)}
                                {walletInfo.spentAmount > 0 && (<>
                                    <div>
                                        {walletInfo.spentAmount}
                                    </div>
                                </>)}
                                <div>
                                    Spend Total
                                </div>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
                    <div className="scroll-table">

                        <Table  striped bordered hover>
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Transaction Date</th>
                                <th>Transaction Operator</th>
                                <th>Transaction Number</th>
                                <th>Transaction Amount</th>
                                <th>Senders Number</th>
                                <th>Transaction Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            <Tables transaction={currentPosts} loading={loading} paginate={currentPage}/>
                            <Pagination
                                postsPerPage={postsPerPage}
                                totalPosts={transaction.length}
                                paginate={paginate}
                            />
                            {/*{transaction && transaction.map((data, index) => (*/}
                            {/*        <tr>*/}
                            {/*            <td>{index + 1}</td>*/}
                            {/*            <td>{moment(data.createdAt).format('MMMM Do, YYYY, h:mm:ss a')}</td>*/}
                            {/*            <td>{data.paymentType}</td>*/}
                            {/*            <td>{data.transactionID}</td>*/}
                            {/*            <td>{data.amount}</td>*/}
                            {/*            <td>{data.mobileNumber}</td>*/}
                            {/*            {data.isComplete === true && (<>*/}
                            {/*                <td style={{ color: "green" }}>Complete</td>*/}
                            {/*            </>)}*/}
                            {/*            {data.isComplete === false && data.reject === false && (<>*/}
                            {/*                <td style={{ color: "blue" }}>Pending</td>*/}
                            {/*            </>)}*/}
                            {/*            {data.reject === true && (<>*/}
                            {/*                <td style={{ color: "red" }}>Canceled</td>*/}
                            {/*            </>)}*/}
                            {/*        </tr>*/}
                            {/*    )*/}
                            {/*)}*/}
                            </tbody>
                        </Table>
                    </div>

                <br />
                </div>
            </Container>
            <Footer />
        </>
    )
}
export default UserWallet
import React, { useState, useEffect } from 'react';
import { Card, Col, Container, Row, Table } from "react-bootstrap";
import { findAllWallet, filterTransaction,markAllPurchaseComplete } from '../Api/addWallet';
import { findAllPaymentMethod } from '../Api/paymentMethod';
import { userInfo } from '../utils/auth';
import Pagination from "./Pagination";
import Tables from "./CompletePurchacheTable";
import Tabless from "./ActivePurchacheTable";
import Tablesss from "./CancelPurchacheTable";
import {markAllComplete} from "../Api/order";
import {notify} from "../utils/notification";
let search = false, filter = false, search2 = false, filter2 = false, srchTerm;
let both = false, filterFunctionActive = false;
let activePaymentFilterBoth = [], completePaymentFilterBoth = [], cancelPaymentFilterBoth = [];
let totalActive, totalComplete, totalCancel, type, filterPaymentTypeActive = false, filtersBoth = false;
let buttonAllActive = false,mark=false;

const PurchaseApprove = () => {
    const [activePayment, setActivePayment] = useState([]);
    const [activePaymentSearch, setActivePaymentSearch] = useState([]);
    const [activePaymentFilter, setActivePaymentFilter] = useState([]);
    const [activePaymentFilter2, setActivePaymentFilter2] = useState([]);

    const [completePayment, setCompletePayment] = useState([]);
    const [completePaymentFilter, setCompletePaymentFilter] = useState([]);

    const [cancelledPayment, setCancelledPayment] = useState([]);
    const [cancelledPaymentFilter, setCancelledPaymentFilter] = useState([]);


    const [allPaymentMethod, setAllPaymentMethod] = useState([]);
    const [checked, setChecked] = useState([]);
    const checkedIds = [...checked];

    const rowSelectRorActivePayment = (e) => {
        setPostsPerPages(e.target.value)
    }

    const rowSelectForCompletePayment = (e) => {
        setPostsPerPage(e.target.value)
    }

    const rowSelectForCancelPayment = (e) => {
        setPostsPerPagess(e.target.value)
    }

    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage,setPostsPerPage] = useState(10);
    const [currentPages, setCurrentPages] = useState(1);
    const [postsPerPages,setPostsPerPages] = useState(10);
    const [currentPagess, setCurrentPagess] = useState(1);
    const [postsPerPagess,setPostsPerPagess] = useState(10);

    const [active, setActive] = useState(0);
    const [complete, setComplete] = useState(0);
    const [cancel, setCancel] = useState(0);

    const [loading, setLoading] = useState(false);

    const [filters, setFilters] = useState({
        paymentType: []
    })

    const { token } = userInfo();

    useEffect(() => {
        findAllWallet(token)
            .then(response => {
                const complete = response.data && response.data.filter(filteredData => filteredData.isComplete === true)
                setCompletePayment(complete)
                totalComplete = complete.length
                const cancel = response.data && response.data.filter(filteredData => filteredData.isComplete === false && filteredData.reject === true)
                setCancelledPayment(cancel)
                totalCancel = cancel.length
            })
    }, [])


    useEffect(() => {
        findAllWallet(token)
            .then(response => {
                const active = response.data && response.data.filter(filteredData => filteredData.isComplete === false && filteredData.reject === false)
                setActivePayment(active)
                totalActive = active.length
            })
    }, [activePayment])


    const findActivePayment =  () => {
         findAllWallet(token)
            .then(response => {
                const active = response.data && response.data.filter(filteredData => filteredData.isComplete === false && filteredData.reject === false)
                setActivePayment(active)
            })
    }

    const findCompletePayment =  () => {
         findAllWallet(token)
            .then(response => {
                const complete = response.data && response.data.filter(filteredData => filteredData.isComplete === true)
                setCompletePayment(complete)
            })
    }

    const findCancelledPayment =  () => {
         findAllWallet(token)
            .then(response => {
                const cancel = response.data && response.data.filter(filteredData => filteredData.isComplete === false && filteredData.reject === true)
                if (filterPaymentTypeActive === false) {
                    setCancelledPayment(cancel)
                }
            })

    }

    useEffect(() => {
        findAllPaymentMethod()
            .then(res => setAllPaymentMethod(res.data))
    }, [])



    if (filter2 === true && search2 === true) {
        filtersBoth = true
        const result = completePaymentFilter.filter((item) =>
            item.userId?.username?.toLowerCase().includes(srchTerm.toLocaleLowerCase()) ||
            item.paymentType?.toLowerCase().includes(srchTerm.toLocaleLowerCase()) ||
            item.transactionID?.toLowerCase().includes(srchTerm.toLocaleLowerCase()) ||
            ((parseInt(item.mobileNumber)).toString()).includes(srchTerm) ||
            ((parseInt(item.amount)).toString()).includes(srchTerm) ||
            ((parseInt(item.userId?.userIdNo)).toString()).includes(srchTerm)
        )
        completePaymentFilterBoth = result

        const result2 = activePaymentFilter2.filter((item) =>
            item.userId?.username?.toLowerCase().includes(srchTerm.toLocaleLowerCase()) ||
            item.paymentType?.toLowerCase().includes(srchTerm.toLocaleLowerCase()) ||
            item.transactionID?.toLowerCase().includes(srchTerm.toLocaleLowerCase()) ||
            ((parseInt(item.mobileNumber)).toString()).includes(srchTerm) ||
            ((parseInt(item.amount)).toString()).includes(srchTerm) ||
            ((parseInt(item.userId?.userIdNo)).toString()).includes(srchTerm)
        )
        activePaymentFilterBoth = result2

        const result3 = cancelledPaymentFilter.filter((item) =>
            item.userId?.username?.toLowerCase().includes(srchTerm.toLocaleLowerCase()) ||
            item.paymentType?.toLowerCase().includes(srchTerm.toLocaleLowerCase()) ||
            item.transactionID?.toLowerCase().includes(srchTerm.toLocaleLowerCase()) ||
            ((parseInt(item.mobileNumber)).toString()).includes(srchTerm) ||
            ((parseInt(item.amount)).toString()).includes(srchTerm) ||
            ((parseInt(item.userId?.userIdNo)).toString()).includes(srchTerm)
        )
        cancelPaymentFilterBoth = result3
        both = true
        search = ''
        filter = ''
    }

    const handleFilters = (myfilters) => {
        const newFilters = { ...filters };
        newFilters["paymentType"] = myfilters;
        setFilters(newFilters);
        filterTransaction(newFilters)
            .then(response => {
                const active = response.data && response.data.filter(filteredData => filteredData.isComplete === false && filteredData.reject === false)
                setActivePaymentFilter(active)
                setActivePaymentFilter2(active)
                const complete = response.data && response.data.filter(filteredData => filteredData.isComplete === true)
                setCompletePayment(complete)
                setCompletePaymentFilter(complete)
                const cancel = response.data && response.data.filter(filteredData => filteredData.isComplete === false && filteredData.reject === true)
                setCancelledPayment(cancel)
                setCancelledPaymentFilter(cancel)

            })

    }

    const filterPaymentType =  () => {
         handleFilters(checkedIds)
    }

    const handleToogle = paymentType => () => {
        type = paymentType;
        filterPaymentTypeActive = true
        const foundId = checked.indexOf(paymentType);
        if (foundId === -1) {
            checkedIds.push(paymentType);
        } else {
            checkedIds.splice(foundId, 1);
        }
        if (checkedIds.length === 0) {
            filter = false
            filterPaymentTypeActive = false
            if (srchTerm === undefined) {
                search = false
            }
            else {
                search = true
                both = false
            }
            filter2 = false
        }
        else {
            filter = true
            search = ''
            filter2 = true
            both = false
        }
        setChecked(checkedIds);
        handleFilters(checkedIds)

    }

    if (localStorage.getItem('transactionArray') != null) {
        buttonAllActive = localStorage.getItem('transactionArray').length !== 0;
    }

    if (!localStorage.getItem('transactionArray')) {
        buttonAllActive = false
    }

    const markAll = () => {
        mark=true
         const myArray = localStorage.getItem('transactionArray').split(",");
        markAllPurchaseComplete(token, myArray)
            .then(res => {
                localStorage.setItem("transactionArray", [])
                notify("Transaction Confirmed!")
                mark=false;
            })
    }

    useEffect(() => {
        localStorage.setItem("transactionArray", [])
    }, [])


    const filterPayment = async () => {
        if (srchTerm != undefined) {
            await findAllWallet(token)
                .then(res => {
                    if (res.data) {
                        filterContent(res.data, srchTerm)
                    }
                })
        }
    }

    const searchPayment = (e) => {
        let searchTerm = e.currentTarget.value
        srchTerm = searchTerm
        filterFunctionActive = true;
        if (searchTerm === undefined) {
            search = false
            search2 = false
            filterFunctionActive = false
        }
        else {
            search = true
            search2 = true
        }
        findAllWallet(token)
            .then(res => {
                if (res.data) {
                    filterContent(res.data, searchTerm)
                }
            })
    }

    const filterContent = (payments, searchTerm) => {
        const result = payments.filter((item) =>
            item.userId?.username?.toLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
            item.paymentType?.toLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
            item.transactionID?.toLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
            ((parseInt(item.mobileNumber)).toString()).includes(searchTerm) ||
            ((parseInt(item.amount)).toString()).includes(searchTerm) ||
            ((parseInt(item.userId?.userIdNo)).toString()).includes(srchTerm)
        )

        let value = result.filter(filteredData => filteredData.isComplete === true)
        setCompletePayment(value)


        let value2 = result.filter(filteredData => filteredData.isComplete === false && filteredData.reject === false)
        setActivePaymentSearch(value2)

        let value3 = result.filter(filteredData => filteredData.isComplete === false && filteredData.reject === true)
        setCancelledPayment(value3)
    }

    // Get current posts
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPost = completePayment.slice(indexOfFirstPost, indexOfLastPost);
    const currentPostsFilterBoths = completePaymentFilterBoth.slice(indexOfFirstPost, indexOfLastPost);

    const indexOfLastPosts = currentPages * postsPerPages;
    const indexOfFirstPosts = indexOfLastPosts - postsPerPages;
    const currentPosts = activePayment.slice(indexOfFirstPosts, indexOfLastPosts);
    const currentPostsSearch = activePaymentSearch.slice(indexOfFirstPosts, indexOfLastPosts);
    const currentPostsFilter = activePaymentFilter.slice(indexOfFirstPosts, indexOfLastPosts);
    const currentPostsFilterBoth = activePaymentFilterBoth.slice(indexOfFirstPosts, indexOfLastPosts);

    const indexOfLastPostss = currentPagess * postsPerPagess;
    const indexOfFirstPostss = indexOfLastPostss - postsPerPagess;
    const currentPostss = cancelledPayment.slice(indexOfFirstPostss, indexOfLastPostss);
    const currentPostsFilterBothss = cancelPaymentFilterBoth.slice(indexOfFirstPostss, indexOfLastPostss);

    // Change page
    const paginate = pageNumber => {
        setCurrentPage(pageNumber)
        setComplete(pageNumber)
    }
    const paginates = pageNumber => {
        setCurrentPages(pageNumber)
        setActive(pageNumber)
    }
    const paginatess = pageNumber => {
        setCurrentPagess(pageNumber)
        setCancel(pageNumber)
    };

    let selectArray = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

    //console.log(postsPerPages,postsPerPage,postsPerPagess)

    const setMark=()=>{
        console.log('mark')
        mark=false
    }
    return (
        <>
            <Container fluid>
                <div className='mt-3 mb-3 d-flex'>
                    {allPaymentMethod && allPaymentMethod.map(item => (
                        <form>
                            <input type="checkbox" className='ml-2' onChange={handleToogle(item.name)} /> {item.name}
                        </form>
                    ))}
                </div>
                <Row>
                    <Col md="12">
                        <div style={{ float: "right", width: "300px", marginBottom: "10px" }}>
                            <input
                                className="form-control"
                                type="search"
                                placeholder="Search"
                                name="serachTerm"
                                onChange={searchPayment}
                            >
                            </input>
                        </div>
                    </Col>
                    <Col md="12">
                        <Card className="strpied-tabled-with-hover">
                            <Card.Header>
                                <Card.Title as="h4">Active Payment</Card.Title>
                                <p style={{ fontSize: ".8rem" }} className="text-muted">Total active payments: {totalActive}</p>
                                {buttonAllActive && (
                                    <>
                                        <button className="btn btn-danger" onClick={markAll}>Mark all as complete</button>
                                    </>
                                )}
                            </Card.Header>
                            <Card.Body className="table-full-width table-responsive px-0">
                                <Table className="table-hover">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">User ID</th>
                                            <th scope="col">Payment Type</th>
                                            <th scope="col">Transaction ID</th>
                                            <th scope="col">Mobile Number</th>
                                            <th scope="col">Amount</th>
                                            <th scope="col">Transaction date</th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {search === true && (<>
                                            <Tabless activePayment={currentPostsSearch} loading={loading} paginates={currentPages} findActivePayment={findActivePayment} findCompletePayment={findCompletePayment} findCancelledPayment={findCancelledPayment} filterPayment={filterPayment} filterFunctionActive={filterFunctionActive} filtersBoth={filtersBoth} postsPerPages={postsPerPages} />
                                        </>)}
                                        {search === false && (<>
                                            <Tabless setMark={setMark} activePayment={currentPosts} loading={loading} paginates={currentPages} findActivePayment={findActivePayment} findCompletePayment={findCompletePayment} findCancelledPayment={findCancelledPayment} postsPerPages={postsPerPages} mark={mark}/>
                                        </>)}
                                        {filter === true && (<>
                                            <Tabless activePayment={currentPostsFilter} loading={loading} paginates={currentPages} findActivePayment={findActivePayment} findCompletePayment={findCompletePayment} findCancelledPayment={findCancelledPayment} filterPaymentTypeActive={filterPaymentTypeActive} filterPaymentType={filterPaymentType} postsPerPages={postsPerPages}/>
                                        </>)}
                                        {both === true && (<>
                                            <Tabless activePayment={currentPostsFilterBoth} loading={loading} paginates={currentPages} findActivePayment={findActivePayment} findCompletePayment={findCompletePayment} findCancelledPayment={findCancelledPayment} filtersBoth={filtersBoth} postsPerPages={postsPerPages}/>
                                        </>)}
                                    </tbody>
                                </Table>
                                <div className='d-flex'>
                                    <Pagination
                                        postsPerPage={postsPerPages}
                                        totalPosts={activePayment.length}
                                        paginate={paginates}
                                        Number={active}
                                    />
                                    {activePayment.length > 0 && (
                                        <div className='ml-5' >
                                            <select style={{ cursor: 'pointer' }} onChange={(e) => rowSelectRorActivePayment(e)}>
                                                {selectArray.map(number => {
                                                    return (
                                                        <option value={number} >{number}</option>
                                                    )
                                                })}
                                            </select>
                                        </div>
                                    )}
                                </div>

                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md="12">
                        <Card className="strpied-tabled-with-hover">
                            <Card.Header>
                                <Card.Title as="h4">Complete Payment</Card.Title>
                                <p style={{ fontSize: ".8rem" }} className="text-muted">Total complete payments: {totalComplete}</p>
                            </Card.Header>
                            <Card.Body className="table-full-width table-responsive px-0">
                                <Table className="table-hover">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">User ID</th>
                                            <th scope="col">Payment Type</th>
                                            <th scope="col">Transaction ID</th>
                                            <th scope="col">Mobile Number</th>
                                            <th scope="col">Amount</th>
                                            <th scope="col">Transaction date</th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {both === false && (<>
                                            <Tables completePayment={currentPost} loading={loading} paginate={currentPage} postsPerPage={postsPerPage}/>
                                        </>)}

                                        {both === true && (<>
                                            <Tables completePayment={currentPostsFilterBoths} loading={loading} paginate={currentPage} postsPerPage={postsPerPage}/>
                                        </>)}
                                    </tbody>
                                </Table>
                                <div className='d-flex'>
                                    <Pagination
                                        postsPerPage={postsPerPage}
                                        totalPosts={completePayment.length}
                                        paginate={paginate}
                                        Number={complete}
                                    />
                                    {completePayment.length > 0 && (
                                        <div className='ml-5' >
                                            <select style={{ cursor: 'pointer' }} onChange={(e) => rowSelectForCompletePayment(e)}>
                                                {selectArray.map(number => {
                                                    return (
                                                        <option value={number} >{number}</option>
                                                    )
                                                })}
                                            </select>
                                        </div>
                                    )}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md="12">
                        <Card className="strpied-tabled-with-hover">
                            <Card.Header>
                                <Card.Title as="h4">Cancelled Payment</Card.Title>
                                <p style={{ fontSize: ".8rem" }} className="text-muted">Total cancelled payments: {totalCancel}</p>
                            </Card.Header>
                            <Card.Body className="table-full-width table-responsive px-0">
                                <Table className="table-hover">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">User ID</th>
                                            <th scope="col">Payment Type</th>
                                            <th scope="col">Transaction ID</th>
                                            <th scope="col">Mobile Number</th>
                                            <th scope="col">Amount</th>
                                            <th scope="col">Transaction date</th>
                                            <th scope="col">Cancel Reason</th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {both === false && (<>
                                            <Tablesss cancelledPayment={currentPostss} loading={loading} paginatess={currentPagess} findActivePayment={findActivePayment} findCancelledPayment={findCancelledPayment} filterPayment={filterPayment} filterFunctionActive={filterFunctionActive} filterPaymentTypeActive={filterPaymentTypeActive} filterPaymentType={filterPaymentType} postsPerPagess={postsPerPagess}/>
                                        </>)}

                                        {both === true && (<>
                                            <Tablesss cancelledPayment={currentPostsFilterBothss} loading={loading} paginatess={currentPagess} findActivePayment={findActivePayment} findCancelledPayment={findCancelledPayment} postsPerPagess={postsPerPagess}/>
                                        </>)}
                                    </tbody>
                                </Table>
                                <div className='d-flex'>
                                    <Pagination
                                        postsPerPage={postsPerPagess}
                                        totalPosts={cancelledPayment.length}
                                        paginate={paginatess}
                                        Number={cancel}
                                    />
                                    {cancelledPayment.length > 0 && (
                                        <>
                                            <div className='ml-5' >
                                                <select style={{ cursor: 'pointer' }} onChange={(e) => rowSelectForCancelPayment(e)}>
                                                    {selectArray.map(number => {
                                                        return (
                                                            <option value={number} >{number}</option>
                                                        )
                                                    })}
                                                </select>
                                            </div>
                                        </>
                                    )}

                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
export default PurchaseApprove
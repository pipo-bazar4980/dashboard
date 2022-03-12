import React, {useState, useEffect} from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {Card} from "antd";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PropTypes from "prop-types";
import Table from "./sendSmsAll";
import Tables from './sendSmsAllActive'
import {getAllUserList,getActiveUserList} from "../Api/user";
import {userInfo} from '../utils/auth';
import Pagination from "./Pagination";
import {useHistory} from "react-router-dom";
import {Button, Form, Modal} from "react-bootstrap";
import {sendMessageAllUser} from "../Api/sendMessage";
import {notify} from '../utils/notification';

function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{p: 3}}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function SendSms() {
    let history = useHistory();

    const {token, role} = userInfo();

    const [allUserList, setAllUserList] = useState([]);

    const [activeUserList, setActiveUserList] = useState([]);


    const [value, setValue] = React.useState(0);

    const [user, setUser] = useState(0);

    const [activeUser, setActiveUser] = useState(0);

    const [show, setShow] = useState(false);

    const [show2, setShow2] = useState(false);

    const [done, setDone] = useState(false);

    const [activeDone, setActiveDone] = useState(false);

    const [allClick, setAllClick] = useState(false);

    const [allActiveClick, setAllActiveClick] = useState(false);

    const handleChanges = (event,newValue) => {
        setValue(newValue);
    };

    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(10);

    const [currentPages, setCurrentPages] = useState(1);
    const [postsPerPages, setPostsPerPages] = useState(10);

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPost = allUserList.slice(indexOfFirstPost, indexOfLastPost);

    const indexOfLastPosts = currentPages * postsPerPages;
    const indexOfFirstPosts = indexOfLastPosts - postsPerPages;
    const currentPosts = activeUserList.slice(indexOfFirstPosts, indexOfLastPosts);

    const paginate = pageNumber => {
        setCurrentPage(pageNumber)
        setUser(pageNumber)
    }

    const paginates = pageNumber => {
        setCurrentPages(pageNumber)
        setActiveUser(pageNumber)
    };

    useEffect(() => {
        getAllUserList(token)
            .then(response => {
                setAllUserList(response.data)
            })
        getActiveUserList(token)
            .then(response => {
                setActiveUserList(response.data)
            })
    }, [])



    const rowSelectForAllUserTable = (e) => {
        setPostsPerPage(e.target.value)
    }
    let selectArray = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

    const nextPage = () => {
        if (allClick === true) {
            setShow(true)
        } else if (!localStorage.getItem('phoneNumberArray')) {
            notify("Please select at least one number")
        } else {
            setShow(true)
        }
    }

    const nextPageActive = () => {
        if (allActiveClick === true) {
            setShow2(true)
        } else if (!localStorage.getItem('activeUserPhoneNumberArray')) {
            notify("Please select at least one number")
        } else {
            setShow2(true)
        }
    }

    const [text, setText] = useState({
        text: '',
        disabled: false
    });

    const handleChange = e => {
        setText({
            ...text,
            [e.target.name]: e.target.value
        })
    }

    const handleClose = () => {
        setShow(false)
        setShow2(false)
    };

    const sendSms = () => {
        setDone(true)
        let numberArray = [];
        if (allClick === true) {
            for (let user of allUserList) {
                numberArray.push(user.phonenumber)
            }
        } else {
            numberArray = localStorage.getItem("phoneNumberArray").split(",")
        }

        let sendMessage = {
            numbers: numberArray,
            message: text.text.replaceAll(" ", "%20").replace(/(\r\n|\n|\r)/gm, "")
        }
        sendMessageAllUser(sendMessage)

            .then(res => {
                handleClose()
                setDone(false)
                setAllClick(false)
                notify("Message send successfully")
                localStorage.setItem("phoneNumberArray", [])
            })
            .catch(err => {
                console.log("err", err)
                notify("Something went wrong! Please try again")
            })
    }

    const sendSmsActiveUser = () => {
        setActiveDone(true)
        let numberArray = [];
        if (allActiveClick === true) {
            for (let user of activeUserList) {
                numberArray.push(user.userId.phonenumber)
            }
        } else {
            numberArray = localStorage.getItem("activeUserPhoneNumberArray").split(",")
        }

        let sendMessage = {
            numbers: numberArray,
            message: text.text.replaceAll(" ", "%20").replace(/(\r\n|\n|\r)/gm, "\n")
        }

        sendMessageAllUser(sendMessage)
            .then(res => {
                handleClose()
                setActiveDone(false)
                setAllActiveClick(false)
                notify("Message send successfully")
                localStorage.setItem("phoneNumberArray", [])
            })
            .catch(err => {
                console.log("err", err)
                notify("Something went wrong! Please try again")
            })
    }

    const allCheckbox = () => {
        setDone(false)
        setAllClick(!allClick)
    }

    const allActiveCheckbox = () => {
        setActiveDone(false)
        setAllActiveClick(!allActiveClick)
    }


    useEffect(() => {
        localStorage.setItem("phoneNumberArray", [])
        localStorage.setItem("activeUserPhoneNumberArray", [])
    }, [])


    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Body style={{margin: "10px"}}>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Send SMS</Form.Label>
                            <Form.Control as="textarea" rows={5} placeholder={"Write something...."}
                                          onChange={handleChange} name="text"/>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={sendSms}>
                        Send
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={show2} onHide={handleClose}>
                <Modal.Body style={{margin: "10px"}}>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Send SMS</Form.Label>
                            <Form.Control as="textarea" rows={5} placeholder={"Write something...."}
                                          onChange={handleChange} name="text"/>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={sendSmsActiveUser}>
                        Send
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

            <Box sx={{width: '100%'}}>
                <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                    <Tabs value={value} onChange={handleChanges} aria-label="basic tabs example">
                        <Tab label="All user list" {...a11yProps(0)} />
                        <Tab label="Active user list" {...a11yProps(1)} />
                    </Tabs>
                </Box>

                <TabPanel value={value} index={0}>
                    <Card title={`All User List`}>
                        <table className="table">
                            <thead>
                            <tr>
                                {done === false && (
                                    <th scope="col"><input onClick={allCheckbox} type="checkbox"/></th>
                                )}
                                {done === true && (
                                    <th scope="col"><input onClick={allCheckbox} type="checkbox" checked={false}
                                                           value={true}/></th>
                                )}

                                <th className="border-0">#</th>
                                <th className="border-0">Customer ID</th>
                                <th className="border-0">Customer Name</th>
                                <th className="border-0">Customer Phone Number</th>
                            </tr>
                            </thead>
                            <tbody>
                            <Table sendSmsAll={currentPost} paginate={currentPage} postsPerPage={postsPerPage}
                                   allClick={allClick} done={done}/>
                            </tbody>
                        </table>
                        <div className='d-flex'>
                            <Pagination
                                postsPerPage={postsPerPage}
                                totalPosts={allUserList.length}
                                paginate={paginate}
                                Number={user}
                            />
                            {allUserList.length > 0 && (
                                <div className='ml-5'>
                                    <select style={{cursor: 'pointer'}} onChange={(e) => rowSelectForAllUserTable(e)}>
                                        {selectArray.map(number => {
                                            return (
                                                <option value={number}>{number}</option>
                                            )
                                        })}
                                    </select>
                                </div>
                            )}
                        </div>
                        <div>
                            <button className="btn btn-danger" onClick={nextPage}>Next</button>
                        </div>
                    </Card>
                    <br/>
                </TabPanel>

                <TabPanel value={value} index={1}>
                    <Card title={`Active User List`}>
                        <table className="table">
                            <thead>
                            <tr>
                                {activeDone === false && (
                                    <th scope="col"><input onClick={allActiveCheckbox} type="checkbox"/></th>
                                )}
                                {activeDone === true && (
                                    <th scope="col"><input onClick={allActiveCheckbox} type="checkbox" checked={false}
                                                           value={true}/></th>
                                )}
                                <th className="border-0">#</th>
                                <th className="border-0">Customer ID</th>
                                <th className="border-0">Customer Name</th>
                                <th className="border-0">Customer Phone Number</th>
                            </tr>
                            </thead>
                            <tbody>
                            <Tables sendSmsAll={currentPosts} paginate={currentPages} postsPerPage={postsPerPages} allActiveClick={allActiveClick}
                                    activeDone={activeDone}/>
                            </tbody>
                        </table>
                        <div className='d-flex'>
                            <Pagination
                                postsPerPage={postsPerPages}
                                totalPosts={activeUserList.length}
                                paginate={paginates}
                                Number={activeUser}
                            />
                            {allUserList.length > 0 && (
                                <div className='ml-5'>
                                    <select style={{cursor: 'pointer'}} onChange={(e) => rowSelectForAllUserTable(e)}>
                                        {selectArray.map(number => {
                                            return (
                                                <option value={number}>{number}</option>
                                            )
                                        })}
                                    </select>
                                </div>
                            )}
                        </div>
                        <div>
                            <button className="btn btn-danger" onClick={nextPageActive}>Next</button>
                        </div>
                    </Card>
                    <br/>
                </TabPanel>

            </Box>


        </>
    )
}

export default SendSms;

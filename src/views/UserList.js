import React, { useState, useEffect } from 'react';
import { userInfo } from '../utils/auth';
import { BsPencilSquare } from "react-icons/bs"
import { notify } from '../utils/notification';
import { getAllWallet } from '../Api/wallet'
import { editBalance } from '../Api/wallet'
import { deleteUser } from '../Api/user';
import { passwordEdit } from "../Api/userAdmin";
import {
    Button,
    Modal,
    Form
} from "react-bootstrap";
let userWalletId, walletUserName;
let userEmail, userName;

const UserList = ({ allUserList, loading, paginate,getAllUserList,postsPerPages }) => {

    const [allWallet, setAllWallet] = useState([]);
    const { token, role, id } = userInfo();
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const handleClose = () => { setShow(false), setShow2(false) };
    const handleShow = () => setShow(true);
    const handleShow2 = () => setShow2(true);


    useEffect(() => {
        getAllWallet(token)
            .then(res => setAllWallet(res.data))
    }, [allWallet])

    if (loading) {
        return <h2>Loading...</h2>;
    }

    const modalOpen = (walletId, name) => () => {
        handleShow()
        userWalletId = walletId;
        walletUserName = name;
    }

    const modalOpen2 = (email, name) => () => {
        handleShow2()
        userEmail = email;
        userName = name;

    }

    const [walletBalance, setWalletBalance] = useState({
        amount: '',
        disabled: false
    });

    const { amount } = walletBalance;

    const handleChange = e => {
        setWalletBalance({
            ...walletBalance,
            [e.target.name]: e.target.value
        })
    }

    const handleChange2 = e => {
        setEditPassword({
            ...editPassword,
            [e.target.name]: e.target.value
        })
    }

    const editUserBalance = () => {
        handleClose();
        setWalletBalance({
            ...walletBalance,
            disabled: true
        })
        editBalance(token, userWalletId, parseInt(amount))
            .then(res => {
                setWalletBalance({
                    amount: '',
                    disabled: true
                })
                notify(`${walletUserName}'s wallet balance updated`)
            })
            .catch(err => {
                setWalletBalance({
                    amount: '',
                    disabled: false
                })
                notify(`Something went wrong. Please try again`)
            })
    }


    const deleteUserById = (id) => () => {
        setDisabled({
            disabledd: true
        })
        deleteUser(token, id)
            .then((response) => {
                getAllUserList()
                notify('User Delete Successfully')
                setDisabled({
                    disabledd: false
                })
            })
            .catch(err => {
                notify('Something went wrong')
                setDisabled({
                    disabledd: false
                })
            })
    }


    const editUserPassword = async () => {
        if (newPassword !== newRePassword) {
            notify('password do not match')
        } else {
            const update = {
                newPassword: newPassword,
                email: userEmail
            }
            console.log(update)
            await passwordEdit(token, id, update).then(res => {
                notify('Password Updated')
                handleClose()
            })
        }
    }


    const [editPassword, setEditPassword] = useState({
        newPassword: '',
        newRePassword: ''
    });
    

    const { newPassword, newRePassword } = editPassword;


    const [disabled, setDisabled] = useState({
        disabledd: false
    });

    const { disabledd } = disabled

    

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header style={{ margin: "40px 10px 0px 15px" }}>
                    Edit {walletUserName}'s Wallet Balance
                </Modal.Header>
                <Modal.Body style={{ margin: "10px" }}>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Enter the amount</Form.Label>
                            <Form.Control type="text" name="amount" placeholder="Enter amount" onChange={handleChange} style={{ width: "80%" }} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={editUserBalance}>
                        Edit
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={show2} onHide={handleClose}>
                <Modal.Header style={{ margin: "40px 10px 0px 15px" }}>
                    Edit {userName}'s password
                </Modal.Header>
                <Modal.Body style={{ margin: "10px" }}>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Enter New Password</Form.Label>
                            <Form.Control type="password" name="newPassword" placeholder="Enter amount" onChange={handleChange2} style={{ width: "80%" }} />
                            <Form.Label>Re-enter Password</Form.Label>
                            <Form.Control type="password" name="newRePassword" placeholder="Enter amount" onChange={handleChange2} style={{ width: "80%" }} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={editUserPassword}>
                        Edit
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

            {allUserList && allUserList.filter(filteredData => filteredData.role === 'user' && filteredData.disabled === false).map((user, index) => (
                <tr>
                    <td>{(paginate - 1) * parseInt(postsPerPages) + index + 1}</td>
                    <td>{user.userIdNo}</td>
                    <td>{user.username} {user.vipBatch === true && (<><span style={{ color: "blue", fontSize: ".7rem", fontWeight: "bold" }}>* (VIP Batch)</span></>)}</td>
                    <td>{user.email}</td>
                    <td>{user.phonenumber}</td>
                    {allWallet && allWallet.map(wallet => {
                        if (user._id === wallet.userId) {
                            return (

                                <td><div className='d-flex justify-content-around'>
                                    <div>{wallet.currentAmount}</div>
                                    <div><BsPencilSquare style={{ fontSize: 'x-large', cursor: "pointer" }} onClick={modalOpen(wallet._id, user.username)} /></div>
                                </div></td>
                            )
                        }
                    })}
                    {(role === 'superadmin' || role === 'admin') && (<>
                        <td className="border-0"><button className='btn btn-danger' disabled={disabledd} onClick={modalOpen2(user.email, user.username)}>Edit Password</button></td>
                    </>)}
                    {(role === 'superadmin' || role === 'admin') && (<>
                        <td className="border-0"><button className='btn btn-danger' disabled={disabledd} onClick={deleteUserById(user._id)}>Delete</button></td>
                    </>)}
                </tr>
            ))
            }
        </>
    );
};

export default UserList;
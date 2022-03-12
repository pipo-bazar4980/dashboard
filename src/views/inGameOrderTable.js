import React, {useEffect, useState} from "react";
import moment from "moment";
import {Form} from "react-bootstrap";
import {Checkbox} from "@mui/material";

let array = [];
let orderIds = []
let arrayItem=['1']

const inGameOrderTable = ({inGameOrders, loading, paginate, markComplete, modalOpen, disabled, postsPerPage}) => {
    if (loading) {
        return <h2>Loading...</h2>;
    }
    const selectAll = (orderId) => () => {
        if (!localStorage.getItem('orderArray')) {
            array = []
            orderIds=[]
        }
        const foundId = array.indexOf(orderId);
        if (foundId === -1) {
            array.push(orderId);
            localStorage.setItem("orderArray", array)
            console.log("array", array)
        } else {
            array.splice(foundId, 1);
            localStorage.setItem("orderArray", array)
        }
        orderIds=localStorage.getItem('orderArray').split(',')
    }

    return (
        <>
            {inGameOrders && inGameOrders.filter(filteredData => filteredData.isComplete === false && filteredData.reject === false && filteredData.productId?.categoryName === '(InGame)').map((order, index) => (
                <tr>
                    {orderIds.length===0 && (
                        <td ><input onClick={selectAll(order._id)} type="checkbox" checked={false} /></td>
                    )}
                    {orderIds.length>0 && arrayItem.map(item=>{
                        if(orderIds.indexOf(order._id) !== -1){
                            return(
                                <td ><input onClick={selectAll(order._id)} type="checkbox" checked={true} /></td>
                            )
                        }
                        else{
                            return(
                                <td ><input onClick={selectAll(order._id)} type="checkbox" checked={false} value={true}/></td>
                            )
                        }
                    })}
                    <td>{(paginate - 1) * parseInt(postsPerPage) + index + 1}</td>
                    <td>{order.orderId}</td>
                    <td>{order.userId?.userIdNo}</td>
                    <td>{order.productId?.gameName}</td>
                    <td>{order.purchaseId?.product?.option} ({order.purchaseId?.product?.price})</td>
                    <td>{order.purchaseId?.accountType} </td>
                    <td>{order.purchaseId?.Number} </td>
                    <td>{order.purchaseId?.Password} </td>
                    <td>{order.purchaseId?.backupCode} </td>
                    <td>{moment(order.createdAt).format('DD-MM-YYYY, h:mm a')}</td>

                    {order.isComplete === false && (<>
                        <td>
                            <button className="btn btn-primary" disabled={disabled}
                                    onClick={markComplete(order._id, order.userId?._id, order.userId?.phonenumber, order.productId?.gameName, order.productId?.categoryName, order.purchaseId?.product?.option, order.purchaseId?.product?.price, order.walletId?._id)}>Mark
                                as Complete
                            </button>
                        </td>
                    </>)}
                    {order.isComplete === true && (<>
                        <td>
                            <button className="btn btn-primary">Completed</button>
                        </td>
                    </>)}

                    <td>
                        <button className="btn btn-primary"
                                onClick={modalOpen(order._id, order.userId?._id, order.productId?.gameName, order.productId?.categoryName, order.purchaseId?.product?.option, order.purchaseId?.product?.price, order?.paymentComplete)}>Cancel
                        </button>
                    </td>
                </tr>
            ))}
        </>
    );
};

export default inGameOrderTable;
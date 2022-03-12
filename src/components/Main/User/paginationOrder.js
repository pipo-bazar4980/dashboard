import React from 'react';
import moment from "moment";

const OrderTables = ({ myOrders, loading, paginate }) => {

    return (
        <>
            {myOrders && myOrders.map((order, index) => (
                <tr key={index}>
                    <td>{(paginate - 1) * 10 + index + 1}</td>
                    <td>{order.orderId}</td>
                    <td>{moment(order.createdAt).format('DD-MM-YYYY, h:mm a')}</td>
                    <td>{order.productId?.gameName}</td>
                    <td>{order.purchaseId?.product?.option} <span style={{ marginLeft: "10px" }}>{order.purchaseId?.product?.price} Taka</span></td>
                    {order.isComplete === true && order.reject === false && (<>
                        <td style={{ color: "green" }}>Complete</td>
                    </>)}
                    {order.isComplete === false && order.reject === false && (<>
                        <td style={{ color: "blue" }}>Pending</td>
                    </>)}
                    {order.reject === true && (<>
                        <td style={{ color: "red" }}>Canceled <span style={{ color: "black" }}>( {order.rejectReason} )</span></td>
                    </>)}
                </tr>
            ))}
        </>
    );
};

export default OrderTables;
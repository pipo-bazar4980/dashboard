import React from 'react';
import moment from "moment";
import { BsPencilSquare } from "react-icons/bs";

const cancelSubscOrderTable = ({ cancelledOrdersSubsc, loading, paginatesssssss,makeActive,disabled,postsPerPagesssssss }) => {
    if (loading) {
        return <h2>Loading...</h2>;
    }

    return (
        <>
            {cancelledOrdersSubsc && cancelledOrdersSubsc.filter(filteredData => filteredData.isComplete === false && filteredData.reject === true && filteredData.productId?.categoryName === '(Subsc)').map((order, index) => (
                <tr>
                    <td>{(paginatesssssss - 1) * parseInt(postsPerPagesssssss) + index + 1}</td>
                    <td>{order.orderId}</td>
                    <td>{order.userId?.userIdNo}</td>
                    <td>{order.productId?.gameName}</td>
                    <td>{order.purchaseId?.product?.option} ({order.purchaseId?.product?.price})</td>
                    <td>{order.purchaseId?.accountType} </td>
                    <td>{order.purchaseId?.Number} </td>
                    <td>{order.purchaseId?.Password} </td>
                    <td>{order.purchaseId?.backupCode} </td>
                    <td>{moment(order.createdAt).format('DD-MM-YYYY, h:mm a')}</td>

                    <td>
                        <button className="btn btn-primary" disabled={disabled} onClick={makeActive(order._id, order.userId?._id, order.productId?.gameName, order.productId?.categoryName, order.purchaseId?.product?.option, order.purchaseId?.product?.price)}>Make Active</button>
                    </td>
                </tr>
            ))}
        </>
    );
};

export default cancelSubscOrderTable;
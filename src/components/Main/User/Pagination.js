import React from 'react';
import moment from "moment";

const Tables = ({ transaction, loading, paginate }) => {
    if (loading) {
        return <h2>Loading...</h2>;
    }
    return (
        <>
            {transaction && transaction.map((data, index) => (
                   <tr key={index}>
                   <td>{(paginate - 1) * 10 + index + 1}</td>
                        <td>{moment(data.createdAt).format('DD-MM-YYYY, h:mm a')}</td>
                        <td>{data.paymentType}</td>
                        <td>{data.transactionID}</td>
                        <td>{data.amount}</td>
                        <td>{data.mobileNumber}</td>
                        {data.isComplete === true && (<>
                            <td style={{ color: "green" }}>Complete</td>
                        </>)}
                        {data.isComplete === false && data.reject === false && (<>
                            <td style={{ color: "blue" }}>Pending</td>
                        </>)}
                        {data.reject === true && (<>
                            <td style={{ color: "red" }}>Canceled <span style={{ color: "black" }}>( {data.rejectReason} )</span></td>
                        </>)}
                    </tr>
                )
            )}
        </>
    );
};

export default Tables;
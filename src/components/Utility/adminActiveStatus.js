import React from 'react';
import { updateUserActiveStatus2 } from "../../Api/user";
import { notify } from '../../utils/notification'

const adminActiveStatus = ({ adminData, paginate }) => {
   
    const changeStatus = (user) => () => {
        let activeStatus = user.activeStatus === "active" ? "InActive" : "active";
        let id=user._id
        updateUserActiveStatus2(activeStatus,id)
                .then((response) => {
                    notify('Admin active status updated')
                })
    }

    return (
        <>
            {adminData && adminData.map((user, index) => (
                <>
                    <div >
                        <span style={{ marginRight: "10px" }}>{(paginate - 1) * 10 + index + 1}</span>
                        <span style={{ maxWidth: "50px" }}> {user.username}</span>

                        <span>
                            <button id="role-btn" className="role-btn">{user.activeStatus}</button>
                            <div className="dropdown">
                                <button className="role-btn" style={{ borderLeft: "1px solid #0d8bf2", width: '35px' }}>
                                    <i className="fa fa-caret-down"></i>
                                </button>
                                <div id="role-dropdown" className="dropdown-content">
                                    <p onClick={changeStatus(user)}>{user.activeStatus === "active" ? "InActive" : "active"}</p>
                                </div>
                            </div>
                        </span>
                    </div><br />
                </>

            ))}
        </>

    );
};

export default adminActiveStatus;
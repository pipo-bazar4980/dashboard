import React, {useState} from 'react';

let array = [];
let userIds = []
let arrayItem=['1']

const sendSmsAll = ({sendSmsAll, paginate, postsPerPage, allActiveClick, activeDone}) => {

    const selectAll = (userId) => () => {

        if (!localStorage.getItem('activeUserPhoneNumberArray')) {
            array = []
            userIds = []
        }
        const foundId = array.indexOf(userId);
        if (foundId === -1) {
            array.push(userId);
            localStorage.setItem("activeUserPhoneNumberArray", array)
        } else {
            array.splice(foundId, 1);
            localStorage.setItem("activeUserPhoneNumberArray", array)
        }
        userIds = localStorage.getItem('activeUserPhoneNumberArray').split(',')
    }

    return (
        <>
            {sendSmsAll && sendSmsAll.map((user, index) => (
                <tr>
                    {allActiveClick === true && activeDone === false && (
                        <td><input onClick={selectAll(user.userId.phonenumber)} type="checkbox" checked={true} value={true}/>
                        </td>
                    )}
                    {allActiveClick===false &&  activeDone===false &&(
                        <td ><input onClick={selectAll(user.userId.phonenumber)} type="checkbox" /></td>
                    )}
                    {activeDone===true &&(
                        <td ><input onClick={selectAll(user.userId.phonenumber)} type="checkbox" /></td>
                    )}
                    <td>{(paginate - 1) * parseInt(postsPerPage) + index + 1}</td>
                    <td>{user.userId.userIdNo}</td>
                    <td>{user.userId.username}</td>
                    <td>{user.userId.phonenumber}</td>
                </tr>
            ))}
        </>
    );
};

export default sendSmsAll;
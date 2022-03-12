import React, {useState} from 'react';

let array = [];
let userIds = []
let arrayItem=['1']
let restart=false
const sendSmsAll = ({sendSmsAll, paginate, postsPerPage, allClick, done}) => {

    const selectAll = (userId) => () => {
        restart=true
        if (!localStorage.getItem('phoneNumberArray')) {
            array = []
            userIds = []
        }
        const foundId = array.indexOf(userId);
        if (foundId === -1) {
            array.push(userId);
            localStorage.setItem("phoneNumberArray", array)
        } else {
            array.splice(foundId, 1);
            localStorage.setItem("phoneNumberArray", array)
        }
        userIds = localStorage.getItem('phoneNumberArray').split(',')
    }

    console.log(allClick,done)
    return (
        <>
            {sendSmsAll && sendSmsAll.map((user, index) => (
                <tr>
                    {allClick === true && done === false && (
                        <td><input onClick={selectAll(user.phonenumber)} type="checkbox" checked={true} value={true}/>
                        </td>
                    )}
                    {allClick===false &&  done===false &&(
                        <td ><input onClick={selectAll(user.phonenumber)} type="checkbox" /></td>
                    )}
                    {done===true &&(
                        <td ><input onClick={selectAll(user.phonenumber)} type="checkbox" checked={false} value={true}/></td>
                    )}

                    <td>{(paginate - 1) * parseInt(postsPerPage) + index + 1}</td>
                    <td>{user.userIdNo}</td>
                    <td>{user.username}</td>
                    <td>{user.phonenumber}</td>
                </tr>
            ))}
        </>
    );
};

export default sendSmsAll;
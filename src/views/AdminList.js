import React from 'react';

const AdminList = ({ adminList, loading, paginate,postsPerPage }) => {
    if (loading) {
        return <h2>Loading...</h2>;
    }
    return (
        <>
            {adminList && adminList.filter(filteredData => filteredData.role === 'admin' && filteredData.disabled === false).map((user, index) => (
                      <tr>
                        <td>{(paginate - 1) * parseInt(postsPerPage) + index + 1}</td>
                        <td>{user.userIdNo}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.phonenumber}</td>
                      </tr>
                    ))
                    }
        </>
    );
};

export default AdminList;
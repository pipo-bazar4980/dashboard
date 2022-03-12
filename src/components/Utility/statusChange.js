import React, { useState, useEffect } from "react";
import { Card } from "antd";
import { Table } from "react-bootstrap";
import { getAllUser } from '../../Api/user';
import { userInfo } from '../../utils/auth';
import Tables from "./adminActiveStatus";
import Pagination from "../../views/Pagination";

const StatusChange = () => {
    const { token } = userInfo();
    const [adminData, setAdminData] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(10);

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPost = adminData.slice(indexOfFirstPost, indexOfLastPost);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    useEffect(() => {
        getAllUser(token)
            .then((res) => {
                let data = res.data
                const admin = data && data.filter(filteredData => filteredData.role === 'admin')
                setAdminData(admin)
                console.log(admin)
            })
            .catch((err) => {
                console.log(err.response);
            });
    }, [adminData]);

    return (
        <div>
            <Card title={`Admin Active Status`}>

                <Tables adminData={currentPost} paginate={currentPage} />

                <Pagination
                    postsPerPage={postsPerPage}
                    totalPosts={adminData.length}
                    paginate={paginate}
                />
            </Card>
        </div >

    )

}

export default StatusChange;
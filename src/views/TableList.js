import React, { useState, useEffect } from 'react';
import { getAllUser } from '../Api/user';
import { userInfo } from '../utils/auth';
import './TableList.css';
import Tables from './AdminList'
import Tabless from './UserList'
import Pagination from './Pagination'
// react-bootstrap components
import {
  Card,
  Table,
  Container,
  Row,
  Col,
} from "react-bootstrap";
let userList;

function TableList() {
  const [adminList, setAdminList] = useState([]);
  const [allUserList, setAllUserList] = useState([]);
  const { token, role } = userInfo();

  useEffect(() => {
    getAllUserList()
  }, [])


  const getAllUserList = () => {
    getAllUser(token)
      .then(response => {
        let admin = response.data && response.data.filter(filteredData => filteredData.role === 'admin' && filteredData.disabled === false)
        setAdminList(admin)
        let user = response.data && response.data.filter(filteredData => filteredData.role === 'user' && filteredData.disabled === false)
        setAllUserList(user)
      })
  }

  const searchForAdminList = (e) => {
    let searchTerm = e.currentTarget.value
    userList = false;
    getAllUser(token)
      .then(res => {
        if (res.data) {
          filterContent(res.data, searchTerm)
        }
      })
  }

  const searchForAllUserList = (e) => {
    let searchTerm = e.currentTarget.value
    userList = true;
    getAllUser(token)
      .then(res => {
        if (res.data) {
          filterContent(res.data, searchTerm)
        }
      })
  }

  const filterContent = (users, searchTerm) => {
    const result = users.filter((user) =>
      user.username?.toLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
      user.phonenumber?.toLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
      ((parseInt(user.wallet?.currentAmount)).toString()).includes(searchTerm) ||
      ((parseInt(user.userIdNo)).toString()).includes(searchTerm)
    )

    if (userList === true) {
      let value = result.filter(filteredData => filteredData.role === 'user')
      setAllUserList(value)
    }
    else if (userList === false) {
      let value = result.filter(filteredData => filteredData.role === 'admin' || filteredData.role === 'superadmin')
      setAdminList(value)
    }

  }

  const rowSelectForUserTable = (e) => {
    setPostsPerPages(e.target.value)
  }

  const rowSelectForAdminTable = (e) => {
    setPostsPerPage(e.target.value)
  }


  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);


  const [currentPages, setCurrentPages] = useState(1);
  let [postsPerPages, setPostsPerPages] = useState(10);


  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPost = adminList.slice(indexOfFirstPost, indexOfLastPost);

  let indexOfLastPosts = currentPages * postsPerPages;
  let indexOfFirstPosts = indexOfLastPosts - postsPerPages;
  let currentPosts = allUserList.slice(indexOfFirstPosts, indexOfLastPosts);

  const [admin, setAdmin] = useState(0);
  const [user, setUser] = useState(0);

  const paginate = pageNumber => {
    setCurrentPage(pageNumber)
    setAdmin(pageNumber)
  }
  const paginates = pageNumber => {
    setCurrentPages(pageNumber)
    setUser(pageNumber)
  }

  let selectArray = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]


  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <div style={{ float: "right", width: "300px" }}>
                  <input
                    className="form-control"
                    type="search"
                    placeholder="Search"
                    name="serachTerm"
                    onChange={searchForAdminList}
                  >
                  </input>
                </div>
                <Card.Title as="h4">Admin List</Card.Title>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                <Table className="table-hover table-striped">
                  <thead>
                    <tr>
                      <th className="border-0">#</th>
                      <th className="border-0">User ID</th>
                      <th className="border-0">Name</th>
                      <th className="border-0">Email</th>
                      <th className="border-0">Phone No</th>
                    </tr>
                  </thead>
                  <tbody>
                    <Tables adminList={currentPost} loading={loading} paginate={currentPage} postsPerPage={postsPerPage}/>
                  </tbody>
                </Table>
                <div className='d-flex'>
                  <Pagination
                    postsPerPage={postsPerPage}
                    totalPosts={adminList.length}
                    paginate={paginate}
                    Number={admin}
                  />
                  {adminList.length > 0 && (
                    <div className='ml-5' >
                      <select style={{ cursor: 'pointer' }} onChange={(e) => rowSelectForAdminTable(e)}>
                        {selectArray.map(number => {
                          return (
                            <option value={number} >{number}</option>
                          )
                        })}
                      </select>
                    </div>
                  )}
                </div>

              </Card.Body>
            </Card>
          </Col>

          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <div style={{ float: "right", width: "300px" }}>
                  <input
                    className="form-control"
                    type="search"
                    placeholder="Search"
                    name="serachTerm"
                    onChange={searchForAllUserList}
                  >
                  </input>
                </div>
                <Card.Title as="h4">User List:</Card.Title>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                <Table className="table-hover table-striped">
                  <thead>
                    <tr>
                      <th className="border-0">#</th>
                      <th className="border-0">User ID</th>
                      <th className="border-0">Name</th>
                      <th className="border-0">Email</th>
                      <th className="border-0">Phone No</th>
                      <th className="border-0">Wallet Balance</th>
                      {(role === 'superadmin') && (<>
                        <th className="border-0"></th>
                      </>)}
                    </tr>
                  </thead>
                  <tbody>
                    <Tabless allUserList={currentPosts} loading={loading} paginate={currentPages} getAllUserList={getAllUserList} postsPerPages={postsPerPages} />
                  </tbody>
                </Table>
                <div className='d-flex'>
                  <Pagination
                    postsPerPage={postsPerPages}
                    totalPosts={allUserList.length}
                    paginate={paginates}
                    Number={user}
                  />
                  {allUserList.length > 0 && (
                    <div className='ml-5' >
                      <select style={{ cursor: 'pointer' }} onChange={(e) => rowSelectForUserTable(e)}>
                        {selectArray.map(number => {
                          return (
                            <option value={number} >{number}</option>
                          )
                        })}
                      </select>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default TableList;

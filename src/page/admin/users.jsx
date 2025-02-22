import React, { useState, useEffect } from "react";
import AxiosInstance from "../../../utils/AxiosInstance";
import { notifyError, formatDate } from "../../../utils/helpers";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Pagination,
} from "@mui/material";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await AxiosInstance.get("/users");
      if (res.status === 200) {
        setUsers(res.data.data);
      }
    } catch (err) {
      notifyError("Error", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Get current page's data
  const paginatedUsers = users.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <div className="px-3 mt-8">
      <div className="flex justify-between">
        <h1 className="font-bold font-serif" style={{ fontSize: "30px" }}>
          List of Users
        </h1>
        <p style={{ fontSize: "13.5px" }}>
          <Link to="/admin">
            <span className="text-blue-500 hover:underline">Home</span> /
          </Link>
          <span className="text-gray-500"> Contacts</span>
        </p>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="flex justify-center items-center">
            <CircularProgress />
          </div>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>
                      <strong>Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Date of Birth</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Gender Identity</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Pronouns</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Email</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Phone</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Status</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Registered At</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Profile Picture</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((user, index) => (
                      <TableRow
                        key={user._id}
                        className="even:bg-gray-50 odd:bg-white hover:bg-gray-100 transition-all"
                      >
                        <TableCell>
                          {(page - 1) * rowsPerPage + index + 1}
                        </TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>
                          {new Date(user.dob).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{user.genderIdentity}</TableCell>
                        <TableCell>{user.pronouns}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phoneNumber}</TableCell>
                        <TableCell>
                          {user.status.charAt(0).toUpperCase() +
                            user.status.slice(1)}
                        </TableCell>
                        <TableCell>
                          {formatDate(user.createdAt, "MMMM DD, YYYY")}
                        </TableCell>
                        <TableCell>
                          <img
                            src={user.profile?.url}
                            alt="Profile"
                            className="w-11 h-11 rounded-xl object-cover"
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={10} align="center">
                        No users found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination Component */}
            <div className="flex justify-center mt-4">
              <Pagination
                count={Math.ceil(users.length / rowsPerPage)}
                page={page}
                onChange={handleChangePage}
                color="secondary"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Users;

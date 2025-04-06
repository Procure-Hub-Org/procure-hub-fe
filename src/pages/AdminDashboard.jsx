import React, { useState, useEffect } from "react";
import BasicButton from "../components/Button/BasicButton";
import Navbar from "../components/Navbar/Navbar";
import "../styles/Admin.css";
import PrimaryButton from "../components/Button/PrimaryButton.jsx";
import axios from "axios";
import CreateUserPage   from "./CreateUserPage.jsx";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [isCreateUserPageVisible, setIsCreateUserPageVisible] = useState(false); // Za kreiranje novog korisnika
  const token = localStorage.getItem("jwt_token");  // Pretpostavljamo da je JWT token pohranjen u localStorage

    // Učitavanje korisnika sa backend-a
  useEffect(() => {
    if (!token) {
        // mock podaci for now - obrisati kada dodje do final verzije
        setUsers([
            { id: 1, firstName: "Mock", lastName: "User", email: "mock@user.com", role: "user" },
            { id: 2, firstName: "Test", lastName: "Admin", email: "admin@test.com", role: "admin" },
        ]);

      // Ako nema tokena, preusmeri na login
      // window.location.href = "/login";
      return;
    }

    axios
        .get(`${import.meta.env.VITE_API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUsers(response.data.users);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
  }, [token]);

  const handleUpdate = (id) => console.log(`Update user with ID: ${id}`);
  const handleDelete = (id) => {
    console.log(`Delete user with ID: ${id}`);
    axios
        .delete(`${import.meta.env.VITE_API_URL}/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUsers(users.filter(user => user.id !== id)); // Ukloni korisnika iz stanja
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
        });
  };

  const handleSuspend = (id) => {
    console.log(`Suspend user with ID: ${id}`);
    axios.patch(`${import.meta.env.VITE_API_URL}/api/users/${id}/suspend`, null,{
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error("Error suspending user:", error);
    })
  };
  const handleApprove = (id) => {
    console.log(`Approve user with ID: ${id}`);
    axios
        .patch(`${import.meta.env.VITE_API_URL}/api/users/${id}/approve`, null, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error approving user:", error);
        });
  };

    const toggleCreateUserPage = () => {
        setIsCreateUserPageVisible(!isCreateUserPageVisible);
    };

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="button-container">
        <PrimaryButton onClick={toggleCreateUserPage}>
          Create User
        </PrimaryButton>
      </div>
      <div className="panel">
          <table className="table">
          <thead>
            <tr>
              <th className="th">ID</th>
              <th className="th">First Name</th>
              <th className="th">Last Name</th>
              <th className="th">Email</th>
              <th className="th">Role</th>
              <th className="th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="tr">
                <td className="td">{user.id}</td>
                <td className="td">{user.firstName}</td>
                <td className="td">{user.lastName}</td>
                <td className="td">{user.email}</td>
                <td className="td">{user.role}</td>
                <td className="td">
                  <BasicButton onClick={() => handleUpdate(user.id)}>Update</BasicButton>
                  <BasicButton onClick={() => handleDelete(user.id)}>Delete</BasicButton>
                  <BasicButton onClick={() => handleSuspend(user.id)}>Suspend</BasicButton>
                  <BasicButton onClick={() => handleApprove(user.id)}>Approve</BasicButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
          {isCreateUserPageVisible && <CreateUserPage />}
      </div>
    </div>
  );
};

export default AdminDashboard;

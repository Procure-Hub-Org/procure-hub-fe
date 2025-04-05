import React, { useState } from "react";
import BasicButton from "../components/Button/BasicButton";
import Navbar from "../components/Navbar/Navbar";
import "../styles/admin.css";

const AdminDashboard = () => {
  const [users] = useState([
    { id: 1, firstName: "Zehra", lastName: "Buza", email: "zehra@example.com", role: "admin" },
    { id: 2, firstName: "Dženeta", lastName: "Milić", email: "dzeneta@example.com", role: "seller" },
    { id: 3, firstName: "Ivona", lastName: "Jozić", email: "ivona@example.com", role: "buyer" },
  ]);

  const handleUpdate = (id) => console.log(`Update user with ID: ${id}`);
  const handleDelete = (id) => console.log(`Delete user with ID: ${id}`);
  const handleSuspend = (id) => console.log(`Suspend user with ID: ${id}`);
  const handleApprove = (id) => console.log(`Approve user with ID: ${id}`);

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="button-container">
        <BasicButton onClick={() => console.log("Create user clicked")}>
          Create User
        </BasicButton>
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
      </div>
    </div>
  );
};

export default AdminDashboard;

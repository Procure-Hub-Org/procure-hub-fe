import React, { useState, useEffect } from "react";
import BasicButton from "../components/Button/BasicButton";
import "../styles/Admin.css";
import PrimaryButton from "../components/Button/PrimaryButton.jsx";
import axios from "axios";
import CreateUserPage from "./CreateUserPage.jsx";
import Layout from "../components/Layout/Layout.jsx";
import { isAuthenticated, isAdmin } from "../utils/auth.jsx";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/system";


const AdminDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  //const [isCreateUserPageVisible, setIsCreateUserPageVisible] = useState(false); // Za kreiranje novog korisnika
  const token = localStorage.getItem("token"); // Pretpostavljamo da je JWT token pohranjen u localStorage
  // Učitavanje korisnika sa backend-a
  useEffect(() => {
    if (!isAdmin()) {
      if (!isAuthenticated()) {
        window.location.href = "/login";
      } else {
        window.location.href = "/";
      }
      return;
    }

    axios.get(`${import.meta.env.VITE_API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const userId = Number(localStorage.getItem("id"));
          setUsers(response.data.users.filter(user => user.id !== userId));
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });

  }, [token]);

  const handleUpdate = async (id) => {
    console.log(`Update user with ID: ${id}`);
    try{
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          role: 'toggle',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user role");
      }

      const userData = await response.json();
      console.log("User updated successfully:", userData);

      updateUser(id, "role", userData.user.role);
    }
    catch (error) {
      console.error("Error updating user role:", error);
    }
  };
  
  const handleDelete = (id) => {
    console.log(`Delete user with ID: ${id}`);
    axios
      .delete(`${import.meta.env.VITE_API_URL}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUsers(users.filter((user) => user.id !== id)); // Ukloni korisnika iz stanja
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  const updateUser = (id, attribute, value) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, [attribute]: value } : user
      )
    );
  };

  const handleSuspend = (id) => {
    console.log(`Suspend user with ID: ${id}`);

    axios.patch(`${import.meta.env.VITE_API_URL}/api/users/${id}/suspend`, null,{
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      console.log(response.data);
      updateUser(id, "status", response.data.data.status);
    })
    .catch((error) => {
      console.error("Error suspending user:", error);
    })

  };
  const handleApprove = (id) => {
    console.log(`Approve user with ID: ${id}`);
    axios.patch(`${import.meta.env.VITE_API_URL}/api/users/${id}/approve`, null, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log(response.data);
          updateUser(id, "status", response.data.data.status);
        })
        .catch((error) => {
          console.error("Error approving user:", error);
        });

  };

  /* ???????
  const toggleCreateUserPage = () => {
    setIsCreateUserPageVisible(!isCreateUserPageVisible);
  };*/

  return (
    <Layout>
      <div className="dashboard-container">
        <div className="button-container">
          <PrimaryButton onClick={() => navigate("/create-user")}>
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
                <th className="th">Status</th>
                <th className="th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="tr">
                  <td className="td">{user.id}</td>
                  <td className="td">{user.first_name}</td>
                  <td className="td">{user.last_name}</td>
                  <td className="td">{user.email}</td>
                  <td className="td">{user.role}</td>
                  <td className="td">{user.status}</td>
                  <td className="td">
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                      <PrimaryButton onClick={() => handleUpdate(user.id)}>
                        Update
                      </PrimaryButton>
                      <PrimaryButton onClick={() => handleDelete(user.id)}>
                        Delete
                      </PrimaryButton>
                      <PrimaryButton onClick={() => handleSuspend(user.id)}>
                        Suspend
                      </PrimaryButton>
                      <PrimaryButton onClick={() => handleApprove(user.id)}>
                        Approve
                      </PrimaryButton>
                  </div>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;

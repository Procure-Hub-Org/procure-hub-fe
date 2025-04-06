export const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return !!token;
};

export const isAdmin = () => {
    const token = localStorage.getItem("role");
    return token === "admin";
};
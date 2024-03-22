export default function isAuthenticated() {
    let token = localStorage.getItem("token");
    if (!token) return false;
    return true;
  }
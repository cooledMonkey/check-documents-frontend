export const authUtils = {
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('jwt_token');
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp ? payload.exp * 1000 > Date.now() : true;
    } catch {
      return false;
    }
  },
  
  logout: () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('refresh_token');
  },
  
  getToken: () => localStorage.getItem('jwt_token'),
};
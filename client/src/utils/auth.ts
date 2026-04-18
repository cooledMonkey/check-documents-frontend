export const authUtils = {
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('jwt_token');
    if (!token) return false;
    
    // 👇 Опционально: проверка срока действия токена
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
    // Можно вызвать authService.logout() для инвалидации на бэкенде
  },
  
  getToken: () => localStorage.getItem('jwt_token'),
};
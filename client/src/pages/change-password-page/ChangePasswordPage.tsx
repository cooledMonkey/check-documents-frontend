import type { JSX, FormEvent } from "react";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../api/authService";
import type { ApiError } from "../../types/auth";

function ChangePasswordPage(): JSX.Element {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  }, []);

  const validate = (): boolean => {
    if (!formData.oldPassword) {
      setError('Введите текущий пароль');
      return false;
    }
    if (formData.newPassword.length < 8) {
      setError('Новый пароль должен содержать минимум 8 символов');
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return false;
    }
    return true;
  };

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    setError(null);
    try {
      await authService.changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });
      setSuccess(true);
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.status === 401) {
        setError('Неверный текущий пароль');
      } else {
        setError(apiError.message || 'Ошибка при смене пароля');
      }
    } finally {
      setLoading(false);
    }
  }, [formData, navigate]);

  if (success) {
    return (
      <div className="login-bg">
        <div className="login-container">
          <div className="login-content" style={{ textAlign: 'center' }}>
            <p className="filters-title" style={{ color: '#4caf50' }}>✓ Пароль изменён</p>
            <p className="login-text">Перенаправляем...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-bg">
      <div className="login-container">
        <div className="login-content">
          <div className="filters-header">
            <p className="filters-title">Смена пароля</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="filter-group-line history-group">
              <label className="filter-label">Текущий пароль</label>
              <input
                type="password"
                name="oldPassword"
                className={`login-input${error && !formData.oldPassword ? ' input-error' : ''}`}
                value={formData.oldPassword}
                onChange={handleChange}
                disabled={loading}
                placeholder=""
                required
              />
            </div>

            <div className="filter-group-line history-group">
              <label className="filter-label">Новый пароль</label>
              <input
                type="password"
                name="newPassword"
                className={`login-input${error && formData.newPassword.length < 8 ? ' input-error' : ''}`}
                value={formData.newPassword}
                onChange={handleChange}
                disabled={loading}
                placeholder=""
                minLength={8}
                required
              />
            </div>

            <div className="filter-group-line history-group">
              <label className="filter-label">Подтвердите пароль</label>
              <input
                type="password"
                name="confirmPassword"
                className={`login-input${error && formData.newPassword !== formData.confirmPassword ? ' input-error' : ''}`}
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                placeholder=""
                required
              />
            </div>

            {error && (
              <div className="error-message" role="alert">
                {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button 
                type="button" 
                className="search-button"
                style={{ background: '#9D9D9D' }}
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                Отмена
              </button>
              <button 
                type="submit" 
                className="search-button"
                disabled={loading}
              >
                {loading ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export { ChangePasswordPage };
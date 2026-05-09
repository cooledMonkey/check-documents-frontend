import type { JSX, FormEvent } from "react";
import { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../../api/authService";
import type { ApiError } from "../../types/auth";

function RegistrationPage(): JSX.Element {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [fieldErrors]);

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      errors.fullName = 'Введите ФИО';
    }
    if (!formData.email.trim()) {
      errors.email = 'Введите почту';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Некорректный формат почты';
    }
    if (!formData.password) {
      errors.password = 'Введите пароль';
    } else if (formData.password.length < 8) {
      errors.password = 'Минимум 8 символов';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validate()) return;
    
    setLoading(true);
    try {
      const response = await authService.register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });
      
      if (response.token) {
        localStorage.setItem('jwt_token', response.token);
        if (response.refreshToken) {
          localStorage.setItem('refresh_token', response.refreshToken);
        }
      }
      
      navigate('/', { replace: true });
      
    } catch (err) {
      const apiError = err as ApiError;
      
      if (apiError.status === 400 && apiError.details) {
        setFieldErrors(apiError.details);
      } else {
        setError(apiError.message || 'Ошибка при регистрации');
      }
    } finally {
      setLoading(false);
    }
  }, [formData, navigate]);

  return (
    <div className="login-bg">
      <div className="login-container">
        <div className="login-content">
          <div className="filters-header">
            <p className="filters-title">Регистрация</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="filter-group-line history-group">
              <label className="filter-label">ФИО</label>
              <input
                type="text"
                name="fullName"
                className={`login-input${fieldErrors.fullName ? ' input-error' : ''}`}
                value={formData.fullName}
                onChange={handleChange}
                disabled={loading}
                placeholder="Иванов Иван Иванович"
              />
              {fieldErrors.fullName && (
                <span className="field-error">{fieldErrors.fullName}</span>
              )}
            </div>

            <div className="filter-group-line history-group">
              <label className="filter-label">Почта</label>
              <input
                type="email"
                name="email"
                className={`login-input${fieldErrors.email ? ' input-error' : ''}`}
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                placeholder="user@example.com"
              />
              {fieldErrors.email && (
                <span className="field-error">{fieldErrors.email}</span>
              )}
            </div>

            <div className="filter-group-line history-group">
              <label className="filter-label">Пароль</label>
              <input
                type="password"
                name="password"
                className={`login-input${fieldErrors.password ? ' input-error' : ''}`}
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                placeholder="••••••••"
              />
              {fieldErrors.password && (
                <span className="field-error">{fieldErrors.password}</span>
              )}
            </div>

            {error && (
              <div className="error-message" role="alert">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="search-button"
              disabled={loading}
            >
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>

          <div className="login-text-container">
            <p className="login-text">Или</p>
            <Link to="/login" className="login-text-colored">
              войти
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export { RegistrationPage };
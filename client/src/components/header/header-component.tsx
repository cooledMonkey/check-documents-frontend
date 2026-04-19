import type { JSX } from "react";
import { useState, useCallback, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../api/authService";
import { authUtils } from "../../utils/auth";
import type { ApiError } from "../../types/auth";

function HeaderComponent(): JSX.Element {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const profileBtnRef = useRef<HTMLButtonElement>(null);

  // 👇 Закрытие меню при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        profileBtnRef.current &&
        !profileBtnRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 👇 Закрытие меню по Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const handleLogout = useCallback(async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    try {
      await authService.logout();
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.status !== 401) {
        console.error('Ошибка при логауте:', apiError.message);
      }
    } finally {
      authUtils.logout();
      setIsLoggingOut(false);
      setIsMenuOpen(false);
      navigate('/login', { replace: true });
    }
  }, [isLoggingOut, navigate]);

  const handleChangePassword = useCallback(() => {
    setIsMenuOpen(false);
    navigate('/change-password');
  }, [navigate]);

  return (
    <header className="container-1">
      <div className="header-container">
        <div className="header-bg">
          <svg className="header-svg" width="517" height="148" viewBox="0 0 517 148" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-80 148V0H338.652L517 148H-80Z" fill="#7570AE"></path>
          </svg>
          
          <Link to="/" style={{ textDecoration: 'none' }} className="header-title">Подпись пров</Link>
          
          <div className="logo-container">
            <p className="logo-text">0100 1101</p>
            <svg className="logo-icon" width="80" height="76" viewBox="0 0 80 76" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g filter="url(#filter0_d_13_441)">
                <path d="M47.6885 0C63.3233 0.000401852 76 11.8808 76 26.5391C75.9999 41.1973 63.3232 53.0777 47.6885 53.0781C41.6789 53.0781 36.108 51.3196 31.5244 48.3262L31.3965 48.4453C30.946 48.2476 30.4437 48.1367 29.915 48.1367C27.9617 48.1369 26.378 49.6429 26.3779 51.5C26.378 51.9857 26.4877 52.4473 26.6826 52.8643L14.4307 64.3496C14.1488 64.6138 13.8406 64.8393 13.5156 65.0273L10.8896 67.4883L8.26367 65.0273C7.93931 64.8395 7.63193 64.6133 7.35059 64.3496C7.06975 64.0863 6.83006 63.7986 6.62988 63.4951L4 61.0303L6.62891 58.5645C6.8291 58.2609 7.06973 57.9732 7.35059 57.71L19.4883 46.333C20.1121 46.8575 20.9319 47.1757 21.8301 47.1758C23.7835 47.1757 25.368 45.6706 25.3682 43.8135C25.3681 42.7921 24.8879 41.8775 24.1318 41.2607C21.1292 37.0479 19.375 31.9859 19.375 26.5391C19.375 11.8806 32.0534 0.000126374 47.6885 0ZM47.7471 6.06543C35.6667 6.06543 25.873 15.1821 25.873 26.4277C25.8732 37.6733 35.6668 46.7891 47.7471 46.7891C59.8272 46.7889 69.6199 37.6732 69.6201 26.4277C69.6201 15.1821 59.8273 6.06554 47.7471 6.06543Z" fill="white"></path>
              </g>
              <defs>
                <filter id="filter0_d_13_441" x="0" y="0" width="80" height="75.4883" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                  <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                  <feOffset dy="4"></feOffset>
                  <feGaussianBlur stdDeviation="2"></feGaussianBlur>
                  <feComposite in2="hardAlpha" operator="out"></feComposite>
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"></feColorMatrix>
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_13_441"></feBlend>
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_13_441" result="shape"></feBlend>
                </filter>
              </defs>
            </svg>
          </div>

          {/* 👇 Профиль — только отображение (не кликабельно)
          <div className="profile-container">
            <svg className="profile-icon" width="75" height="75" viewBox="0 0 75 75" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g filter="url(#filter0_d_13_445)">
                <circle cx="37.5" cy="33.5" r="33.5" fill="#D9D9D9"></circle>
              </g>
              <defs>
                <filter id="filter0_d_13_445" x="0" y="0" width="75" height="75" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                  <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                  <feOffset dy="4"></feOffset>
                  <feGaussianBlur stdDeviation="2"></feGaussianBlur>
                  <feComposite in2="hardAlpha" operator="out"></feComposite>
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"></feColorMatrix>
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_13_445"></feBlend>
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_13_445" result="shape"></feBlend>
                </filter>
              </defs>
            </svg>
            <p className="username">best_hr_43</p>
          </div> */}
        </div>
      </div>

      <div className="nav-bar">
        <svg className="svg-nav-bg" width="764" height="52" viewBox="0 0 764 52" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M764 0V52H64.7783L0 0H764Z" fill="#9D9D9D"></path>
        </svg>
        <svg className="svg-nav-bg-2" width="764" height="52" viewBox="0 0 764 52" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M764 0V52H64.7783L0 0H764Z" fill="#9D9D9D"></path>
        </svg>
        
        <Link to="/" style={{ textDecoration: 'none' }} className="nav-button-bg btn-1">Проверка</Link>
        <Link to="/history" style={{ textDecoration: 'none' }} className="nav-button-bg btn-2">История</Link>
        
        {/* 👇 Кнопка «Профиль» с выпадающим меню */}
        <div className="profile-nav-wrapper" ref={menuRef}>
          <button 
            ref={profileBtnRef}
            className="nav-button-bg btn-3 profile-nav-btn"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-haspopup="true"
            type="button"
          >
            Профиль
          </button>

          {/* 👇 Выпадающее меню */}
          {isMenuOpen && (
            <div className="profile-dropdown nav-dropdown" role="menu">
              <button 
                className="dropdown-item" 
                onClick={handleChangePassword}
                role="menuitem"
                type="button"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                Сменить пароль
              </button>
              
              <div className="dropdown-divider"></div>
              
              <button 
                className={`dropdown-item${isLoggingOut ? ' loading' : ''}`} 
                onClick={handleLogout}
                disabled={isLoggingOut}
                role="menuitem"
                type="button"
              >
                {isLoggingOut ? (
                  <>
                    <span className="spinner-mini"></span>
                    Выход...
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Выйти
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export { HeaderComponent };
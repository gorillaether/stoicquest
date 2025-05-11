import React from 'react';
import './Button.css';

/**
 * Reusable Button component with different variants and optional icon
 */
const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  icon = null,
  disabled = false,
  fullWidth = false,
  type = 'button',
  className = '',
  ...props
}) => {
  // Define icon mapping (assuming you have an icons library or component)
  const renderIcon = () => {
    if (!icon) return null;
    
    // This is a placeholder for actual icon rendering
    // In a real implementation, you might import icons from a library like react-icons
    const iconMap = {
      edit: <span className="icon">✏️</span>,
      save: <span className="icon">💾</span>,
      delete: <span className="icon">🗑️</span>,
      share: <span className="icon">📤</span>,
      copy: <span className="icon">📋</span>,
      download: <span className="icon">📥</span>,
      check: <span className="icon">✓</span>,
      close: <span className="icon">✕</span>,
      add: <span className="icon">+</span>,
    };
    
    return iconMap[icon] || null;
  };

  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="btn-icon">{renderIcon()}</span>}
      <span className="btn-text">{children}</span>
    </button>
  );
};

export default Button;
import React from 'react';

/**
 * Card component - A reusable container for content with customizable styling
 * 
 * @param {object} props
 * @param {React.ReactNode} props.children - Content to be displayed inside the card
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.title - Optional card title
 * @param {string} props.subtitle - Optional card subtitle
 * @param {boolean} props.elevated - Whether to apply elevation/shadow
 * @param {boolean} props.interactive - Whether the card has hover/active states
 * @param {function} props.onClick - Optional click handler
 * @param {string} props.variant - Visual style variant ('default', 'primary', 'secondary', 'success', 'warning', 'danger')
 * @param {boolean} props.bordered - Whether to display a border
 * @param {string} props.width - Optional width override
 * @param {string} props.height - Optional height override
 */
const Card = ({
  children,
  className = '',
  title,
  subtitle,
  elevated = false,
  interactive = false,
  onClick,
  variant = 'default',
  bordered = true,
  width,
  height,
}) => {
  // Base classes for card
  const baseClasses = 'rounded-lg p-4 transition-all duration-200';
  
  // Variant specific classes
  const variantClasses = {
    default: 'bg-white text-gray-800',
    primary: 'bg-blue-50 text-blue-800',
    secondary: 'bg-purple-50 text-purple-800',
    success: 'bg-green-50 text-green-800',
    warning: 'bg-yellow-50 text-yellow-700',
    danger: 'bg-red-50 text-red-800',
  };
  
  // Border classes
  const borderClasses = bordered ? {
    default: 'border border-gray-200',
    primary: 'border border-blue-200',
    secondary: 'border border-purple-200',
    success: 'border border-green-200',
    warning: 'border border-yellow-200',
    danger: 'border border-red-200',
  } : {};
  
  // Elevation classes
  const elevationClass = elevated ? 'shadow-md' : '';
  
  // Interactive classes
  const interactiveClasses = interactive ? 
    'cursor-pointer hover:shadow-lg active:scale-98 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300' : '';
  
  // Combine all classes
  const cardClasses = `
    ${baseClasses}
    ${variantClasses[variant] || variantClasses.default}
    ${borderClasses[variant] || borderClasses.default || ''}
    ${elevationClass}
    ${interactiveClasses}
    ${className}
  `;
  
  const cardStyle = {
    width: width || 'auto',
    height: height || 'auto',
  };
  
  return (
    <div 
      className={cardClasses}
      onClick={onClick}
      style={cardStyle}
    >
      {title && (
        <div className="mb-2">
          <h3 className="font-semibold text-lg">{title}</h3>
          {subtitle && <p className="text-sm opacity-75">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
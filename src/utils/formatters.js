// src/utils/formatters.js
// Utility functions for formatting data and text

/**
 * Format a date to a readable string
 * @param {Date} date - Date to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
};

/**
 * Format time elapsed since a given date
 * @param {Date} date - Start date
 * @returns {string} - Formatted time elapsed (e.g., "2 days ago")
 */
export const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    return interval === 1 ? '1 year ago' : `${interval} years ago`;
  }
  
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return interval === 1 ? '1 month ago' : `${interval} months ago`;
  }
  
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return interval === 1 ? '1 day ago' : `${interval} days ago`;
  }
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return interval === 1 ? '1 hour ago' : `${interval} hours ago`;
  }
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return interval === 1 ? '1 minute ago' : `${interval} minutes ago`;
  }
  
  return seconds < 10 ? 'just now' : `${Math.floor(seconds)} seconds ago`;
};

/**
 * Format XP with appropriate suffix
 * @param {number} xp - Experience points
 * @returns {string} - Formatted XP string
 */
export const formatXP = (xp) => {
  return `${xp} XP`;
};

/**
 * Parse and format Markdown text to HTML (simple version)
 * @param {string} text - Markdown text
 * @returns {string} - HTML content
 */
export const parseMarkdown = (text) => {
  // This is a very simplified markdown parser
  // For production, use a proper library like marked or remark
  
  if (!text) return '';
  
  // Handle paragraphs
  let html = text
    .split('\n\n')
    .map(paragraph => `<p>${paragraph.trim()}</p>`)
    .join('');
  
  // Handle bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Handle italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  return html;
};

/**
 * Truncate text to a specific length
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} - Truncated text
 */
export const truncateText = (text, length = 100) => {
  if (!text || text.length <= length) return text;
  return text.substring(0, length) + '...';
};
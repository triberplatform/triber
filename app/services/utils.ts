/* eslint-disable @typescript-eslint/no-explicit-any */
export const formatBusinessTypeToSentence = (businessType:any) => {
    if (!businessType) return '';
    
    // Convert to lowercase, replace underscores with spaces
    const formatted = businessType.toLowerCase().replace(/_/g, ' ');
    
    // Capitalize first letter only
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };
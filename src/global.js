
/**
 * Global definitions to be included into files as needed
 */
export const getServerUrl = () => 
{
    return process.env.REACT_APP_SERVER_URL || 'http://localhost:8000';
}

/**
 * @returns the date as string in shortened ISO format
 */
export const toISOString = ( date) => {
  return date.toISOString().substring(0, 19);
}

/**
 * @returns the current date in shortened ISO format
 */
export const now = () => {
  return toISOString( new Date());
}

/**
 * @returns Generate random id
 */
export const getRandomId = () => {
  return Math.random().toString(36).substring(2, 16);
}
  
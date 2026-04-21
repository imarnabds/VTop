const API_BASE_URL = 'http://localhost:3080/api';

export const registerUser = async (userData: any) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  const data = await response.json();
  if (!response.ok && !data.success) throw new Error(data.message || 'Registration failed');
  return data;
};

export const loginUser = async (credentials: any) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  const data = await response.json();
  if (!response.ok && !data.success) throw new Error(data.message || 'Login failed');
  return data;
};

export const fetchModuleData = async (category: string, submenu: string) => {
  try {
    const user = JSON.parse(localStorage.getItem('vtop_user') || '{}');
    const response = await fetch(`${API_BASE_URL}/module/${category}/${submenu}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': user.token || user.regNum || '' // Authenticated session token context 
      }
    });

    if (!response.ok) {
      if(response.status === 401) throw new Error("Unauthorized! You must sign in to view this securely.");
      throw new Error(`API error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching module data:', error);
    throw error;
  }
};

export const logoutUser = async (logoutData: { regNum: string, sessionId: string }) => {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(logoutData)
  });
  const data = await response.json();
  if (!response.ok && !data.success) throw new Error(data.message || 'Logout failed');
  return data;
};


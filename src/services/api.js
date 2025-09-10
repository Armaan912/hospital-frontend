const API_BASE_URL = 'http://localhost:5000/api';

class HospitalAPI {
  static async getHospitals(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/hospitals/all${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch hospitals');
    }
    
    return result.data;
  }

  static async getHospitalById(id, view = 'details') {
    const url = `${API_BASE_URL}/hospitals/${id}?view=${view}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch hospital details');
    }
    
    return result.data;
  }

  static async createHospital(formData) {
    const url = `${API_BASE_URL}/hospitals/create`;
    
    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to create hospital');
    }
    
    return result.data;
  }

  static async updateHospital(id, formData) {
    const url = `${API_BASE_URL}/hospitals/update/${id}`;
    
    const response = await fetch(url, {
      method: 'PUT',
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to update hospital');
    }
    
    return result.data;
  }

  static async deleteHospital(id) {
    const url = `${API_BASE_URL}/hospitals/delete/${id}`;
    
    const response = await fetch(url, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to delete hospital');
    }
    
    return result;
  }
}

export default HospitalAPI;

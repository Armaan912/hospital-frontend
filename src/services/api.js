// Fixed backend base URL per deployment
const API_BASE_URL = 'https://hospital-backend-elzv.onrender.com/api';

class HospitalAPI {
  static async parseJsonOrThrow(response) {
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return response.json();
    }
    const text = await response.text();
    const preview = text.slice(0, 200).replace(/\n/g, ' ');
    throw new Error(`Expected JSON but received '${contentType || 'unknown'}'. Preview: ${preview}`);
  }

  static async getHospitals(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/hospitals/all${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || `HTTP error! status: ${response.status}`);
    }
    
    const result = await HospitalAPI.parseJsonOrThrow(response);
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch hospitals');
    }
    
    return result.data;
  }

  static async getHospitalById(id, view = 'details') {
    const url = `${API_BASE_URL}/hospitals/${id}?view=${view}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || `HTTP error! status: ${response.status}`);
    }
    
    const result = await HospitalAPI.parseJsonOrThrow(response);
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
      const text = await response.text();
      throw new Error(text || `HTTP error! status: ${response.status}`);
    }
    
    const result = await HospitalAPI.parseJsonOrThrow(response);
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
      const text = await response.text();
      throw new Error(text || `HTTP error! status: ${response.status}`);
    }
    
    const result = await HospitalAPI.parseJsonOrThrow(response);
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
      const text = await response.text();
      throw new Error(text || `HTTP error! status: ${response.status}`);
    }
    
    const result = await HospitalAPI.parseJsonOrThrow(response);
    if (!result.success) {
      throw new Error(result.error || 'Failed to delete hospital');
    }
    
    return result;
  }
}

export default HospitalAPI;

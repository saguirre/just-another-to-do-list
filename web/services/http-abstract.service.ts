import axios from 'axios';

export abstract class HttpService {
  protected async get<T>(url: string): Promise<T> {
    const response = await axios.get(url);
    return response.data;
  }

  protected async post<T>(url: string, data: any): Promise<T> {
    const response = await axios.post(url, data);
    return response.data;
  }

  protected async put<T>(url: string, data: any): Promise<T> {
    const response = await axios.put(url, data);
    return response.data;
  }

  protected async delete<T>(url: string): Promise<T> {
    const response = await axios.delete(url);
    return response.data;
  }
}

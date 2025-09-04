export interface IPInfo {
  ip: string;
  country?: string;
  region?: string;
  city?: string;
}

class IPService {
  private cachedIP: string | null = null;

  async getIPAddress(): Promise<string> {
    try {
      // Use a public IP API service
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      this.cachedIP = data.ip;
      return data.ip;
    } catch (error) {
      console.error('Failed to get IP address:', error);
      // Fallback to a default IP if the service fails
      return this.cachedIP || '0.0.0.0';
    }
  }

  async getDetailedIPInfo(): Promise<IPInfo> {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      return {
        ip: data.ip,
        country: data.country_name,
        region: data.region,
        city: data.city
      };
    } catch (error) {
      console.error('Failed to get detailed IP info:', error);
      const ip = await this.getIPAddress();
      return { ip };
    }
  }
}

export default new IPService();

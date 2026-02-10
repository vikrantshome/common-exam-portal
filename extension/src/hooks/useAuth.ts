import { useState, useEffect } from 'react';

const WEB_APP_URL = "http://localhost:3001";
const API_URL = `${WEB_APP_URL}/api/ext/profile`;

export type UserProfile = {
  user: {
    mobile: string;
    email?: string;
  };
  profile: {
    firstName: string;
    lastName?: string;
    dob?: string;
    gender?: string;
    category?: string;
    aadharNo?: string;
    fatherName?: string;
    motherName?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    class10Board?: string;
    class10Percentage?: number;
    class12Board?: string;
    class12Status?: string;
  };
  documents: { type: string; url: string }[];
};

export function useAuth() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Check for cookie
      const cookie = await chrome.cookies.get({ url: WEB_APP_URL, name: "session" });
      
      if (!cookie) {
        setIsAuthenticated(false);
        setProfile(null);
        setLoading(false);
        return;
      }

      // 2. Fetch Profile
      const response = await fetch(API_URL);
      
      if (response.status === 401) {
        setIsAuthenticated(false);
        setProfile(null);
      } else if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setIsAuthenticated(true);
      } else {
        setError("Failed to fetch profile");
      }
    } catch (err) {
      console.error(err);
      setError("Extension error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return { profile, loading, error, isAuthenticated, checkAuth };
}

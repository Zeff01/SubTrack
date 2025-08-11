import { useState, useEffect } from 'react';
import { getUsernameByEmail } from '../../services/userService';
import { User } from 'firebase/auth';

export const useUsername = (user: User | null) => {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsername = async () => {
      if (!user?.email) {
        setUsername(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const fetchedUsername = await getUsernameByEmail(user.email);
        setUsername(fetchedUsername);
      } catch (error) {
        console.error('Error fetching username:', error);
        setUsername(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUsername();
  }, [user?.email]);

  return { username, loading };
};
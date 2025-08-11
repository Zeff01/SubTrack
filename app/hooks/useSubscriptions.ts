import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { retrieveAllDocumentSubscriptionSpecificUser } from '../../services/userService';
import { Subscription } from '../../types';
import moment from 'moment';

interface HighlightedDay {
  date: string;
  colors: string[];
  id: string[];
  cost: string[];
  app_name: string[];
  due_date: string[];
}

export const useSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [highlightedDays, setHighlightedDays] = useState<HighlightedDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const generateHighlightedDays = (subscriptions: Subscription[], currentDate: moment.Moment): HighlightedDay[] => {
    const highlights: { [key: string]: HighlightedDay } = {};
    
    subscriptions.forEach((sub) => {
      if (!sub.due_date) return;
      
      const [day, month, year] = sub.due_date.split('/').map(Number);
      const dueDate = moment({ year, month: month - 1, day });
      
      const dateStr = dueDate.format('YYYY-MM-DD');
      
      if (!highlights[dateStr]) {
        highlights[dateStr] = {
          date: dateStr,
          colors: [],
          id: [],
          cost: [],
          app_name: [],
          due_date: []
        };
      }
      
      highlights[dateStr].colors.push(sub.color || '#3AABCC');
      highlights[dateStr].id.push(sub.id || '');
      highlights[dateStr].cost.push(sub.cost.toString());
      highlights[dateStr].app_name.push(sub.app_name);
      highlights[dateStr].due_date.push(sub.due_date);
    });
    
    return Object.values(highlights);
  };

  const getTotalMonthlyCost = (highlightedDays: HighlightedDay[]): number => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    return highlightedDays
      .filter((entry) => {
        const date = new Date(entry.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .reduce((monthlyTotal, entry) => {
        const dayTotal = entry.cost.reduce((sum, cost) => sum + parseFloat(cost), 0);
        return monthlyTotal + dayTotal;
      }, 0);
  };

  const getYearlyStats = (subscriptions: Subscription[]): { total: number; average: number } => {
    let yearlyTotal = 0;
    
    subscriptions.forEach((sub) => {
      if (sub.status === 'cancelled' || sub.status === 'paused') return;
      
      let yearlyAmount = 0;
      const cost = sub.cost_type === 'variable' ? (sub.average_cost || sub.cost) : sub.cost;
      
      switch (sub.cycle) {
        case 'weekly':
          yearlyAmount = cost * 52;
          break;
        case 'monthly':
          yearlyAmount = cost * 12;
          break;
        case 'quarterly':
          yearlyAmount = cost * 4;
          break;
        case 'yearly':
          yearlyAmount = cost;
          break;
      }
      
      yearlyTotal += yearlyAmount;
    });
    
    return {
      total: yearlyTotal,
      average: yearlyTotal / 12
    };
  };

  const fetchSubscriptions = useCallback(async (userId: string) => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      const res = await retrieveAllDocumentSubscriptionSpecificUser(userId);
      
      if (res.success && res.data) {
        setSubscriptions(res.data);
        const highlights = generateHighlightedDays(res.data, moment());
        setHighlightedDays(highlights);
      } else {
        setError(res.error || 'Failed to fetch subscriptions');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to fetch subscriptions');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser?.uid) {
          fetchSubscriptions(firebaseUser.uid);
        }
      });
      
      return unsubscribe;
    }, [fetchSubscriptions])
  );

  return {
    subscriptions,
    highlightedDays,
    loading,
    error,
    getTotalMonthlyCost,
    getYearlyStats,
    refetch: fetchSubscriptions
  };
};
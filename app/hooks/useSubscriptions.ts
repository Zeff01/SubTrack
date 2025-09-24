import { useFocusEffect } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import moment from 'moment';
import { useCallback, useState } from 'react';
import { auth } from '../../config/firebase';
import { retrieveAllDocumentSubscriptionSpecificUser } from '../../services/userService';
import { Subscription } from '../../types';

interface HighlightedDay {
  date: string;
  colors: string[];
  id: string[];
  cost: string[];
  average_cost: string[];
  cost_type: string[];
  app_name: string[];
  due_date: string[];
  icons?: string[];
}

export const useSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [highlightedDays, setHighlightedDays] = useState<HighlightedDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const generateHighlightedDays = (subscriptions: Subscription[], currentDate: moment.Moment): HighlightedDay[] => {
    const daysMap = new Map<
      string,
      {
        //colors: Set<string>;
        colors: string[];
        id: string[];
        app_name: string[];
        cost: string[];
        due_date: string[];
        icons: string[];
        average_cost: string[];
        cost_type: string[];
      }
    >();
  
    const startDate = currentDate.clone().startOf('month');
    const endDate = currentDate.clone().add(3, 'years').endOf('month');
  
    const cycleMap: {
      [key: string]: { unit: moment.unitOfTime.DurationConstructor; step: number } | null;
    } = {
      daily: { unit: 'day', step: 1 },
      weekly: { unit: 'week', step: 1 },
      biweekly: { unit: 'week', step: 2 },
      semimonthly: null,
      monthly: { unit: 'month', step: 1 },
      bimonthly: { unit: 'month', step: 2 },
      quarterly: { unit: 'month', step: 3 },
      semiannually: { unit: 'month', step: 6 },
      yearly: { unit: 'year', step: 1 },
    };
  
    const addEntry = (date: moment.Moment, sub: Subscription) => {
      const key = date.format('YYYY-MM-DD');
      if (!daysMap.has(key)) {
        daysMap.set(key, {
          // colors: new Set(),
          colors: [],
          id: [],
          app_name: [],
          cost: [],
          due_date: [],
          icons: [],
          average_cost: [],
          cost_type: [],
        });
      }
      const entry = daysMap.get(key)!;
      //entry.colors.add(sub.selected_color);
      entry.colors.push(sub.color);
      entry.id.push(sub.id || '');
      entry.app_name.push(sub.app_name);
      entry.cost.push(sub.cost);
      entry.due_date.push(sub.due_date);
      entry.icons?.push(sub.icon || '');
      entry.average_cost.push(sub.average_cost || '');
      entry.cost_type?.push(sub.cost_type || '');
    };
  
    subscriptions.forEach((sub) => {
      const baseDate = moment(sub.due_date, 'MM/DD/YYYY');
      const cycle = sub.cycle.toLowerCase();
      const config = cycleMap[cycle];
  
      if (!baseDate.isValid()) return;
  
      if (cycle === 'semimonthly') {
        let current = startDate.clone().startOf('month');
        const end = endDate.clone();
  
        while (current.isSameOrBefore(end)) {
          const first = current.clone().date(1);
          const fifteenth = current.clone().date(15);
  
          [first, fifteenth].forEach((d) => {
            if (d.isSameOrAfter(startDate) && d.isSameOrBefore(endDate)) {
              addEntry(d, sub);
            }
          });
  
          current.add(1, 'month');
        }
  
        return;
      }
  
      if (!config) return;
  
      let current = baseDate.clone();
      const { unit, step } = config;
  
      const diff = current.diff(startDate, unit, true);
      if (diff < 0) {
        const increment = Math.ceil(Math.abs(diff) / step);
        current.add(increment * step, unit);
      }
  
      while (current.isSameOrBefore(endDate)) {
        addEntry(current, sub);
        current.add(step, unit);
      }
    });
  
    // Convert map to array
    const result: {
      date: string;
      colors: string[];
      id: string[];
      app_name: string[];
      cost: string[];
      due_date: string[];
      icons: string[];
      average_cost: string[];
      cost_type: string[];
    }[] = [];
  
    daysMap.forEach((value, date) => {
      result.push({
        icons: value.icons,
        date,
        colors: value.colors,
        id: value.id,
        app_name: value.app_name,
        cost: value.cost,
        due_date: value.due_date,
        average_cost: value.average_cost,
        cost_type: value.cost_type,
      });
    });
  
    return result;
  };


  const getTotalMonthlyCost = (highlightedDays: HighlightedDay[]): number => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // 0-indexed (0 = Jan)
    const currentYear = currentDate.getFullYear();

  return highlightedDays
    .filter((entry) => {
      const date = new Date(entry.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((monthlyTotal, entry) => {
     // const costs = entry.cost || []; // Fallback to empty array if undefined
      const isVariable = entry.cost_type?.[0] === 'variable';
      const costs = isVariable
        ? Array.isArray(entry.average_cost) ? entry.average_cost : []
        : Array.isArray(entry.cost) ? entry.cost : [];

      const entryTotal = costs.reduce((entrySum: number, cost: any) => {
        const numericCost = parseFloat(cost);
        return entrySum + (isNaN(numericCost) ? 0 : numericCost);
      }, 0);
      return monthlyTotal + entryTotal;
    }, 0);
  };

  const getYearlyStats = (subscriptions: Subscription[]): { total: number; average: number } => {
  let yearlyTotal = 0;

  subscriptions.forEach((sub) => {
   // if (sub.status === 'cancelled' || sub.status === 'paused') return;

    let yearlyAmount = 0;

    const isVariable = sub.cost_type === 'variable';
    let cost: number = parseFloat(
      isVariable ? sub.average_cost ?? '0' : sub.cost ?? '0'
    );

    
    //const rawCost = sub.cost_type === 'variable' ? (sub.average_cost || sub.cost) : sub.cost;
   // const cost = parseFloat(rawCost);

    if (isNaN(cost)) return; // skip invalid costs

    switch (sub.cycle) {
      case 'daily':
        yearlyAmount = cost * 365;
        break;
      case 'weekly':
        yearlyAmount = cost * 52;
        break;
      case 'biweekly':
        yearlyAmount = cost * 26;
        break;
      case 'semimonthly':
        yearlyAmount = cost * 24;
        break;
      case 'monthly':
        yearlyAmount = cost * 12;
        break;
      case 'bimonthly':
        yearlyAmount = cost * 6;
        break;
      case 'quarterly':
        yearlyAmount = cost * 4;
        break;
      case 'semiannually':
        yearlyAmount = cost * 2;
        break;
      case 'yearly':
        yearlyAmount = cost;
        break;
      default:
        yearlyAmount = 0;
    }


    yearlyTotal += yearlyAmount;
  });

  return {
    total: parseFloat(yearlyTotal.toFixed(2)),
    average: parseFloat((yearlyTotal / 12).toFixed(2))
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

export default useSubscriptions;
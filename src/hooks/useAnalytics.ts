import { useCallback } from 'react';
import { logEvent, Analytics } from 'firebase/analytics';
import { analytics } from '../firebase/config';

const debugAnalytics = (eventName: string, params: any) => {
  if (__DEV__) {
    console.log(`[Analytics Event] ${eventName}:`, params);
  }
};

export const useAnalytics = () => {
  const logScreenView = useCallback(async (screenName: string, screenClass?: string) => {
    const params = {
      firebase_screen: screenName,
      firebase_screen_class: screenClass,
    };
    debugAnalytics('screen_view', params);
    
    const analyticsInstance = await analytics;
    if (analyticsInstance) {
      logEvent(analyticsInstance as Analytics, 'screen_view', params);
    }
  }, []);

  const logButtonClick = useCallback(async (buttonName: string, screenName: string) => {
    const params = {
      button_name: buttonName,
      screen_name: screenName,
    };
    debugAnalytics('button_click', params);

    const analyticsInstance = await analytics;
    if (analyticsInstance) {
      logEvent(analyticsInstance as Analytics, 'button_click', params);
    }
  }, []);

  const logTransaction = useCallback(async (transactionData: {
    id: string;
    type: 'income' | 'expense';
    amount: number;
    categoryId: string;
  }) => {
    const params = {
      transaction_id: transactionData.id,
      transaction_type: transactionData.type,
      amount: transactionData.amount,
      category_id: transactionData.categoryId,
    };
    debugAnalytics('transaction_added', params);

    const analyticsInstance = await analytics;
    if (analyticsInstance) {
      logEvent(analyticsInstance as Analytics, 'transaction_added', params);
    }
  }, []);

  const logFilter = useCallback(async (filterData: {
    type?: 'income' | 'expense';
    categoryIds?: string[];
    dateRange?: string;
  }) => {
    const params = {
      filter_type: filterData.type || 'all',
      categories: filterData.categoryIds?.join(',') || 'none',
      date_range: filterData.dateRange || 'none',
    };
    debugAnalytics('filter_applied', params);

    const analyticsInstance = await analytics;
    if (analyticsInstance) {
      logEvent(analyticsInstance as Analytics, 'filter_applied', params);
    }
  }, []);

  const logBudget = useCallback(async (budgetData: {
    id: string;
    categoryId: string;
    amount: number;
    month: string;
  }) => {
    const params = {
      budget_id: budgetData.id,
      category_id: budgetData.categoryId,
      amount: budgetData.amount,
      month: budgetData.month,
    };
    debugAnalytics('budget_created', params);

    const analyticsInstance = await analytics;
    if (analyticsInstance) {
      logEvent(analyticsInstance as Analytics, 'budget_created', params);
    }
  }, []);

  return {
    logScreenView,
    logButtonClick,
    logTransaction,
    logFilter,
    logBudget,
  };
}; 
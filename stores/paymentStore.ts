import AsyncStorage from '@react-native-async-storage/async-storage';
import { PaymentMethod } from '@/types';

const STORAGE_KEY = 'cleanops_payment_methods';

export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to load payment methods', e);
    return [];
  }
}

export async function addPaymentMethod(method: Omit<PaymentMethod, 'id' | 'isDefault'>): Promise<PaymentMethod> {
  const methods = await getPaymentMethods();
  const newMethod: PaymentMethod = {
    ...method,
    id: Math.random().toString(36).substring(7),
    isDefault: methods.length === 0, // Default if it's the first one
  };
  
  const updated = [...methods, newMethod];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newMethod;
}

export async function removePaymentMethod(id: string): Promise<void> {
  const methods = await getPaymentMethods();
  const updated = methods.filter(m => m.id !== id);
  
  // If we removed the default, set another one as default
  if (methods.find(m => m.id === id)?.isDefault && updated.length > 0) {
    updated[0].isDefault = true;
  }
  
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export async function setDefaultPaymentMethod(id: string): Promise<void> {
  const methods = await getPaymentMethods();
  const updated = methods.map(m => ({
    ...m,
    isDefault: m.id === id,
  }));
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

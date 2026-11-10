import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppIcon from './AppIcon';
import {
  defaultCategories,
  defaultPaymentMethods,
  getCategoryIcon,
  transactionService,
  type ApiCategory,
  type ApiTransaction,
} from '../service/transactionService';
import { toast } from '../utils/toast';

type AddTransactionModalProps = {
  visible: boolean;
  onClose: () => void;
  onSuccess?: (transaction: ApiTransaction) => void;
  initialType?: 'expense' | 'income';
};

const colors = {
  dark: '#1E2B24',
  primary: '#356C40',
  muted: '#7D857E',
  border: '#E5E7E0',
  background: '#F7F7F1',
  surface: '#FFFFFF',
  lightGreen: '#E9F0E3',
  lightGray: '#EFF1EA',
};

export default function AddTransactionModal({
  visible,
  onClose,
  onSuccess,
  initialType = 'expense',
}: AddTransactionModalProps) {
  const insets = useSafeAreaInsets();
  const [type, setType] = useState<'income' | 'expense'>(initialType);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ApiCategory | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('Cash');
  const [dateStr, setDateStr] = useState<string>(() => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  });
  const [notes, setNotes] = useState('');
  const [categories, setCategories] = useState<ApiCategory[]>(() =>
    defaultCategories.filter((c) => c.type === initialType)
  );
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resetForm = () => {
    setAmount('');
    setDescription('');
    setNotes('');
    setErrorMessage(null);
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    setDateStr(`${y}-${m}-${d}`);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Fetch categories when visible or type changes
  useEffect(() => {
    let isMounted = true;
    if (visible) {
      transactionService
        .getCategories(type)
        .then((cats) => {
          if (!isMounted) return;
          setCategories(cats);
          if (cats.length > 0) {
            setSelectedCategory((prev) => (prev && cats.some((c) => c.id === prev.id) ? prev : cats[0]));
          } else {
            setSelectedCategory(null);
          }
        })
        .catch(() => {
          if (!isMounted) return;
          const fallback = defaultCategories.filter((c) => c.type === type);
          setCategories(fallback);
          if (fallback.length > 0) {
            setSelectedCategory((prev) => (prev && fallback.some((c) => c.id === prev.id) ? prev : fallback[0]));
          }
        });
    }
    return () => {
      isMounted = false;
    };
  }, [visible, type]);

  // Handle type change (expense <-> income)
  const handleTypeChange = (newType: 'expense' | 'income') => {
    setType(newType);
  };

  const handleAmountChange = (text: string) => {
    // Only allow numbers and one decimal point
    const cleaned = text.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      return;
    }
    if (parts[1] && parts[1].length > 2) {
      return; // Max 2 decimal places
    }
    setAmount(cleaned);
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async () => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage('Please enter a valid amount greater than 0.');
      return;
    }

    if (!description.trim()) {
      setErrorMessage('Please enter a description (e.g. Lunch, Fuel, Salary).');
      return;
    }

    if (!selectedCategory) {
      setErrorMessage('Please select a category.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await transactionService.create({
        type,
        amount: parsedAmount.toFixed(2),
        category_id: selectedCategory.id,
        payment_method: selectedPaymentMethod,
        description: description.trim(),
        transaction_date: dateStr,
        notes: notes.trim() || undefined,
      });

      toast.success(
        type === 'expense' ? 'Expense Added' : 'Income Added',
        `RM ${parsedAmount.toFixed(2)} recorded successfully.`
      );

      if (onSuccess && response.transaction) {
        onSuccess(response.transaction);
      }
      handleClose();
    } catch (err: any) {
      const msg = err?.message || 'Failed to save transaction. Please try again.';
      setErrorMessage(msg);
      toast.error('Error', msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      onRequestClose={handleClose}
      transparent
      visible={visible}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 justify-end bg-black/40"
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close modal backdrop"
          onPress={handleClose}
          className="absolute inset-0"
        />

        <View
          style={{
            maxHeight: '88%',
            backgroundColor: colors.background,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            paddingBottom: Math.max(insets.bottom, 16),
          }}
          className="w-full overflow-hidden"
        >
          {/* Sheet Handle */}
          <View
            style={{
              width: 40,
              height: 4,
              borderRadius: 2,
              backgroundColor: '#D3D9D0',
              alignSelf: 'center',
              marginTop: 10,
              marginBottom: 12,
            }}
          />

          {/* Header */}
          <View className="flex-row items-center justify-between px-6 pb-3">
            <View>
              <Text className="text-xl font-bold tracking-tight text-[#1E2B24]">
                {type === 'expense' ? 'Add Expense' : 'Add Income'}
              </Text>
              <Text className="text-xs text-[#7D857E] mt-0.5">
                Quickly record a new transaction
              </Text>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={8}
              onPress={handleClose}
              className="w-8 h-8 rounded-full items-center justify-center bg-[#ECEFE8]"
            >
              <AppIcon
                name={{ ios: 'xmark', android: 'close', web: 'close' }}
                tintColor={colors.dark}
                size={14}
              />
            </Pressable>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
          >
            {/* Type Selector Tabs */}
            <View className="flex-row bg-[#E6ECE1] p-1 rounded-2xl mb-4">
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Switch to Expense"
                onPress={() => handleTypeChange('expense')}
                className={`flex-1 py-2 rounded-xl items-center justify-center ${
                  type === 'expense' ? 'bg-[#1E2B24]' : 'bg-transparent'
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    type === 'expense' ? 'text-white' : 'text-[#5C665E]'
                  }`}
                >
                  Expense
                </Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Switch to Income"
                onPress={() => handleTypeChange('income')}
                className={`flex-1 py-2 rounded-xl items-center justify-center ${
                  type === 'income' ? 'bg-[#356C40]' : 'bg-transparent'
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    type === 'income' ? 'text-white' : 'text-[#5C665E]'
                  }`}
                >
                  Income
                </Text>
              </Pressable>
            </View>

            {/* Error Message banner */}
            {errorMessage && (
              <View className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
                <Text className="text-xs text-red-700 font-medium">
                  {errorMessage}
                </Text>
              </View>
            )}

            {/* Amount Card */}
            <View className="bg-white rounded-2xl p-4 border border-[#E5E7E0] mb-4">
              <Text className="text-[11px] font-semibold text-[#7D857E] uppercase tracking-wider mb-1">
                Amount
              </Text>
              <View className="flex-row items-center">
                <Text className="text-2xl font-bold text-[#1E2B24] mr-2">
                  RM
                </Text>
                <TextInput
                  value={amount}
                  onChangeText={handleAmountChange}
                  placeholder="0.00"
                  placeholderTextColor="#A6ADA6"
                  keyboardType="decimal-pad"
                  autoFocus={true}
                  className="flex-1 text-3xl font-bold text-[#1E2B24] p-0"
                />
              </View>
            </View>

            {/* Description Input */}
            <View className="mb-4">
              <Text className="text-xs font-semibold text-[#1E2B24] mb-2">
                Description / Merchant
              </Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder={type === 'expense' ? 'e.g. Ayam Gepuk, Groceries, Petrol' : 'e.g. Monthly Salary, Bonus'}
                placeholderTextColor="#A6ADA6"
                className="h-12 bg-white rounded-xl px-4 border border-[#E5E7E0] text-sm text-[#1E2B24]"
              />
            </View>

            {/* Category Selector */}
            <View className="mb-4">
              <Text className="text-xs font-semibold text-[#1E2B24] mb-2">
                Category
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8, paddingVertical: 2 }}
              >
                {categories.map((cat) => {
                  const isSelected = selectedCategory?.id === cat.id;
                  const iconName = getCategoryIcon(cat.name, cat.icon);

                  return (
                    <Pressable
                      key={`cat-${cat.id}-${cat.name}`}
                      accessibilityRole="button"
                      accessibilityLabel={`Select category ${cat.name}`}
                      onPress={() => setSelectedCategory(cat)}
                      className={`flex-row items-center px-3.5 py-2.5 rounded-xl border ${
                        isSelected
                          ? 'bg-[#E9F0E3] border-[#356C40]'
                          : 'bg-white border-[#E5E7E0]'
                      }`}
                    >
                      <View className="mr-2">
                        <AppIcon
                          name={iconName}
                          tintColor={isSelected ? colors.primary : colors.muted}
                          size={16}
                        />
                      </View>
                      <Text
                        className={`text-xs ${
                          isSelected
                            ? 'font-bold text-[#1E2B24]'
                            : 'font-medium text-[#5C665E]'
                        }`}
                      >
                        {cat.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            {/* Payment Method Selector */}
            <View className="mb-4">
              <Text className="text-xs font-semibold text-[#1E2B24] mb-2">
                Payment Method
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8, paddingVertical: 2 }}
              >
                {defaultPaymentMethods.map((method) => {
                  const isSelected = selectedPaymentMethod === method;
                  return (
                    <Pressable
                      key={`pm-${method}`}
                      accessibilityRole="button"
                      accessibilityLabel={`Select payment method ${method}`}
                      onPress={() => setSelectedPaymentMethod(method)}
                      className={`px-3.5 py-2 rounded-xl border ${
                        isSelected
                          ? 'bg-[#1E2B24] border-[#1E2B24]'
                          : 'bg-white border-[#E5E7E0]'
                      }`}
                    >
                      <Text
                        className={`text-xs ${
                          isSelected
                            ? 'font-semibold text-white'
                            : 'font-medium text-[#5C665E]'
                        }`}
                      >
                        {method}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            {/* Date Input */}
            <View className="mb-5">
              <Text className="text-xs font-semibold text-[#1E2B24] mb-2">
                Date (YYYY-MM-DD)
              </Text>
              <TextInput
                value={dateStr}
                onChangeText={setDateStr}
                placeholder="2026-11-10"
                placeholderTextColor="#A6ADA6"
                className="h-12 bg-white rounded-xl px-4 border border-[#E5E7E0] text-sm text-[#1E2B24]"
              />
            </View>

            {/* Submit Button */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={type === 'expense' ? 'Save Expense' : 'Save Income'}
              disabled={submitting}
              onPress={handleSubmit}
              className={`h-12 rounded-2xl items-center justify-center shadow-sm ${
                type === 'expense' ? 'bg-[#1E2B24]' : 'bg-[#356C40]'
              } active:opacity-90`}
            >
              {submitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text className="text-sm font-bold text-white tracking-wide">
                  {type === 'expense' ? 'Save Expense' : 'Save Income'}
                </Text>
              )}
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

import { forwardRef } from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';

type Props = TextInputProps & {
  label?: string;
  error?: string;
  containerClassName?: string;
  className?: string;
};

export const Input = forwardRef<TextInput, Props>(
  ({ label, error, containerClassName = '', className = '', ...rest }, ref) => {
    return (
      <View className={`gap-1.5 ${containerClassName}`}>
        {label && (
          <Text className="ml-1 text-sm font-medium text-[#1C1C1E]">
            {label}
          </Text>
        )}
        <TextInput
          ref={ref}
          className={`rounded-xl border px-4 py-3 text-base text-[#1C1C1E] bg-white min-h-[48px] ${error ? 'border-[#FF3B30]' : 'border-[#D1D1D6]'} ${className}`}
          placeholderTextColor="#8E8E93"
          autoCorrect={false}
          {...rest}
        />
        {error && (
          <Text className="ml-1 text-[13px] text-[#FF3B30]">{error}</Text>
        )}
      </View>
    );
  },
);

Input.displayName = 'Input';

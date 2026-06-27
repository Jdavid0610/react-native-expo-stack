import { forwardRef } from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';

type Props = TextInputProps & {
  label?: string;
  error?: string;
  containerClassName?: string;
  className?: string;
};

export const Input = forwardRef<TextInput, Props>(
  ({ label, error, containerClassName = '', className = '', style, ...rest }, ref) => {
    return (
      <View className={`gap-1.5 ${containerClassName}`}>
        {label && (
          <Text className="ml-1 text-sm font-medium text-[#1C1C1E]">
            {label}
          </Text>
        )}
        <TextInput
          ref={ref}
          // Fixed height + horizontal-only padding lets the single-line text
          // center natively. fontSize via style (not `text-base`) avoids the
          // lineHeight that pushes glyphs to the top on iOS.
          className={`rounded-xl border px-4 h-12 text-[#1C1C1E] bg-white ${error ? 'border-[#FF3B30]' : 'border-[#D1D1D6]'} ${className}`}
          style={[{ fontSize: 16 }, style]}
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

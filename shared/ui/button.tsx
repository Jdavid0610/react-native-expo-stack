import { ActivityIndicator, Pressable, Text, type PressableProps } from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'outline';

type Props = PressableProps & {
  title: string;
  variant?: ButtonVariant;
  loading?: boolean;
  className?: string;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-[#007AFF]',
  secondary: 'bg-[#F2F2F7]',
  outline: 'bg-transparent border-[1.5px] border-[#007AFF]',
};

const textClasses: Record<ButtonVariant, string> = {
  primary: 'text-white',
  secondary: 'text-[#1C1C1E]',
  outline: 'text-[#007AFF]',
};

export function Button({
  title,
  variant = 'primary',
  loading = false,
  disabled,
  className = '',
  ...rest
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      className={`items-center justify-center rounded-xl px-6 py-3.5 min-h-[48px] ${variantClasses[variant]} ${isDisabled ? 'opacity-50' : 'active:opacity-85'} ${className}`}
      disabled={isDisabled}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? '#007AFF' : '#fff'}
          size="small"
        />
      ) : (
        <Text className={`text-base font-semibold ${textClasses[variant]}`}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

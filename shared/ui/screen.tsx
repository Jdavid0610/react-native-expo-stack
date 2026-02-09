import { View, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = ViewProps & {
  safe?: boolean;
  className?: string;
};

export function Screen({ safe = true, className = '', children, ...rest }: Props) {
  const Component = safe ? SafeAreaView : View;
  return (
    <Component className={`flex-1 bg-white ${className}`} {...rest}>
      {children}
    </Component>
  );
}

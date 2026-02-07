import { StyleSheet, View, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = ViewProps & {
  safe?: boolean;
};

export function Screen({ safe = true, style, children, ...rest }: Props) {
  const Component = safe ? SafeAreaView : View;
  return (
    <Component style={[styles.container, style]} {...rest}>
      {children}
    </Component>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

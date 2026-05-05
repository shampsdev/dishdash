import { Outlet } from 'react-router-dom';
import { useSafeArea } from '../hooks/useSafeArea';

export const SafeAreaLayout = () => {
  const { safeAreaInsets } = useSafeArea();

  return (
    <div
      style={{
        paddingTop: safeAreaInsets.top * 1.75,
        paddingRight: safeAreaInsets.right,
        paddingLeft: safeAreaInsets.left,
        paddingBottom: safeAreaInsets.bottom,
      }}
    >
      <Outlet />
    </div>
  );
};

import { useFonts, Syne_400Regular, Syne_500Medium, Syne_600SemiBold, Syne_700Bold } from '@expo-google-fonts/syne';
import { DMSans_400Regular, DMSans_500Medium, DMSans_700Bold } from '@expo-google-fonts/dm-sans';

export const useAppFonts = () => {
  const [loaded, error] = useFonts({
    'Syne-Regular': Syne_400Regular,
    'Syne-Medium': Syne_500Medium,
    'Syne-SemiBold': Syne_600SemiBold,
    'Syne-Bold': Syne_700Bold,
    'DMSans-Regular': DMSans_400Regular,
    'DMSans-Medium': DMSans_500Medium,
    'DMSans-Bold': DMSans_700Bold,
  });

  return { loaded, error };
};

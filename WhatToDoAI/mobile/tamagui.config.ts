import { defaultConfig } from '@tamagui/config/v4';
import { createTamagui } from 'tamagui';

// you usually export this from a tamagui.config.ts file
export const tamaguiConfig = createTamagui(defaultConfig);

// make TypeScript type everything based on your config
type Conf = typeof tamaguiConfig;
declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaguiConfig;
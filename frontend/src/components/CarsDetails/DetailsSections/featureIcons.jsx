import React from 'react';
import {
  Rocket as RocketIcon,
  Gauge as GaugeIcon,
  BatteryCharging as BatteryChargingIcon,
  Headphones as HeadphonesIcon,
  Thermometer as ThermometerIcon,
  Wifi as WifiIcon,
  Lock as LockIcon,
  Camera as CameraIcon,
  Navigation as NavigationIcon,
  Bluetooth as BluetoothIcon
} from 'lucide-react';

// Collection of available icons
export const featureIcons = {
  performance: <GaugeIcon size={24} />,
  battery: <BatteryChargingIcon size={24} />,
  audio: <HeadphonesIcon size={24} />,
  climate: <ThermometerIcon size={24} />,
  connectivity: <WifiIcon size={24} />,
  security: <LockIcon size={24} />,
  camera: <CameraIcon size={24} />,
  navigation: <NavigationIcon size={24} />,
  bluetooth: <BluetoothIcon size={24} />,
  default: <RocketIcon size={24} />
}; 
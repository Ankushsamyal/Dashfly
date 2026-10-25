export interface ActivityTypeConfig {
  id: string;
  label: string;
  icon: string;
  color: string;
  met: number;
}

export const ACTIVITY_TYPES: ActivityTypeConfig[] = [
  { id: 'running', label: 'Running', icon: 'run', color: '#FC4C02', met: 9.8 },
  { id: 'cycling', label: 'Cycling', icon: 'directions-bike', color: '#5AC8FA', met: 7.5 },
  { id: 'walking', label: 'Walking', icon: 'directions-walk', color: '#34C759', met: 3.5 },
  { id: 'hiking', label: 'Hiking', icon: 'terrain', color: '#AF52DE', met: 6.0 },
  { id: 'swimming', label: 'Swimming', icon: 'pool', color: '#007AFF', met: 8.3 },
  { id: 'yoga', label: 'Yoga', icon: 'self-improvement', color: '#FF9500', met: 2.5 },
  { id: 'gym', label: 'Gym Workout', icon: 'fitness-center', color: '#FF3B30', met: 5.0 },
  { id: 'football', label: 'Football', icon: 'sports-soccer', color: '#34C759', met: 7.0 },
  { id: 'cricket', label: 'Cricket', icon: 'sports-cricket', color: '#5AC8FA', met: 4.5 },
  { id: 'badminton', label: 'Badminton', icon: 'sports-tennis', color: '#FF9500', met: 5.5 },
  { id: 'kabaddi', label: 'Kabaddi', icon: 'sports-martial-arts', color: '#AF52DE', met: 8.0 },
  { id: 'rowing', label: 'Rowing', icon: 'rowing', color: '#007AFF', met: 7.0 },
  { id: 'skiing', label: 'Skiing', icon: 'downhill-skiing', color: '#5AC8FA', met: 7.0 },
  { id: 'skateboarding', label: 'Skateboarding', icon: 'skateboarding', color: '#FF3B30', met: 5.0 },
  { id: 'elliptical', label: 'Elliptical', icon: 'directions-run', color: '#FF9500', met: 5.0 },
];

export const getActivityType = (id: string): ActivityTypeConfig => {
  return ACTIVITY_TYPES.find((t) => t.id === id) || ACTIVITY_TYPES[0];
};

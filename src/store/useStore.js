import { create } from 'zustand';

export const useStore = create((set) => ({
  currentView: 'home', // 'home', 'about', 'projects', 'contact'
  isStarted: false,
  isLoading: true,
  isDayTime: false,
  rainLevel: 'none', // 'none', 'low', 'medium', 'high'
  isDroneMode: false,
  isPlacementMode: false,
  isEnvironmentFixed: false,
  dayPhase: 'noon', // 'sunrise', 'noon', 'evening'
  nightPhase: 'mid', // 'early', 'mid', 'post'
  coreState: 'venom', // 'venom', 'linkedin', 'mail', 'youtube'
  eagleSpawnPosition: [0, 60, 0],
  eagleCameraOffset: [100, 20, -200],
  eagleScale: 1.0,
  eagleMovementParams: { speed: 0.5, rotSpeed: 0.01 },
  eagleMovement: { forward: false, backward: false, left: false, right: false, up: false, down: false },
  setView: (view) => set({ currentView: view }),
  setEagleSpawnPosition: (pos) => set({ eagleSpawnPosition: pos }),
  setEagleCameraOffset: (offset) => set({ eagleCameraOffset: offset }),
  isFreeLook: false,
  setIsFreeLook: (val) => set({ isFreeLook: val }),
  setEagleScale: (scale) => set({ eagleScale: scale }),
  setEagleMovementParams: (params) => set((state) => ({ eagleMovementParams: { ...state.eagleMovementParams, ...params } })),
  setEagleMovement: (movement) => set((state) => ({ eagleMovement: { ...state.eagleMovement, ...movement } })),
  toggleDroneMode: () => set((state) => ({ isDroneMode: !state.isDroneMode, isPlacementMode: false })),
  togglePlacementMode: () => set((state) => ({ isPlacementMode: !state.isPlacementMode, isDroneMode: false })),
  toggleEnvironmentFix: () => set((state) => ({ isEnvironmentFixed: !state.isEnvironmentFixed })),
  setStarted: (started) => set({ isStarted: started }),
  setLoading: (loading) => set({ isLoading: loading }),
  toggleDayTime: () => set((state) => ({ isDayTime: !state.isDayTime })),
  nextRainLevel: () => set((state) => {
    const levels = ['none', 'low', 'medium', 'high'];
    const currentIndex = levels.indexOf(state.rainLevel);
    const nextIndex = (currentIndex + 1) % levels.length;
    return { rainLevel: levels[nextIndex] };
  }),
  nextDayPhase: () => set((state) => {
    const phases = ['sunrise', 'noon', 'evening'];
    const currentIndex = phases.indexOf(state.dayPhase);
    const nextIndex = (currentIndex + 1) % phases.length;
    return { dayPhase: phases[nextIndex] };
  }),
  nextNightPhase: () => set((state) => {
    const phases = ['early', 'mid', 'post'];
    const currentIndex = phases.indexOf(state.nightPhase);
    const nextIndex = (currentIndex + 1) % phases.length;
    return { nightPhase: phases[nextIndex] };
  }),
  nextCoreState: () => set((state) => {
    const states = ['venom', 'linkedin', 'mail', 'youtube'];
    const currentIndex = states.indexOf(state.coreState);
    const nextIndex = (currentIndex + 1) % states.length;
    return { coreState: states[nextIndex] };
  }),
}));

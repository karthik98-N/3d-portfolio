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
  eagleCameraOffset: [0, 150, -250],
  eagleScale: 1.0,
  eagleMovementParams: { speed: 0.5, rotSpeed: 0.01 },
  eagleMovement: { forward: false, backward: false, left: false, right: false, up: false, down: false },
  horsePosition: [9.40, 7.42, 55.57],
  horseRotation: [0, 0, 0],
  horseScale: [0.03, 0.03, 0.03],
  horseRGBIntensity: 5,
  horseRGBSpeed: 2,
  horseGroundAdjustment: 0,
  horseTransformMode: 'translate',
  isHorsePlacementMode: false,
  isHorseMode: false,
  isTouchToMoveEnabled: false,
  horseMovement: { forward: false, backward: false, left: false, right: false, sprint: false },
  setView: (view) => set({ currentView: view }),
  setEagleSpawnPosition: (pos) => set({ eagleSpawnPosition: pos }),
  setEagleCameraOffset: (offset) => set({ eagleCameraOffset: offset }),
  isFreeLook: false,
  setIsFreeLook: (val) => set({ isFreeLook: val }),
  setEagleScale: (scale) => set({ eagleScale: scale }),
  setEagleMovementParams: (params) => set((state) => ({ eagleMovementParams: { ...state.eagleMovementParams, ...params } })),
  setEagleMovement: (movement) => set((state) => ({ eagleMovement: { ...state.eagleMovement, ...movement } })),
  setHorsePosition: (pos) => set({ horsePosition: pos }),
  setHorseRotation: (rot) => set({ horseRotation: rot }),
  setHorseScale: (scl) => set({ horseScale: scl }),
  setHorseRGBIntensity: (intensity) => set({ horseRGBIntensity: intensity }),
  setHorseRGBSpeed: (speed) => set({ horseRGBSpeed: speed }),
  setHorseGroundAdjustment: (adj) => set({ horseGroundAdjustment: adj }),
  setHorseTransformMode: (mode) => set({ horseTransformMode: mode }),
  toggleHorsePlacementMode: () => set((state) => ({ isHorsePlacementMode: !state.isHorsePlacementMode })),
  toggleHorseMode: () => set((state) => {
    const nextHorseMode = !state.isHorseMode;
    return { 
      isHorseMode: nextHorseMode, 
      isHorsePlacementMode: false,
      isDroneMode: false,
      // If turning OFF horse mode, go back to home view
      ...( !nextHorseMode ? { currentView: 'home' } : {} )
    };
  }),
  setHorseMovement: (movement) => set((state) => ({ horseMovement: { ...state.horseMovement, ...movement } })),
  toggleDroneMode: () => set((state) => {
    const nextDroneMode = !state.isDroneMode;
    return { 
      isDroneMode: nextDroneMode, 
      isPlacementMode: false,
      isFreeLook: nextDroneMode // Default ON when entering, OFF when exiting
    };
  }),
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
  toggleTouchToMove: () => set((state) => ({ isTouchToMoveEnabled: !state.isTouchToMoveEnabled })),
}));

import { create } from 'zustand';

export const useStore = create((set) => ({
  currentView: 'home', // 'home', 'about', 'projects', 'contact'
  isStarted: false,
  isLoading: true,
  isDayTime: false,
  rainLevel: 'none', // 'none', 'low', 'medium', 'high'
  isDroneMode: false,
  isEnvironmentFixed: false,
  dayPhase: 'noon', // 'sunrise', 'noon', 'evening'
  nightPhase: 'mid', // 'early', 'mid', 'post'
  coreState: 'venom', // 'venom', 'linkedin', 'mail', 'youtube'
  setView: (view) => set({ currentView: view }),
  toggleDroneMode: () => set((state) => ({ isDroneMode: !state.isDroneMode })),
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

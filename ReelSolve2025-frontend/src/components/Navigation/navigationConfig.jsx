import {
  Casino as CasinoIcon,
  Settings as SettingsIcon,
  PlayCircle as PlayCircleIcon,
  ShowChart as ShowChartIcon,
  Gavel as GavelIcon
} from '@mui/icons-material';

export const navigationConfig = {
  slots: [
    { id: 'reel', label: 'Reel Matrix', icon: <SettingsIcon /> },
    { id: 'symbol', label: 'Symbol Setup', icon: <CasinoIcon /> },
    { id: 'bonus', label: 'Bonus Rounds', icon: <PlayCircleIcon /> },
    { id: 'payline', label: 'Paylines', icon: <ShowChartIcon /> },
    { id: 'rules', label: 'Ruleset Manager', icon: <GavelIcon /> },
    { id: 'simulation', label: 'Simulation & RTP', icon: <PlayCircleIcon /> },
  ],
  bingo: [
    { id: 'card', label: 'Card Manager', icon: <CasinoIcon /> },
    { id: 'pattern', label: 'Pattern Manager', icon: <SettingsIcon /> },
    { id: 'bonus', label: 'Bonus Features', icon: <PlayCircleIcon /> },
    { id: 'mechanics', label: 'Game Mechanics', icon: <GavelIcon /> },
    { id: 'simulation', label: 'Simulation & RTP', icon: <PlayCircleIcon /> },
  ],
  poker: [
    { id: 'gamevariant', label: 'Video-Poker Variant', icon: <SettingsIcon /> },
    { id: 'card', label: 'Card & Deck Manager', icon: <SettingsIcon /> },
    { id: 'paytable', label: 'Paytable Config', icon: <GavelIcon /> },
    { id: 'bonus', label: 'Bonus & Side Bet Features', icon: <PlayCircleIcon /> },
    { id: 'rngconfig', label: 'RNG Configuration (Advanced)', icon: <PlayCircleIcon /> },
    { id: 'simulation', label: 'Simulation & RTP', icon: <PlayCircleIcon /> },
  ],
  tables: [
    { id: 'stub', label: 'Table Configuration', icon: <CasinoIcon /> },
  ],
};
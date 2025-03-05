import {
  Apps as AppsIcon,
  Settings as SettingsIcon,
  ShowChart as LineChartIcon,
  PlayCircle as PlayCircleIcon,
  Gavel as GavelIcon,
  CardGiftcard as CardGiftcardIcon,
  Casino as CasinoIcon,
  GridOn as GridOnIcon,
} from '@mui/icons-material';

export const navigationConfig = {
  slots: [
    {
      id: 'reel',
      label: 'Reel Configuration',
      icon: <SettingsIcon />,
    },
    {
      id: 'symbol',
      label: 'Symbol Setup',
      icon: <AppsIcon />,
    },
    {
      id: 'payline',
      label: 'Paylines',
      icon: <LineChartIcon />,
    },
    {
      id: 'rules',
      label: 'Ruleset Manager',
      icon: <GavelIcon />,
    },
    {
      id: 'bonus',
      label: 'Bonus Rounds',
      icon: <CardGiftcardIcon />,
    },
    {
      id: 'simulation',
      label: 'Simulation',
      icon: <PlayCircleIcon />,
    },
  ],
  tables: [
    {
      id: 'table-layout',
      label: 'Table Layout',
      icon: <CasinoIcon />,
    },
    {
      id: 'betting-options',
      label: 'Betting Options',
      icon: <GridOnIcon />,
    },
    // Add more table game specific navigation items
  ],
  bingo: [
    // Add bingo specific navigation items
  ],
};
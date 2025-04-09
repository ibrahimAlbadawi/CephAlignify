import { createTheme } from '@mui/material/styles';

// To override components and styles in Meterial UI
const theme = createTheme({
  typography: {
    fontFamily: 'quicksand', 
  },
  // optional: override other defaults if needed
});

export default theme;
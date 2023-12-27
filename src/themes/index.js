import { createTheme } from "@mui/material/styles";
import { red, lightBlue, grey, orange, green } from "@mui/material/colors";

const font = import.meta.env.VITE_FONT;

let theme = createTheme({
  typography: {
    fontFamily: font,
    fontSize: 14,
    button: { textTransform: "none", fontWeight: "bold", fontSize: 15 },
    ERROR: {
      fontFamily: font,
      color: red[600],
      fontSize: 14,
      fontWeight: "bold",
    },
    mandatoryStar: {
      fontFamily: font,
      color: red[600],
      fontSize: 17,
      fontWeight: "400",
    },
    HELPER: {
      fontFamily: font,
      color: lightBlue[800],
      fontSize: 14,
      fontWeight: "bold",
    },
    WARNING: {
      fontFamily: font,
      color: orange[500],
      fontSize: 14,
      fontWeight: "bold",
    },
    inputFieldLabel: { fontFamily: font, fontSize: 15 },
  },
  palette: {
    text: {
      primary: "#363f4d",
    },
    grey: {
      main: grey[300],
      contrastText: "#000000",
    },
    primary: {
      main: lightBlue[800],
    },
    secondary: {
      main: red[600],
      contrastText: "#fff",
    },
    orange: {
      main: orange[500],
      dark: orange[700],
      contrastText: "#fff",
    },
    green: {
      main: green[500],
      dark: green[700],
      contrastText: "#fff",
    },
    teal: {
      main: "#00796B",
      dark: "#015e53",
      contrastText: "#fff",
    },
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          textAlign: "center",
          background: "#ffffff",
        },
      },
    },
    MuiButtonGroup: {
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          height: 40,
        },
      },
    },
  },
});

export default theme;

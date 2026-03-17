import { createTheme, virtualColor } from "@mantine/core";

export const theme = createTheme({
  primaryColor: "blue",
  fontFamily: "Outfit, sans-serif",
  headings: {
    fontFamily: "Outfit, sans-serif",
    fontWeight: "900",
  },
  defaultRadius: "lg",
  components: {
    Button: {
      defaultProps: {
        radius: "md",
        fw: 600,
      },
    },
    Card: {
      defaultProps: {
        radius: "lg",
        withBorder: true,
      },
    },
    Paper: {
      defaultProps: {
        radius: "lg",
      },
    },
  },
  other: {
    glassBackground: "rgba(255, 255, 255, 0.05)",
    glassBorder: "1px solid rgba(255, 255, 255, 0.08)",
    glassBlur: "12px",
  },
});

import { Header } from "@/components/Header/Header";
import { HeaderProvider } from "@/components/Header/HeaderContext";
import {
    ColorSchemeScript,
    MantineColorsTuple,
    MantineProvider,
    createTheme,
    mantineHtmlProps,
} from "@mantine/core";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Terraflow",
    description:
        "A Terraform tool to easily create and manage you configurations.",
};

const terraflow: MantineColorsTuple = [
    "#f7eeff",
    "#e8dbf6",
    "#ccb5e6",
    "#af8dd7",
    "#976aca",
    "#8854c2",
    "#7b42bc", // Default Terraform color
    "#6e3ba9",
    "#623398",
    "#552a86",
];

const theme = createTheme({
    colors: {
        terraflow,
    },
    primaryColor: "terraflow",
    fontFamily: "Inter, sans-serif",
    headings: {
        fontFamily: "Inter, sans-serif",
        fontWeight: "600",
        sizes: {
            h1: { fontSize: "2.5rem", lineHeight: "1.2" },
            h2: { fontSize: "2rem", lineHeight: "1.3" },
            h3: { fontSize: "1.75rem", lineHeight: "1.4" },
            h4: { fontSize: "1.5rem", lineHeight: "1.5" },
            h5: { fontSize: "1.25rem", lineHeight: "1.6" },
            h6: { fontSize: "1rem", lineHeight: "1.7" },
        },
    },
    components: {
        Button: {
            defaultProps: {
                variant: "filled",
            },
        },
        TextInput: {
            defaultProps: {
                variant: "filled",
            },
        },
        Select: {
            defaultProps: {
                variant: "filled",
            },
        },
        Textarea: {
            defaultProps: {
                variant: "filled",
            },
        },
    },
    fontSmoothing: true,
    primaryShade: { light: 6, dark: 8 },
    radius: {
        xs: "2px",
        sm: "4px",
        md: "8px",
        lg: "16px",
        xl: "32px",
        full: "9999px",
    },
    spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
    },
    shadows: {
        xs: "0 1px 2px rgba(0, 0, 0, 0.05)",
        sm: "0 2px 4px rgba(0, 0, 0, 0.05)",
        md: "0 4px 8px rgba(0, 0, 0, 0.05)",
        lg: "0 8px 16px rgba(0, 0, 0, 0.05)",
        xl: "0 16px 32px rgba(0, 0, 0, 0.05)",
    },
    breakpoints: {
        xs: "480px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
    },
    fontSizes: {
        xs: "0.75rem",
        sm: "0.875rem",
        md: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
        "6xl": "3.75rem",
        "7xl": "4.5rem",
        "8xl": "6rem",
        "9xl": "8rem",
    },
});

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr" {...mantineHtmlProps}>
            <head>
                <ColorSchemeScript defaultColorScheme="auto" />
                <meta name="apple-mobile-web-app-title" content="Terraflow" />
            </head>
            <body>
                <MantineProvider defaultColorScheme="auto" theme={theme}>
                    <HeaderProvider>
                        <Header />
                        {children}
                    </HeaderProvider>
                </MantineProvider>
            </body>
        </html>
    );
}

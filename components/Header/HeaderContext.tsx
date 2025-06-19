"use client";

import { createContext, ReactNode, useContext, useState } from "react";

type HeaderContextType = {
    setHeaderContent: (content: ReactNode) => void;
    headerContent: ReactNode;
};

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export function HeaderProvider({ children }: { children: ReactNode }) {
    const [headerContent, setHeaderContent] = useState<ReactNode>(null);

    return (
        <HeaderContext.Provider value={{ headerContent, setHeaderContent }}>
            {children}
        </HeaderContext.Provider>
    );
}

export function useHeaderContent() {
    const context = useContext(HeaderContext);
    if (!context) {
        throw new Error(
            "useHeaderContent doit être utilisé à l'intérieur de HeaderProvider"
        );
    }
    return context;
}

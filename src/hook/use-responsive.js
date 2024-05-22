import { useMediaQuery } from "react-responsive";

export default function useResponsive() {
  const isDesktop = useMediaQuery({
    query: "(min-width: 1025px)",
  });

  const isMobile = useMediaQuery({ query: "(max-width: 1024px)" });
  const isSmallScreen = useMediaQuery({ query: "(max-width: 599px)" });
  const mobileSidebarScreen = useMediaQuery({ query: "(max-width: 1199px)" });
  const isLargeScreen = useMediaQuery({ query: "(min-width: 1200px)" });

  return {
    isDesktop,
    isMobile,
    mobileSidebarScreen,
    isSmallScreen,
    isLargeScreen,
  };
}

import { type AppType } from "next/dist/shared/lib/utils";

import "~/styles/globals.css";
import { GameSettingsProvider } from "~/utils/useGameSettings";
import { PlayersProvider } from "~/utils/usePlayers";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <GameSettingsProvider>
      <PlayersProvider>
        <Component {...pageProps} />
      </PlayersProvider>
    </GameSettingsProvider>
  );
};

export default MyApp;

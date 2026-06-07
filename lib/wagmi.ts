"use client";

import { cookieStorage, createConfig, createStorage, http } from "wagmi";
import { base } from "wagmi/chains";
import { coinbaseWallet, injected } from "wagmi/connectors";
import { BUILDER_DATA_SUFFIX } from "@/lib/contracts";

export const wagmiConfig = createConfig({
  chains: [base],
  multiInjectedProviderDiscovery: true,
  connectors: [
    injected({
      shimDisconnect: true,
      unstable_shimAsyncInject: 1_000
    }),
    coinbaseWallet({
      appName: "Circuit Sticker"
    })
  ],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage
  }),
  transports: {
    [base.id]: http()
  }
});

export { BUILDER_DATA_SUFFIX };

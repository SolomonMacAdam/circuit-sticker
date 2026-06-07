# Circuit Sticker

A mobile-first Base Mini App for three simple onchain circuit actions: Place Chip, Route Line, and Test Spark.

## Setup

1. Deploy `contracts/CircuitSticker.sol` on Base.
2. Set `NEXT_PUBLIC_CIRCUIT_STICKER_ADDRESS` to the deployed contract address.
3. Put the base.dev verify token directly in `app/layout.tsx`:

```tsx
<meta name="base:app_id" content="YOUR_BASE_DEV_VERIFY_TOKEN" />
```

4. After base.dev issues the builder code, set `NEXT_PUBLIC_BUILDER_DATA_SUFFIX` to the ERC-8021 encoded string.
5. Deploy to Vercel and turn off Deployment Protection for public Base App access.

## Commands

```bash
npm install
npm run dev
npm run typecheck
npm run build
```

## Notes

- The app uses native Wagmi configuration with `injected` and `coinbaseWallet` connectors only.
- There is no token, points system, invitation flow, or payment feature.
- Each `writeContract` call passes `dataSuffix: BUILDER_DATA_SUFFIX` explicitly.

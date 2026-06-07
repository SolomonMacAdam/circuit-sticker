import type { Address, Hex } from "viem";

const configuredAddress = process.env.NEXT_PUBLIC_CIRCUIT_STICKER_ADDRESS;
const configuredSuffix = process.env.NEXT_PUBLIC_BUILDER_DATA_SUFFIX;
const deployedCircuitStickerAddress = "0x3684Fdf0EDFa6cEc9432F63437DfaAdE3Bcdb5f9";
const builderDataSuffix =
  "0x62635f69687070706b396f0b0080218021802180218021802180218021";

export const CIRCUIT_STICKER_ADDRESS = (
  configuredAddress?.startsWith("0x") ? configuredAddress : deployedCircuitStickerAddress
) as Address;

export const BUILDER_DATA_SUFFIX: Hex =
  configuredSuffix?.startsWith("0x") && configuredSuffix.length > 2
    ? (configuredSuffix as Hex)
    : builderDataSuffix;

export const hasContractAddress = Boolean(CIRCUIT_STICKER_ADDRESS);
export const hasBuilderDataSuffix = BUILDER_DATA_SUFFIX !== "0x";

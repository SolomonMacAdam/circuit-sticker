"use client";

import { useEffect, useMemo, useState } from "react";
import type { Address, Hash } from "viem";
import { base } from "wagmi/chains";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContracts,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract
} from "wagmi";
import { circuitStickerAbi } from "@/lib/abi";
import {
  BUILDER_DATA_SUFFIX,
  CIRCUIT_STICKER_ADDRESS,
  hasBuilderDataSuffix,
  hasContractAddress
} from "@/lib/contracts";

type ActionKey = "chip" | "route" | "spark";

type CircuitAction = {
  key: ActionKey;
  label: string;
  method: "placeChip" | "routeLine" | "testSpark";
  short: string;
};

const actions: CircuitAction[] = [
  { key: "chip", label: "Place Chip", method: "placeChip", short: "CHIP" },
  { key: "route", label: "Route Line", method: "routeLine", short: "LINE" },
  { key: "spark", label: "Test Spark", method: "testSpark", short: "SPRK" }
];

const readNames = [
  "userChips",
  "userRoutes",
  "userSparks",
  "totalChips",
  "totalRoutes",
  "totalSparks"
] as const;

function shortAddress(address?: Address) {
  if (!address) return "Not connected";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatCount(value: unknown) {
  if (typeof value === "bigint") return value.toString();
  return "0";
}

function transactionLabel(status: string, hash?: Hash) {
  if (status === "pending") return "Waiting for wallet";
  if (status === "confirming") return "Confirming on Base";
  if (status === "success") return `Success ${hash ? shortAddress(hash) : ""}`;
  if (status === "error") return "Failed";
  return "Ready";
}

export function CircuitStickerApp() {
  const [walletMenuOpen, setWalletMenuOpen] = useState(false);
  const [activeAction, setActiveAction] = useState<ActionKey | null>(null);
  const [lastHash, setLastHash] = useState<Hash>();
  const { address, chainId, isConnected } = useAccount();
  const { connectors, connect, isPending: isConnectPending } = useConnect({
    mutation: {
      onSuccess: () => setWalletMenuOpen(false)
    }
  });
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitchPending } = useSwitchChain();
  const { writeContract, isPending: isWritePending, error: writeError } = useWriteContract({
    mutation: {
      onSuccess: (hash) => setLastHash(hash)
    }
  });
  const receipt = useWaitForTransactionReceipt({
    hash: lastHash,
    chainId: base.id
  });

  const readContracts = useMemo(() => {
    if (!hasContractAddress) return [];

    return readNames.map((functionName) => ({
      address: CIRCUIT_STICKER_ADDRESS,
      abi: circuitStickerAbi,
      functionName,
      args: functionName.startsWith("user") ? [address ?? "0x0000000000000000000000000000000000000000"] : []
    }));
  }, [address]);

  const reads = useReadContracts({
    contracts: readContracts,
    query: {
      enabled: hasContractAddress,
      refetchInterval: receipt.isSuccess ? false : 6000
    }
  });

  useEffect(() => {
    if (receipt.isSuccess) {
      reads.refetch();
    }
  }, [receipt.isSuccess, reads]);

  const transactionState = receipt.isLoading
    ? "confirming"
    : receipt.isSuccess
      ? "success"
      : receipt.isError || writeError
        ? "error"
        : isWritePending
          ? "pending"
          : "idle";

  const values = {
    myChips: formatCount(reads.data?.[0]?.result),
    myRoutes: formatCount(reads.data?.[1]?.result),
    mySparks: formatCount(reads.data?.[2]?.result),
    totalChips: formatCount(reads.data?.[3]?.result),
    totalRoutes: formatCount(reads.data?.[4]?.result),
    totalSparks: formatCount(reads.data?.[5]?.result)
  };

  const runAction = async (action: CircuitAction) => {
    if (!isConnected) {
      setWalletMenuOpen(true);
      return;
    }

    if (!hasContractAddress || !CIRCUIT_STICKER_ADDRESS) return;

    if (chainId !== base.id) {
      switchChain({ chainId: base.id });
      return;
    }

    setActiveAction(action.key);
    writeContract({
      address: CIRCUIT_STICKER_ADDRESS,
      abi: circuitStickerAbi,
      functionName: action.method,
      chainId: base.id,
      dataSuffix: BUILDER_DATA_SUFFIX
    });
  };

  const actionDisabled =
    !hasContractAddress || isWritePending || receipt.isLoading || isSwitchPending;

  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-5xl flex-col gap-4 overflow-hidden rounded-lg border border-white/15 bg-[#121817] shadow-2xl shadow-black/40">
        <header className="flex flex-col gap-4 border-b border-white/15 bg-[#232b2d] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#ff5fb4]">
              Base Mini App
            </p>
            <h1 className="mt-1 text-3xl font-black tracking-normal text-white sm:text-4xl">
              Circuit Sticker
            </h1>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setWalletMenuOpen((open) => !open)}
              className="flex min-h-12 w-full items-center justify-between gap-3 rounded-md border border-white/20 bg-[#3d474c] px-4 text-left text-sm font-bold text-white shadow-inner shadow-white/10 sm:w-72"
            >
              <span className="flex items-center gap-3">
                <span
                  className={`h-3 w-3 rounded-full ${isConnected ? "bg-[#0052ff] status-led" : "bg-[#899399]"}`}
                />
                <span>{isConnected ? shortAddress(address) : "Connect Wallet"}</span>
              </span>
              <span className="text-xs uppercase text-white/70">Select</span>
            </button>

            {walletMenuOpen ? (
              <div className="absolute right-0 z-20 mt-2 w-full min-w-72 rounded-md border border-white/20 bg-[#1c2425] p-2 shadow-xl shadow-black/40">
                {connectors.map((connector) => (
                  <button
                    key={connector.uid}
                    type="button"
                    onClick={() => connect({ connector, chainId: base.id })}
                    disabled={isConnectPending}
                    className="flex w-full items-center justify-between rounded px-3 py-3 text-left text-sm font-semibold text-white hover:bg-white/10 disabled:cursor-wait disabled:opacity-60"
                  >
                    <span>{connector.name}</span>
                    <span className="text-xs uppercase text-[#72a3ff]">Base</span>
                  </button>
                ))}
                {isConnected ? (
                  <button
                    type="button"
                    onClick={() => {
                      disconnect();
                      setWalletMenuOpen(false);
                    }}
                    className="mt-1 w-full rounded border border-[#ff3fa4]/40 px-3 py-3 text-left text-sm font-bold text-[#ff87c8] hover:bg-[#ff3fa4]/10"
                  >
                    Disconnect
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        </header>

        <div className="grid flex-1 gap-4 p-4 lg:grid-cols-[1.15fr_0.85fr] lg:p-6">
          <section className="circuit-board trace-lines relative overflow-hidden rounded-lg border border-white/20 p-4 shadow-inner shadow-black/50 sm:p-6">
            <div className="absolute right-5 top-5 h-8 w-8 rounded-full border-4 border-[#f3fff8]/80 bg-[#103a2c]" />
            <div className="absolute bottom-6 left-5 h-10 w-16 border-2 border-[#ff3fa4] bg-[#ff3fa4]/10" />

            <div className="relative z-10 flex min-h-[33rem] flex-col justify-between gap-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-white/75">
                    Workbench
                  </p>
                  <p className="mt-2 max-w-md text-sm font-semibold leading-6 text-white/90">
                    Three onchain circuit actions. No token. No points. Base gas only.
                  </p>
                </div>
                <span className="rounded border border-[#ff3fa4] bg-[#ff3fa4]/15 px-2 py-1 text-xs font-black text-white">
                  LIVE
                </span>
              </div>

              <div className="grid gap-3">
                {actions.map((action) => (
                  <button
                    key={action.key}
                    type="button"
                    onClick={() => runAction(action)}
                    disabled={actionDisabled}
                    className="group grid min-h-20 grid-cols-[4.5rem_1fr_auto] items-center gap-3 rounded-md border-2 border-white/80 bg-[#f6fff8] px-3 text-left text-[#102017] shadow-[6px_6px_0_rgba(0,0,0,0.32)] transition hover:-translate-y-0.5 hover:shadow-[8px_8px_0_rgba(0,0,0,0.34)] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-[4px_4px_0_rgba(0,0,0,0.2)]"
                  >
                    <span className="rounded bg-[#111819] px-2 py-2 text-center text-xs font-black text-[#ff65b9]">
                      {action.short}
                    </span>
                    <span className="text-xl font-black">{action.label}</span>
                    <span className="h-4 w-4 rounded-full border-2 border-[#111819] bg-[#0052ff] group-hover:status-led" />
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs font-black uppercase tracking-normal text-white">
                <div className="rounded border border-white/30 bg-black/20 p-2">Chip Pad</div>
                <div className="rounded border border-white/30 bg-black/20 p-2">Route Pad</div>
                <div className="rounded border border-white/30 bg-black/20 p-2">Spark Pad</div>
              </div>
            </div>
          </section>

          <aside className="flex flex-col gap-4">
            <StatusPanel
              title="Chip Counter"
              primaryLabel="My Chips"
              primaryValue={values.myChips}
              totalLabel="Total Chips"
              totalValue={values.totalChips}
            />
            <StatusPanel
              title="Route Counter"
              primaryLabel="My Routes"
              primaryValue={values.myRoutes}
              totalLabel="Total Routes"
              totalValue={values.totalRoutes}
            />
            <StatusPanel
              title="Spark Counter"
              primaryLabel="My Sparks"
              primaryValue={values.mySparks}
              totalLabel="Total Sparks"
              totalValue={values.totalSparks}
            />

            <section className="rounded-lg border border-white/15 bg-[#232b2d] p-4">
              <h2 className="text-sm font-black uppercase tracking-[0.14em] text-white/75">
                Chain Output
              </h2>
              <dl className="mt-4 grid gap-3 text-sm">
                <Readout label="Wallet Status" value={isConnected ? "Connected" : "Disconnected"} />
                <Readout
                  label="Network"
                  value={chainId === base.id ? "Base" : isConnected ? "Switch to Base" : "Waiting"}
                />
                <Readout label="Last Transaction" value={transactionLabel(transactionState, lastHash)} />
                <Readout
                  label="Active Action"
                  value={actions.find((action) => action.key === activeAction)?.label ?? "None"}
                />
              </dl>
              {lastHash ? (
                <a
                  href={`https://basescan.org/tx/${lastHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 block rounded border border-[#0052ff]/70 px-3 py-3 text-center text-sm font-bold text-[#9dbaff] hover:bg-[#0052ff]/10"
                >
                  View on Basescan
                </a>
              ) : null}
            </section>

            {!hasContractAddress || !hasBuilderDataSuffix ? (
              <section className="rounded-lg border border-[#ff3fa4]/50 bg-[#271722] p-4 text-sm font-semibold leading-6 text-white">
                {!hasContractAddress ? (
                  <p>Set NEXT_PUBLIC_CIRCUIT_STICKER_ADDRESS before sending transactions.</p>
                ) : null}
                {!hasBuilderDataSuffix ? (
                  <p>Set NEXT_PUBLIC_BUILDER_DATA_SUFFIX after the builder code is issued.</p>
                ) : null}
              </section>
            ) : null}
          </aside>
        </div>
      </section>
    </main>
  );
}

function StatusPanel({
  title,
  primaryLabel,
  primaryValue,
  totalLabel,
  totalValue
}: {
  title: string;
  primaryLabel: string;
  primaryValue: string;
  totalLabel: string;
  totalValue: string;
}) {
  return (
    <section className="rounded-lg border border-white/15 bg-[#2f383d] p-4 shadow-inner shadow-white/5">
      <h2 className="text-sm font-black uppercase tracking-[0.14em] text-white/75">{title}</h2>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Counter label={primaryLabel} value={primaryValue} accent="text-[#a8c0ff]" />
        <Counter label={totalLabel} value={totalValue} accent="text-[#ff8ccc]" />
      </div>
    </section>
  );
}

function Counter({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="rounded-md border border-white/15 bg-[#111819] p-3">
      <p className="text-xs font-bold text-white/60">{label}</p>
      <p className={`mt-2 break-all text-3xl font-black ${accent}`}>{value}</p>
    </div>
  );
}

function Readout({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-h-10 items-center justify-between gap-3 border-b border-white/10 pb-2">
      <dt className="font-bold text-white/60">{label}</dt>
      <dd className="text-right font-black text-white">{value}</dd>
    </div>
  );
}

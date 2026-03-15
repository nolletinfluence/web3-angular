export type ChainType = "evm" | "solana";

const EVM_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;
const SOLANA_BASE58_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

export const getAddressError = (chainType: ChainType, address: string): string | null => {
  const trimmed = address.trim();

  if (!trimmed) {
    return "Адрес кошелька обязателен.";
  }

  if (chainType === "evm" && !EVM_ADDRESS_REGEX.test(trimmed)) {
    return "Неверный формат EVM-адреса (0x + 40 hex символов).";
  }

  if (chainType === "solana" && !SOLANA_BASE58_REGEX.test(trimmed)) {
    return "Неверный формат Solana-адреса (base58, 32-44 символа).";
  }

  return null;
};

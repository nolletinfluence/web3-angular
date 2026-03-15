const DIGITS_ONLY_REGEX = /^\d+$/;
const DECIMAL_STRING_REGEX = /^-?\d+(\.\d+)?$/;

const USD_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const INTEGER_FORMATTER = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

const DATE_FORMATTER = new Intl.DateTimeFormat("ru-RU", {
  dateStyle: "medium",
  timeStyle: "short",
});

const normalizeDigits = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed || !DIGITS_ONLY_REGEX.test(trimmed)) {
    return "0";
  }

  return trimmed.replace(/^0+(?!$)/, "");
};

const splitUnits = (
  rawBalance: string,
  decimals: number,
): { integerPart: string; fractionalPart: string } => {
  if (decimals <= 0) {
    return { integerPart: rawBalance, fractionalPart: "" };
  }

  if (rawBalance.length <= decimals) {
    return {
      integerPart: "0",
      fractionalPart: rawBalance.padStart(decimals, "0"),
    };
  }

  return {
    integerPart: rawBalance.slice(0, -decimals),
    fractionalPart: rawBalance.slice(-decimals),
  };
};

const addOneToInteger = (value: string): string => {
  try {
    return (BigInt(value || "0") + 1n).toString();
  } catch {
    return value;
  }
};

const incrementFraction = (fraction: string): string => {
  const digits = fraction.split("");
  let carry = 1;

  for (let index = digits.length - 1; index >= 0; index -= 1) {
    const next = Number(digits[index]) + carry;
    if (next === 10) {
      digits[index] = "0";
      carry = 1;
    } else {
      digits[index] = next.toString();
      carry = 0;
      break;
    }
  }

  if (carry === 1) {
    return `1${digits.join("")}`;
  }

  return digits.join("");
};

const roundFraction = (
  integerPart: string,
  fractionalPart: string,
  maxDecimals: number,
): { integerPart: string; fractionalPart: string } => {
  if (maxDecimals <= 0 || fractionalPart.length === 0) {
    return { integerPart, fractionalPart: "" };
  }

  if (fractionalPart.length <= maxDecimals) {
    return { integerPart, fractionalPart };
  }

  const head = fractionalPart.slice(0, maxDecimals);
  const nextDigit = fractionalPart.charAt(maxDecimals);

  if (nextDigit < "5") {
    return { integerPart, fractionalPart: head };
  }

  const incremented = incrementFraction(head);
  if (incremented.length > maxDecimals) {
    return {
      integerPart: addOneToInteger(integerPart),
      fractionalPart: "0".repeat(maxDecimals),
    };
  }

  return { integerPart, fractionalPart: incremented };
};

const formatInteger = (value: string): string => {
  try {
    return INTEGER_FORMATTER.format(BigInt(value));
  } catch {
    return value;
  }
};

export const formatTokenAmount = (
  rawBalance: string,
  decimals: number,
  maxDecimals = 6,
): string => {
  const normalized = normalizeDigits(rawBalance);
  const safeDecimals = Math.max(0, Math.floor(decimals));
  const { integerPart, fractionalPart } = splitUnits(normalized, safeDecimals);
  const rounded = roundFraction(integerPart, fractionalPart, maxDecimals);
  const groupedInteger = formatInteger(rounded.integerPart);
  const trimmedFraction = rounded.fractionalPart.replace(/0+$/, "");

  if (!trimmedFraction) {
    return groupedInteger;
  }

  return `${groupedInteger}.${trimmedFraction}`;
};

export const formatUsd = (value: number): string => {
  if (!Number.isFinite(value)) {
    return "$0.00";
  }

  return USD_FORMATTER.format(value);
};

export const formatTransactionValue = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed || !DECIMAL_STRING_REGEX.test(trimmed)) {
    return "0";
  }

  const isNegative = trimmed.startsWith("-");
  const normalized = isNegative ? trimmed.slice(1) : trimmed;
  const [integerRaw, fractionalRaw = ""] = normalized.split(".");
  const integerPart = normalizeDigits(integerRaw);
  const rounded = roundFraction(integerPart, fractionalRaw, 6);
  const groupedInteger = formatInteger(rounded.integerPart);
  const trimmedFraction = rounded.fractionalPart.replace(/0+$/, "");
  const sign = isNegative ? "-" : "";

  if (!trimmedFraction) {
    return `${sign}${groupedInteger}`;
  }

  return `${sign}${groupedInteger}.${trimmedFraction}`;
};

export const shortenHash = (hash: string, head = 6, tail = 4): string => {
  if (hash.length <= head + tail) {
    return hash;
  }

  return `${hash.slice(0, head)}...${hash.slice(-tail)}`;
};

export const shortenAddress = (address: string, head = 6, tail = 4): string => {
  if (address.length <= head + tail) {
    return address;
  }

  return `${address.slice(0, head)}...${address.slice(-tail)}`;
};

export const formatTimestamp = (timestampSeconds: number): string => {
  if (!Number.isFinite(timestampSeconds)) {
    return "-";
  }

  const date = new Date(timestampSeconds * 1000);
  return DATE_FORMATTER.format(date);
};

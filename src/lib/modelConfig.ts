// # path: src/lib/modelConfig.ts

// Flat form state; keep everything as strings/booleans for easy inputs
export type ModelFormState = {
  // Core identity
  publisher: string; // e.g. "dirty-data"
  modelName: string; // e.g. "qwen3-vl-8b-bartowski"
  baseKey: string; // e.g. "bartowski/qwen3-vl-8b-instruct-gguf"
  hfUser: string; // e.g. "bartowski"
  hfRepo: string; // e.g. "Qwen_Qwen3-VL-8B-Instruct-GGUF"

  // metadataOverrides
  domain: string; // e.g. "llm"
  architectures: string; // comma-separated, e.g. "qwen3_vl"
  compatibilityTypes: string; // comma-separated, e.g. "gguf"
  paramsStrings: string; // comma-separated, e.g. "8B"
  minMemoryUsageBytes: string; // numeric string
  contextLengths: string; // comma-separated, e.g. "256000"
  vision: boolean;
  reasoning: boolean;
  trainedForToolUse: boolean;

  // config.operation
  topKSampling: string; // numeric string
  temperature: string; // numeric string
  minPSamplingChecked: boolean;
  minPSampling: string; // numeric string

  // config.load
  loadContextLength: string; // numeric string

  // customFields
  enableThinkingField: boolean;
};

const parseNumber = (value: string, fallback: number): number => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const splitList = (value: string): string[] =>
  value
    .split(",")
    .map((v) => v.trim())
    .filter((v) => v.length > 0);

const splitNumberList = (value: string): number[] =>
  splitList(value)
    .map((v) => Number(v))
    .filter((n) => Number.isFinite(n));

export const createDefaultFormState = (): ModelFormState => ({
  publisher: "dirty-data",
  modelName: "qwen3-vl-8b-bartowski",
  baseKey: "bartowski/qwen3-vl-8b-instruct-gguf",
  hfUser: "bartowski",
  hfRepo: "Qwen_Qwen3-VL-8B-Instruct-GGUF",

  domain: "llm",
  architectures: "qwen3_vl",
  compatibilityTypes: "gguf",
  paramsStrings: "8B",
  minMemoryUsageBytes: "6000000000",
  contextLengths: "256000",
  vision: true,
  reasoning: true,
  trainedForToolUse: true,

  topKSampling: "20",
  temperature: "0.7",
  minPSamplingChecked: true,
  minPSampling: "0",

  loadContextLength: "256000",
  enableThinkingField: true,
});

// Generate model.yaml as a string from the current form state
export const generateModelYaml = (state: ModelFormState): string => {
  const architectures = splitList(state.architectures);
  const compatibilityTypes = splitList(state.compatibilityTypes);
  const paramsStrings = splitList(state.paramsStrings);
  const contextLengths = splitNumberList(state.contextLengths);
  const minMemoryUsageBytes = parseNumber(state.minMemoryUsageBytes, 0);

  const topKSampling = parseNumber(state.topKSampling, 20);
  const temperature = parseNumber(state.temperature, 0.7);
  const minPSamplingValue = parseNumber(state.minPSampling, 0);

  const loadContextLength = parseNumber(state.loadContextLength, 0);

  const lines: string[] = [];

  lines.push(
    "# model.yaml is an open standard for defining cross-platform, composable AI models"
  );
  lines.push("# Learn more at https://modelyaml.org");
  lines.push(`model: ${state.publisher}/${state.modelName}`);
  lines.push("");
  lines.push("base:");
  lines.push(`  - key: ${state.baseKey}`);
  lines.push("    sources:");
  lines.push("      - type: huggingface");
  lines.push(`        user: ${state.hfUser}`);
  lines.push(`        repo: ${state.hfRepo}`);
  lines.push("");
  lines.push("metadataOverrides:");
  lines.push(`  domain: ${state.domain}`);

  if (architectures.length > 0) {
    lines.push("  architectures:");
    for (const arch of architectures) {
      lines.push(`    - ${arch}`);
    }
  }

  if (compatibilityTypes.length > 0) {
    lines.push("  compatibilityTypes:");
    for (const comp of compatibilityTypes) {
      lines.push(`    - ${comp}`);
    }
  }

  if (paramsStrings.length > 0) {
    lines.push("  paramsStrings:");
    for (const p of paramsStrings) {
      lines.push(`    - ${p}`);
    }
  }

  if (minMemoryUsageBytes > 0) {
    lines.push(`  minMemoryUsageBytes: ${minMemoryUsageBytes}`);
  }

  if (contextLengths.length > 0) {
    lines.push("  contextLengths:");
    for (const c of contextLengths) {
      lines.push(`    - ${c}`);
    }
  }

  lines.push(`  vision: ${state.vision ? "true" : "false"}`);
  lines.push(`  reasoning: ${state.reasoning ? "true" : "false"}`);
  lines.push(
    `  trainedForToolUse: ${state.trainedForToolUse ? "true" : "false"}`
  );
  lines.push("");
  lines.push("config:");
  lines.push("  operation:");
  lines.push("    fields:");
  lines.push("      - key: llm.prediction.topKSampling");
  lines.push(`        value: ${topKSampling}`);
  lines.push("      - key: llm.prediction.temperature");
  lines.push(`        value: ${temperature}`);

  if (state.minPSamplingChecked) {
    lines.push("      - key: llm.prediction.minPSampling");
    lines.push("        value:");
    lines.push("          checked: true");
    lines.push(`          value: ${minPSamplingValue}`);
  }

  if (loadContextLength > 0) {
    lines.push("  load:");
    lines.push("    fields:");
    lines.push("      - key: llm.load.contextLength");
    lines.push(`        value: ${loadContextLength}`);
  }

  if (state.enableThinkingField) {
    lines.push("");
    lines.push("customFields:");
    lines.push("  - key: enableThinking");
    lines.push("    displayName: Enable Thinking");
    lines.push(
      "    description: Controls whether the model will think before replying"
    );
    lines.push("    type: boolean");
    lines.push("    defaultValue: true");
    lines.push("    effects:");
    lines.push("      - type: setJinjaVariable");
    lines.push("        variable: enable_thinking");
  }

  return lines.join("\n");
};

// Generate manifest.json consistent with LM Studio lms push expectations
export const generateManifestJson = (state: ModelFormState): string => {
  const manifest = {
    type: "model",
    owner: state.publisher,
    name: state.modelName,
    dependencies: [
      {
        type: "model",
        purpose: "baseModel",
        modelKeys: [state.baseKey],
        sources: [
          {
            type: "huggingface",
            user: state.hfUser,
            repo: state.hfRepo,
          },
        ],
      },
    ],
    revision: 1,
  };

  return JSON.stringify(manifest, null, 2);
};

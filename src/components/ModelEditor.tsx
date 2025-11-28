// # path: src/components/ModelEditor.tsx
import type React from "react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

import IconWrench from "~icons/mdi/wrench";
import IconFileCode from "~icons/mdi/file-code-outline";
import IconJson from "~icons/mdi/code-json";

import {
  createDefaultFormState,
  generateManifestJson,
  generateModelYaml,
  type ModelFormState,
} from "@/lib/modelConfig";

const FieldRow: React.FC<
  React.PropsWithChildren<{ label: string; description?: string }>
> = ({ label, description, children }) => (
  <div className="space-y-1">
    <Label className="text-xs font-medium">{label}</Label>
    {description ? (
      <p className="text-[10px] text-muted-foreground">{description}</p>
    ) : null}
    {children}
  </div>
);

const ModelEditor: React.FC = () => {
  const [form, setForm] = useState<ModelFormState>(createDefaultFormState);

  const modelYaml = useMemo(() => generateModelYaml(form), [form]);
  const manifestJson = useMemo(() => generateManifestJson(form), [form]);

  const updateField = <K extends keyof ModelFormState>(
    key: K,
    value: ModelFormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // no-op; clipboard may be unavailable in some environments
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)]">
      {/* Left: form sections */}
      <div className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 space-y-0">
            <IconWrench className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-semibold">
              Core model identity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <FieldRow
              label="Publisher"
              description="LM Studio Hub owner; first part of `model: publisher/name`."
            >
              <Input
                value={form.publisher}
                onChange={(e) => updateField("publisher", e.target.value)}
                className="h-8 text-xs"
              />
            </FieldRow>
            <FieldRow
              label="Model name"
              description="Model slug; second part of `model: publisher/name`."
            >
              <Input
                value={form.modelName}
                onChange={(e) => updateField("modelName", e.target.value)}
                className="h-8 text-xs"
              />
            </FieldRow>
            <FieldRow
              label="Base key"
              description="Virtual key used by LM Studio to identify this concrete model."
            >
              <Input
                value={form.baseKey}
                onChange={(e) => updateField("baseKey", e.target.value)}
                className="h-8 text-xs"
                placeholder="bartowski/Qwen_Qwen3-VL-8B-Instruct-GGUF"
              />
            </FieldRow>
            <div className="grid gap-3 md:grid-cols-2">
              <FieldRow
                label="Hugging Face user/org"
                description="`user` for the Hugging Face source."
              >
                <Input
                  value={form.hfUser}
                  onChange={(e) => updateField("hfUser", e.target.value)}
                  className="h-8 text-xs"
                />
              </FieldRow>
              <FieldRow
                label="Hugging Face repository"
                description="`repo` for the Hugging Face source."
              >
                <Input
                  value={form.hfRepo}
                  onChange={(e) => updateField("hfRepo", e.target.value)}
                  className="h-8 text-xs"
                />
              </FieldRow>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              metadataOverrides
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <FieldRow label="Domain">
              <Input
                value={form.domain}
                onChange={(e) => updateField("domain", e.target.value)}
                className="h-8 text-xs"
              />
            </FieldRow>

            <div className="grid gap-3 md:grid-cols-2">
              <FieldRow
                label="Architectures"
                description="Comma-separated, e.g. `qwen3_vl`."
              >
                <Input
                  value={form.architectures}
                  onChange={(e) => updateField("architectures", e.target.value)}
                  className="h-8 text-xs"
                />
              </FieldRow>
              <FieldRow
                label="Compatibility types"
                description="Comma-separated, e.g. `gguf,safetensors`."
              >
                <Input
                  value={form.compatibilityTypes}
                  onChange={(e) =>
                    updateField("compatibilityTypes", e.target.value)
                  }
                  className="h-8 text-xs"
                />
              </FieldRow>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <FieldRow
                label="Params strings"
                description="Comma-separated labels, e.g. `8B,vision`."
              >
                <Input
                  value={form.paramsStrings}
                  onChange={(e) => updateField("paramsStrings", e.target.value)}
                  className="h-8 text-xs"
                />
              </FieldRow>
              <FieldRow
                label="Min memory (bytes)"
                description="Approximate minimum VRAM / RAM footprint."
              >
                <Input
                  value={form.minMemoryUsageBytes}
                  onChange={(e) =>
                    updateField("minMemoryUsageBytes", e.target.value)
                  }
                  className="h-8 text-xs"
                  type="number"
                  min={0}
                />
              </FieldRow>
            </div>

            <FieldRow
              label="Context lengths"
              description="Comma-separated, e.g. `40960` or `256000`."
            >
              <Input
                value={form.contextLengths}
                onChange={(e) => updateField("contextLengths", e.target.value)}
                className="h-8 text-xs"
              />
            </FieldRow>

            <div className="flex flex-wrap gap-4 pt-1">
              <label className="flex items-center gap-2 text-xs">
                <Switch
                  checked={form.vision}
                  onCheckedChange={(v) => updateField("vision", Boolean(v))}
                />
                <span>vision</span>
              </label>
              <label className="flex items-center gap-2 text-xs">
                <Switch
                  checked={form.reasoning}
                  onCheckedChange={(v) => updateField("reasoning", Boolean(v))}
                />
                <span>reasoning</span>
              </label>
              <label className="flex items-center gap-2 text-xs">
                <Switch
                  checked={form.trainedForToolUse}
                  onCheckedChange={(v) =>
                    updateField("trainedForToolUse", Boolean(v))
                  }
                />
                <span>trainedForToolUse</span>
              </label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              config (operation &amp; load)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="grid gap-3 md:grid-cols-3">
              <FieldRow
                label="topKSampling"
                description="llm.prediction.topKSampling"
              >
                <Input
                  value={form.topKSampling}
                  onChange={(e) => updateField("topKSampling", e.target.value)}
                  className="h-8 text-xs"
                  type="number"
                />
              </FieldRow>
              <FieldRow
                label="temperature"
                description="llm.prediction.temperature"
              >
                <Input
                  value={form.temperature}
                  onChange={(e) => updateField("temperature", e.target.value)}
                  className="h-8 text-xs"
                  type="number"
                  step="0.05"
                />
              </FieldRow>
              <FieldRow
                label="minPSampling"
                description="llm.prediction.minPSampling.value"
              >
                <Input
                  value={form.minPSampling}
                  onChange={(e) => updateField("minPSampling", e.target.value)}
                  className="h-8 text-xs"
                  type="number"
                  step="0.01"
                />
              </FieldRow>
            </div>

            <label className="flex items-center gap-2 text-xs">
              <Switch
                checked={form.minPSamplingChecked}
                onCheckedChange={(v) =>
                  updateField("minPSamplingChecked", Boolean(v))
                }
              />
              <span>Enable minPSampling.checked</span>
            </label>

            <FieldRow
              label="Load context length"
              description="llm.load.contextLength (optional; 0 disables)."
            >
              <Input
                value={form.loadContextLength}
                onChange={(e) =>
                  updateField("loadContextLength", e.target.value)
                }
                className="h-8 text-xs"
                type="number"
              />
            </FieldRow>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              customFields
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <label className="flex items-center gap-2 text-xs">
              <Switch
                checked={form.enableThinkingField}
                onCheckedChange={(v) =>
                  updateField("enableThinkingField", Boolean(v))
                }
              />
              <span>Add `enableThinking` custom field</span>
            </label>
            <p className="text-[10px] text-muted-foreground">
              When enabled, emits the `customFields` block that toggles an
              `enable_thinking` Jinja variable, matching the LM Studio example.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Right: code outputs */}
      <div className="space-y-4">
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-2">
              <IconFileCode className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-semibold">
                Generated files
              </CardTitle>
            </div>
            <div className="flex gap-2">
              <Button
                size="xs"
                variant="outline"
                className="h-7 px-2 text-[11px]"
                onClick={() => handleCopy(modelYaml)}
              >
                Copy model.yaml
              </Button>
              <Button
                size="xs"
                variant="outline"
                className="h-7 px-2 text-[11px]"
                onClick={() => handleCopy(manifestJson)}
              >
                Copy manifest.json
              </Button>
            </div>
          </CardHeader>
          <CardContent className="h-[calc(100vh-220px)] space-y-3 text-xs md:h-[calc(100vh-180px)]">
            <Tabs defaultValue="yaml" className="flex h-full flex-col">
              <TabsList className="mb-2 w-full justify-start gap-1">
                <TabsTrigger value="yaml" className="flex items-center gap-1">
                  <IconFileCode className="h-3 w-3" />
                  <span className="text-[11px]">model.yaml</span>
                </TabsTrigger>
                <TabsTrigger
                  value="manifest"
                  className="flex items-center gap-1"
                >
                  <IconJson className="h-3 w-3" />
                  <span className="text-[11px]">manifest.json</span>
                </TabsTrigger>
              </TabsList>
              <TabsContent
                value="yaml"
                className="flex-1 overflow-hidden rounded-md border bg-muted p-0"
              >
                <pre className="h-full overflow-auto p-3 text-[11px] leading-relaxed">
                  {modelYaml}
                </pre>
              </TabsContent>
              <TabsContent
                value="manifest"
                className="flex-1 overflow-hidden rounded-md border bg-muted p-0"
              >
                <pre className="h-full overflow-auto p-3 text-[11px] leading-relaxed">
                  {manifestJson}
                </pre>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ModelEditor;

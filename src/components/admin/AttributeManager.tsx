"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash, GripVertical } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AttributeManagerProps {
  value: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
}

const COMMON_ATTRIBUTES = [
  "Color",
  "Size",
  "Material",
  "Base Type",
  "Hair Type",
  "Density",
  "Length",
];

export function AttributeManager({ value, onChange }: AttributeManagerProps) {
  const [attributes, setAttributes] = useState<{ key: string; val: string }[]>([]);

  useEffect(() => {
    if (value) {
      const formatted = Object.entries(value).map(([key, val]) => ({ key, val }));
      setAttributes(formatted);
    }
  }, [value]); // Caution: this might cause loops if onChange creates new object reference

  const updateParent = (newAttrs: { key: string; val: string }[]) => {
    const obj: Record<string, string> = {};
    newAttrs.forEach((attr) => {
      if (attr.key) obj[attr.key] = attr.val;
    });
    onChange(obj);
  };

  const addAttribute = () => {
    const newAttrs = [...attributes, { key: "", val: "" }];
    setAttributes(newAttrs);
    // Don't update parent yet until key is set
  };

  const removeAttribute = (index: number) => {
    const newAttrs = attributes.filter((_, i) => i !== index);
    setAttributes(newAttrs);
    updateParent(newAttrs);
  };

  const handleChange = (index: number, field: "key" | "val", newValue: string) => {
    const newAttrs = [...attributes];
    newAttrs[index][field] = newValue;
    setAttributes(newAttrs);
    updateParent(newAttrs);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Product Attributes</Label>
        <Button type="button" variant="outline" size="sm" onClick={addAttribute}>
          <Plus className="mr-2 h-4 w-4" /> Add Attribute
        </Button>
      </div>

      {attributes.length === 0 && (
        <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
          No attributes added. Add details like Color, Size, etc.
        </div>
      )}

      <div className="space-y-2">
        {attributes.map((attr, index) => (
          <div key={index} className="flex items-start gap-2">
            <div className="mt-2.5 cursor-grab text-muted-foreground">
              <GripVertical className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <Select
                value={COMMON_ATTRIBUTES.includes(attr.key) ? attr.key : "custom"}
                onValueChange={(val) => {
                   if (val === "custom") {
                     handleChange(index, "key", "");
                   } else {
                     handleChange(index, "key", val);
                   }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Attribute Name" />
                </SelectTrigger>
                <SelectContent>
                  {COMMON_ATTRIBUTES.map((common) => (
                    <SelectItem key={common} value={common}>
                      {common}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Custom...</SelectItem>
                </SelectContent>
              </Select>
              {!COMMON_ATTRIBUTES.includes(attr.key) && (
                 <Input
                   className="mt-2"
                   placeholder="Enter custom name"
                   value={attr.key}
                   onChange={(e) => handleChange(index, "key", e.target.value)}
                 />
              )}
            </div>
            <div className="flex-1">
              <Input
                placeholder="Value (e.g., Red, XL)"
                value={attr.val}
                onChange={(e) => handleChange(index, "val", e.target.value)}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-destructive"
              onClick={() => removeAttribute(index)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

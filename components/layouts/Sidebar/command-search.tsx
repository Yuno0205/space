"use client";

import type { LucideIcon } from "lucide-react";
import { useRef, useState } from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/utils";
import { useRouter } from "next/navigation";

export type CommandSearchItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  group?: string;
};

type CommandSearchProps = {
  items: CommandSearchItem[];
};

export function CommandSearch({ items }: CommandSearchProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const handleClose = () => {
    setOpen(false);
    setSearch("");
  };

  const groupedItems = items.reduce<Record<string, CommandSearchItem[]>>((acc, item) => {
    const key = item.group ?? "Pages";
    acc[key] ??= [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <div ref={containerRef} className="relative">
      <Command
        className={cn(
          "overflow-visible rounded-lg bg-background text-foreground border",
          open ? "border-border shadow-sm" : "border-transparent shadow-none",
          "[&_[cmdk-input-wrapper]]:border-b",
          open
            ? "[&_[cmdk-input-wrapper]]:border-b-border"
            : "[&_[cmdk-input-wrapper]]:border-b-transparent"
        )}
      >
        <CommandInput
          value={search}
          onValueChange={setSearch}
          placeholder="Search..."
          onFocus={() => setOpen(true)}
          onBlur={() => {
            setTimeout(() => {
              if (!containerRef.current?.contains(document.activeElement)) {
                handleClose();
              }
            }, 150);
          }}
        />
        {open && (
          <CommandList className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[300px] rounded-lg border bg-popover shadow-md outline-none border-none">
            <CommandEmpty>No results found.</CommandEmpty>
            {Object.entries(groupedItems).map(([group, groupItems]) => (
              <CommandGroup key={group} heading={group}>
                {groupItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <CommandItem
                      key={item.href}
                      value={`${item.group ?? ""} ${item.title}`}
                      onSelect={() => {
                        handleClose();
                        router.push(item.href);
                      }}
                      onMouseDown={(e) => e.preventDefault()}
                      // asChild
                      className="cursor-pointer"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ))}
          </CommandList>
        )}
      </Command>
    </div>
  );
}

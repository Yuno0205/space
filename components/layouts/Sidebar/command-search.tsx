"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
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
        value={search}
        onValueChange={setSearch}
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
                      onSelect={handleClose}
                      onMouseDown={(e) => e.preventDefault()}
                      asChild
                      className="cursor-pointer"
                    >
                      <Link href={item.href}>
                        <Icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
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

"use client";

import { Fragment, useState } from "react";
import { Dialog, Combobox, Transition } from "@headlessui/react";
import { Search } from "lucide-react";
import clsx from "clsx";

interface Props {
  open: boolean;
  onClose: () => void;
}

type Item = { id: number; name: string; href: string };

const items: Item[] = [
  { id: 1, name: "Buy Cars", href: "/vehicles" },
  { id: 2, name: "Sell Your Car", href: "/sell" },
  { id: 3, name: "Dealers", href: "/dealers" },
  { id: 4, name: "Financing", href: "/financing" },
  { id: 5, name: "About", href: "/about" },
];

export default function CommandPalette({ open, onClose }: Props) {
  const [query, setQuery] = useState("");

  const filtered =
    query === ""
      ? items
      : items.filter((i) =>
          i.name.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <Transition.Root show={open} as={Fragment} afterLeave={onClose}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-100"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-75"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-start justify-center pt-24">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-100"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-75"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-lg rounded-xl bg-white dark:bg-slate-900 shadow-xl ring-1 ring-slate-500/10">
              <Combobox
                as="div"
                onChange={(item: Item) => {
                  window.location.href = item.href;
                }}
              >
                <div className="relative">
                  <Search className="absolute top-3 left-3 w-5 h-5 text-slate-400" />
                  <Combobox.Input
                    className="w-full pl-10 pr-4 py-3 bg-transparent text-sm outline-none"
                    placeholder="Search…"
                    autoFocus
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                {filtered.length > 0 ? (
                  <Combobox.Options static className="max-h-60 overflow-y-auto">
                    {filtered.map((item) => (
                      <Combobox.Option
                        key={item.id}
                        value={item}
                        className={({ active }) =>
                          clsx(
                            "cursor-pointer px-4 py-2 text-sm",
                            active
                              ? "bg-primary text-white"
                              : "text-slate-700 dark:text-slate-100"
                          )
                        }
                      >
                        {item.name}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                ) : (
                  <p className="px-4 py-3 text-sm text-slate-500">No results.</p>
                )}
              </Combobox>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

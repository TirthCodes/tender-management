"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "./input";
import { PlusCircle } from "lucide-react";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Dialog } from "./dialog";
import { Option } from "@/lib/types/common";
// import { Response, useDynamicQuery } from "@/hooks/useDynamicQuery";

interface AutoCompleteInputProps {
  selectedValue: Option;
  data: Option[];
  title: string;
  // getQuery?: () => Promise<Response>;
  widthClass: string;
  handleValueChange: (value: Option) => void;
  createDialogContent?: React.ReactNode;
}

const AutoCompleteInput: React.FC<AutoCompleteInputProps> = ({
  selectedValue,
  title,
  data,
  // getQuery,
  widthClass,
  handleValueChange,
  createDialogContent,
}) => {
  const [inputValue, setInputValue] = useState(
    selectedValue?.stShortName ? selectedValue.stShortName : ""
  );
  const [filteredData, setFilteredData] = useState<Option[]>([] as Option[]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  // const [shouldFetch, setShouldFetch] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const previousCreateDialogOpen = useRef(false);

  // useEffect(() => {
  //   setInputValue(selectedValue?.label ? selectedValue.label : "");
  // }, [selectedValue])

  useEffect(() => {
    if (data && data.length > 0) {
      setFilteredData(data);
      if (inputValue === "") {
        handleValueChange({ stShortName: "", id: 0 });
      } else {
        const filtered = filteredData.filter((item) =>
          item.stShortName.toLowerCase().includes(inputValue?.toLowerCase())
        );
        setFilteredData(filtered);
      }
    }
  }, [inputValue, data]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (showDropdown) {
        if (event.key === "ArrowDown") {
          event.preventDefault();
          setFocusedIndex((prev) =>
            Math.min(prev + 1, filteredData.length - 1)
          );
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          setFocusedIndex((prev) => Math.max(prev - 1, 0));
        } else if (event.key === "Enter" && focusedIndex >= 0) {
          event.preventDefault();
          const selectedItem = filteredData[focusedIndex];
          if (selectedItem) handleItemClick(selectedItem);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showDropdown, filteredData, focusedIndex]);

  useEffect(() => {
    if (focusedIndex >= 0 && itemRefs.current[focusedIndex]) {
      itemRefs.current[focusedIndex]?.scrollIntoView({
        block: "nearest",
        inline: "nearest",
      });
    }
  }, [focusedIndex]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setShowDropdown(true);
    setFocusedIndex(-1);
  };

  const handleItemClick = (item: Option) => {
    setInputValue(item.stShortName);
    setShowDropdown(false);
    handleValueChange(item);
  };

  // useEffectAfterMount(() => {
  //   if (!createDialogOpen) {
  //     console.log("shouldFetch", shouldFetch, "createDialogOpen", createDialogOpen);
  //     setShouldFetch(true);
  //     setTimeout(() => setShowDropdown(false), 200);
  //   }
  // }, [createDialogOpen]);

  useEffect(() => {
    if (previousCreateDialogOpen.current && !createDialogOpen) {
      setTimeout(() => setShowDropdown(false), 200);
    }
    previousCreateDialogOpen.current = createDialogOpen;
  }, [createDialogOpen]);

  // const useQuery = useDynamicQuery(
  //   title.toLowerCase(),
  //   () =>
  //     getQuery?.() ??
  //     Promise.resolve({ message: "", data: [], success: false }),
  //   false
  // );

  // useEffect(() => {
  //   const response = useQuery.data?.data;
  //   if (response && response?.length > 0 && !useQuery.isLoading) {
  //     setFilteredData(response as Option[]);
  //   }
  // }, [useQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        if (!createDialogOpen) {
          setShowDropdown(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [createDialogOpen]);

  return (
    <div ref={dropdownRef} className={`"relative bg-white ${widthClass ? widthClass : "w-full"}`}>
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setShowDropdown(true)}
        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
        placeholder={`Select ${title}`}
      />
      {/* <div className="absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none">
        <ChevronsUpDown className="opacity-50 h-4 w-4" />
      </div> */}
      {showDropdown && filteredData.length > 0 ? (
        <ul className={`absolute z-50 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto ${widthClass ? widthClass : "w-full"}`}>
          {filteredData.map((item, index) => (
            <li
              key={item.stShortName}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              onClick={() => handleItemClick(item)}
              className={`h-10 p-2 cursor-pointer hover:bg-gray-100 flex items-center border-b ${
                focusedIndex === index ? "bg-gray-100" : ""
              }`}
            >
              <span className="font-semibold text-lg">{item.stShortName}</span>
            </li>
          ))}
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger onClick={() => setCreateDialogOpen(true)} asChild>
              <div className={`p-2 cursor-pointer bg-white h-9 flex items-center gap-2 border-b ${widthClass ? widthClass : "w-full"}`}>
                <PlusCircle className="h-5 w-5" /> Create
              </div>
            </DialogTrigger>
            {createDialogContent}
          </Dialog>
        </ul>
      ) : (
        <>
          {showDropdown ? (
            <div className={`absolute z-[100] bg-white mt-1 border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto ${widthClass ? widthClass : "w-full"}`}>
              <Dialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
              >
                <DialogTrigger
                  onClick={() => setCreateDialogOpen(true)}
                  asChild
                >
                  <div className="p-2 cursor-pointer h-9 flex items-center gap-2 border-b">
                    <PlusCircle className="h-5 w-5" /> Create
                  </div>
                </DialogTrigger>
                {createDialogContent}
              </Dialog>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};

export default AutoCompleteInput;

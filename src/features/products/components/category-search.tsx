
import { useCategoryLeaveSearch } from "@/features/products/hooks/use-categories";
import { Category } from "@/features/products/types";
import { MagicSearch, DisplayItem } from "@grab/seller-ui/components/magic-search";
import { Input } from "@grab/seller-ui/components/input";
import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { ComponentPropsWithoutRef } from 'react';
import { HateoasLink } from "@/types";

export type CategoryPickerProps = {
    link: HateoasLink
    onChange: (category: Category) => void;
    value: string;
}

export default function CategorySearch({ link, value, onChange, ...inputProps }: ComponentPropsWithoutRef<typeof Input> & CategoryPickerProps) {
    const [query, setQuery] = useState<string>(value);
    const { data, isLoading } = useCategoryLeaveSearch(link, query);

    const items: DisplayItem[] = data?.leaves?.map((leaf) => ({
        id: leaf.id,
        name: leaf.name,
    })) ?? [];

    useEffect(() =>
        setQuery(value),
        [value])

    return (
        <MagicSearch
            items={items}
            onQueryChange={setQuery}
            onQueryClear={() => {
                onChange({id:"",name:""});
            }}
            onSelect={(item) => onChange({ id: item.id, name: item.name })}
            isLoading={isLoading}
            initialQuery={value}
            renderInput={(props) => (
                <div className="relative">
                    <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        {...inputProps}
                        {...props}
                        type="text"
                        placeholder="Search category"
                        id="category-search"
                        className="pl-9"
                    />
                </div>
            )}
        />
    );
}

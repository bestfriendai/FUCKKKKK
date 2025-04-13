// WhatToDoAI/mobile/src/components/SearchBar.tsx

import React, { useState } from 'react';
import { XStack, Input, Button } from 'tamagui';
import { Search, X } from 'lucide-react-native'; // Use appropriate icons

interface SearchBarProps {
    placeholder?: string;
    onSearch: (query: string) => void;
    initialQuery?: string;
    onChangeQuery?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
    placeholder = "Search...",
    onSearch,
    initialQuery = '',
    onChangeQuery,
}) => {
    const [query, setQuery] = useState(initialQuery);

    const handleTextChange = (text: string) => {
        setQuery(text);
        onChangeQuery?.(text); // Notify parent if needed
    };

    const handleClear = () => {
        setQuery('');
        onChangeQuery?.('');
        // Optionally trigger search with empty query or just clear
        // onSearch('');
    };

    const handleSubmit = () => {
        onSearch(query);
    };

    return (
        <XStack alignItems="center" width="100%" gap="$2">
            <Input
                flex={1}
                placeholder={placeholder}
                value={query}
                onChangeText={handleTextChange}
                onSubmitEditing={handleSubmit} // Trigger search on keyboard submit
                returnKeyType="search"
                size="$4"
                borderRadius="$4"
                icon={<Search size={18} />}
                clearButton={query.length > 0}
                onClear={handleClear}
            />
            {/* Optional: Add a separate search button if needed */}
            {/*
            <Button onPress={handleSubmit} size="$4">
                Search
            </Button>
            */}
        </XStack>
    );
};

export default SearchBar;

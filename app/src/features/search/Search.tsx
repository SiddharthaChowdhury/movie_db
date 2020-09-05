import React from "react";
import { Grid } from "@material-ui/core";
import "./search.scss";

interface SearchProps {
    value: string;
    onChange: (value: string) => void;
    onSearch: () => void;
}

export const Search: React.FC<SearchProps> = ({value, onChange, onSearch}) => {
    return (
        <Grid item={true} className={'searchContainer'} data-test={'search-container'}>
            <input placeholder={'Movie in your mind'} type={'search'} value={value} onChange={e => onChange(e.target.value)} />
            <button onClick={onSearch}>Search</button>
        </Grid>
    );
}
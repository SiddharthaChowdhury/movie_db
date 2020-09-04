import { IMovieInfo } from "./features/IMovieInfo";

export enum TypeActionApp {
    SetMovies = "Set > Movies",
    SetFav = "Set > Fav",
    SetSearch = "Set > Search"
}

export interface IActionSearch {
    type: TypeActionApp;
    payload: any;
}

export interface IAppReducer {
    searchKey: string;
    results: IMovieInfo[];
    fav: IMovieInfo[];
    total: number;
}

export const initialState: IAppReducer = {
    searchKey: '',
    total: 0,
    results: [],
    fav: []
}

export const appReducer = (state: IAppReducer = initialState, action: IActionSearch): IAppReducer => {
    switch(action.type){
        case TypeActionApp.SetMovies:
            return {
                ...state,
                results: action.payload.results,
                total: action.payload.total
            };
        case TypeActionApp.SetFav:
            return {
                ...state,
                fav: action.payload
            };
        case TypeActionApp.SetSearch:
            return {
                ...state,
                searchKey: action.payload
            };
        default: 
            return state;
    }
}

export const MOVIE_API = `https://api.themoviedb.org/3/search/movie?api_key=a257cb70fbd6771ad887d607b4234e5c&include_adult=false`;
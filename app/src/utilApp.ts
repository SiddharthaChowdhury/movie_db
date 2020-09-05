import { IMovieInfo } from "./features/IMovieInfo";

export enum TypeActionApp {
    SetMovies = "Set > Movies",
    SetFav = "Set > Fav",
    SetSearch = "Set > Search",
    SetView = "Set > View",
    Loading = "Loading > Search"
}

export interface IActionSearch {
    type: TypeActionApp;
    payload: any;
}

export enum IdAppView {
    Search,
    Favourite
}
export interface IAppReducer {
    searchKey: string;
    results: IMovieInfo[];
    fav: {[id: string]: IMovieInfo};
    total: number;
    isLoading?: boolean;
    view: IdAppView
}

export const initialState: IAppReducer = {
    searchKey: '',
    total: 0,
    results: [],
    fav: {},
    view: IdAppView.Search
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
            if (state.fav[action.payload.id]) {
                const update = {...state.fav}
                delete update[action.payload.id];

                return {
                    ...state,
                    fav: {...update}
                }
            } else {
                return {
                    ...state,
                    fav: {
                        ...state.fav,
                        [action.payload.id]: action.payload
                    }
                }
            }
        case TypeActionApp.SetView:
            return {
                ...state,
                view: action.payload
            };
        case TypeActionApp.Loading:
            return {
                ...state,
                isLoading: action.payload
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
import { IMovieInfo } from "./features/IMovieInfo";
import axios from "axios";

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

class UtilApp {
    public initialState: IAppReducer = {
        searchKey: '',
        total: 0,
        results: [],
        fav: {},
        view: IdAppView.Search
    }

    public appReducer = (state: IAppReducer = this.initialState, action: IActionSearch): IAppReducer => {
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

    public appGetMovies = (key: string, total: number, storeDispatch: any) => {
        const MOVIE_API = `https://api.themoviedb.org/3/search/movie?api_key=a257cb70fbd6771ad887d607b4234e5c&include_adult=false`;
        axios.get(MOVIE_API, { 
            params: {
                query: key,
                total,
            }
        })
        .then(function ({data: {total_results, results}}: any) {
            storeDispatch({type: TypeActionApp.SetMovies, payload: {
                total: total_results,
                results: results.map((entry: any): IMovieInfo => ({
                    poster: entry.poster_path ? `https://image.tmdb.org/t/p/w200${entry.poster_path}` : null,
                    id: entry.id,
                    overview: entry.overview,
                    title: entry.title,
                    release_date: entry.release_date,
                    vote_count: entry.vote_count,
                    vote_average: entry.vote_average
                }))
            }})
    
            storeDispatch({type: TypeActionApp.Loading, payload: false})
        })
        .catch(function () {
            //TODO: handle error
            storeDispatch({type: TypeActionApp.Loading, payload: false})
        })
    }
}

export const utilApp = new UtilApp();
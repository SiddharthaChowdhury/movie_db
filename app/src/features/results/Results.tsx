import React from "react";
import { Grid } from "@material-ui/core";
import {WatchLaterOutlined, WatchLater, ReportProblem} from "@material-ui/icons";
import "./results.scss";
import { IMovieInfo } from "../IMovieInfo";

interface SearchProps {
    results: IMovieInfo[];
    // onSearch: () => void;
}

export const Results: React.FC<SearchProps> = ({results}) => {
    return (
        <Grid item={true} className={'movieList'}>
            {results.map((result:IMovieInfo, _key: number) => {
                return (
                    <div className={'movieList__item'} key={result.id}>
                        {result.poster 
                            ? <div className={'movieList__item--image'} style={{backgroundImage: `url(${result.poster})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center'}}/>
                            : <div className={'movieList__item--image'} title={'Poster missing'}> <ReportProblem/> </div>
                        }
                        
                        <div className={'movieList__item--body'}>
                            <div className={'result-title'}>
                                <label>
                                    <span>{_key + 1}.</span>
                                    <span>{result.title}</span>
                                    <span>({new Date(result.release_date).getFullYear()})</span>
                                </label>
                                <span>{result.isUserFav ? <WatchLater /> : <WatchLaterOutlined/>}</span>
                            </div>
                            <div className={'result-overview'}>
                                { result.overview.length < 400 ? result.overview : result.overview.substring(0, 400) + '..'}
                            </div>
                        </div>
                    </div>
                );
            })}
        </Grid>
    );
}
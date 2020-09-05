import React from "react";
import { Grid } from "@material-ui/core";
import {WatchLaterOutlined, WatchLater, ReportProblem, Star} from "@material-ui/icons";
import "./results.scss";
import { IMovieInfo } from "../IMovieInfo";
import { IdAppView } from "../../utilApp";

interface SearchProps {
    favList: {[id: string]: IMovieInfo};
    results: IMovieInfo[];
    onWatchLater: (movie: IMovieInfo) => void;
    view?: IdAppView;
}

export const Results: React.FC<SearchProps> = ({results, onWatchLater, favList, view}) => {

    let filteredResults = results;

    if(view === IdAppView.Favourite) {
        filteredResults = Object.values(favList);
    }

    return (
        <Grid item={true} className={'movieList'} data-test={'app-result-movies'}>
            {filteredResults.map((result: IMovieInfo, _key: number) => {
                return (
                    <div className={`movieList__item ${_key % 2 === 0 ? 'odd-Item': ''}`} key={result.id}>
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
                                <span data-test={'app-result-movies-setfav'} onClick={() => onWatchLater(result)}>{favList[result.id] ? <WatchLater /> : <WatchLaterOutlined/>}</span>
                            </div>
                            <div className={'result-overview'}>
                                { result.overview.length < 350 ? result.overview : result.overview.substring(0, 350) + '..'}
                            </div>
                            <div className={'result-meta'}>
                                <div className="result-meta__metric">
                                    <label>Average rating:</label>
                                    <span>{result.vote_average}</span>
                                    <Star/>
                                </div>
                                <span>|</span>
                                <div className="result-meta__metric">
                                    <label>Votes:</label>
                                    <span>{result.vote_count}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </Grid>
    );
}
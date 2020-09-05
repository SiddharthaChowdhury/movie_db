import React from 'react';
import {Grid} from '@material-ui/core';
import './app.scss';
import { appReducer, initialState, TypeActionApp, MOVIE_API, IdAppView } from './utilApp';
import { Search } from './features/search/Search';
import axios from "axios";
import { IMovieInfo } from './features/IMovieInfo';
import { Results } from './features/results/Results';

const App: React.FC<any> = () => {
	const [state, dispatch] = React.useReducer(appReducer, initialState);

	const fetchMovies = async () => {
		if(!state.searchKey) {
			return;
		}

		dispatch({type: TypeActionApp.Loading, payload: true})

		axios.get(MOVIE_API, {
			params: {
				query: state.searchKey,
				total: state.total
			}
		})
		.then(function ({data: {total_results, results}}) {
			dispatch({type: TypeActionApp.SetMovies, payload: {
				total: total_results,
				results: results.map((entry: any): IMovieInfo => ({
					poster: entry.poster_path ? `https://image.tmdb.org/t/p/w200${entry.poster_path}` : null,
					id: entry.id,
					overview: entry.overview,
					title: entry.title,
					release_date: entry.release_date,
					isUserFav: false
				}))
			}})

			dispatch({type: TypeActionApp.Loading, payload: false})
		})
		.catch(function (error) {
			// handle error
			console.log(error);
			dispatch({type: TypeActionApp.Loading, payload: false})
		})
	}

	return (
		<Grid container={true} justify={'center'} className={'app'}>
			<Grid item={true} md={4} sm={12} xs={12} className={'mainContainer'} >
				<div className={'mainContainer__topbar'}>
					<div>
						<h1>MovieDB.inc</h1>
						<p>Search movies for free</p>
					</div>
					<div>
						<button className={state.view === IdAppView.Search ? 'active': ''} onClick={() => dispatch({type: TypeActionApp.SetView, payload: IdAppView.Search})}>Search</button>
						<button className={state.view === IdAppView.Favourite ? 'active': ''} onClick={() => dispatch({type: TypeActionApp.SetView, payload: IdAppView.Favourite})}>My watchlist</button>
					</div>
				</div>
				<Search 
					value={state.searchKey} 
					onChange={(value: string) => dispatch({type: TypeActionApp.SetSearch, payload: value})}
					onSearch={fetchMovies}
				/>
				{state.isLoading 
					? <div className="app-loading"> Loading ...</div> 
				: state.isLoading === false 
					? (
						<div className="app-loading">
							Showing result: {state.results.length}/{state.total}
						</div>
					)
					: null
				 }
				<Results results={state.results}/>
			</Grid>
		</Grid>
	);
}

export default App;

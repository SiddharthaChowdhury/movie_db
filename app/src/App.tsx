import React from 'react';
import {Grid} from '@material-ui/core';
import './app.scss';
import { appReducer, initialState, TypeActionApp, MOVIE_API } from './utilApp';
import { Search } from './features/search/Search';
import axios from "axios";
import { IMovieInfo } from './features/IMovieInfo';

const App: React.FC<any> = () => {
	const [state, dispatch] = React.useReducer(appReducer, initialState);

	const fetchMovies = async () => {
		if(!state.searchKey) {
			return;
		}

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
					poster: `https://image.tmdb.org/t/p/w200${entry.poster_path}`,
					id: entry.id,
					overview: entry.overview,
					title: entry.title,
					release_date: entry.release_date,
					isUserFav: false
				}))
			}})
		})
		.catch(function (error) {
			// handle error
			console.log(error);
		})
	}

	return (
		<Grid container={true} justify={'center'}>
			<Grid item={true} md={4} sm={12} xs={12} className={'mainContainer'} >
				<h1>hello</h1>
				<Search 
					value={state.searchKey} 
					onChange={(value: string) => dispatch({type: TypeActionApp.SetSearch, payload: value})}
					onSearch={fetchMovies}
				/>
			</Grid>
		</Grid>
	);
}

export default App;

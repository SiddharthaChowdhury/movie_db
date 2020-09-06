import React from 'react';
import {Grid} from '@material-ui/core';
import './app.scss';import { Search } from './features/search/Search';
import { IMovieInfo } from './features/IMovieInfo';
import { Results } from './features/results/Results';
import { WatchLaterOutlined } from '@material-ui/icons';
import { utilApp, TypeActionApp, IdAppView } from './utilApp';

const App: React.FC<any> = () => {
	const [state, dispatch] = React.useReducer(utilApp.appReducer, utilApp.initialState);

	const fetchMovies = async () => {
		dispatch({type: TypeActionApp.SetView, payload: IdAppView.Search})
		if(!state.searchKey) {
			dispatch({type: TypeActionApp.SetMovies, payload: {results: [], total: 0}})
			return;
		}

		dispatch({type: TypeActionApp.Loading, payload: true})

		utilApp.appGetMovies(state.searchKey, state.total, dispatch);
	}

	const favCount = Object.keys(state.fav).length;

	return (
		<Grid container={true} justify={'center'} className={'app'} data-test={'app-container'}>
			<Grid item={true} md={4} sm={12} xs={12} className={'mainContainer'} >
				<div data-test={'app-nav'} className={'mainContainer__topbar'}>
					<div>
						<h1>MovieDB.inc</h1>
						<p>Search movies for free</p>
					</div>
					<div>
						<button title={'Search movies'} data-test={'app-search-btn'} className={state.view === IdAppView.Search ? 'active': ''} onClick={() => dispatch({type: TypeActionApp.SetView, payload: IdAppView.Search})}>
							Search
						</button>
						<button title={'Watch later'} data-test={'app-fav-btn'} className={state.view === IdAppView.Favourite ? 'active': ''} onClick={() => dispatch({type: TypeActionApp.SetView, payload: IdAppView.Favourite})}>
							<WatchLaterOutlined/>
							{( favCount > 0) && 
								<div className={'favCount'}>{favCount}</div>
							}
						</button>
					</div>
				</div>
				<Search 
					value={state.searchKey} 
					onChangeText={(value: string) => dispatch({type: TypeActionApp.SetSearch, payload: value})}
					onSearch={fetchMovies}
				/>
				{(state.isLoading)
					? <div className="app-loading"> Loading ...</div> 
					: state.isLoading === false 
						? (
							<div className="app-loading">
								{state.view === IdAppView.Search 
									? <>Showing result: {state.results.length}/{state.total}</>
									: <>Movies in watchlist: {favCount}</>
								}
								
							</div>
						)
						: null
				 }
				<Results 
					view={state.view}
					favList={state.fav}
					results={state.results} 
					onWatchLater={(movie: IMovieInfo) => dispatch({type: TypeActionApp.SetFav, payload: movie})}
				/>
			</Grid>
		</Grid>
	);
}

export default App;

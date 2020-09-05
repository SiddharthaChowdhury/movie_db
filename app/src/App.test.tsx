import React from 'react';
import App from './App';
import { ShallowWrapper} from 'enzyme';
import { utilApp, TypeActionApp, IdAppView } from './utilApp';
import { setupShallow, getElementByTestAttr, setupMount } from './test/utilTest';

describe('App component test', () => {
	let wrapper: ShallowWrapper;

	beforeEach(() => {
		wrapper = setupShallow({component: App, props: {}});
	})

  	test('Should load component successfully', () => {
		const appContainer = getElementByTestAttr(wrapper, 'app-container')
		expect(appContainer.length).toBe(1);
	})

	test('Should load top nav with 2 buttons', () => {
		const appNav = getElementByTestAttr(wrapper, 'app-nav')
		expect(appNav.length).toBe(1);
		expect(appNav.find('button').length).toBe(2);
	})

	test('Search button should be active', () => {
		const appNav = getElementByTestAttr(wrapper, 'app-nav')
		expect(appNav.find('button.active').text()).toBe('Search');
	});
});

describe('App state test using useReducer', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	test('Should change current view on nav buttons click', () => {
		const mock_Dispatch = jest.fn();
		React.useReducer = jest.fn(() => [utilApp.initialState, mock_Dispatch]);

		const wrapper = setupMount({component: App, props: {}});
		const appFavBtn = getElementByTestAttr(wrapper, 'app-fav-btn');
		const appSearchBtn = getElementByTestAttr(wrapper, 'app-search-btn');

		expect(appFavBtn.length).toBe(1);
		appFavBtn.simulate('click');
		expect(mock_Dispatch).toHaveBeenCalledWith({type: TypeActionApp.SetView, payload: IdAppView.Favourite});

		expect(appSearchBtn.length).toBe(1);
		appSearchBtn.simulate('click');
		expect(mock_Dispatch).toHaveBeenCalledWith({type: TypeActionApp.SetView, payload: IdAppView.Search});
	});
});

describe('App movie search test', () => {
	beforeEach(function () {
	})
	afterEach(() => {
		jest.clearAllMocks();
	})

	test('Should change state on input change', () => {
		const mock_Dispatch = jest.fn();
		React.useReducer = jest.fn(() => [utilApp.initialState, mock_Dispatch]);

		const wrapper = setupMount({component: App, props: {}});
		const searchInput = getElementByTestAttr(wrapper, 'search-container').find('input');
		const mockEvent = {target: {value: 'Hobbits'}};

		searchInput.simulate('change', mockEvent);

		expect(mock_Dispatch).toHaveBeenCalledWith({payload: "Hobbits", type: TypeActionApp.SetSearch});
	})

	test('Should trigger no API request on search with keyword empty', () => {
		let promise = Promise.resolve()
		const mock_Dispatch = jest.fn();
		React.useReducer = jest.fn(() => [utilApp.initialState, mock_Dispatch]);

		const wrapper = setupMount({component: App, props: {}});
		const searchBtn = getElementByTestAttr(wrapper, 'search-container').find('button');

		expect(searchBtn.length).toBe(1);

		const mock_getMovies = jest.fn(() => promise);
		utilApp.appGetMovies = mock_getMovies;

		searchBtn.simulate('click')

		expect(mock_getMovies).toHaveBeenCalledTimes(0); // because empty keyword
		expect(mock_Dispatch).toHaveBeenCalledTimes(2);
		expect(mock_Dispatch).toHaveBeenCalledWith({type: TypeActionApp.SetView, payload: IdAppView.Search})
		expect(mock_Dispatch).toHaveBeenCalledWith({type: TypeActionApp.SetMovies, payload: {results: [], total: 0}})
	});

	test('Should trigger API request on search with keyword', () => {
		const mock_Dispatch = jest.fn();
		React.useReducer = jest.fn(() => [{...utilApp.initialState, searchKey: 'Hobbits'}, mock_Dispatch]); // Adding search key

		const wrapper = setupMount({component: App, props: {}});
		const searchBtn = getElementByTestAttr(wrapper, 'search-container').find('button');

		expect(searchBtn.length).toBe(1);

		const mock_getMovies = jest.fn();
		utilApp.appGetMovies = mock_getMovies;

		searchBtn.simulate('click')

		expect(mock_getMovies).toHaveBeenCalledTimes(1); // because NON_Empty keyword
		expect(mock_getMovies).toHaveBeenCalledWith('Hobbits', utilApp.initialState.total, mock_Dispatch);
	});
})

describe('App setting watch later btn test', () => {
	beforeEach(function () {
	})
	afterEach(() => {
		jest.clearAllMocks();
	})

	test('Should trigger API request on search with keyword', () => {
		const mock_Dispatch = jest.fn();
		React.useReducer = jest.fn(() => [{...utilApp.initialState, searchKey: 'Hobbits', results: mockMovies, total: 1}, mock_Dispatch]); // Adding search key

		const wrapper = setupMount({component: App, props: {}});
		const setFavBtn = getElementByTestAttr(wrapper, 'app-result-movies-setfav');

		expect(setFavBtn.length).toBe(1);

		setFavBtn.simulate('click', mockMovies[0]);

		expect(mock_Dispatch).toHaveBeenCalledTimes(1);
		expect(mock_Dispatch).toHaveBeenCalledWith({type: TypeActionApp.SetFav, payload: mockMovies[0]});
	});
})

const mockMovies = [
    {
        "poster": "https://image.tmdb.org/t/p/w200/poster.jpg",
        "id": 150584,
        "overview": "In an age long ago...",
        "title": "Clash of the Empires",
        "release_date": "2012-11-13",
        "vote_count": 22,
        "vote_average": 2.5
    }
];
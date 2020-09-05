import React from 'react';
import {Results} from './Results';
import { ShallowWrapper} from 'enzyme';
import { setupShallow, getElementByTestAttr, ISetupConf } from '../../test/utilTest';
import { IdAppView } from '../../utilApp';

describe('Testing component Search', () => {
    let wrapper: ShallowWrapper;
    let mock_OnWatchLater: jest.Mock;
    const setupConf: ISetupConf = {component: Results, props: {}}

    beforeEach(() => {
        mock_OnWatchLater = jest.fn();
        setupConf.props.onWatchLater = mock_OnWatchLater;
    })

    afterEach(() => {
        jest.clearAllMocks();
    })

    test('Should render correctly for view Results', () => {
        wrapper = setupShallow({...setupConf, props: {
            ...setupConf.props,
            results: mockMovies,
            favList: {}
        }})

        expect(getElementByTestAttr(wrapper, 'app-result-movies').find('.movieList__item').length).toBe(1);
    })

    test('Should call correct prop on click addToWatchList', () => {
        wrapper = setupShallow({...setupConf, props: {
            ...setupConf.props,
            results: mockMovies,
            favList: {}
        }})

        const addToWatchListBtn = getElementByTestAttr(wrapper, 'app-result-movies-setfav')
        expect(addToWatchListBtn.length).toBe(1);

        addToWatchListBtn.simulate('click');

        expect(mock_OnWatchLater).toHaveBeenCalledWith(mockMovies[0]);
    })

    test('Should render when view is WatchList/Favourite', () => {
        wrapper = setupShallow({...setupConf, props: {
            ...setupConf.props,
            results: mockMovies,
            favList: mockFav,
            view: IdAppView.Favourite
        }})

        expect(getElementByTestAttr(wrapper, 'app-result-movies').find('.movieList__item').length).toBe(2);
    })
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

const mockFav = {
    "123": {
        "poster": "https://image.tmdb.org/t/p/w200/poster.jpg",
        "id": 123,
        "overview": "In an age long ago...",
        "title": "Hobbits",
        "release_date": "2012-11-13",
        "vote_count": 22,
        "vote_average": 2.5
    },
    "456": {
        "poster": "https://image.tmdb.org/t/p/w200/poster.jpg",
        "id": 456,
        "overview": "In an age long ago...",
        "title": "Hobbits",
        "release_date": "2012-11-13",
        "vote_count": 22,
        "vote_average": 2.5
    }
};
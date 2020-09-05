import moxios from 'moxios'
import { utilApp, TypeActionApp, IdAppView } from './utilApp'

jest.clearAllMocks()
describe('UtilApp tests', () => {
    describe('Testing reducer function', () => {
        test('Testing case TypeAction.SetMovies', () => {
            const newState = utilApp.appReducer(utilApp.initialState, {type: TypeActionApp.SetMovies, payload: {results: mockMovies, total: mockMovies.length}});

            expect(newState).toEqual({...utilApp.initialState, results: mockMovies, total: mockMovies.length})
        })

        test('Testing case TypeAction.SetFav', () => {
            const newState = utilApp.appReducer(utilApp.initialState, {type: TypeActionApp.SetFav, payload: mockMovies[0]});

            expect(newState).toEqual({...utilApp.initialState, fav: {
                [mockMovies[0].id]: mockMovies[0]
            }})

            const moreRecentState = utilApp.appReducer(newState, {type: TypeActionApp.SetFav, payload: mockMovies[0]});
            expect(moreRecentState).toEqual({...utilApp.initialState, fav: {}})
        })

        test('Testing case TypeAction.SetView', () => {
            const newState = utilApp.appReducer(utilApp.initialState, {type: TypeActionApp.SetView, payload: IdAppView.Favourite});

            expect(newState).toEqual({...utilApp.initialState, view: IdAppView.Favourite});
        })

        test('Testing case TypeAction.Loading', () => {
            const newState = utilApp.appReducer(utilApp.initialState, {type: TypeActionApp.Loading, payload: true});

            expect(newState).toEqual({...utilApp.initialState, isLoading: true});
        })

        test('Testing case TypeAction.SetSearch', () => {
            const newState = utilApp.appReducer(utilApp.initialState, {type: TypeActionApp.SetSearch, payload: 'Hobbits'});

            expect(newState).toEqual({...utilApp.initialState, searchKey: 'Hobbits'});
        })

        test('Testing case default', () => {
            const newState = utilApp.appReducer(utilApp.initialState, {type: '' as TypeActionApp, payload: null});

            expect(newState).toEqual(utilApp.initialState);
        })
    })

    describe('Testing appGetMovies() function', () => {
        beforeEach(function () {
            moxios.install()
        })
    
        afterEach(function () {
            moxios.uninstall()
            jest.clearAllMocks()
        })

        test('Should fetch correct movie data using axios', (done) => {
            const mockDispatch = jest.fn(() => {});
            utilApp.appGetMovies('Hobbits', 20, mockDispatch);

            moxios.wait(function () {
                let request = moxios.requests.mostRecent()
                request.respondWith({
                    status: 200,
                    response: mockMovies
                }).then(function (resp) {
                    expect(resp.data).toEqual(mockMovies);
                    expect(mockDispatch).toHaveBeenCalledWith({type: TypeActionApp.Loading, payload: false})
                    done()
                })
            })
        })
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
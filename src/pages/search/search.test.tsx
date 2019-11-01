import { createBrowserHistory } from 'history';
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createStore } from 'redux';

import { fireEvent, queryByAttribute, queryByTestId, render } from '@testing-library/react';

import rootReducer from '../../reducers/rootReducer';
import i18n from '../../translations/i18n';
import Search from './Search';

describe('Search', () => {
  let search: any;
  const store = createStore(rootReducer);
  const history = createBrowserHistory();

  beforeEach(() => {
    search = render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <Router history={history}>
            <Search />
          </Router>
        </I18nextProvider>
      </Provider>
    );
  });

  test('When the user searches with the search term Norway, the user is able to see the search results', () => {
    const searchInput = queryByTestId(search.container, 'search-input');
    fireEvent.change(searchInput!, { target: { value: 'Norway' } });
    fireEvent.keyDown(searchInput!, { key: 'Enter', code: 13 });
    const searchResults = queryByAttribute('class', search.container, 'search-results');
    expect(searchResults).toBeDefined();
  });
});

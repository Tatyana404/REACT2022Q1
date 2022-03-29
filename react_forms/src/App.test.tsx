import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import SearchBar from './Components/Home/SearchBar';
import Header from './Components/Shared/Header';
import Cards from './Components/Home/Cards';
import { saveToStorage } from './storage';
import NotFound from './Pages/NotFound';
import AboutUs from './Pages/AboutUs';
import Home from './Pages/Home';
import App from './App';

describe('Page rendering', () => {
  test('Home page render', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
  });

  test('AboutUs page render', () => {
    render(
      <BrowserRouter>
        <AboutUs />
      </BrowserRouter>
    );
  });

  test('NotFound page render', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );
  });
});

describe('Rendering Components', () => {
  test('App component render', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
  });

  test('Render component Header', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
  });

  test('Render component SearchBar', () => {
    render(<SearchBar />);
  });

  test('Render component Cards', () => {
    render(<Cards />);
  });
});

type StorageState = { [key: string]: string };

const fakeLocalStorage = (() => {
  let store: StorageState = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => (store[key] = value.toString()),
    removeItem: (key: string) => delete store[key],
    clear: () => (store = {}),
  };
})();

describe('Storage', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
      value: fakeLocalStorage,
    });
  });

  it('Saves the key to the storage', () => {
    saveToStorage('fake-value');

    expect(window.localStorage.getItem('the-key')).toEqual('fake-value');
  });
});

describe('Cards', () => {
  it('User cards render', () => {
    render(<Cards />);

    expect(screen.getAllByTestId('userСards').length).toBe(10);
  });

  it('Card render', () => {
    render(<Cards />);

    expect(screen.getAllByText(/Nickname:/i).length).toBe(10);
  });
});

describe('Display text on pages', () => {
  test('About Us Text Render', () => {
    render(
      <BrowserRouter>
        <AboutUs />
      </BrowserRouter>
    );

    expect(screen.getByText(/About Us/i)).toBeInTheDocument();
  });

  test('Text rendering on NotFound page', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );

    expect(screen.getByText(/Page not found/i)).toBeInTheDocument();
    expect(screen.getByText(/Back to the main page/i)).toBeInTheDocument();
  });
});

describe('Navigation', () => {
  test('Router', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    userEvent.click(screen.getByTestId('aboutLink'));
    expect(screen.getByTestId('aboutPage')).toBeInTheDocument();
    userEvent.click(screen.getByTestId('homeLink'));
    expect(screen.getByTestId('homePage')).toBeInTheDocument();
  });

  test('Getting to the error page', () => {
    render(
      <MemoryRouter initialEntries={['/non_existent_page']}>
        <NotFound />
      </MemoryRouter>
    );

    expect(screen.getByTestId('notFoundPage')).toBeInTheDocument();
  });
});

test('NotFound page contains a link', () => {
  render(
    <BrowserRouter>
      <NotFound />
    </BrowserRouter>
  );

  expect(screen.getByRole('link')).toBeInTheDocument();
});

test('Input event', () => {
  render(
    <BrowserRouter>
      <SearchBar />
    </BrowserRouter>
  );

  fireEvent.input(screen.getByTestId('input'), { target: { value: 'test-value' } });
  expect(screen.queryByTestId('input')).toContainHTML('test-value');
});

import type {AppProps} from 'next/app';
import {store} from '@/redux/store';
import {Provider} from 'react-redux';
import {SessionProvider} from 'next-auth/react';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../app/globals.css';

export default function App({Component, pageProps}: AppProps) {
    return (
        <Provider store={store}>
            <SessionProvider session={pageProps.session}>
                <Component {...pageProps} />
                <ToastContainer />
            </SessionProvider>
        </Provider>
    );
}
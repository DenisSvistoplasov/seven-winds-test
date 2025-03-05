import './App.style.scss'
import { Layout } from './components/Layout/Layout';

export function App() {
    const params = Object.entries({
        cc_load_policy: 0,
        controls: 2,
        fs: 0,
        rel: 0,
        showinfo: 0
    }).map(([key, value]) => `${key}=${value}`).join('&')

    return <Layout />
}

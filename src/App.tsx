import { HashRouter, Route, Routes } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { CheatsheetPage } from './pages/CheatsheetPage';
import { CheatsheetsIndex } from './pages/CheatsheetsIndex';
import { Dashboard } from './pages/Dashboard';
import { ExercisePage } from './pages/ExercisePage';
import { PatternPage } from './pages/PatternPage';
import { PatternsPage } from './pages/PatternsPage';
import { Playground } from './pages/Playground';
import { SettingsPage } from './pages/SettingsPage';

// HashRouter é obrigatório: GitHub Pages não suporta BrowserRouter (404 em rotas).
export default function App() {
  return (
    <HashRouter>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/cheatsheets" element={<CheatsheetsIndex />} />
            <Route path="/cheatsheets/:slug" element={<CheatsheetPage />} />
            <Route path="/padroes" element={<PatternsPage />} />
            <Route path="/padroes/:slug" element={<PatternPage />} />
            <Route path="/exercicio/:id" element={<ExercisePage />} />
            <Route path="/playground" element={<Playground />} />
            <Route path="/config" element={<SettingsPage />} />
            <Route
              path="*"
              element={<p className="text-zinc-500">Página não encontrada.</p>}
            />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}

import app from './services/firebase';
console.log('Firebase conectado:', app.name);
import './App.css'
import previewImage from './assets/preview.webp'
import downloadImage from './assets/download.webp'
import downloadImage1 from './assets/download-1.webp'
import previewBottomImage from './assets/preview-bottom.png'
import gridFourImage from './assets/grid-four.png'

function App() {
  return (
    <>
      <section className="hero-section" id="home">
        <img src={previewImage} alt="Foto do casal" className="hero-image" />

        <header className="hero-topbar">
          <div className="hero-brand">Lucas & Gladys</div>
          <nav className="hero-nav" aria-label="Navegacao principal">
            <a href="#home">Home</a>
            <a href="#sobre">Sobre o Casamento</a>
            <a href="#sobre">Nossa Historia</a>
            <a href="#duvidas">Painel de Duvidas</a>
          </nav>
        </header>

        <div className="hero-center-text">
          <p>Sabado, 30 de junho, 2026</p>
          <p>The Golden Elm Manor,</p>
          <p>St. Augustine, Salvador</p>
        </div>
      </section>

      <section className="duo-grid" id="sobre">
        <article className="duo-card">
          <img src={downloadImage} alt="Nossa historia" />
          <a href="#nossa-historia">Fotos do Casal</a>
        </article>
        <article className="duo-card">
          <img src={downloadImage1} alt="Sobre o casamento" />
          <a href="#o-que-levar">O que levar</a>
        </article>
        <article className="duo-card">
          <img src={previewBottomImage} alt="Painel de duvidas" />
          <a href="#nossa-historia">Nossa história</a>
        </article>
        <article className="duo-card">
          <img src={gridFourImage} alt="Fotos do casal" />
          <a href="#localizacao">Localização</a>
        </article>
      </section>
    </>
  )
}

export default App

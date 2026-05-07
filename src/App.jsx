import app from './services/firebase';
console.log('Firebase conectado:', app.name);
import { useEffect, useState } from 'react'
import './App.css'
import previewImage from './assets/preview.webp'
import downloadImage from './assets/download.webp'
import downloadImage1 from './assets/download-1.webp'
import previewBottomImage from './assets/preview-bottom.png'
import gridFourImage from './assets/grid-four.png'
import registroConvidadoImage from './assets/registro-convidado.jpg'
import giftCanistersImage from './assets/gift-canisters.jpeg'
import giftMirrorImage from './assets/gift-mirror.jpeg'
import giftPitcherImage from './assets/gift-pitcher.jpeg'
import giftSaltPepperImage from './assets/gift-salt-pepper.jpeg'
import giftHenBasketImage from './assets/gift-hen-basket.jpeg'
import giftUmbrellaBasketImage from './assets/gift-umbrella-basket.jpeg'
import giftLampImage from './assets/gift-lamp.jpeg'
import giftUtensilHolderImage from './assets/gift-utensil-holder.jpeg'
import giftMugRackImage from './assets/gift-mug-rack.jpeg'
import {
  ReservedGiftError,
  ensureGiftCatalog,
  listGifts,
  submitGuestRegistration,
} from './services/guestRegistry'

const localGiftCatalog = [
  {
    id: 'potes-vidro',
    name: 'Jogo de potes de vidro',
    storeUrl: 'https://lojaexemplo.com/potes-vidro',
    price: 'R$ 189,90',
    image: giftCanistersImage,
    position: 0,
  },
  {
    id: 'espelho-oval',
    name: 'Espelho oval de parede',
    storeUrl: 'https://lojaexemplo.com/espelho-oval',
    price: 'R$ 279,90',
    image: giftMirrorImage,
    position: 1,
  },
  {
    id: 'jarra-rosa',
    name: 'Jarra decorativa rosa',
    storeUrl: 'https://lojaexemplo.com/jarra-rosa',
    price: 'R$ 129,90',
    image: giftPitcherImage,
    position: 2,
  },
  {
    id: 'saleiro-pimenteiro',
    name: 'Jogo saleiro e pimenteiro',
    storeUrl: 'https://lojaexemplo.com/saleiro-pimenteiro',
    price: 'R$ 69,90',
    image: giftSaltPepperImage,
    position: 3,
  },
  {
    id: 'cesto-galinha',
    name: 'Cesto de ovos com galinha',
    storeUrl: 'https://lojaexemplo.com/cesto-galinha',
    price: 'R$ 159,90',
    image: giftHenBasketImage,
    position: 4,
  },
  {
    id: 'cesto-guarda-chuva',
    name: 'Cesto porta-guarda-chuvas',
    storeUrl: 'https://lojaexemplo.com/cesto-guarda-chuva',
    price: 'R$ 199,90',
    image: giftUmbrellaBasketImage,
    position: 5,
  },
  {
    id: 'abajur-vintage',
    name: 'Abajur vintage',
    storeUrl: 'https://lojaexemplo.com/abajur-vintage',
    price: 'R$ 219,90',
    image: giftLampImage,
    position: 6,
  },
  {
    id: 'porta-utensilios',
    name: 'Porta-utensilios floral',
    storeUrl: 'https://lojaexemplo.com/porta-utensilios',
    price: 'R$ 89,90',
    image: giftUtensilHolderImage,
    position: 7,
  },
  {
    id: 'suporte-canecas',
    name: 'Suporte rustico para canecas',
    storeUrl: 'https://lojaexemplo.com/suporte-canecas',
    price: 'R$ 169,90',
    image: giftMugRackImage,
    position: 8,
  },
]

const giftImageById = Object.fromEntries(
  localGiftCatalog.map((gift) => [gift.id, gift.image]),
)

function App() {
  const [currentScreen, setCurrentScreen] = useState('home')
  const [hasCompanion, setHasCompanion] = useState('')
  const [selectedGifts, setSelectedGifts] = useState([])
  const [gifts, setGifts] = useState([])
  const [isLoadingGifts, setIsLoadingGifts] = useState(true)
  const [isSubmittingRegistration, setIsSubmittingRegistration] = useState(false)
  const [registrationMessage, setRegistrationMessage] = useState('')
  const [registrationError, setRegistrationError] = useState('')

  const hydrateGifts = (giftRecords) =>
    giftRecords.map((gift) => ({
      ...gift,
      image: giftImageById[gift.id],
    }))

  useEffect(() => {
    let isMounted = true

    async function loadGiftCatalog() {
      setIsLoadingGifts(true)
      setRegistrationError('')

      try {
        const giftRecords = await ensureGiftCatalog(
          localGiftCatalog.map(({ image, ...gift }) => gift),
        )

        if (!isMounted) {
          return
        }

        setGifts(hydrateGifts(giftRecords))
      } catch (error) {
        if (!isMounted) {
          return
        }

        setRegistrationError(
          'Nao foi possivel carregar os presentes do banco agora.',
        )
      } finally {
        if (isMounted) {
          setIsLoadingGifts(false)
        }
      }
    }

    loadGiftCatalog()

    return () => {
      isMounted = false
    }
  }, [])

  const refreshGiftCatalog = async () => {
    const giftRecords = await listGifts()
    setGifts(hydrateGifts(giftRecords))
  }

  const toggleGift = (giftId) => {
    const targetGift = gifts.find((gift) => gift.id === giftId)

    if (!targetGift || targetGift.status === 'reservado') {
      return
    }

    setRegistrationError('')

    setSelectedGifts((currentGifts) =>
      currentGifts.includes(giftId)
        ? currentGifts.filter((currentGiftId) => currentGiftId !== giftId)
        : [...currentGifts, giftId],
    )
  }

  const handleRegistrationSubmit = async (event) => {
    event.preventDefault()

    if (selectedGifts.length === 0) {
      setRegistrationMessage('')
      setRegistrationError('Escolha pelo menos um presente antes de enviar.')
      return
    }

    const formData = new FormData(event.currentTarget)
    const guestData = {
      nome: formData.get('nome')?.toString().trim() ?? '',
      email: formData.get('email')?.toString().trim() ?? '',
      presenca: formData.get('presenca')?.toString() ?? '',
      temAcompanhante: hasCompanion === 'sim',
      nomeAcompanhante:
        formData.get('nomeAcompanhante')?.toString().trim() ?? '',
      quantidadeCriancas: Number(formData.get('criancas') ?? 0),
      prato: formData.get('prato')?.toString() ?? '',
      mensagem: formData.get('mensagem')?.toString().trim() ?? '',
    }

    const selectedGiftRecords = gifts.filter((gift) =>
      selectedGifts.includes(gift.id),
    )

    setIsSubmittingRegistration(true)
    setRegistrationMessage('')
    setRegistrationError('')

    try {
      await submitGuestRegistration({
        guestData,
        selectedGiftIds: selectedGifts,
        selectedGifts: selectedGiftRecords,
      })

      await refreshGiftCatalog()
      event.currentTarget.reset()
      setHasCompanion('')
      setSelectedGifts([])
      setRegistrationMessage(
        'Registro enviado e presentes reservados com sucesso.',
      )
    } catch (error) {
      if (error instanceof ReservedGiftError) {
        setRegistrationError(
          `Estes presentes ja foram reservados: ${error.giftNames.join(', ')}.`,
        )
        await refreshGiftCatalog()
        setSelectedGifts([])
      } else {
        setRegistrationError(
          'Nao foi possivel salvar o registro agora. Tente novamente.',
        )
      }
    } finally {
      setIsSubmittingRegistration(false)
    }
  }

  if (currentScreen === 'registro') {
    return (
      <main className="registration-screen">
        <button
          className="registration-back"
          type="button"
          onClick={() => setCurrentScreen('home')}
        >
          Voltar
        </button>

        <section className="registration-panel">
          <p className="registration-monogram">J&amp;J</p>
          <h1>Registro Convidado</h1>
          <p>
            Confirme sua presenca e conte pra gente quem vem celebrar esse dia
            com a gente.
          </p>

          <form className="registration-form" onSubmit={handleRegistrationSubmit}>
            <label>
              Nome completo
              <input type="text" name="nome" placeholder="Seu nome" required />
            </label>
            <label>
              E-mail
              <input
                type="email"
                name="email"
                placeholder="seu@email.com"
                required
              />
            </label>
            <label>
              Voce ira ao casamento?
              <select name="presenca" defaultValue="" required>
                <option value="" disabled>
                  Selecione uma opcao
                </option>
                <option value="sim">Sim, confirmo minha presenca</option>
                <option value="nao">Nao poderei comparecer</option>
              </select>
            </label>
            <label>
              Acompanhante?
              <select
                name="acompanhante"
                value={hasCompanion}
                onChange={(event) => setHasCompanion(event.target.value)}
                required
              >
                <option value="" disabled>
                  Selecione uma opcao
                </option>
                <option value="sim">Sim</option>
                <option value="nao">Nao</option>
              </select>
            </label>
            {hasCompanion === 'sim' && (
              <label>
                Nome do acompanhante
                <input
                  type="text"
                  name="nomeAcompanhante"
                  placeholder="Nome do acompanhante"
                  required
                />
              </label>
            )}
            <label>
              Quantidade de criancas
              <select name="criancas" defaultValue="0">
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
              </select>
            </label>
            <label>
              Opcao de prato
              <select name="prato" defaultValue="" required>
                <option value="" disabled>
                  Selecione uma opcao
                </option>
                <option value="vegetariano">Vegetariano</option>
                <option value="carnivoro">Carnivoro</option>
              </select>
            </label>
            <label>
              Mensagem para os noivos
              <textarea name="mensagem" placeholder="Escreva sua mensagem" />
            </label>

            <fieldset className="gift-selection">
              <legend>Escolha um ou mais presentes</legend>
              <p>Selecione pelo menos um presente para concluir o registro.</p>

              {isLoadingGifts ? (
                <p className="gift-feedback">Carregando presentes do banco...</p>
              ) : (
                <div className="gift-grid">
                  {gifts.map((gift) => {
                    const isSelected = selectedGifts.includes(gift.id)
                    const isReserved = gift.status === 'reservado'

                    return (
                      <article
                        className={`gift-card ${isSelected ? 'is-selected' : ''} ${
                          isReserved ? 'is-reserved' : ''
                        }`}
                        key={gift.id}
                      >
                        <div className="gift-image">
                          <button
                            type="button"
                            aria-pressed={isSelected}
                            aria-label={
                              isReserved
                                ? `${gift.name} reservado`
                                : `Selecionar ${gift.name}`
                            }
                            disabled={isReserved}
                            onClick={() => toggleGift(gift.id)}
                          >
                            {isReserved ? '-' : 'X'}
                          </button>
                          <img src={gift.image} alt={gift.name} />
                        </div>

                        <div className="gift-info">
                          <h2>{gift.name}</h2>
                          <a
                            href={gift.storeUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Link da loja
                          </a>
                          <p>{gift.price}</p>
                          <span className="gift-status">
                            {isReserved ? 'Reservado' : 'Disponivel'}
                          </span>
                        </div>
                      </article>
                    )
                  })}
                </div>
              )}
            </fieldset>

            {registrationMessage ? (
              <p className="form-feedback is-success">{registrationMessage}</p>
            ) : null}
            {registrationError ? (
              <p className="form-feedback is-error">{registrationError}</p>
            ) : null}

            <button
              type="submit"
              disabled={
                selectedGifts.length === 0 ||
                isSubmittingRegistration ||
                isLoadingGifts
              }
            >
              {isSubmittingRegistration ? 'Enviando...' : 'Enviar Registro'}
            </button>
          </form>
        </section>
      </main>
    )
  }

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

      <section className="guest-register" id="registro-convidado">
        <div className="guest-register-hero">
          <img src={registroConvidadoImage} alt="Casal de noivos com buque" />
          <div className="guest-register-content">
            <h2>Registro Convidado</h2>
            <p>
              Criamos esse cantinho para dividir com voces nossa ansiedade e
              alegria de ver todo mundo que a gente ama reunido em um so lugar.
              Aqui no site, voce descobre tudo o que precisa saber para
              aproveitar o nosso casamento do inicio ao fim.
            </p>
            <button type="button" onClick={() => setCurrentScreen('registro')}>
              Fazer o Registro
            </button>
          </div>
        </div>

        <div className="guest-register-footer">
          <p>J&amp;J</p>
          <a href="#home">Volte para cima</a>
        </div>
      </section>
    </>
  )
}

export default App

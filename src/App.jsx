import { useEffect, useState } from 'react'
import './App.css'
import previewImage from './assets/preview.webp'
import downloadImage from './assets/download.webp'
import downloadImage1 from './assets/download-1.webp'
import venueImage from './assets/download (3).webp'
import previewBottomImage from './assets/preview-bottom.png'
import registroConvidadoImage from './assets/registro-convidado.jpg'
import faqLanternsImage from './assets/faq-lanterns.jpg'
import faqParasolsImage from './assets/faq-parasols.jpg'
import faqFlowersImage from './assets/faq-flowers.jpg'
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
import {
  enableSmoothAnchorNavigation,
  smoothScrollToTop,
} from './utils/smoothScroll'

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

function WeddingDetailsPage({ onBack, onRegister, onQuestions }) {
  return (
    <main className="wedding-page">
      <button className="page-back" type="button" onClick={onBack}>
        Voltar
      </button>

      <section className="wedding-section wedding-section-page">
        <div className="wedding-heading">
          <p>L&amp;G</p>
          <h1>Sobre o Casamento</h1>
          <span>
            Tudo o que voce precisa saber para celebrar conosco: data, horarios,
            local e o clima do nosso grande dia.
          </span>
        </div>

        <div className="wedding-intro">
          <img src={downloadImage1} alt="Detalhes da celebracao" />
          <div className="wedding-intro-text">
            <h2>Uma tarde para lembrar</h2>
            <p>
              Lucas e Gladys convidam voce para uma celebracao intima ao ar livre,
              cercada de jardim, musica ao vivo e a presenca de quem faz parte da
              nossa historia. A cerimonia e a festa acontecem no mesmo endereco,
              para que voce possa aproveitar cada momento sem pressa.
            </p>
            <p>
              Sabado, 30 de junho de 2026, a partir das 16h, na Villa Jardim Aurora,
              em Salvador. Confirmamos presenca e lista de presentes pelo Registro
              Convidado aqui no site.
            </p>
          </div>
        </div>

        <div className="wedding-details-grid">
          <article className="wedding-detail-card">
            <span>Data</span>
            <h2>Sabado, 30 de junho de 2026</h2>
            <p>Cerimonia ao entardecer, com recepcao em seguida no mesmo local.</p>
          </article>
          <article className="wedding-detail-card">
            <span>Horario</span>
            <h2>Cerimonia as 16h</h2>
            <p>Chegue entre 15h30 e 15h45 para acomodacao tranquila dos convidados.</p>
          </article>
          <article className="wedding-detail-card">
            <span>Local</span>
            <h2>Villa Jardim Aurora</h2>
            <p>
              Rua das Acacias, 248 - Jardim das Flores, Salvador - BA. Estacionamento
              no proprio espaco.
            </p>
          </article>
          <article className="wedding-detail-card">
            <span>Traje</span>
            <h2>Social elegante</h2>
            <p>
              Tons claros e terrosos combinam com o jardim. Evite saltos finos em
              areas de grama.
            </p>
          </article>
        </div>

        <div className="wedding-schedule">
          <h2>Cronograma do dia</h2>
          <ol className="wedding-schedule-list">
            <li>
              <strong>15h30</strong>
              <span>Recepcao dos convidados no jardim</span>
            </li>
            <li>
              <strong>16h00</strong>
              <span>Cerimonia ao ar livre</span>
            </li>
            <li>
              <strong>17h00</strong>
              <span>Cocktail e sessao de fotos</span>
            </li>
            <li>
              <strong>19h30</strong>
              <span>Jantar e festa</span>
            </li>
            <li>
              <strong>23h30</strong>
              <span>Encerramento</span>
            </li>
          </ol>
        </div>

        <div className="wedding-cta">
          <button type="button" onClick={onRegister}>
            Confirmar presenca
          </button>
          <button type="button" onClick={onQuestions}>
            Ver painel de duvidas
          </button>
        </div>
      </section>
    </main>
  )
}

function StoryPage({ onBack }) {
  return (
    <main className="story-page">
      <button className="page-back" type="button" onClick={onBack}>
        Voltar
      </button>

      <section className="history-section history-section-page">
        <section className="header-section">
          <img src="/foto1.jpeg" alt="Foto do casal" className="hero-image" />
          <div className="header-content">
            <h1>Where the Wild Things Wed</h1>
            <p>
              Nós nos conhecemos em uma caminhada artística em Seattle, literalmente
              esbarrando um no outro. Começamos a fazer trilhas juntos — muitas
              trilhas. Nós dois amamos o noroeste do Pacífico, as montanhas, a
              costa, tudo. Estávamos sempre por aí, nas trilhas, apenas curtindo,
              conversando ao redor de uma fogueira. Simplesmente encaixou. Estávamos
              na mesma sintonia.
            </p>
            <p>
              Uma vez, estávamos fazendo trilha e eu reclamei das minhas botas, e a
              Gladys simplesmente parou e começou a amarrar meus cadarços para mim.
              Foi aí que eu soube. Não foi um grande gesto. Foi só… a gente.
            </p>
            <p>
              Construímos uma vida juntos. É tranquila, é de verdade. Gostamos de
              aventuras simples, mas também apreciamos um bom vinho com amigos.
              Desde aquelas primeiras trilhas até aprender a viver juntos sob
              incontáveis céus estrelados, sempre encontramos nossos melhores
              momentos na natureza.
            </p>
            <p>
              Parece certo celebrar cercados pelas pessoas que nos entendem.
              Estamos animados para começar este próximo capítulo com vocês.
            </p>
            <p>Em frente e para o alto, rumo à próxima aventura!</p>
          </div>
        </section>

        <section className="main-section">
          <div className="timeline-block">
            <img
              src="/foto2.png"
              alt="Quando nos conhecemos"
              className="timeline-image"
            />
            <div className="timeline-text">
              <h2>Hoje... - 20/01/2007</h2>
            </div>
          </div>

          <div className="timeline-block reverse">
            <img
              src="/foto3.jpeg"
              alt="Campamento Jovens"
              className="timeline-image"
            />
            <div className="timeline-text">
              <h2>Campamento Jovens - 02/2017</h2>
            </div>
          </div>

          <div className="timeline-block">
            <img src="/foto4.jpeg" alt="1 ano juntos" className="timeline-image" />
            <div className="timeline-text">
              <h2>1 Ano Juntos - 2018</h2>
            </div>
          </div>

          <div className="timeline-block reverse">
            <img
              src="/foto5.png"
              alt="2º ano de namoro"
              className="timeline-image"
            />
            <div className="timeline-text">
              <h2>2º Ano de Namoro - 2018</h2>
            </div>
          </div>

          <div className="timeline-block">
            <img
              src="/foto6.png"
              alt="Pedido de casamento"
              className="timeline-image"
            />
            <div className="timeline-text">
              <h2>Pedido de Casamento - 12/06/2020</h2>
            </div>
          </div>

          <div className="timeline-block reverse">
            <img
              src="/foto9.png"
              alt="Preparativos casamento"
              className="timeline-image"
            />
            <div className="timeline-text">
              <h2>1º Ano de Noivado - 2020</h2>
            </div>
          </div>

          <div className="timeline-block">
            <img
              src="/foto10.png"
              alt="Preparativos casamento"
              className="timeline-image"
            />
            <div className="timeline-text">
              <h2>Preparativos Casamento</h2>
            </div>
          </div>
        </section>
      </section>
    </main>
  )
}

function PackingPage({ onBack }) {
  return (
    <main className="packing-page">
      <button className="page-back" type="button" onClick={onBack}>
        Voltar
      </button>

      <section className="packing-section packing-section-page">
        <div className="packing-heading">
          <p>L&amp;G</p>
          <h1>O que levar</h1>
          <span>
            Preparamos uma lista simples para voce chegar tranquilo e aproveitar
            cada momento da celebracao com a gente.
          </span>
        </div>

        <div className="packing-content">
          <div className="packing-note">
            <p>Dica dos noivos</p>
            <h2>Leve o essencial e venha leve</h2>
            <span>
              O clima pode variar ao longo do dia. Um casaco leve e um sapato
              confortavel fazem toda a diferenca entre a cerimonia e a festa.
            </span>
          </div>

          <div className="packing-grid">
            <article className="packing-card">
              <span>01</span>
              <h2>Convite ou confirmacao</h2>
              <p>
                Tenha em maos o convite ou a confirmacao do registro. Isso ajuda
                na organizacao da recepcao e do seu lugar na mesa.
              </p>
            </article>
            <article className="packing-card">
              <span>02</span>
              <h2>Traje social elegante</h2>
              <p>
                Sugerimos look social elegante, com roupas confortaveis para
                circular entre cerimonia, fotos e festa.
              </p>
            </article>
            <article className="packing-card">
              <span>03</span>
              <h2>Calcado confortavel</h2>
              <p>
                Se possivel, leve um par extra ou um sapato mais confortavel para
                usar depois da cerimonia.
              </p>
            </article>
            <article className="packing-card">
              <span>04</span>
              <h2>Casaco ou xale leve</h2>
              <p>
                A noite pode esfriar no jardim. Um casaco, xale ou estola combina
                com o clima e com as fotos.
              </p>
            </article>
            <article className="packing-card">
              <span>05</span>
              <h2>Protetor solar e acessorios</h2>
              <p>
                Parte da celebracao acontece ao ar livre. Protetor solar, oculos
                e um lenco sao bem-vindos.
              </p>
            </article>
            <article className="packing-card">
              <span>06</span>
              <h2>Presente ou reserva online</h2>
              <p>
                Voce pode reservar presentes pelo Registro Convidado no site. Se
                preferir levar algo pessoal, sera recebido com muito carinho.
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  )
}

function QuestionsPage({ onBack }) {
  return (
    <main className="questions-page">
      <button className="page-back" type="button" onClick={onBack}>
        Voltar
      </button>

      <section className="faq-section faq-section-page">
        <div className="faq-heading">
          <p>L&amp;G</p>
          <h1>Painel de Duvidas</h1>
          <span>
            Reunimos aqui as principais informacoes para voce chegar tranquilo,
            encontrar o local e aproveitar cada momento da celebracao.
          </span>
        </div>

        <div className="faq-layout">
          <div className="faq-location">
            <div className="faq-location-main">
              <img src={faqLanternsImage} alt="Decoracao com lanternas suspensas" />
            </div>
            <div className="faq-location-gallery">
              <img src={faqParasolsImage} alt="Madrinhas com sombrinhas brancas" />
              <img src={faqFlowersImage} alt="Flores em garrafas de vidro" />
            </div>
            <div className="faq-address" id="localizacao">
              <p>Local da cerimonia</p>
              <h2>Villa Jardim Aurora</h2>
              <span>
                Rua das Acacias, 248 - Jardim das Flores, Salvador - BA
              </span>
            </div>
          </div>

          <div className="faq-grid">
            <article className="faq-card">
              <span>01</span>
              <h2>Qual sera o horario?</h2>
              <p>
                A cerimonia esta marcada para as 16h. Sugerimos chegar com
                alguns minutos de antecedencia para encontrar seu lugar com
                calma.
              </p>
            </article>
            <article className="faq-card">
              <span>02</span>
              <h2>Como chego ao local?</h2>
              <p>
                O endereco acima e uma localizacao ficticia para o projeto. A
                referencia principal e a Villa Jardim Aurora, proxima a Praca
                das Flores.
              </p>
            </article>
            <article className="faq-card">
              <span>03</span>
              <h2>Qual traje devo usar?</h2>
              <p>
                O traje sugerido e social elegante. Escolha roupas confortaveis
                para circular entre a cerimonia, as fotos e a festa.
              </p>
            </article>
            <article className="faq-card">
              <span>04</span>
              <h2>Posso levar acompanhante?</h2>
              <p>
                Sim, se o acompanhante estiver indicado no seu convite. No
                registro de convidado voce informa o nome de quem ira com voce.
              </p>
            </article>
            <article className="faq-card">
              <span>05</span>
              <h2>Como confirmo presenca?</h2>
              <p>
                Use a area de Registro Convidado para confirmar sua presenca,
                informar restricoes e deixar uma mensagem para os noivos.
              </p>
            </article>
            <article className="faq-card">
              <span>06</span>
              <h2>Como funciona a lista de presentes?</h2>
              <p>
                A lista fica dentro do registro. Voce escolhe um ou mais
                presentes disponiveis e o site reserva sua selecao.
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  )
}

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
    giftRecords.map((gift, index) => {
      const isAvailable =
        gift.disponivel === true ||
        gift.disponivel?.toString().trim().toLowerCase() === 'true'

      return {
        ...gift,
        name: gift.name ?? gift.nome,
        storeUrl: gift.storeUrl ?? gift.store_url ?? '#',
        price:
          typeof gift.price === 'string'
            ? gift.price
            : typeof gift.preco === 'string'
              ? gift.preco
              : '',
        status: isAvailable ? 'disponivel' : 'reservado',
        image:
          gift.image ??
          giftImageById[gift.id] ??
          localGiftCatalog[index % localGiftCatalog.length]?.image,
      }
    })

  const navigateToScreen = (screen) => {
    setCurrentScreen(screen)
    smoothScrollToTop()
  }

  useEffect(() => enableSmoothAnchorNavigation(), [])

  useEffect(() => {
    const screenByHash = {
      '#sobre-casamento': 'sobre-casamento',
      '#nossa-historia': 'nossa-historia',
      '#o-que-levar': 'o-que-levar',
      '#duvidas': 'duvidas',
    }

    const syncScreenWithHash = () => {
      const hashScreen = screenByHash[window.location.hash]

      if (hashScreen) {
        setCurrentScreen(hashScreen)
      }
    }

    syncScreenWithHash()
    window.addEventListener('hashchange', syncScreenWithHash)

    return () => window.removeEventListener('hashchange', syncScreenWithHash)
  }, [])

  useEffect(() => {
    let isMounted = true

    async function loadGiftCatalog() {
      setIsLoadingGifts(true)
      setRegistrationError('')

      try {
        const giftRecords = await ensureGiftCatalog(
          localGiftCatalog.map(({ id, name, storeUrl, price, position }) => ({
            id,
            name,
            storeUrl,
            price,
            position,
          })),
        )

        if (!isMounted) {
          return
        }

        setGifts(hydrateGifts(giftRecords))
      } catch {
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
    const form = event.currentTarget

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

    setIsSubmittingRegistration(true)
    setRegistrationMessage('')
    setRegistrationError('')

    try {
      await submitGuestRegistration({
        guestData,
        selectedGiftIds: selectedGifts,
      })

      await refreshGiftCatalog()
      form.reset()
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

  if (currentScreen === 'sobre-casamento') {
    return (
      <WeddingDetailsPage
        onBack={() => navigateToScreen('home')}
        onRegister={() => navigateToScreen('registro')}
        onQuestions={() => navigateToScreen('duvidas')}
      />
    )
  }

  if (currentScreen === 'nossa-historia') {
    return <StoryPage onBack={() => navigateToScreen('home')} />
  }

  if (currentScreen === 'o-que-levar') {
    return <PackingPage onBack={() => navigateToScreen('home')} />
  }

  if (currentScreen === 'duvidas') {
    return <QuestionsPage onBack={() => navigateToScreen('home')} />
  }

  if (currentScreen === 'registro') {
    return (
      <main className="registration-screen">
        <button
          className="registration-back"
          type="button"
          onClick={() => navigateToScreen('home')}
        >
          Voltar
        </button>

        <section className="registration-panel">
          <p className="registration-monogram">L&amp;G</p>
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
            <a
              href="#sobre-casamento"
              onClick={() => navigateToScreen('sobre-casamento')}
            >
              Sobre o Casamento
            </a>
            <a
              href="#nossa-historia"
              onClick={() => navigateToScreen('nossa-historia')}
            >
              Nossa Historia
            </a>
            <a href="#duvidas" onClick={() => navigateToScreen('duvidas')}>
              Painel de Duvidas
            </a>
          </nav>
        </header>

        <div className="hero-center-text">
          <p>Sabado, 30 de junho, 2026</p>
          <p>Villa Jardim Aurora</p>
          <p>Salvador, Bahia</p>
        </div>
      </section>

     {/* Grid de navegação */}
<section className="duo-grid" id="sobre">
  <article className="duo-card">
    <img src={downloadImage} alt="Nossa historia" />
    <a href="#nossa-historia" onClick={() => navigateToScreen('nossa-historia')}>
      Fotos do Casal
    </a>
  </article>
  <article className="duo-card">
    <img src={downloadImage1} alt="Sobre o casamento" />
    <a href="#sobre-casamento" onClick={() => navigateToScreen('sobre-casamento')}>
      Sobre o Casamento
    </a>
  </article>
  <article className="duo-card">
    <img src={venueImage} alt="O que levar" />
    <a href="#o-que-levar" onClick={() => navigateToScreen('o-que-levar')}>
      O que levar
    </a>
  </article>
  <article className="duo-card">
    <img src={previewBottomImage} alt="Nossa historia" />
    <a href="#nossa-historia" onClick={() => navigateToScreen('nossa-historia')}>
      Nossa história
    </a>
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
            <button type="button" onClick={() => navigateToScreen('registro')}>
              Fazer o Registro
            </button>
          </div>
        </div>

        <div className="guest-register-footer">
          <p>L&amp;G</p>
          <a href="#home">Volte para cima</a>
        </div>
      </section>
    </>

    
  )
  
}
export default App

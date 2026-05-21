import { supabase } from './supabase'

class ReservedGiftError extends Error {
  constructor(giftNames) {
    super('One or more gifts are already reserved.')
    this.name = 'ReservedGiftError'
    this.giftNames = giftNames
  }
}

function isGiftAvailable(gift) {
  return (
    gift.disponivel === true ||
    gift.disponivel?.toString().trim().toLowerCase() === 'true'
  )
}

async function listGifts() {
  const { data, error } = await supabase
    .from('presentes')
    .select('*')

  if (error) throw error
  return data
}

async function ensureGiftCatalog(defaultGifts) {
  const existingGifts = await listGifts()
  if (existingGifts.length > 0) return existingGifts

  const { error } = await supabase
    .from('presentes')
    .insert(defaultGifts.map((gift) => ({
      nome: gift.name,
      descricao: gift.descricao ?? '',
      imagem_url: gift.imagem_url ?? '',
      disponivel: true,
    })))

  if (error) throw error
  return listGifts()
}

async function submitGuestRegistration({ guestData, selectedGiftIds }) {
  const { data: giftsData, error: giftsError } = await supabase
    .from('presentes')
    .select('*')
    .in('id', selectedGiftIds)

  if (giftsError) throw giftsError

  const unavailableGiftNames = giftsData
    .filter(gift => !isGiftAvailable(gift))
    .map(gift => gift.nome)

  if (unavailableGiftNames.length > 0) {
    throw new ReservedGiftError(unavailableGiftNames)
  }

  const { data: guest, error: guestError } = await supabase
    .from('convidados')
    .insert({
      nome: guestData.nome,
      email: guestData.email,
      confirmou_presenca: guestData.presenca === 'sim',
      nome_parceiro: guestData.temAcompanhante ? guestData.nomeAcompanhante : null,
      criancas: guestData.quantidadeCriancas,
      preferencia_cardapio: guestData.prato,
    })
    .select()
    .single()

  if (guestError) throw guestError

  const { error: updateError } = await supabase
    .from('presentes')
    .update({ disponivel: false })
    .in('id', selectedGiftIds)

  if (updateError) throw updateError

  return guest.id
}

export { ReservedGiftError, ensureGiftCatalog, listGifts, submitGuestRegistration }

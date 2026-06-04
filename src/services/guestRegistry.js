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

function normalizeGiftName(name) {
  return name?.toString().trim().toLowerCase()
}

async function listGifts() {
  const { data, error } = await supabase
    .from('presentes')
    .select('*')

  if (error) throw error
  return data
}

async function listGuestRegistrations() {
  const { data: guests, error: guestsError } = await supabase
    .from('convidados')
    .select('*')
    .order('criado_em', { ascending: false, nullsFirst: false })

  if (guestsError) throw guestsError

  const { data: gifts, error: giftsError } = await supabase
    .from('presentes')
    .select('*')
    .not('convidado_id', 'is', null)

  if (giftsError) throw giftsError

  const giftsByGuestId = gifts.reduce((groupedGifts, gift) => {
    const guestId = gift.convidado_id

    return {
      ...groupedGifts,
      [guestId]: [...(groupedGifts[guestId] ?? []), gift],
    }
  }, {})

  return guests.map((guest) => ({
    ...guest,
    presentes: giftsByGuestId[guest.id] ?? [],
  }))
}

function subscribeToGuestRegistrations(onChange) {
  const channel = supabase
    .channel('guest-registration-list')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'convidados' },
      onChange,
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'presentes' },
      onChange,
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

async function ensureGiftCatalog(defaultGifts) {
  const existingGifts = await listGifts()
  const existingGiftNames = new Set(
    existingGifts.map((gift) => normalizeGiftName(gift.nome ?? gift.name)),
  )
  const giftsToInsert =
    existingGifts.length === 0
      ? defaultGifts
      : defaultGifts.filter(
          (gift) =>
            gift.syncToDatabase && !existingGiftNames.has(normalizeGiftName(gift.name)),
        )

  if (giftsToInsert.length === 0) return existingGifts

  const { error } = await supabase
    .from('presentes')
    .insert(giftsToInsert.map((gift) => ({
      nome: gift.name,
      descricao: gift.descricao ?? '',
      imagem_url: gift.imagem_url ?? '',
      disponivel: true,
      position: gift.position ?? 0,
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
    .update({ disponivel: false, convidado_id: guest.id })
    .in('id', selectedGiftIds)

  if (updateError) throw updateError

  return guest.id
}

export {
  ReservedGiftError,
  ensureGiftCatalog,
  listGifts,
  listGuestRegistrations,
  submitGuestRegistration,
  subscribeToGuestRegistrations,
}

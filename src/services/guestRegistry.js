import {
  collection,
  doc,
  getDocs,
  runTransaction,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore'
import { db } from './firebase'

const giftsCollection = collection(db, 'presentes')
const guestsCollection = collection(db, 'convidados')
const guestGiftsCollection = collection(db, 'convidado_presentes')

class ReservedGiftError extends Error {
  constructor(giftNames) {
    super('One or more gifts are already reserved.')
    this.name = 'ReservedGiftError'
    this.giftNames = giftNames
  }
}

const mapGiftDocument = (giftDoc) => ({
  id: giftDoc.id,
  ...giftDoc.data(),
})

const sortByPosition = (leftGift, rightGift) =>
  (leftGift.position ?? 0) - (rightGift.position ?? 0)

async function listGifts() {
  const snapshot = await getDocs(giftsCollection)

  return snapshot.docs.map(mapGiftDocument).sort(sortByPosition)
}

async function ensureGiftCatalog(defaultGifts) {
  const existingGifts = await listGifts()

  if (existingGifts.length > 0) {
    return existingGifts
  }

  const batch = writeBatch(db)

  defaultGifts.forEach((gift, index) => {
    const giftRef = doc(db, 'presentes', gift.id)

    batch.set(giftRef, {
      name: gift.name,
      storeUrl: gift.storeUrl,
      price: gift.price,
      position: gift.position ?? index,
      status: 'disponivel',
      reservedByGuestId: null,
      reservedByGuestName: null,
      createdAt: serverTimestamp(),
    })
  })

  await batch.commit()

  return listGifts()
}

async function submitGuestRegistration({
  guestData,
  selectedGiftIds,
  selectedGifts,
}) {
  return runTransaction(db, async (transaction) => {
    const guestRef = doc(guestsCollection)
    const giftRefs = selectedGiftIds.map((giftId) => doc(db, 'presentes', giftId))
    const giftSnapshots = await Promise.all(
      giftRefs.map((giftRef) => transaction.get(giftRef)),
    )

    const unavailableGiftNames = giftSnapshots
      .filter((giftSnapshot) => {
        if (!giftSnapshot.exists()) {
          return true
        }

        return giftSnapshot.data().status === 'reservado'
      })
      .map((giftSnapshot, index) =>
        giftSnapshot.exists()
          ? giftSnapshot.data().name
          : selectedGifts[index]?.name ?? 'Presente indisponivel',
      )

    if (unavailableGiftNames.length > 0) {
      throw new ReservedGiftError(unavailableGiftNames)
    }

    transaction.set(guestRef, {
      nome: guestData.nome,
      email: guestData.email,
      presenca: guestData.presenca,
      temAcompanhante: guestData.temAcompanhante,
      acompanhante: guestData.temAcompanhante
        ? { nome: guestData.nomeAcompanhante }
        : null,
      quantidadeCriancas: guestData.quantidadeCriancas,
      prato: guestData.prato,
      mensagem: guestData.mensagem,
      presentesSelecionados: selectedGifts.map((gift) => ({
        id: gift.id,
        nome: gift.name,
        preco: gift.price,
      })),
      createdAt: serverTimestamp(),
    })

    selectedGifts.forEach((gift, index) => {
      const relationRef = doc(guestGiftsCollection)

      transaction.update(giftRefs[index], {
        status: 'reservado',
        reservedByGuestId: guestRef.id,
        reservedByGuestName: guestData.nome,
        reservedAt: serverTimestamp(),
      })

      transaction.set(relationRef, {
        convidadoId: guestRef.id,
        convidadoNome: guestData.nome,
        presenteId: gift.id,
        presenteNome: gift.name,
        preco: gift.price,
        lojaUrl: gift.storeUrl,
        createdAt: serverTimestamp(),
      })
    })

    return guestRef.id
  })
}

export {
  ReservedGiftError,
  ensureGiftCatalog,
  listGifts,
  submitGuestRegistration,
}

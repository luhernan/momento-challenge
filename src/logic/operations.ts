import { Agent, Operation } from './types'
import { readFromCSV } from './utils'

function isInsideSemester(
  date: string
) {

  return (
    date >= '2025-01-01' && date <= '2025-06-30'
  )
}

export async function getIssuance () {
  const operations = await readFromCSV('../resources/issuance.csv')
  return operations
}

export async function getClaims () {
  const operations = await readFromCSV('../resources/claims.csv')
  return operations
}

export function calculateIssuance (agent: Agent, operations: Operation[]) {
  let issuance = 0
  for (const op of operations) {
    if (op.agent === agent.id && isInsideSemester(op.date)) {
      issuance += Number(op.amount)
    }
  }
  return issuance
}


export function calculateClaims (agent: Agent, operations: Operation[]) {
  let claims = 0

  for (const op of operations) {
    //No hacemos nada si no encuentra el agente o esta fuera del rango de fechas.
    if (op.agent !== agent.id || !isInsideSemester(op.date)) {
      continue
    }

    // Sumamos las operaciones de reserva y pago de ajuste.
    if (op.operation === 'reserve' || op.operation === 'adjust') {
      claims += Number(op.amount)
    }

    // Restamos las operaciones de deducible y de recuperacion.
    if (op.operation === 'deductible' || op.operation === 'recovery') {
      claims -= Number(op.amount)
    }
  }
  return claims
}


export function calculateBonus (agent: Agent) {
  
  let siniestralidad = 0
  
  //Para evitar dividir entre cero
  if (agent.issuance > 0) {
    siniestralidad = (agent.claims / agent.issuance) * 100
  }

  //Porcentaje del bono (PB)
if (siniestralidad <= 65) {
    if (agent.issuance >= 0 && agent.issuance <= 3500) {
      return (agent.issuance * 4)/100
    }

    if (agent.issuance > 3500 && agent.issuance <= 5000) {
      return (agent.issuance * 5)/100
    }

    if (agent.issuance > 5000 && agent.issuance <= 5500) {
      return (agent.issuance * 6)/100
    }

    if (agent.issuance > 5500 && agent.issuance <= 6000) {
      return (agent.issuance * 8)/100
    }

    if (agent.issuance > 6000) {
      return (agent.issuance * 10)/100
    }
  }

  // siniestralidad > 65
  if (siniestralidad > 65) {

    if (agent.issuance >= 0 && agent.issuance <= 3500) {
      return (agent.issuance * 0)/100
    }

    if (agent.issuance > 3500 && agent.issuance <= 5000) {
      return (agent.issuance * 0)/100
    }

    if (agent.issuance > 5000 && agent.issuance <= 5500) {
      return (agent.issuance * 1)/100
    }

    if (
      agent.issuance > 5500 && agent.issuance <= 6000) {
      return (agent.issuance * 2)/100
    }

    if (agent.issuance > 6000) {
      return (agent.issuance * 3)/100
    }
  }

  


}

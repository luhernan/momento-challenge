import { getAgents, showList } from './logic/agents'
import { Operation } from '@logic/types'
import { getIssuance, getClaims, calculateIssuance, calculateClaims, calculateBonus } from './logic/operations'

async function main () {
  const agents = await getAgents()
  const issuance = await getIssuance()
  const claims = await getClaims()

  for (const agent of agents) {
    const agentIssuance = issuance.filter((op: Operation) => op.agent == agent.id)
    console.log(agent.name, agentIssuance.length)

    agent.issuance = calculateIssuance(agent, agentIssuance)

    
    agent.claims = calculateClaims(agent, claims)
    agent.bonus = calculateBonus(agent)
  }

  showList(agents)
}

main()

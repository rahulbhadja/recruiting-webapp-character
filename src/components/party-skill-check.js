import { useState } from 'react'
import { rollDice } from './skill-check'

const PartySkillCheck = ({ characters, skillList, calculateModifier }) => {
  const [selectedSkill, setSelectedSkill] = useState(skillList[0].name)
  const [dc, setDC] = useState(20)
  const [rollResult, setRollResult] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(null)

  const performPartySkillCheck = () => {
    let bestCharacter = characters.reduce((best, current, index) => {
      const attributeModifier = calculateModifier(
        current.attributes[
          skillList.find((skill) => skill.name === selectedSkill)
            .attributeModifier
        ]
      )
      const skillTotal = current.skillPoints[selectedSkill] + attributeModifier

      return !best || skillTotal > best.skillTotal
        ? { character: current, skillTotal, index }
        : best
    }, null)

    const roll = rollDice()
    const isSuccess = roll + bestCharacter.skillTotal >= dc

    setSelectedIndex(bestCharacter.index)
    setRollResult({ roll, skillTotal: bestCharacter.skillTotal, isSuccess })
  }

  return (
    <div>
      <h4>Party Skill Check</h4>
      <select
        value={selectedSkill}
        onChange={(e) => setSelectedSkill(e.target.value)}
      >
        {skillList.map((skill) => (
          <option key={skill.name} value={skill.name}>
            {skill.name}
          </option>
        ))}
      </select>
      <input
        type='number'
        value={dc}
        onChange={(e) => setDC(Number(e.target.value))}
      />
      <button onClick={performPartySkillCheck}>Roll</button>
      {rollResult && (
        <div>
          <p>
            Char {selectedIndex + 1} rolled a {rollResult.roll} and had a total
            skill of {rollResult.skillTotal} (
            {rollResult.isSuccess ? 'Success' : 'Failure'}).
          </p>
        </div>
      )}
    </div>
  )
}

export default PartySkillCheck

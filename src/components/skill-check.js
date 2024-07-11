import { useState } from 'react'

export const rollDice = () => Math.floor(Math.random() * 20) + 1

const SkillCheck = ({ character, skillList, calculateModifier }) => {
  const [selectedSkill, setSelectedSkill] = useState(skillList[0].name)
  const [dc, setDC] = useState(20)
  const [rollResult, setRollResult] = useState(null)

  const performSkillCheck = () => {
    const attributeModifier = calculateModifier(
      character.attributes[
        skillList.find((skill) => skill.name === selectedSkill)
          .attributeModifier
      ]
    )
    const skillTotal = character.skillPoints[selectedSkill] + attributeModifier
    const roll = rollDice()
    const isSuccess = roll + skillTotal >= dc

    setRollResult({ roll, skillTotal, isSuccess })
  }

  return (
    <div>
      <h4>Skill Check for {character.name}</h4>
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
      <button onClick={performSkillCheck}>Roll</button>
      {rollResult && (
        <p>
          Rolled: {rollResult.roll}, Skill Total: {rollResult.skillTotal} (
          {rollResult.isSuccess ? 'Success' : 'Failure'})
        </p>
      )}
    </div>
  )
}

export default SkillCheck

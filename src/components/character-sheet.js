import { useEffect, useState } from 'react'

const MAX_ATTRIBUTES_SUM = 70
const initialAttributes = {
  Strength: 10,
  Dexterity: 10,
  Constitution: 10,
  Intelligence: 10,
  Wisdom: 10,
  Charisma: 10,
}

function CharacterSheet({ ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST }) {
  const initialSkillPoints = () =>
    SKILL_LIST.reduce((acc, skill) => ({ ...acc, [skill.name]: 0 }), {})

  const [characters, setCharacters] = useState([
    {
      attributes: { ...initialAttributes },
      skillPoints: initialSkillPoints(),
    },
  ])

  const [showClassDetails, setShowClassDetails] = useState({})

  const addNewCharacter = () => {
    setCharacters([
      ...characters,
      {
        attributes: { ...initialAttributes },
        skillPoints: initialSkillPoints(),
      },
    ])
  }
  const calculateModifier = (attributeValue) => {
    return Math.floor((attributeValue - 10) / 2)
  }

  const checkClassRequirements = (character, requirements) => {
    return Object.keys(requirements).every((attribute) => {
      const isMet = character.attributes[attribute] >= requirements[attribute]
      console.log(`Checking ${attribute} requirement: ${isMet}`)
      return isMet
    })
  }

  const adjustAttribute = (index, attributeName, change) => {
    setCharacters(
      characters.map((character, idx) => {
        if (idx !== index) return character

        const currentSum = Object.values(character.attributes).reduce(
          (sum, value) => sum + value,
          0
        )
        console.log(`Current sum: ${currentSum}, change: ${change}`)
        if (currentSum + change > MAX_ATTRIBUTES_SUM && change > 0) {
          alert(
            'Maximum total attributes reached. Please decrease another attribute first.'
          )
          return character
        }

        return {
          ...character,
          attributes: {
            ...character.attributes,
            [attributeName]: Math.max(
              1,
              character.attributes[attributeName] + change
            ),
          },
        }
      })
    )
  }

  const calculateTotalSkillPoints = (character) => {
    const intelligenceModifier = calculateModifier(
      character.attributes.Intelligence
    )
    return 10 + 4 * intelligenceModifier
  }

  const adjustSkillPoints = (index, skillName, delta) => {
    setCharacters(
      characters.map((character, idx) => {
        if (idx !== index) return character

        const currentPoints = character.skillPoints[skillName]
        const newPoints = Math.max(0, currentPoints + delta)
        const totalUsedPoints =
          Object.values(character.skillPoints).reduce(
            (sum, points) => sum + points,
            0
          ) -
          currentPoints +
          newPoints

        console.log(
          `Total used points: ${totalUsedPoints}, total skill points: ${calculateTotalSkillPoints(
            character
          )}`
        )
        if (totalUsedPoints <= calculateTotalSkillPoints(character)) {
          return {
            ...character,
            skillPoints: { ...character.skillPoints, [skillName]: newPoints },
          }
        } else {
          alert(
            'Skill points limit reached. Adjust other skills to allocate more points here.'
          )
          return character
        }
      })
    )
  }

  const saveAllCharacters = async () => {
    const url = `https://recruiting.verylongdomaintotestwith.ca/api/rahulbhadja/character`
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(characters),
      })
      const result = await response.json()
      console.log('Save successful:', result)
    } catch (error) {
      console.error('Failed to save characters data:', error)
    }
  }

  const loadAllCharacters = async () => {
    const url = `https://recruiting.verylongdomaintotestwith.ca/api/rahulbhadja/character`
    try {
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        console.log('Loaded data:', data)
        setCharacters(data.body)
      } else {
        throw new Error('Failed to fetch characters data')
      }
    } catch (error) {
      console.error('Error retrieving data:', error)
    }
  }

  const showMinimumRequirements = (className) => {
    setShowClassDetails({
      ...showClassDetails,
      [className]: !showClassDetails[className],
    })
  }
  const renderClassControls = (character) => {
    return Object.entries(CLASS_LIST).map(([className, requirements]) => (
      <div key={className}>
        <h3
          style={{
            cursor: 'pointer',
            color: checkClassRequirements(character, requirements)
              ? 'green'
              : 'red',
          }}
          onClick={() => showMinimumRequirements(className)}
        >
          {className}
        </h3>

        {showClassDetails[className] && (
          <div>
            {Object.entries(requirements).map(([attribute, value]) => (
              <p key={attribute}>
                {attribute}: {value}
              </p>
            ))}
          </div>
        )}
      </div>
    ))
  }

  const renderAttributeControls = (character, index) => {
    return ATTRIBUTE_LIST.map((attribute) => (
      <div
        key={attribute}
        style={{
          display: 'flex',
          justifyContent: 'start',
          alignItems: 'center',
        }}
      >
        <p>
          {attribute}: {character.attributes[attribute]} (Modifier:{' '}
          {calculateModifier(character.attributes[attribute])})
        </p>
        <button onClick={() => adjustAttribute(index, attribute, 1)}>+</button>
        <button onClick={() => adjustAttribute(index, attribute, -1)}>-</button>
      </div>
    ))
  }

  useEffect(() => {
    loadAllCharacters()
  }, [])

  const renderSkillControls = (character, index) => {
    return SKILL_LIST.map((skill) => (
      <div
        key={skill.name}
        style={{
          display: 'flex',
          justifyContent: 'start',
          alignItems: 'center',
          gap: '2px',
        }}
      >
        <p style={{ fontSize: '12px' }}>
          {skill.name} - Points: {character.skillPoints[skill.name]} Modifier
          (Based on {skill.attributeModifier}):
        </p>
        <div style={{}}>
          <button onClick={() => adjustSkillPoints(index, skill.name, 1)}>
            +
          </button>
          <button onClick={() => adjustSkillPoints(index, skill.name, -1)}>
            -
          </button>
        </div>
        <p style={{ fontSize: '12px' }}>
          Total:{' '}
          {character.skillPoints[skill.name] +
            calculateModifier(character.attributes[skill.attributeModifier])}
        </p>
      </div>
    ))
  }

  const renderCharacterControls = (character, index) => {
    return (
      <div key={index}>
        <h4>Character {index + 1}</h4>

        <div
          style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'space-around',
          }}
        >
          <div>
            <h5>Attributes</h5>
            {renderAttributeControls(character, index)}
          </div>
          <div>
            <h5>Classes</h5>
            {renderClassControls(character, index)}
          </div>
          <div>
            <h5>Skills</h5>
            <div>
              <p>
                available skill points:{calculateTotalSkillPoints(character)}
              </p>
            </div>
            {renderSkillControls(character, index)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <button onClick={addNewCharacter}>Add New Character</button>
      <button onClick={saveAllCharacters}>Save All Characters</button>
      <button onClick={loadAllCharacters}>Load All Characters</button>

      {characters.map((character, index) => (
        <div key={index}>{renderCharacterControls(character, index)}</div>
      ))}
    </div>
  )
}

export default CharacterSheet

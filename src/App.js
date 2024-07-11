import { useState } from 'react'
import './App.css'
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST } from './consts.js'
import CharacterSheet from './components/character-sheet.js'

function App() {
  return (
    <div className='App'>
      <header className='App-header'>
        <h1>React Coding Exercise</h1>
      </header>
      <section className='App-section'>
        <CharacterSheet
          ATTRIBUTE_LIST={ATTRIBUTE_LIST}
          CLASS_LIST={CLASS_LIST}
          SKILL_LIST={SKILL_LIST}
        />
      </section>
    </div>
  )
}

export default App

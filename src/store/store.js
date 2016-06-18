import { createStore, compose } from 'Redux'

import mainStore from './main_store'

// const store = createStore( mainStore ) // prod store

// dev store
const devTools = window.devToolsExtension && window.devToolsExtension()
const store = createStore(
  mainStore,
  devTools
)

export default store

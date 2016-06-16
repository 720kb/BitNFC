import { createStore } from 'Redux'

import mainStore from './main_store'

const store = createStore( mainStore )

export default store

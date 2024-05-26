import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import store, { persistorStore } from './utils/redux/store.ts'
import { RouterProvider } from 'react-router-dom'
import Router from './router/index.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(

    <Provider store={store}>
      <PersistGate persistor={persistorStore}>
      <RouterProvider router={Router} />
      </PersistGate>
    </Provider>

)

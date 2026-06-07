import { useEffect, useRef, useState } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import SplashScreen from './components/SplashScreen.jsx'
import HomePage from './pages/HomePage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import CollectionPage from './pages/CollectionPage.jsx'
import ProductPage from './pages/ProductPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import CollectionTransition from './components/CollectionTransition.jsx'

const pageVariants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
}

function PageFrame({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function getCollectionSlug(pathname) {
  return pathname.startsWith('/collections/') ? pathname.split('/')[2] : ''
}

function AnimatedRoutes() {
  const location = useLocation()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionCollection, setTransitionCollection] = useState(getCollectionSlug(location.pathname))
  const previousPathRef = useRef(location.pathname)
  const seenCollectionTransitionsRef = useRef(new Set())

  useEffect(() => {
    const currentPath = location.pathname
    const collectionSlug = getCollectionSlug(currentPath)

    window.scrollTo({ top: 0, behavior: 'smooth' })

    if (currentPath === '/' || !collectionSlug) {
      setIsTransitioning(false)
      previousPathRef.current = currentPath
      return
    }

    if (currentPath !== previousPathRef.current) {
      const hasSeenTransition = seenCollectionTransitionsRef.current.has(collectionSlug)

      setTransitionCollection(collectionSlug)
      setIsTransitioning(!hasSeenTransition)
      seenCollectionTransitionsRef.current.add(collectionSlug)
      previousPathRef.current = currentPath
    } else {
      setIsTransitioning(false)
    }
  }, [location.pathname])

  return (
    <>
      <CollectionTransition 
        isPresent={isTransitioning} 
        collection={transitionCollection}
        onTransitionComplete={() => setIsTransitioning(false)} 
      />
      <AnimatePresence>
        <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageFrame>
              <HomePage />
            </PageFrame>
          }
        />
        <Route
          path="/about"
          element={
            <PageFrame>
              <AboutPage />
            </PageFrame>
          }
        />
        <Route
          path="/collections/:slug"
          element={
            <PageFrame>
              <CollectionPage />
            </PageFrame>
          }
        />
        <Route
          path="/products/:productId"
          element={
            <PageFrame>
              <ProductPage />
            </PageFrame>
          }
        />
        <Route
          path="*"
          element={
            <PageFrame>
              <NotFoundPage />
            </PageFrame>
          }
        />
      </Routes>
      </AnimatePresence>
    </>
  )
}

function App() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setShowSplash(false), 1250)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <BrowserRouter>
      <SplashScreen isVisible={showSplash} />
      <Navbar />
      <main>
        <AnimatedRoutes />
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App

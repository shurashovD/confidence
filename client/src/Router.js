import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Switch, Route, Redirect } from 'react-router-dom'
import { Modal } from './components/Modal'
import { useAuth } from './hooks/auth.hook'
import { AdminCompetitionDetailPage } from './pages/AdminCompetitionDetailPage'
import { AdminCompetitionsPage } from './pages/AdminCompetitionsPage'
import { AdminCreateCompetitionPage } from './pages/AdminCreateCompetitionPage'
import { AdminCreateUserPage } from './pages/AdminCreateUserPage'
import { AdminEditCompetitionPage } from './pages/AdminEditCompetitionPage'
import { AdminEditUserPage } from './pages/AdminEditUserPage'
import { AdminPage } from './pages/AdminPage'
import { AdminUsersPage } from './pages/AdminUsersPage'
import { CompetitionPage } from './pages/CompetitionPage'
import { HyhienicalPage } from './pages/HyhienicalPage'
import { LoginPage } from './pages/LoginPage'
import { MainPage } from './pages/MainPage'
import { PhotoPage } from './pages/PhotoPage'
import { RefereePage } from './pages/RefereePage'
import { RegisterPage } from './pages/RegisterPage'
import { ResultPage } from './pages/ResultPage'
import { ScreenPage } from './pages/ScreenPage'
import { COMPETITION_ROLE_HYHIENICAL, COMPETITION_ROLE_PHOTO, COMPETITION_ROLE_REFEREE, COMPETITION_ROLE_REGISTER, COMPETITION_ROLE_SCREEN } from './redux/competitionTypes'

export const Router = () => {
  const { auth } = useSelector(state => state)
  const { checkAuth } = useAuth()

  useEffect(() => {
    if ( !auth.role ) {
      checkAuth()
    }
  }, [auth, checkAuth])

  switch ( auth.role ) {
    case COMPETITION_ROLE_SCREEN : {
      return (
        <main>
          <Modal />
          <Switch>
            <Route path="/screen">
                <ScreenPage />
            </Route>
            <Redirect to="/screen" />
          </Switch>
        </main>
      )
    }
    case COMPETITION_ROLE_REFEREE : {
      return (
        <main>
          <Modal />
          <Switch>
            <Route path="/referee">
              <RefereePage />
            </Route>
            <Redirect to="/referee" />
          </Switch>
        </main>
      )
    }
    case COMPETITION_ROLE_HYHIENICAL : {
      return (
        <main>
          <Modal />
          <Switch>
            <Route path="/hyhienical">
              <HyhienicalPage />
            </Route>
            <Redirect to="/hyhienical" />
          </Switch>
        </main>
      )
    }
    case COMPETITION_ROLE_PHOTO : {
      return (
        <main>
          <Modal />
          <Switch>
            <Route path="/photo">
              <PhotoPage />
            </Route>
            <Redirect to="/photo" />
          </Switch>
        </main>
      )
    }
    case COMPETITION_ROLE_REGISTER : {
      return (
        <main>
          <Modal />
          <Switch>
            <Route path="/register">
              <RegisterPage />
            </Route>
            <Redirect to="/register" />
          </Switch>
        </main>
      )
    }
    case 'ADMIN' : {
      return (
        <main>
          <Modal />
          <Switch>
            <Route path="/admin/competition/detail">
              <AdminCompetitionDetailPage />
            </Route>
            <Route path="/admin/competitions/create">
              <AdminCreateCompetitionPage />
            </Route>
            <Route path="/admin/competitions/edit">
              <AdminEditCompetitionPage />
            </Route>
            <Route path="/admin/competitions">
              <AdminCompetitionsPage />
            </Route>
            <Route path="/admin/users/create">
              <AdminCreateUserPage />
            </Route>
            <Route path="/admin/users/edit">
              <AdminEditUserPage />
            </Route>
            <Route path="/admin/users">
              <AdminUsersPage />
            </Route>
            <Route path="/admin">
              <AdminPage />
            </Route>
            <Redirect to="/admin" />
          </Switch>
        </main>
      )
    }
    default : {
      return (
        <main>
          <Modal />
          <Switch>
            <Route path="/competition/result">
              <ResultPage />
            </Route>
            <Route path="/competition">
              <CompetitionPage />
            </Route>
            <Route path="/login">
              <LoginPage />
            </Route>
            <Route path="/">
              <MainPage />
            </Route>
            <Redirect to="/" />
          </Switch>
        </main>
      )
    }
  }
}